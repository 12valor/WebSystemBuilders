begin;

drop policy if exists "admin_roles_insert_super_admin" on public.admin_roles;
drop policy if exists "admin_roles_update_super_admin" on public.admin_roles;
drop policy if exists "admin_roles_delete_super_admin" on public.admin_roles;

create or replace function public.get_admin_access()
returns table (
  user_id uuid,
  email text,
  display_name text,
  role public.admin_role,
  granted_by uuid,
  granted_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.has_admin_role('super_admin') then
    raise exception 'super administrator access required' using errcode = '42501';
  end if;

  return query
  select roles.user_id, users.email::text, profiles.display_name, roles.role, roles.granted_by, roles.granted_at
  from public.admin_roles roles
  join auth.users users on users.id = roles.user_id
  left join public.profiles profiles on profiles.user_id = roles.user_id
  order by case when roles.role = 'super_admin' then 0 else 1 end, users.email;
end;
$$;

create or replace function public.manage_admin_access(
  p_email text,
  p_role public.admin_role,
  p_action text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_target uuid;
  v_current_role public.admin_role;
  v_super_admin_count integer;
begin
  if not private.has_admin_role('super_admin') then
    raise exception 'super administrator access required' using errcode = '42501';
  end if;
  if p_action not in ('grant', 'revoke') then
    raise exception 'unsupported access action' using errcode = '22023';
  end if;

  select id into v_target
  from auth.users
  where lower(email) = lower(trim(p_email))
  limit 1;

  if v_target is null then
    raise exception 'no verified account exists for this email' using errcode = 'P0002';
  end if;

  select role into v_current_role from public.admin_roles where user_id = v_target for update;
  select count(*) into v_super_admin_count from public.admin_roles where role = 'super_admin';

  if p_action = 'revoke' then
    if v_current_role is null then
      raise exception 'administrator access does not exist' using errcode = 'P0002';
    end if;
    if v_target = v_actor then
      raise exception 'you cannot revoke your own administrator access' using errcode = '23514';
    end if;
    if v_current_role = 'super_admin' and v_super_admin_count <= 1 then
      raise exception 'the final super administrator cannot be removed' using errcode = '23514';
    end if;
    delete from public.admin_roles where user_id = v_target;
  else
    if v_target = v_actor and p_role <> 'super_admin' then
      raise exception 'you cannot demote your own super administrator access' using errcode = '23514';
    end if;
    if v_current_role = 'super_admin' and p_role <> 'super_admin' and v_super_admin_count <= 1 then
      raise exception 'the final super administrator cannot be demoted' using errcode = '23514';
    end if;
    insert into public.admin_roles (user_id, role, granted_by, granted_at)
    values (v_target, p_role, v_actor, now())
    on conflict (user_id) do update
    set role = excluded.role,
        granted_by = excluded.granted_by,
        granted_at = excluded.granted_at;
  end if;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    v_actor,
    case when p_action = 'revoke' then 'admin_access.revoked' else 'admin_access.granted' end,
    'admin_roles',
    v_target::text,
    jsonb_build_object('access_action', p_action, 'role', p_role)
  );

  return v_target;
end;
$$;

revoke all on function public.get_admin_access() from public;
grant execute on function public.get_admin_access() to authenticated;
revoke all on function public.manage_admin_access(text,public.admin_role,text) from public;
grant execute on function public.manage_admin_access(text,public.admin_role,text) to authenticated;

commit;