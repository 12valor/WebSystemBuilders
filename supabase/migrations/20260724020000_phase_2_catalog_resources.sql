begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'system-media',
    'system-media',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp']::text[]
  ),
  (
    'system-deliverables',
    'system-deliverables',
    false,
    262144000,
    array['application/zip', 'application/x-zip-compressed', 'application/octet-stream']::text[]
  )
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.create_system_version(
  p_system_id uuid,
  p_version_label text,
  p_release_notes text,
  p_make_current boolean
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_version_id uuid;
begin
  if not private.has_admin_role('admin') then
    raise exception 'Administrator access is required.' using errcode = '42501';
  end if;

  if p_make_current then
    update public.system_versions
    set is_current = false
    where system_id = p_system_id and is_current = true;
  end if;

  insert into public.system_versions (
    system_id,
    version_label,
    release_notes,
    is_current,
    released_at,
    created_by
  )
  values (
    p_system_id,
    p_version_label,
    nullif(p_release_notes, ''),
    p_make_current,
    case when p_make_current then now() else null end,
    (select auth.uid())
  )
  returning id into new_version_id;

  return new_version_id;
end;
$$;

revoke all on function public.create_system_version(uuid, text, text, boolean) from public;
grant execute on function public.create_system_version(uuid, text, text, boolean) to authenticated;

commit;
