begin;

alter table public.systems add column if not exists payment_qr_url text;
alter table public.systems add column if not exists payment_instructions text;

alter type public.order_status add value if not exists 'pending_verification';
alter type public.order_status add value if not exists 'verified';
alter type public.order_status add value if not exists 'rejected';
alter type public.order_status add value if not exists 'completed';

alter table public.orders add column if not exists contact_number text;
alter table public.orders add column if not exists reference_number text;
alter table public.orders add column if not exists proof_of_payment_url text;
alter table public.orders add column if not exists admin_notes text;
alter table public.orders add column if not exists verified_at timestamptz;

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('payment-qrs', 'payment-qrs', true)
on conflict (id) do nothing;

create policy "Public payment proofs upload" on storage.objects
for insert to anon, authenticated
with check (bucket_id = 'payment-proofs');

create policy "Public payment proofs read" on storage.objects
for select to anon, authenticated
using (bucket_id = 'payment-proofs');

create policy "Public payment QRs read" on storage.objects
for select to anon, authenticated
using (bucket_id = 'payment-qrs');

create policy "Admin payment QRs manage" on storage.objects
for all to authenticated
using (bucket_id = 'payment-qrs' and private.has_admin_role('admin'));

create or replace function public.create_scan_to_pay_order(
  p_system_slug text,
  p_customer_name text,
  p_customer_email text,
  p_contact_number text,
  p_reference_number text,
  p_proof_of_payment_url text,
  p_return_token_hash text
)
returns table (
  order_id uuid,
  order_number text,
  product_name text,
  version_label text,
  amount_minor bigint,
  currency text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_system public.systems%rowtype;
  selected_version public.system_versions%rowtype;
  new_order_id uuid;
  new_order_number text;
  authoritative_price bigint;
  normalized_email text := lower(trim(p_customer_email));
  accepted_at timestamptz := now();
begin
  if char_length(trim(p_customer_name)) not between 2 and 120 then raise exception 'Customer name is invalid.' using errcode = '22023'; end if;
  if normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'Customer email is invalid.' using errcode = '22023'; end if;
  if char_length(trim(p_reference_number)) not between 3 and 100 then raise exception 'Reference number is required.' using errcode = '22023'; end if;
  if char_length(trim(p_proof_of_payment_url)) < 5 then raise exception 'Proof of payment is required.' using errcode = '22023'; end if;

  if (select count(*) from public.orders where customer_email = normalized_email and created_at >= now() - interval '15 minutes') >= 5 then
    raise exception 'Too many recent checkout attempts.' using errcode = 'P0001';
  end if;

  select * into selected_system from public.systems
  where slug = p_system_slug and status = 'published' and pricing_type = 'fixed'
    and product_type in ('ready_made', 'customizable_template') and currency = 'PHP'
  for share;
  if not found then raise exception 'System is not available for direct checkout.' using errcode = 'P0002'; end if;

  select * into selected_version from public.system_versions
  where system_id = selected_system.id and is_current = true;
  if not found or not exists (select 1 from public.system_files where system_version_id = selected_version.id) then
    raise exception 'Current private deliverable is unavailable.' using errcode = 'P0002';
  end if;

  authoritative_price := case
    when selected_system.sale_active and selected_system.sale_price_minor is not null then selected_system.sale_price_minor
    else selected_system.price_minor
  end;

  new_order_number := 'WSB-' || to_char(now() at time zone 'UTC', 'YYYYMMDD') || '-' || upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 10));

  insert into public.orders (
    order_number, customer_name, customer_email, contact_number, reference_number,
    proof_of_payment_url, status, subtotal_minor, total_minor, currency,
    return_token_hash, terms_accepted_at, license_accepted_at, refund_policy_accepted_at,
    delivery_policy_accepted_at, expires_at
  ) values (
    new_order_number, trim(p_customer_name), normalized_email, nullif(trim(p_contact_number), ''), trim(p_reference_number),
    trim(p_proof_of_payment_url), 'pending_verification', authoritative_price, authoritative_price, selected_system.currency,
    p_return_token_hash, accepted_at, accepted_at, accepted_at, accepted_at,
    accepted_at + interval '7 days'
  ) returning id into new_order_id;

  insert into public.order_items (
    order_id, system_id, system_version_id, product_name, product_slug, version_label,
    unit_price_minor, line_total_minor, currency, license_snapshot, support_snapshot,
    delivery_snapshot, inclusions_snapshot
  ) values (
    new_order_id, selected_system.id, selected_version.id, selected_system.title, selected_system.slug,
    selected_version.version_label, authoritative_price, authoritative_price, selected_system.currency,
    coalesce(nullif(trim(selected_system.license_summary), ''), 'Single business source-code license.'),
    nullif(trim(selected_system.support_summary), ''),
    coalesce(nullif(trim(selected_system.delivery_summary), ''), 'Private access after verified payment.'),
    nullif(trim(selected_system.inclusions), '')
  );

  return query select new_order_id, new_order_number, selected_system.title,
    selected_version.version_label, authoritative_price, selected_system.currency;
end;
$$;

create or replace function public.update_order_manual_status(
  p_order_id uuid,
  p_new_status public.order_status,
  p_admin_notes text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_order public.orders%rowtype;
begin
  if not private.has_admin_role('admin') then
    raise exception 'Unauthorized admin action.' using errcode = '42501';
  end if;

  select * into target_order from public.orders where id = p_order_id for update;
  if not found then return false; end if;

  update public.orders set
    status = p_new_status,
    admin_notes = nullif(trim(p_admin_notes), ''),
    verified_at = case when p_new_status in ('verified', 'completed', 'paid') then coalesce(verified_at, now()) else verified_at end,
    paid_at = case when p_new_status in ('verified', 'completed', 'paid') then coalesce(paid_at, now()) else paid_at end,
    updated_at = now()
  where id = p_order_id;

  if p_new_status in ('verified', 'completed', 'paid') and target_order.status not in ('verified', 'completed', 'paid') then
    perform public.initialize_order_delivery(p_order_id);
  end if;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(),
    'order.status_updated',
    'orders',
    p_order_id::text,
    jsonb_build_object('previous_status', target_order.status, 'new_status', p_new_status, 'notes', p_admin_notes)
  );

  return true;
end;
$$;

revoke all on function public.create_scan_to_pay_order(text, text, text, text, text, text, text) from public;
revoke all on function public.update_order_manual_status(uuid, public.order_status, text) from public;
grant execute on function public.create_scan_to_pay_order(text, text, text, text, text, text, text) to service_role;
grant execute on function public.update_order_manual_status(uuid, public.order_status, text) to authenticated;

commit;
