begin;

alter table public.systems
  add column if not exists sale_active boolean not null default false;

alter table public.systems
  drop constraint if exists systems_sale_activation;

alter table public.systems
  add constraint systems_sale_activation
  check (not sale_active or sale_price_minor is not null);

insert into storage.buckets (id, name, public)
values
  ('system-media', 'system-media', false),
  ('system-deliverables', 'system-deliverables', false)
on conflict (id) do update
set public = false;

drop policy if exists "system_storage_select_admin" on storage.objects;
create policy "system_storage_select_admin"
on storage.objects for select
to authenticated
using (
  bucket_id in ('system-media', 'system-deliverables')
  and private.has_admin_role('admin')
);

drop policy if exists "system_storage_insert_admin" on storage.objects;
create policy "system_storage_insert_admin"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('system-media', 'system-deliverables')
  and private.has_admin_role('admin')
);

drop policy if exists "system_storage_update_admin" on storage.objects;
create policy "system_storage_update_admin"
on storage.objects for update
to authenticated
using (
  bucket_id in ('system-media', 'system-deliverables')
  and private.has_admin_role('admin')
)
with check (
  bucket_id in ('system-media', 'system-deliverables')
  and private.has_admin_role('admin')
);

drop policy if exists "system_storage_delete_admin" on storage.objects;
create policy "system_storage_delete_admin"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('system-media', 'system-deliverables')
  and private.has_admin_role('admin')
);

create or replace function private.audit_system_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    (select auth.uid()),
    case when tg_op = 'INSERT' then 'system.created' else 'system.updated' end,
    'systems',
    new.id::text,
    jsonb_build_object('status', new.status, 'slug', new.slug)
  );
  return new;
end;
$$;

revoke all on function private.audit_system_change() from public;

drop trigger if exists systems_audit_change on public.systems;
create trigger systems_audit_change
after insert or update on public.systems
for each row execute function private.audit_system_change();

commit;
