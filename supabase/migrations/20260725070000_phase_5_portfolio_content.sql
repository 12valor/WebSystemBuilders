begin;

do $$
begin
  create type public.content_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  audience public.catalog_audience not null,
  summary text not null,
  description text not null,
  outcome text,
  technology_stack text[] not null default '{}',
  project_url text,
  is_featured boolean not null default false,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint portfolio_items_title_length check (char_length(title) between 2 and 160),
  constraint portfolio_items_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 2 and 160),
  constraint portfolio_items_summary_length check (char_length(summary) between 10 and 500),
  constraint portfolio_items_description_length check (char_length(description) between 20 and 20000),
  constraint portfolio_items_outcome_length check (outcome is null or char_length(outcome) between 5 and 2000),
  constraint portfolio_items_technology_count check (cardinality(technology_stack) <= 30),
  constraint portfolio_items_project_url check (project_url is null or project_url ~* '^https://'),
  constraint portfolio_items_sort_order check (sort_order between 0 and 10000),
  constraint portfolio_items_publication_state check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  )
);

create index if not exists portfolio_items_status_sort_idx
on public.portfolio_items(status, is_featured desc, sort_order, created_at);

drop trigger if exists portfolio_items_set_updated_at on public.portfolio_items;
create trigger portfolio_items_set_updated_at
before update on public.portfolio_items
for each row execute function private.set_updated_at();

alter table public.portfolio_items enable row level security;

drop policy if exists "portfolio_items_select_published_or_admin" on public.portfolio_items;
create policy "portfolio_items_select_published_or_admin"
on public.portfolio_items for select
to anon, authenticated
using (status = 'published' or private.has_admin_role('admin'));

drop policy if exists "portfolio_items_manage_admin" on public.portfolio_items;
create policy "portfolio_items_manage_admin"
on public.portfolio_items for all
to authenticated
using (private.has_admin_role('admin'))
with check (private.has_admin_role('admin'));

create or replace function private.audit_portfolio_item_change()
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
      when tg_op = 'INSERT' then 'portfolio.created'
      when old.status <> 'published' and new.status = 'published' then 'portfolio.published'
      when old.status <> 'archived' and new.status = 'archived' then 'portfolio.archived'
      else 'portfolio.updated'
    end,
    'portfolio_items',
    new.id::text,
    jsonb_build_object(
      'slug', new.slug,
      'status', new.status,
      'previous_status', case when tg_op = 'UPDATE' then old.status else null end,
      'audience', new.audience,
      'is_featured', new.is_featured
    )
  );
  return new;
end;
$$;

revoke all on function private.audit_portfolio_item_change() from public;

drop trigger if exists portfolio_items_audit_change on public.portfolio_items;
create trigger portfolio_items_audit_change
after insert or update on public.portfolio_items
for each row execute function private.audit_portfolio_item_change();

commit;
