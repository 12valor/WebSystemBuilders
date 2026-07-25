begin;

do $$ begin create type public.order_status as enum ('pending', 'paid', 'failed', 'expired', 'cancelled', 'refunded', 'disputed'); exception when duplicate_object then null; end $$;
do $$ begin create type public.payment_status as enum ('pending', 'paid', 'failed', 'expired', 'refunded', 'disputed'); exception when duplicate_object then null; end $$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  profile_user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  status public.order_status not null default 'pending',
  subtotal_minor bigint not null,
  total_minor bigint not null,
  currency text not null default 'PHP',
  return_token_hash text not null unique,
  terms_accepted_at timestamptz not null,
  license_accepted_at timestamptz not null,
  refund_policy_accepted_at timestamptz not null,
  delivery_policy_accepted_at timestamptz not null,
  paid_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_number_format check (order_number ~ '^WSB-[0-9]{8}-[A-F0-9]{10}$'),
  constraint orders_customer_name_length check (char_length(customer_name) between 2 and 120),
  constraint orders_customer_email_normalized check (customer_email = lower(trim(customer_email)) and char_length(customer_email) between 5 and 254),
  constraint orders_amounts_valid check (subtotal_minor >= 0 and total_minor >= subtotal_minor),
  constraint orders_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint orders_return_token_hash check (return_token_hash ~ '^[a-f0-9]{64}$')
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  system_id uuid references public.systems(id) on delete set null,
  system_version_id uuid references public.system_versions(id) on delete set null,
  product_name text not null,
  product_slug text not null,
  version_label text not null,
  unit_price_minor bigint not null,
  quantity integer not null default 1,
  line_total_minor bigint not null,
  currency text not null,
  license_snapshot text not null,
  support_snapshot text,
  delivery_snapshot text not null,
  inclusions_snapshot text,
  created_at timestamptz not null default now(),
  constraint order_items_product_name_length check (char_length(product_name) between 2 and 160),
  constraint order_items_product_slug_format check (product_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint order_items_version_length check (char_length(version_label) between 1 and 40),
  constraint order_items_amounts_valid check (unit_price_minor >= 0 and quantity = 1 and line_total_minor = unit_price_minor * quantity),
  constraint order_items_currency_format check (currency ~ '^[A-Z]{3}$')
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null default 'paymongo',
  provider_checkout_session_id text unique,
  provider_payment_id text unique,
  checkout_url text,
  status public.payment_status not null default 'pending',
  amount_minor bigint not null,
  currency text not null,
  livemode boolean,
  failure_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_provider_supported check (provider = 'paymongo'),
  constraint payments_amount_nonnegative check (amount_minor >= 0),
  constraint payments_currency_format check (currency ~ '^[A-Z]{3}$'),
  constraint payments_checkout_id_format check (provider_checkout_session_id is null or provider_checkout_session_id ~ '^cs_[A-Za-z0-9]+$'),
  constraint payments_payment_id_format check (provider_payment_id is null or provider_payment_id ~ '^pay_[A-Za-z0-9]+$'),
  constraint payments_checkout_url_https check (checkout_url is null or checkout_url ~ '^https://checkout\.paymongo\.com/')
);

create table if not exists public.payment_events (
  id bigint generated always as identity primary key,
  payment_id uuid references public.payments(id) on delete restrict,
  order_id uuid references public.orders(id) on delete restrict,
  provider text not null default 'paymongo',
  provider_event_id text not null unique,
  event_type text not null,
  livemode boolean not null,
  payload_sha256 text not null,
  processing_status text not null default 'received',
  processing_error text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  constraint payment_events_provider_supported check (provider = 'paymongo'),
  constraint payment_events_event_id_length check (char_length(provider_event_id) between 8 and 160),
  constraint payment_events_type_length check (char_length(event_type) between 3 and 120),
  constraint payment_events_payload_hash check (payload_sha256 ~ '^[a-f0-9]{64}$'),
  constraint payment_events_processing_status check (processing_status in ('received', 'processed', 'ignored', 'rejected'))
);

create index if not exists orders_customer_created_idx on public.orders(customer_email, created_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);
create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists payments_order_idx on public.payments(order_id);
create index if not exists payment_events_order_received_idx on public.payment_events(order_id, received_at desc);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders for each row execute function private.set_updated_at();
drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments for each row execute function private.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;

create policy "orders_select_admin" on public.orders for select to authenticated using (private.has_admin_role('admin'));
create policy "order_items_select_admin" on public.order_items for select to authenticated using (private.has_admin_role('admin'));
create policy "payments_select_admin" on public.payments for select to authenticated using (private.has_admin_role('admin'));
create policy "payment_events_select_admin" on public.payment_events for select to authenticated using (private.has_admin_role('admin'));

create or replace function public.create_pending_order(
  p_system_slug text,
  p_customer_name text,
  p_customer_email text,
  p_return_token_hash text
)
returns table (
  order_id uuid,
  order_number text,
  payment_id uuid,
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
  new_payment_id uuid;
  new_order_number text;
  authoritative_price bigint;
  normalized_email text := lower(trim(p_customer_email));
  accepted_at timestamptz := now();
begin
  if char_length(trim(p_customer_name)) not between 2 and 120 then raise exception 'Customer name is invalid.' using errcode = '22023'; end if;
  if normalized_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'Customer email is invalid.' using errcode = '22023'; end if;
  if (select count(*) from public.orders where customer_email = normalized_email and created_at >= now() - interval '15 minutes') >= 5 then
    raise exception 'Too many recent checkout attempts.' using errcode = 'P0001';
  end if;
  if p_return_token_hash !~ '^[a-f0-9]{64}$' then raise exception 'Return token is invalid.' using errcode = '22023'; end if;

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
  if authoritative_price is null or authoritative_price < 1 then raise exception 'Authoritative price is unavailable.' using errcode = '22023'; end if;

  new_order_number := 'WSB-' || to_char(now() at time zone 'UTC', 'YYYYMMDD') || '-' || upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 10));
  insert into public.orders (
    order_number, customer_name, customer_email, subtotal_minor, total_minor, currency,
    return_token_hash, terms_accepted_at, license_accepted_at, refund_policy_accepted_at,
    delivery_policy_accepted_at, expires_at
  ) values (
    new_order_number, trim(p_customer_name), normalized_email, authoritative_price, authoritative_price,
    selected_system.currency, p_return_token_hash, accepted_at, accepted_at, accepted_at, accepted_at,
    accepted_at + interval '24 hours'
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

  insert into public.payments (order_id, amount_minor, currency)
  values (new_order_id, authoritative_price, selected_system.currency)
  returning id into new_payment_id;

  return query select new_order_id, new_order_number, new_payment_id, selected_system.title,
    selected_version.version_label, authoritative_price, selected_system.currency;
end;
$$;

create or replace function public.attach_checkout_session(
  p_payment_id uuid,
  p_checkout_session_id text,
  p_checkout_url text,
  p_livemode boolean
)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.payments set
    provider_checkout_session_id = p_checkout_session_id,
    checkout_url = p_checkout_url,
    livemode = p_livemode,
    failure_code = null
  where id = p_payment_id and status = 'pending' and provider_checkout_session_id is null;
  return found;
end;
$$;

create or replace function public.fail_checkout_setup(p_payment_id uuid, p_failure_code text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.payments set status = 'failed', failure_code = left(coalesce(p_failure_code, 'provider_error'), 80)
  where id = p_payment_id and status = 'pending' and provider_checkout_session_id is null;
  return found;
end;
$$;

create or replace function public.record_paid_checkout_event(
  p_provider_event_id text,
  p_event_type text,
  p_checkout_session_id text,
  p_provider_payment_id text,
  p_amount_minor bigint,
  p_currency text,
  p_livemode boolean,
  p_payload_sha256 text
)
returns text language plpgsql security definer set search_path = '' as $$
declare
  selected_payment public.payments%rowtype;
  selected_order public.orders%rowtype;
begin
  if exists (select 1 from public.payment_events where provider_event_id = p_provider_event_id) then return 'duplicate'; end if;
  select * into selected_payment from public.payments where provider_checkout_session_id = p_checkout_session_id for update;
  if not found then
    insert into public.payment_events (provider_event_id, event_type, livemode, payload_sha256, processing_status, processing_error, processed_at)
    values (p_provider_event_id, p_event_type, p_livemode, p_payload_sha256, 'rejected', 'checkout_not_found', now());
    return 'rejected';
  end if;
  select * into selected_order from public.orders where id = selected_payment.order_id for update;

  if selected_payment.amount_minor <> p_amount_minor or selected_payment.currency <> upper(p_currency)
    or selected_order.total_minor <> p_amount_minor or selected_payment.livemode is distinct from p_livemode then
    insert into public.payment_events (payment_id, order_id, provider_event_id, event_type, livemode, payload_sha256, processing_status, processing_error, processed_at)
    values (selected_payment.id, selected_order.id, p_provider_event_id, p_event_type, p_livemode, p_payload_sha256, 'rejected', 'expected_values_mismatch', now());
    return 'rejected';
  end if;

  insert into public.payment_events (payment_id, order_id, provider_event_id, event_type, livemode, payload_sha256, processing_status, processed_at)
  values (selected_payment.id, selected_order.id, p_provider_event_id, p_event_type, p_livemode, p_payload_sha256, 'processed', now());

  update public.payments set status = 'paid', provider_payment_id = coalesce(provider_payment_id, p_provider_payment_id), failure_code = null
  where id = selected_payment.id and status <> 'paid';
  update public.orders set status = 'paid', paid_at = coalesce(paid_at, now()) where id = selected_order.id and status <> 'paid';
  if selected_order.status <> 'paid' then
    insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
    values (null, 'order.paid', 'orders', selected_order.id::text, jsonb_build_object('order_number', selected_order.order_number));
  end if;
  return case when selected_order.status = 'paid' then 'duplicate' else 'paid' end;
exception when unique_violation then return 'duplicate';
end;
$$;

create or replace function public.get_order_status_by_token(p_order_number text, p_return_token_hash text)
returns table (order_number text, status public.order_status, total_minor bigint, currency text, product_name text, version_label text, created_at timestamptz, paid_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select o.order_number, o.status, o.total_minor, o.currency, oi.product_name, oi.version_label, o.created_at, o.paid_at
  from public.orders o join public.order_items oi on oi.order_id = o.id
  where o.order_number = p_order_number and o.return_token_hash = p_return_token_hash
  limit 1
$$;

revoke all on function public.create_pending_order(text, text, text, text) from public;
revoke all on function public.attach_checkout_session(uuid, text, text, boolean) from public;
revoke all on function public.fail_checkout_setup(uuid, text) from public;
revoke all on function public.record_paid_checkout_event(text, text, text, text, bigint, text, boolean, text) from public;
revoke all on function public.get_order_status_by_token(text, text) from public;
grant execute on function public.create_pending_order(text, text, text, text) to service_role;
grant execute on function public.attach_checkout_session(uuid, text, text, boolean) to service_role;
grant execute on function public.fail_checkout_setup(uuid, text) to service_role;
grant execute on function public.record_paid_checkout_event(text, text, text, text, bigint, text, boolean, text) to service_role;
grant execute on function public.get_order_status_by_token(text, text) to service_role;

commit;
