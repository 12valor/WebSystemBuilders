begin;

create or replace function private.audit_system_media_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_system_id uuid;
  v_media_type public.system_media_type;
  v_storage_path text;
  v_sort_order integer;
begin
  if tg_op = 'DELETE' then
    v_id := old.id;
    v_system_id := old.system_id;
    v_media_type := old.media_type;
    v_storage_path := old.storage_path;
    v_sort_order := old.sort_order;
  else
    v_id := new.id;
    v_system_id := new.system_id;
    v_media_type := new.media_type;
    v_storage_path := new.storage_path;
    v_sort_order := new.sort_order;
  end if;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    (select auth.uid()),
    case tg_op
      when 'INSERT' then 'media.created'
      when 'UPDATE' then 'media.updated'
      else 'media.removed'
    end,
    'system_media',
    v_id::text,
    jsonb_build_object(
      'system_id', v_system_id,
      'media_type', v_media_type,
      'source', case when v_storage_path is null then 'external' else 'upload' end,
      'sort_order', v_sort_order
    )
  );

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

revoke all on function private.audit_system_media_change() from public;

drop trigger if exists system_media_audit_change on public.system_media;
create trigger system_media_audit_change
after insert or update or delete on public.system_media
for each row execute function private.audit_system_media_change();

commit;
