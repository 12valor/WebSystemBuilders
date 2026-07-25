begin;

do $$
begin
  create type public.content_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text not null default 'General',
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint faq_items_question_length check (char_length(question) between 5 and 240),
  constraint faq_items_answer_length check (char_length(answer) between 10 and 5000),
  constraint faq_items_category_length check (char_length(category) between 2 and 80),
  constraint faq_items_sort_order check (sort_order between 0 and 10000),
  constraint faq_items_publication_state check (
    (status = 'published' and published_at is not null)
    or (status <> 'published')
  )
);

create index if not exists faq_items_status_sort_idx
on public.faq_items(status, sort_order, created_at);

drop trigger if exists faq_items_set_updated_at on public.faq_items;
create trigger faq_items_set_updated_at
before update on public.faq_items
for each row execute function private.set_updated_at();

alter table public.faq_items enable row level security;

drop policy if exists "faq_items_select_published_or_admin" on public.faq_items;
create policy "faq_items_select_published_or_admin"
on public.faq_items for select
to anon, authenticated
using (status = 'published' or private.has_admin_role('admin'));

drop policy if exists "faq_items_manage_admin" on public.faq_items;
create policy "faq_items_manage_admin"
on public.faq_items for all
to authenticated
using (private.has_admin_role('admin'))
with check (private.has_admin_role('admin'));

insert into public.faq_items (
  id,
  question,
  answer,
  category,
  status,
  sort_order,
  published_at
)
values
  ('fa000000-0000-4000-8000-000000000001', 'What is the difference between a ready-made system and custom development?', 'A ready-made system is an existing administrator-published product with defined features, requirements, inclusions, exclusions, price, and delivery terms. Custom development begins with a requirements review and receives a separate scope and quotation before work starts.', 'Products and services', 'published', 0, now()),
  ('fa000000-0000-4000-8000-000000000002', 'What support is available for student projects?', 'Student services cover ethical technical work such as system development, templates, interface implementation, debugging, deployment, documentation guidance, and mentoring. Students remain responsible for authorship, academic decisions, research, defense, and compliance with school rules.', 'Student services', 'published', 1, now()),
  ('fa000000-0000-4000-8000-000000000003', 'Is source code included with ready-made systems?', 'Yes. The approved ready-made package direction includes the purchased source-code package, supplied documentation, and 30 calendar days of support for the original purchaser. The exact product page must confirm every inclusion and exclusion before checkout.', 'License and package', 'published', 2, now()),
  ('fa000000-0000-4000-8000-000000000004', 'Can a purchased ready-made system be modified or resold?', 'The approved license direction is broad, perpetual, non-exclusive commercial use that allows use, modification, deployment, resale, and redistribution of the purchased system. WebSystemBuilders retains its original ownership and may continue selling the same system. Third-party assets and packages remain governed by their own licenses, and final legal wording still requires review before production commerce.', 'License and package', 'published', 3, now()),
  ('fa000000-0000-4000-8000-000000000005', 'How are prices shown?', 'Ready-made systems may use a fixed price or a visible starting price. Custom development uses a quotation. PHP is the canonical catalog and default settlement currency; localized display amounts are estimates and must not silently change the authoritative checkout price.', 'Pricing', 'published', 4, now()),
  ('fa000000-0000-4000-8000-000000000006', 'When are purchased files delivered?', 'A pending order is created before hosted checkout. Files are fulfilled only after verified server-side payment confirmation, never from the browser return page alone. Delivery uses private storage and expiring, revocable download access through email and the customer portal.', 'Delivery', 'published', 5, now()),
  ('fa000000-0000-4000-8000-000000000007', 'How long is support included?', 'The original purchaser receives 30 calendar days of support beginning when the paid order is fulfilled. It covers access, installation using supplied documentation, documented requirements, and reproducible defects in the unmodified delivered version. Customization, hosting, deployment, training, and ongoing maintenance are separate unless a product page explicitly includes them.', 'Support', 'published', 6, now()),
  ('fa000000-0000-4000-8000-000000000008', 'Are digital purchases refundable?', 'The approved direction is that digital sales are final for change-of-mind purchases, subject to applicable consumer rights and legally required remedies. Duplicate or unauthorized charges, delivery failures, material defects, misrepresentation, and other non-excludable remedies require review. Final production wording is still subject to legal review.', 'Policies', 'published', 7, now()),
  ('fa000000-0000-4000-8000-000000000009', 'Why are there no placeholder products or portfolio claims?', 'Systems and project evidence appear only after real records and approved materials are available. The website does not invent clients, testimonials, projects, metrics, credentials, or availability to fill an empty state.', 'Trust', 'published', 8, now())
on conflict (id) do nothing;

create or replace function private.audit_faq_item_change()
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
      when tg_op = 'INSERT' then 'faq.created'
      when old.status <> 'published' and new.status = 'published' then 'faq.published'
      when old.status <> 'archived' and new.status = 'archived' then 'faq.archived'
      else 'faq.updated'
    end,
    'faq_items',
    new.id::text,
    jsonb_build_object(
      'status', new.status,
      'previous_status', case when tg_op = 'UPDATE' then old.status else null end,
      'category', new.category,
      'sort_order', new.sort_order
    )
  );
  return new;
end;
$$;

revoke all on function private.audit_faq_item_change() from public;

drop trigger if exists faq_items_audit_change on public.faq_items;
create trigger faq_items_audit_change
after insert or update on public.faq_items
for each row execute function private.audit_faq_item_change();

commit;
