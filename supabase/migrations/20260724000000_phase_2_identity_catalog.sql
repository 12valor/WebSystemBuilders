begin;

create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

do $$ begin create type public.admin_role as enum ('admin', 'super_admin'); exception when duplicate_object then null; end $$;
do $$ begin create type public.system_audience as enum ('students', 'business', 'both'); exception when duplicate_object then null; end $$;
do $$ begin create type public.product_type as enum ('ready_made', 'customizable_template', 'custom_service'); exception when duplicate_object then null; end $$;
do $$ begin create type public.pricing_type as enum ('fixed', 'starting', 'quotation'); exception when duplicate_object then null; end $$;
do $$ begin create type public.system_status as enum ('draft', 'published', 'unlisted', 'archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.system_media_type as enum ('image', 'video', 'demo'); exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (display_name is null or char_length(display_name) between 1 and 120)
);

create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.admin_role not null default 'admin',
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now()
);

create table if not exists public.system_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  audience public.system_audience not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint system_categories_name_length check (char_length(name) between 2 and 100),
  constraint system_categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint system_categories_sort_order check (sort_order >= 0)
);

create table if not exists public.systems (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.system_categories(id) on delete set null,
  title text not null,
  slug text not null unique,
  summary text not null,
  description text,
  audience public.system_audience not null,
  product_type public.product_type not null,
  pricing_type public.pricing_type not null,
  price_minor bigint,
  regular_price_minor bigint,
  sale_price_minor bigint,
  sale_starts_at timestamptz,
  sale_ends_at timestamptz,
  currency text not null default 'PHP',
  status public.system_status not null default 'draft',
  is_featured boolean not null default false,
  requirements text,
  inclusions text,
  exclusions text,
  license_summary text,
  support_summary text,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint systems_title_length check (char_length(title) between 2 and 160),
  constraint systems_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint systems_summary_length check (char_length(summary) between 10 and 320),
  constraint systems_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint systems_price_nonnegative check (
    (price_minor is null or price_minor >= 0)
    and (regular_price_minor is null or regular_price_minor >= 0)
    and (sale_price_minor is null or sale_price_minor >= 0)
  ),
  constraint systems_pricing_value check (
    (pricing_type = 'quotation' and price_minor is null)
    or (pricing_type in ('fixed', 'starting') and price_minor is not null)
  ),
  constraint systems_sale_value check (
    sale_price_minor is null
    or (
      regular_price_minor is not null
      and sale_price_minor < regular_price_minor
      and (sale_ends_at is null or sale_starts_at is null or sale_ends_at > sale_starts_at)
    )
  ),
  constraint systems_published_at check (status <> 'published' or published_at is not null)
);

create table if not exists public.system_features (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.systems(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint system_features_label_length check (char_length(label) between 2 and 180),
  constraint system_features_sort_order check (sort_order >= 0)
);

create table if not exists public.system_media (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.systems(id) on delete cascade,
  media_type public.system_media_type not null default 'image',
  storage_path text,
  external_url text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint system_media_source check (
    (storage_path is not null and external_url is null)
    or (storage_path is null and external_url is not null)
  ),
  constraint system_media_sort_order check (sort_order >= 0)
);

create table if not exists public.system_versions (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references public.systems(id) on delete cascade,
  version_label text not null,
  release_notes text,
  is_current boolean not null default false,
  released_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (system_id, version_label),
  constraint system_versions_label_length check (char_length(version_label) between 1 and 40)
);

create unique index if not exists system_versions_one_current_per_system on public.system_versions(system_id) where is_current;

create table if not exists public.system_files (
  id uuid primary key default gen_random_uuid(),
  system_version_id uuid not null references public.system_versions(id) on delete cascade,
  storage_bucket text not null default 'system-deliverables',
  storage_path text not null,
  original_filename text not null,
  byte_size bigint,
  sha256 text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint system_files_byte_size check (byte_size is null or byte_size > 0),
  constraint system_files_sha256_format check (sha256 is null or sha256 ~ '^[a-f0-9]{64}$')
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint audit_logs_action_length check (char_length(action) between 2 and 100),
  constraint audit_logs_target_table_length check (char_length(target_table) between 2 and 100)
);

create index if not exists admin_roles_role_idx on public.admin_roles(role);
create index if not exists system_categories_active_sort_idx on public.system_categories(is_active, sort_order);
create index if not exists systems_status_updated_idx on public.systems(status, updated_at desc);
create index if not exists systems_category_status_idx on public.systems(category_id, status);
create index if not exists systems_audience_status_idx on public.systems(audience, status);
create index if not exists systems_featured_status_idx on public.systems(is_featured, status);
create index if not exists system_features_system_sort_idx on public.system_features(system_id, sort_order);
create index if not exists system_media_system_sort_idx on public.system_media(system_id, sort_order);
create index if not exists system_versions_system_idx on public.system_versions(system_id);
create index if not exists system_files_version_idx on public.system_files(system_version_id);
create index if not exists audit_logs_target_idx on public.audit_logs(target_table, target_id);
create index if not exists audit_logs_actor_created_idx on public.audit_logs(actor_user_id, created_at desc);

create or replace function private.current_admin_role()
returns public.admin_role language sql stable security definer set search_path = ''
as $$ select role from public.admin_roles where user_id = (select auth.uid()) $$;

create or replace function private.has_admin_role(required_role public.admin_role default 'admin')
returns boolean language sql stable security definer set search_path = ''
as $$
  select case
    when private.current_admin_role() = 'super_admin' then true
    when required_role = 'admin' and private.current_admin_role() = 'admin' then true
    else false
  end
$$;

revoke all on function private.current_admin_role() from public;
revoke all on function private.has_admin_role(public.admin_role) from public;
grant execute on function private.current_admin_role() to anon, authenticated;
grant execute on function private.has_admin_role(public.admin_role) to anon, authenticated;

create or replace function private.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end; $$;

create or replace function private.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public;
revoke all on function private.create_profile_for_new_user() from public;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function private.set_updated_at();

drop trigger if exists system_categories_set_updated_at on public.system_categories;
create trigger system_categories_set_updated_at before update on public.system_categories
for each row execute function private.set_updated_at();

drop trigger if exists systems_set_updated_at on public.systems;
create trigger systems_set_updated_at before update on public.systems
for each row execute function private.set_updated_at();

drop trigger if exists auth_user_profile_created on auth.users;
create trigger auth_user_profile_created after insert on auth.users
for each row execute function private.create_profile_for_new_user();

alter table public.profiles enable row level security;
alter table public.admin_roles enable row level security;
alter table public.system_categories enable row level security;
alter table public.systems enable row level security;
alter table public.system_features enable row level security;
alter table public.system_media enable row level security;
alter table public.system_versions enable row level security;
alter table public.system_files enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated
using ((select auth.uid()) = user_id or private.has_admin_role('admin'));
create policy "profiles_update_own" on public.profiles for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "admin_roles_select_own_or_super_admin" on public.admin_roles for select to authenticated
using ((select auth.uid()) = user_id or private.has_admin_role('super_admin'));
create policy "admin_roles_insert_super_admin" on public.admin_roles for insert to authenticated
with check (private.has_admin_role('super_admin'));
create policy "admin_roles_update_super_admin" on public.admin_roles for update to authenticated
using (private.has_admin_role('super_admin')) with check (private.has_admin_role('super_admin'));
create policy "admin_roles_delete_super_admin" on public.admin_roles for delete to authenticated
using (private.has_admin_role('super_admin'));

create policy "categories_select_public_or_admin" on public.system_categories for select to anon, authenticated
using (is_active or private.has_admin_role('admin'));
create policy "categories_insert_admin" on public.system_categories for insert to authenticated
with check (private.has_admin_role('admin'));
create policy "categories_update_admin" on public.system_categories for update to authenticated
using (private.has_admin_role('admin')) with check (private.has_admin_role('admin'));

create policy "systems_select_published_or_admin" on public.systems for select to anon, authenticated
using (status = 'published' or private.has_admin_role('admin'));
create policy "systems_insert_admin" on public.systems for insert to authenticated
with check (private.has_admin_role('admin'));
create policy "systems_update_admin" on public.systems for update to authenticated
using (private.has_admin_role('admin')) with check (private.has_admin_role('admin'));

create policy "features_select_published_or_admin" on public.system_features for select to anon, authenticated
using (exists (select 1 from public.systems where systems.id = system_features.system_id and systems.status = 'published') or private.has_admin_role('admin'));
create policy "features_manage_admin" on public.system_features for all to authenticated
using (private.has_admin_role('admin')) with check (private.has_admin_role('admin'));

create policy "media_select_published_or_admin" on public.system_media for select to anon, authenticated
using (exists (select 1 from public.systems where systems.id = system_media.system_id and systems.status = 'published') or private.has_admin_role('admin'));
create policy "media_manage_admin" on public.system_media for all to authenticated
using (private.has_admin_role('admin')) with check (private.has_admin_role('admin'));

create policy "versions_select_published_or_admin" on public.system_versions for select to anon, authenticated
using (exists (select 1 from public.systems where systems.id = system_versions.system_id and systems.status = 'published') or private.has_admin_role('admin'));
create policy "versions_manage_admin" on public.system_versions for all to authenticated
using (private.has_admin_role('admin')) with check (private.has_admin_role('admin'));

create policy "files_manage_admin" on public.system_files for all to authenticated
using (private.has_admin_role('admin')) with check (private.has_admin_role('admin'));
create policy "audit_logs_select_admin" on public.audit_logs for select to authenticated
using (private.has_admin_role('admin'));

insert into public.system_categories (name, slug, audience, description, sort_order)
values
  ('Point of Sale', 'point-of-sale', 'business', 'Point-of-sale systems for business operations.', 10),
  ('Inventory Management', 'inventory-management', 'business', 'Systems for tracking stock, movement, and availability.', 20),
  ('Warehouse Management', 'warehouse-management', 'business', 'Systems for warehouse operations and stock control.', 30),
  ('Capstone Systems', 'capstone-systems', 'students', 'Ethical software systems and technical support for capstone work.', 40),
  ('Thesis-Related Systems', 'thesis-related-systems', 'students', 'Ethical technical systems and development guidance for thesis-related work.', 50),
  ('Custom System Development', 'custom-system-development', 'both', 'Custom software development based on reviewed requirements.', 60)
on conflict (slug) do update set
  name = excluded.name,
  audience = excluded.audience,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

commit;
