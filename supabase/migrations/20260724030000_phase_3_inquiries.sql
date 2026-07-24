begin;

create type public.inquiry_type as enum ('contact', 'quote');
create type public.inquiry_audience as enum ('student', 'business', 'general');
create type public.inquiry_status as enum ('new', 'in_review', 'responded', 'closed', 'spam');

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type public.inquiry_type not null,
  audience public.inquiry_audience not null,
  name text not null,
  email text not null,
  organization text,
  subject text not null,
  message text not null,
  project_type text,
  requirements text,
  timeline text,
  source_path text not null,
  status public.inquiry_status not null default 'new',
  request_fingerprint text not null,
  email_fingerprint text not null,
  assigned_to uuid references auth.users(id) on delete set null,
  responded_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inquiries_name_length check (char_length(name) between 2 and 100),
  constraint inquiries_email_length check (char_length(email) between 3 and 254),
  constraint inquiries_organization_length check (organization is null or char_length(organization) <= 160),
  constraint inquiries_subject_length check (char_length(subject) between 5 and 160),
  constraint inquiries_message_length check (char_length(message) between 20 and 4000),
  constraint inquiries_requirements_length check (requirements is null or char_length(requirements) between 30 and 6000),
  constraint inquiries_timeline_length check (timeline is null or char_length(timeline) <= 160),
  constraint inquiries_project_type check (
    project_type is null or project_type in ('custom-system', 'ready-made-customization', 'student-technical-support', 'other')
  ),
  constraint inquiries_source_path check (source_path ~ '^/[^[:space:]]{0,199}$'),
  constraint inquiries_fingerprint_format check (
    request_fingerprint ~ '^[a-f0-9]{64}$' and email_fingerprint ~ '^[a-f0-9]{64}$'
  ),
  constraint inquiries_quote_requirements check (
    (inquiry_type = 'contact' and project_type is null and requirements is null)
    or (inquiry_type = 'quote' and project_type is not null and requirements is not null)
  )
);

create index inquiries_status_created_idx on public.inquiries(status, created_at desc);
create index inquiries_request_rate_idx on public.inquiries(request_fingerprint, created_at desc);
create index inquiries_email_rate_idx on public.inquiries(email_fingerprint, created_at desc);

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at before update on public.inquiries
for each row execute function private.set_updated_at();

alter table public.inquiries enable row level security;

create policy "inquiries_select_admin" on public.inquiries for select to authenticated
using (private.has_admin_role('admin'));
create policy "inquiries_update_admin" on public.inquiries for update to authenticated
using (private.has_admin_role('admin')) with check (private.has_admin_role('admin'));

comment on table public.inquiries is 'Server-submitted contact and quotation inquiries. Public direct inserts are intentionally denied by RLS.';

commit;
