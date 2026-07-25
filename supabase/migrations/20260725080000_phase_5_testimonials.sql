begin;

do $$
begin
  create type public.content_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  attribution_name text not null,
  attribution_role text,
  attribution_organization text,
  relationship_context text not null,
  is_featured boolean not null default false,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_quote_length check (char_length(quote) between 20 and 2000),
  constraint testimonials_name_length check (char_length(attribution_name) between 2 and 120),
  constraint testimonials_role_length check (attribution_role is null or char_length(attribution_role) between 2 and 120),
  constraint testimonials_organization_length check (attribution_organization is null or char_length(attribution_organization) between 2 and 160),
  constraint testimonials_context_length check (char_length(relationship_context) between 5 and 240),
  constraint testimonials_sort_order check (sort_order between 0 and 10000),
  constraint testimonials_publication_state check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  )
);

create table if not exists public.testimonial_verifications (
  testimonial_id uuid primary key references public.testimonials(id) on delete cascade,
  source_reference text not null,
  permission_confirmed_at timestamptz,
  verified_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonial_verifications_source_length check (char_length(source_reference) between 5 and 500)
);

create index if not exists testimonials_status_sort_idx
on public.testimonials(status, is_featured desc, sort_order, created_at);

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function private.set_updated_at();

drop trigger if exists testimonial_verifications_set_updated_at on public.testimonial_verifications;
create trigger testimonial_verifications_set_updated_at
before update on public.testimonial_verifications
for each row execute function private.set_updated_at();

alter table public.testimonials enable row level security;
alter table public.testimonial_verifications enable row level security;

drop policy if exists "testimonials_select_published_or_admin" on public.testimonials;
create policy "testimonials_select_published_or_admin"
on public.testimonials for select
to anon, authenticated
using (status = 'published' or private.has_admin_role('admin'));

drop policy if exists "testimonials_manage_admin" on public.testimonials;
create policy "testimonials_manage_admin"
on public.testimonials for all
to authenticated
using (private.has_admin_role('admin'))
with check (private.has_admin_role('admin'));

drop policy if exists "testimonial_verifications_admin_only" on public.testimonial_verifications;
create policy "testimonial_verifications_admin_only"
on public.testimonial_verifications for all
to authenticated
using (private.has_admin_role('admin'))
with check (private.has_admin_role('admin'));

create or replace function private.enforce_testimonial_publication()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'published' and not exists (
    select 1
    from public.testimonial_verifications
    where testimonial_id = new.id
      and permission_confirmed_at is not null
  ) then
    raise exception 'testimonial publication requires verified permission' using errcode = '23514';
  end if;
  return new;
end;
$$;

revoke all on function private.enforce_testimonial_publication() from public;

drop trigger if exists testimonials_enforce_publication on public.testimonials;
create trigger testimonials_enforce_publication
before insert or update on public.testimonials
for each row execute function private.enforce_testimonial_publication();

create or replace function public.create_testimonial_draft(
  p_quote text,
  p_attribution_name text,
  p_attribution_role text,
  p_attribution_organization text,
  p_relationship_context text,
  p_source_reference text,
  p_permission_confirmed boolean,
  p_sort_order integer,
  p_is_featured boolean
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if not private.has_admin_role('admin') then
    raise exception 'administrator access required' using errcode = '42501';
  end if;

  insert into public.testimonials (
    quote,
    attribution_name,
    attribution_role,
    attribution_organization,
    relationship_context,
    is_featured,
    status,
    sort_order,
    created_by,
    updated_by
  ) values (
    p_quote,
    p_attribution_name,
    p_attribution_role,
    p_attribution_organization,
    p_relationship_context,
    p_is_featured,
    'draft',
    p_sort_order,
    auth.uid(),
    auth.uid()
  ) returning id into v_id;

  insert into public.testimonial_verifications (
    testimonial_id,
    source_reference,
    permission_confirmed_at,
    verified_by
  ) values (
    v_id,
    p_source_reference,
    case when p_permission_confirmed then now() else null end,
    case when p_permission_confirmed then auth.uid() else null end
  );

  return v_id;
end;
$$;

create or replace function public.update_testimonial(
  p_testimonial_id uuid,
  p_expected_updated_at timestamptz,
  p_intent text,
  p_quote text,
  p_attribution_name text,
  p_attribution_role text,
  p_attribution_organization text,
  p_relationship_context text,
  p_source_reference text,
  p_permission_confirmed boolean,
  p_sort_order integer,
  p_is_featured boolean
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_status public.content_status;
  v_published_at timestamptz;
begin
  if not private.has_admin_role('admin') then
    raise exception 'administrator access required' using errcode = '42501';
  end if;
  if p_intent not in ('save', 'publish', 'archive') then
    raise exception 'unsupported testimonial intent' using errcode = '22023';
  end if;
  if p_intent = 'publish' and not p_permission_confirmed then
    raise exception 'testimonial publication requires verified permission' using errcode = '23514';
  end if;

  select status, published_at
  into v_status, v_published_at
  from public.testimonials
  where id = p_testimonial_id
    and updated_at = p_expected_updated_at
  for update;

  if not found then return false; end if;

  insert into public.testimonial_verifications (
    testimonial_id,
    source_reference,
    permission_confirmed_at,
    verified_by
  ) values (
    p_testimonial_id,
    p_source_reference,
    case when p_permission_confirmed then now() else null end,
    case when p_permission_confirmed then auth.uid() else null end
  )
  on conflict (testimonial_id) do update
  set source_reference = excluded.source_reference,
      permission_confirmed_at = case
        when p_permission_confirmed then coalesce(public.testimonial_verifications.permission_confirmed_at, now())
        else null
      end,
      verified_by = case when p_permission_confirmed then auth.uid() else null end;

  update public.testimonials
  set quote = p_quote,
      attribution_name = p_attribution_name,
      attribution_role = p_attribution_role,
      attribution_organization = p_attribution_organization,
      relationship_context = p_relationship_context,
      is_featured = p_is_featured,
      sort_order = p_sort_order,
      status = case
        when p_intent = 'publish' then 'published'::public.content_status
        when p_intent = 'archive' then 'archived'::public.content_status
        else v_status
      end,
      published_at = case
        when p_intent = 'publish' then coalesce(v_published_at, now())
        else v_published_at
      end,
      updated_by = auth.uid()
  where id = p_testimonial_id;

  return true;
end;
$$;

revoke all on function public.create_testimonial_draft(text,text,text,text,text,text,boolean,integer,boolean) from public;
grant execute on function public.create_testimonial_draft(text,text,text,text,text,text,boolean,integer,boolean) to authenticated;
revoke all on function public.update_testimonial(uuid,timestamptz,text,text,text,text,text,text,text,boolean,integer,boolean) from public;
grant execute on function public.update_testimonial(uuid,timestamptz,text,text,text,text,text,text,text,boolean,integer,boolean) to authenticated;

create or replace function private.audit_testimonial_change()
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
      when tg_op = 'INSERT' then 'testimonial.created'
      when old.status <> 'published' and new.status = 'published' then 'testimonial.published'
      when old.status <> 'archived' and new.status = 'archived' then 'testimonial.archived'
      else 'testimonial.updated'
    end,
    'testimonials',
    new.id::text,
    jsonb_build_object(
      'status', new.status,
      'previous_status', case when tg_op = 'UPDATE' then old.status else null end,
      'is_featured', new.is_featured
    )
  );
  return new;
end;
$$;

revoke all on function private.audit_testimonial_change() from public;

drop trigger if exists testimonials_audit_change on public.testimonials;
create trigger testimonials_audit_change
after insert or update on public.testimonials
for each row execute function private.audit_testimonial_change();

commit;
