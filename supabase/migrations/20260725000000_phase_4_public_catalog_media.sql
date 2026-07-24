begin;

drop policy if exists "system_media_storage_select_published" on storage.objects;
create policy "system_media_storage_select_published"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'system-media'
  and exists (
    select 1
    from public.system_media
    join public.systems on systems.id = system_media.system_id
    where system_media.storage_path = storage.objects.name
      and systems.status = 'published'
  )
);

comment on policy "system_media_storage_select_published" on storage.objects
is 'Allows time-limited signed reads for media attached to published systems only.';

commit;
