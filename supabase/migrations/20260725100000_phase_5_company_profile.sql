begin;

create table if not exists public.company_profile (
  id smallint primary key default 1,
  company_summary text not null,
  founder_bio text not null,
  public_email text,
  public_phone text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_profile_singleton check (id = 1),
  constraint company_profile_summary_length check (char_length(company_summary) between 20 and 600),
  constraint company_profile_bio_length check (char_length(founder_bio) between 20 and 600),
  constraint company_profile_email_format check (public_email is null or (char_length(public_email) between 5 and 254 and public_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
  constraint company_profile_phone_format check (public_phone is null or (char_length(public_phone) between 7 and 30 and public_phone ~ '^[+0-9() .-]+$')),
  constraint company_profile_publication_state check ((status = 'published' and published_at is not null) or status <> 'published')
);

insert into public.company_profile (id, company_summary, founder_bio, status)
values (
  1,
  'WebSystemBuilders helps students and business owners access ready-made software systems and request custom development through one professional platform.',
  'AG Evangelista is the founder of WebSystemBuilders and a web developer focused on creating practical software solutions for students and business owners.',
  'draft'
)
on conflict (id) do nothing;

drop trigger if exists company_profile_set_updated_at on public.company_profile;
create trigger company_profile_set_updated_at
before update on public.company_profile
for each row execute function private.set_updated_at();

alter table public.company_profile enable row level security;

drop policy if exists "company_profile_select_published_or_admin" on public.company_profile;
create policy "company_profile_select_published_or_admin"
on public.company_profile for select
to anon, authenticated
using (status = 'published' or private.has_admin_role('admin'));

drop policy if exists "company_profile_manage_admin" on public.company_profile;
create policy "company_profile_manage_admin"
on public.company_profile for update
to authenticated
using (private.has_admin_role('admin'))
with check (private.has_admin_role('admin'));

create or replace function private.audit_company_profile_change()
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
      when old.status <> 'published' and new.status = 'published' then 'company_profile.published'
      when old.status <> 'archived' and new.status = 'archived' then 'company_profile.archived'
      else 'company_profile.updated'
    end,
    'company_profile',
    new.id::text,
    jsonb_build_object(
      'status', new.status,
      'previous_status', old.status,
      'has_public_email', new.public_email is not null,
      'has_public_phone', new.public_phone is not null
    )
  );
  return new;
end;
$$;

revoke all on function private.audit_company_profile_change() from public;

drop trigger if exists company_profile_audit_change on public.company_profile;
create trigger company_profile_audit_change
after update on public.company_profile
for each row execute function private.audit_company_profile_change();

commit;
