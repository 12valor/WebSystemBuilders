begin;

do $$
begin
  create type public.site_content_placement as enum ('announcement', 'homepage_feature');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.site_content_blocks (
  id uuid primary key default gen_random_uuid(),
  placement public.site_content_placement not null,
  eyebrow text,
  title text not null,
  body text,
  action_label text,
  action_href text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_content_title_length check (char_length(title) between 5 and 180),
  constraint site_content_eyebrow_length check (eyebrow is null or char_length(eyebrow) between 2 and 60),
  constraint site_content_body_length check (body is null or char_length(body) between 10 and 800),
  constraint site_content_action_pair check ((action_label is null) = (action_href is null)),
  constraint site_content_action_label_length check (action_label is null or char_length(action_label) between 2 and 60),
  constraint site_content_action_internal check (action_href is null or (action_href ~ '^/[A-Za-z0-9/_?#=&.%~-]*$' and action_href !~ '^//')),
  constraint site_content_sort_order check (sort_order between 0 and 10000),
  constraint site_content_placement_fields check (
    (placement = 'announcement' and eyebrow is null and body is null)
    or (placement = 'homepage_feature' and eyebrow is not null and body is not null)
  ),
  constraint site_content_publication_state check (
    (status = 'published' and published_at is not null)
    or status <> 'published'
  )
);

create unique index if not exists site_content_one_published_per_placement_idx
on public.site_content_blocks(placement)
where status = 'published';

create index if not exists site_content_status_sort_idx
on public.site_content_blocks(status, placement, sort_order, created_at);

drop trigger if exists site_content_blocks_set_updated_at on public.site_content_blocks;
create trigger site_content_blocks_set_updated_at
before update on public.site_content_blocks
for each row execute function private.set_updated_at();

alter table public.site_content_blocks enable row level security;

drop policy if exists "site_content_select_published_or_admin" on public.site_content_blocks;
create policy "site_content_select_published_or_admin"
on public.site_content_blocks for select
to anon, authenticated
using (status = 'published' or private.has_admin_role('admin'));

drop policy if exists "site_content_manage_admin" on public.site_content_blocks;
create policy "site_content_manage_admin"
on public.site_content_blocks for all
to authenticated
using (private.has_admin_role('admin'))
with check (private.has_admin_role('admin'));

create or replace function private.audit_site_content_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    (select auth.uid()),
    case
      when tg_op = 'INSERT' then 'content_block.created'
      when old.status <> 'published' and new.status = 'published' then 'content_block.published'
      when old.status <> 'archived' and new.status = 'archived' then 'content_block.archived'
      else 'content_block.updated'
    end,
    'site_content_blocks',
    new.id::text,
    jsonb_build_object(
      'placement', new.placement,
      'status', new.status,
      'previous_status', case when tg_op = 'UPDATE' then old.status else null end
    )
  );
  return new;
end;
$$;

revoke all on function private.audit_site_content_change() from public;

drop trigger if exists site_content_blocks_audit_change on public.site_content_blocks;
create trigger site_content_blocks_audit_change
after insert or update on public.site_content_blocks
for each row execute function private.audit_site_content_change();

commit;
