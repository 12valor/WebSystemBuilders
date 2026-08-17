begin;

alter table public.payments
  add column if not exists provider_order_id text,
  add column if not exists provider_environment text,
  add column if not exists captured_at timestamptz;

alter table public.orders add column if not exists proof_storage_path text;

alter table public.payments drop constraint if exists payments_provider_supported;
alter table public.payments add constraint payments_provider_supported
  check (provider in ('paypal', 'manual', 'paymongo'));
alter table public.payments drop constraint if exists payments_checkout_id_format;
alter table public.payments drop constraint if exists payments_payment_id_format;
alter table public.payments drop constraint if exists payments_payment_intent_id_format;
alter table public.payments drop constraint if exists payments_checkout_url_https;
alter table public.payments add constraint payments_provider_environment_supported
  check (
    (provider = 'paypal' and provider_environment in ('sandbox', 'live'))
    or (provider <> 'paypal' and provider_environment is null)
  );
alter table public.payments add constraint payments_paypal_order_id_format
  check (provider_order_id is null or (provider = 'paypal' and provider_order_id ~ '^[A-Z0-9]{8,32}$'));
alter table public.payments add constraint payments_provider_payment_id_length
  check (provider_payment_id is null or char_length(provider_payment_id) between 8 and 160);

alter table public.payment_events drop constraint if exists payment_events_provider_supported;
alter table public.payment_events add constraint payment_events_provider_supported
  check (provider in ('paypal', 'paymongo'));

drop index if exists public.payments_pending_paymongo_order_idx;
drop index if exists public.payments_provider_payment_intent_uidx;
create unique index if not exists payments_provider_order_uidx
  on public.payments(provider, provider_order_id) where provider_order_id is not null;
create unique index if not exists payments_provider_payment_uidx
  on public.payments(provider, provider_payment_id) where provider_payment_id is not null;
create index if not exists payments_pending_paypal_order_idx
  on public.payments(order_id, created_at desc)
  where provider = 'paypal' and status in ('pending', 'processing');

update storage.buckets set public = false where id = 'payment-proofs';
drop policy if exists "Public payment proofs upload" on storage.objects;
drop policy if exists "Public payment proofs read" on storage.objects;
drop policy if exists "Customer payment proofs upload" on storage.objects;
drop policy if exists "Customer payment proofs read" on storage.objects;
drop policy if exists "Admin payment proofs read" on storage.objects;
create policy "Customer payment proofs upload" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Customer payment proofs read" on storage.objects
for select to authenticated
using (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Admin payment proofs read" on storage.objects
for select to authenticated
using (bucket_id = 'payment-proofs' and private.has_admin_role('admin'));

drop function if exists public.create_or_reuse_paymongo_order(uuid, uuid, text, text, text);
drop function if exists public.attach_checkout_session(uuid, text, text, boolean);
drop function if exists public.fail_checkout_setup(uuid, text);
drop function if exists public.record_paid_checkout_event(text, text, text, uuid, text, text, text, text, bigint, text, boolean, text);
drop function if exists public.create_scan_to_pay_order(text, text, text, text, text, text, text);

create function public.create_or_reuse_paypal_order(
  p_system_id uuid,
  p_profile_user_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_return_token_hash text,
  p_environment text
)
returns table (
  order_id uuid,
  order_number text,
  payment_id uuid,
  product_name text,
  version_label text,
  amount_minor bigint,
  currency text,
  provider_order_id text
)
language plpgsql security definer set search_path = '' as $$
declare
  selected_system public.systems%rowtype;
  selected_version public.system_versions%rowtype;
  selected_order public.orders%rowtype;
  selected_item public.order_items%rowtype;
  selected_payment public.payments%rowtype;
  new_order_id uuid;
  new_order_number text;
  authoritative_price bigint;
  normalized_email text := lower(trim(p_customer_email));
  verified_email text;
  accepted_at timestamptz := now();
begin
  if p_environment not in ('sandbox', 'live') then
    raise exception 'PayPal environment is invalid.' using errcode = '22023';
  end if;
  select lower(email) into verified_email from auth.users
  where id = p_profile_user_id and email_confirmed_at is not null;
  if verified_email is null or verified_email <> normalized_email then
    raise exception 'A verified customer identity is required.' using errcode = '42501';
  end if;
  if char_length(trim(p_customer_name)) not between 2 and 120
    or p_return_token_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Checkout identity is invalid.' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_profile_user_id::text || ':' || p_system_id::text || ':paypal', 0)
  );

  select * into selected_system from public.systems
  where id = p_system_id and status = 'published' and pricing_type = 'fixed'
    and product_type in ('ready_made', 'customizable_template') and currency = 'PHP'
  for share;
  if not found then
    raise exception 'System is not available for direct checkout.' using errcode = 'P0002';
  end if;
  select * into selected_version from public.system_versions
  where system_id = selected_system.id and is_current = true limit 1;
  if not found or not exists (
    select 1 from public.system_files where system_version_id = selected_version.id
  ) then
    raise exception 'Current private deliverable is unavailable.' using errcode = 'P0002';
  end if;
  authoritative_price := case
    when selected_system.sale_active and selected_system.sale_price_minor is not null
      then selected_system.sale_price_minor
    else selected_system.price_minor
  end;
  if authoritative_price is null or authoritative_price < 1 then
    raise exception 'Authoritative price is unavailable.' using errcode = '22023';
  end if;

  select o.* into selected_order
  from public.orders o
  join public.order_items oi on oi.order_id = o.id
  join public.payments p on p.order_id = o.id
  where o.profile_user_id = p_profile_user_id
    and oi.system_id = p_system_id
    and oi.system_version_id = selected_version.id
    and oi.line_total_minor = authoritative_price
    and o.status = 'pending'
    and p.provider = 'paypal'
    and p.provider_environment = p_environment
    and p.status in ('pending', 'processing')
    and o.created_at >= now() - interval '24 hours'
  order by o.created_at desc limit 1 for update of o;

  if found then
    select * into selected_item from public.order_items where public.order_items.order_id = selected_order.id limit 1;
    select * into selected_payment from public.payments
      where public.payments.order_id = selected_order.id and provider = 'paypal'
      order by created_at desc limit 1 for update;
    return query select selected_order.id, selected_order.order_number, selected_payment.id,
      selected_item.product_name, selected_item.version_label, selected_payment.amount_minor,
      selected_payment.currency, selected_payment.provider_order_id;
    return;
  end if;

  if (select count(*) from public.orders
      where profile_user_id = p_profile_user_id and created_at >= now() - interval '15 minutes') >= 5 then
    raise exception 'Too many recent checkout attempts.' using errcode = 'P0001';
  end if;

  new_order_number := 'WSB-' || to_char(now() at time zone 'UTC', 'YYYYMMDD') || '-' ||
    upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 10));
  insert into public.orders (
    order_number, profile_user_id, customer_name, customer_email, status,
    subtotal_minor, total_minor, currency, return_token_hash, terms_accepted_at,
    license_accepted_at, refund_policy_accepted_at, delivery_policy_accepted_at, expires_at
  ) values (
    new_order_number, p_profile_user_id, trim(p_customer_name), normalized_email, 'pending',
    authoritative_price, authoritative_price, selected_system.currency, p_return_token_hash,
    accepted_at, accepted_at, accepted_at, accepted_at, accepted_at + interval '24 hours'
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
  ) returning * into selected_item;
  insert into public.payments (
    order_id, provider, status, amount_minor, currency, livemode, provider_environment
  ) values (
    new_order_id, 'paypal', 'pending', authoritative_price, selected_system.currency,
    p_environment = 'live', p_environment
  ) returning * into selected_payment;
  return query select new_order_id, new_order_number, selected_payment.id,
    selected_item.product_name, selected_item.version_label, authoritative_price,
    selected_system.currency, null::text;
end;
$$;

create function public.attach_paypal_order(
  p_payment_id uuid, p_provider_order_id text, p_environment text
)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.payments set
    provider_order_id = p_provider_order_id,
    provider_environment = p_environment,
    livemode = p_environment = 'live',
    status = 'processing',
    failure_code = null
  where id = p_payment_id and provider = 'paypal' and status in ('pending', 'processing')
    and (provider_order_id is null or provider_order_id = p_provider_order_id)
    and provider_environment = p_environment;
  return found;
end;
$$;

create function public.fail_paypal_order_setup(p_payment_id uuid, p_failure_code text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.payments set status = 'failed', failure_code = left(trim(p_failure_code), 120)
  where id = p_payment_id and provider = 'paypal' and provider_order_id is null and status = 'pending';
  return found;
end;
$$;

create function public.get_paypal_capture_context(
  p_provider_order_id text, p_profile_user_id uuid default null
)
returns table (
  order_id uuid, order_number text, profile_user_id uuid, payment_id uuid,
  amount_minor bigint, currency text, provider_environment text,
  payment_status public.payment_status, provider_payment_id text
)
language sql stable security definer set search_path = '' as $$
  select o.id, o.order_number, o.profile_user_id, p.id, p.amount_minor, p.currency,
    p.provider_environment, p.status, p.provider_payment_id
  from public.payments p join public.orders o on o.id = p.order_id
  where p.provider = 'paypal' and p.provider_order_id = p_provider_order_id
    and (p_profile_user_id is null or o.profile_user_id = p_profile_user_id)
  limit 1
$$;

create function public.reconcile_paypal_payment(
  p_provider_event_id text,
  p_event_type text,
  p_provider_order_id text,
  p_provider_payment_id text,
  p_state text,
  p_amount_minor bigint,
  p_currency text,
  p_environment text,
  p_payload_sha256 text
)
returns text language plpgsql security definer set search_path = '' as $$
declare
  selected_payment public.payments%rowtype;
  selected_order public.orders%rowtype;
  next_payment_status public.payment_status;
  next_order_status public.order_status;
begin
  if exists (select 1 from public.payment_events where provider_event_id = p_provider_event_id) then
    return 'duplicate';
  end if;
  select * into selected_payment from public.payments
  where provider = 'paypal' and provider_order_id = p_provider_order_id for update;
  if not found then return 'not_found'; end if;
  select * into selected_order from public.orders where id = selected_payment.order_id for update;

  if p_state not in ('completed', 'pending', 'declined', 'refunded', 'reversed')
    or p_environment not in ('sandbox', 'live')
    or selected_payment.provider_environment <> p_environment
    or selected_payment.livemode is distinct from (p_environment = 'live')
    or selected_payment.amount_minor <> p_amount_minor
    or selected_order.total_minor <> p_amount_minor
    or selected_payment.currency <> upper(p_currency)
    or selected_order.currency <> upper(p_currency)
    or upper(p_currency) <> 'PHP'
    or p_payload_sha256 !~ '^[a-f0-9]{64}$'
    or (selected_payment.provider_payment_id is not null
        and p_provider_payment_id is not null
        and selected_payment.provider_payment_id <> p_provider_payment_id) then
    insert into public.payment_events (
      payment_id, order_id, provider, provider_event_id, event_type, livemode,
      payload_sha256, processing_status, processing_error, processed_at
    ) values (
      selected_payment.id, selected_order.id, 'paypal', p_provider_event_id,
      p_event_type, p_environment = 'live', p_payload_sha256,
      'rejected', 'expected_values_mismatch', now()
    );
    return 'rejected';
  end if;

  next_payment_status := case p_state
    when 'completed' then 'paid'::public.payment_status
    when 'pending' then 'processing'::public.payment_status
    when 'declined' then 'failed'::public.payment_status
    when 'refunded' then 'refunded'::public.payment_status
    else 'disputed'::public.payment_status
  end;
  next_order_status := case p_state
    when 'completed' then 'paid'::public.order_status
    when 'declined' then 'failed'::public.order_status
    when 'refunded' then 'refunded'::public.order_status
    when 'reversed' then 'disputed'::public.order_status
    else selected_order.status
  end;

  insert into public.payment_events (
    payment_id, order_id, provider, provider_event_id, event_type, livemode,
    payload_sha256, processing_status, processed_at
  ) values (
    selected_payment.id, selected_order.id, 'paypal', p_provider_event_id,
    p_event_type, p_environment = 'live', p_payload_sha256, 'processed', now()
  );
  update public.payments set
    status = next_payment_status,
    provider_payment_id = coalesce(provider_payment_id, p_provider_payment_id),
    captured_at = case when p_state = 'completed' then coalesce(captured_at, now()) else captured_at end,
    failure_code = case when p_state = 'declined' then 'paypal_capture_declined' else null end
  where id = selected_payment.id;
  update public.orders set
    status = next_order_status,
    paid_at = case when p_state = 'completed' then coalesce(paid_at, now()) else paid_at end
  where id = selected_order.id;
  if p_state = 'completed' and selected_order.status <> 'paid' then
    insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
    values (null, 'order.paid', 'orders', selected_order.id::text,
      jsonb_build_object('order_number', selected_order.order_number, 'provider', 'paypal'));
  end if;
  return p_state;
exception when unique_violation then return 'duplicate';
end;
$$;

create function public.cancel_paypal_order(
  p_provider_order_id text, p_profile_user_id uuid, p_reason text
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare selected_order_id uuid;
begin
  select o.id into selected_order_id from public.orders o
  join public.payments p on p.order_id = o.id
  where p.provider = 'paypal' and p.provider_order_id = p_provider_order_id
    and o.profile_user_id = p_profile_user_id
    and p.status in ('pending', 'processing')
  for update of o, p;
  if not found then return false; end if;
  update public.payments set status = 'cancelled', failure_code = left(trim(p_reason), 120)
    where order_id = selected_order_id and provider = 'paypal';
  update public.orders set status = 'cancelled' where id = selected_order_id and status = 'pending';
  return true;
end;
$$;

create function public.create_authenticated_manual_order(
  p_system_id uuid,
  p_profile_user_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_contact_number text,
  p_reference_number text,
  p_proof_storage_path text,
  p_return_token_hash text
)
returns table (order_id uuid, order_number text)
language plpgsql security definer set search_path = '' as $$
declare
  selected_system public.systems%rowtype;
  selected_version public.system_versions%rowtype;
  new_order_id uuid;
  new_order_number text;
  authoritative_price bigint;
  normalized_email text := lower(trim(p_customer_email));
  verified_email text;
  accepted_at timestamptz := now();
begin
  select lower(email) into verified_email from auth.users
  where id = p_profile_user_id and email_confirmed_at is not null;
  if verified_email is null or verified_email <> normalized_email then
    raise exception 'A verified customer identity is required.' using errcode = '42501';
  end if;
  if char_length(trim(p_customer_name)) not between 2 and 120
    or char_length(trim(p_reference_number)) not between 3 and 100
    or p_return_token_hash !~ '^[a-f0-9]{64}$'
    or p_proof_storage_path !~ ('^' || p_profile_user_id::text || '/[A-Za-z0-9._/-]+$') then
    raise exception 'Manual payment submission is invalid.' using errcode = '22023';
  end if;
  if not exists (select 1 from storage.objects
    where bucket_id = 'payment-proofs' and name = p_proof_storage_path) then
    raise exception 'Payment proof is unavailable.' using errcode = '22023';
  end if;
  select * into selected_system from public.systems
  where id = p_system_id and status = 'published' and pricing_type = 'fixed'
    and product_type in ('ready_made', 'customizable_template') and currency = 'PHP'
    and payment_qr_url ~ '^https://' and char_length(trim(payment_instructions)) >= 8
  for share;
  if not found then raise exception 'Manual payment is unavailable.' using errcode = 'P0002'; end if;
  select * into selected_version from public.system_versions
    where system_id = selected_system.id and is_current = true limit 1;
  if not found or not exists (select 1 from public.system_files where system_version_id = selected_version.id) then
    raise exception 'Current private deliverable is unavailable.' using errcode = 'P0002';
  end if;
  authoritative_price := case when selected_system.sale_active and selected_system.sale_price_minor is not null
    then selected_system.sale_price_minor else selected_system.price_minor end;
  if authoritative_price is null or authoritative_price < 1 then
    raise exception 'Authoritative price is unavailable.' using errcode = '22023';
  end if;
  if (select count(*) from public.orders where profile_user_id = p_profile_user_id
      and created_at >= now() - interval '15 minutes') >= 5 then
    raise exception 'Too many recent checkout attempts.' using errcode = 'P0001';
  end if;
  new_order_number := 'WSB-' || to_char(now() at time zone 'UTC', 'YYYYMMDD') || '-' ||
    upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 10));
  insert into public.orders (
    order_number, profile_user_id, customer_name, customer_email, contact_number,
    reference_number, proof_storage_path, status, subtotal_minor, total_minor, currency,
    return_token_hash, terms_accepted_at, license_accepted_at, refund_policy_accepted_at,
    delivery_policy_accepted_at, expires_at
  ) values (
    new_order_number, p_profile_user_id, trim(p_customer_name), normalized_email,
    nullif(trim(p_contact_number), ''), trim(p_reference_number), p_proof_storage_path,
    'pending_verification', authoritative_price, authoritative_price, selected_system.currency,
    p_return_token_hash, accepted_at, accepted_at, accepted_at, accepted_at,
    accepted_at + interval '7 days'
  ) returning id into new_order_id;
  insert into public.order_items (
    order_id, system_id, system_version_id, product_name, product_slug, version_label,
    unit_price_minor, line_total_minor, currency, license_snapshot, support_snapshot,
    delivery_snapshot, inclusions_snapshot
  ) values (
    new_order_id, selected_system.id, selected_version.id, selected_system.title,
    selected_system.slug, selected_version.version_label, authoritative_price,
    authoritative_price, selected_system.currency,
    coalesce(nullif(trim(selected_system.license_summary), ''), 'Single business source-code license.'),
    nullif(trim(selected_system.support_summary), ''),
    coalesce(nullif(trim(selected_system.delivery_summary), ''), 'Private access after verified payment.'),
    nullif(trim(selected_system.inclusions), '')
  );
  insert into public.payments (order_id, provider, status, amount_minor, currency)
    values (new_order_id, 'manual', 'pending', authoritative_price, selected_system.currency);
  return query select new_order_id, new_order_number;
end;
$$;

drop function if exists public.get_customer_portal();
create function public.get_customer_portal()
returns table (
  order_id uuid, order_number text, order_status public.order_status,
  total_minor bigint, currency text, product_name text, product_slug text,
  purchased_version text, current_version text, created_at timestamptz,
  paid_at timestamptz, payment_provider text, payment_status public.payment_status,
  provider_order_id text, provider_payment_id text,
  fulfillment_status public.fulfillment_status, delivery_available boolean
)
language sql stable security definer set search_path = '' as $$
  select o.id, o.order_number, o.status, o.total_minor, o.currency,
    oi.product_name, oi.product_slug, oi.version_label, current_version.version_label,
    o.created_at, o.paid_at, latest_payment.provider, latest_payment.status,
    latest_payment.provider_order_id, latest_payment.provider_payment_id,
    f.status,
    (latest_payment.status = 'paid' and f.status = 'delivered' and f.revoked_at is null)
  from public.orders o
  join public.order_items oi on oi.order_id = o.id
  left join public.fulfillments f on f.order_id = o.id
  left join lateral (
    select p.provider, p.status, p.provider_order_id, p.provider_payment_id
    from public.payments p where p.order_id = o.id order by p.created_at desc limit 1
  ) latest_payment on true
  left join lateral (
    select sv.version_label from public.system_versions sv
    where sv.system_id = oi.system_id and sv.is_current = true limit 1
  ) current_version on true
  where o.profile_user_id = (select auth.uid())
  order by o.created_at desc
$$;

revoke all on function public.create_or_reuse_paypal_order(uuid, uuid, text, text, text, text) from public, anon, authenticated;
revoke all on function public.attach_paypal_order(uuid, text, text) from public, anon, authenticated;
revoke all on function public.fail_paypal_order_setup(uuid, text) from public, anon, authenticated;
revoke all on function public.get_paypal_capture_context(text, uuid) from public, anon, authenticated;
revoke all on function public.reconcile_paypal_payment(text, text, text, text, text, bigint, text, text, text) from public, anon, authenticated;
revoke all on function public.cancel_paypal_order(text, uuid, text) from public, anon, authenticated;
revoke all on function public.create_authenticated_manual_order(uuid, uuid, text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.get_customer_portal() from public, anon;

grant execute on function public.create_or_reuse_paypal_order(uuid, uuid, text, text, text, text) to service_role;
grant execute on function public.attach_paypal_order(uuid, text, text) to service_role;
grant execute on function public.fail_paypal_order_setup(uuid, text) to service_role;
grant execute on function public.get_paypal_capture_context(text, uuid) to service_role;
grant execute on function public.reconcile_paypal_payment(text, text, text, text, text, bigint, text, text, text) to service_role;
grant execute on function public.cancel_paypal_order(text, uuid, text) to service_role;
grant execute on function public.create_authenticated_manual_order(uuid, uuid, text, text, text, text, text, text) to service_role;
grant execute on function public.get_customer_portal() to authenticated;

commit;
