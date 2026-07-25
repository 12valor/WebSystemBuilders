begin;

create index if not exists audit_logs_created_idx
on public.audit_logs(created_at desc);

create or replace function private.audit_category_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    (select auth.uid()),
    case when tg_op = 'INSERT' then 'category.created' else 'category.updated' end,
    'system_categories',
    new.id::text,
    jsonb_build_object(
      'name', new.name,
      'slug', new.slug,
      'audience', new.audience,
      'is_active', new.is_active
    )
  );
  return new;
end;
$$;

revoke all on function private.audit_category_change() from public;

drop trigger if exists system_categories_audit_change on public.system_categories;
create trigger system_categories_audit_change
after insert or update on public.system_categories
for each row execute function private.audit_category_change();

commit;
