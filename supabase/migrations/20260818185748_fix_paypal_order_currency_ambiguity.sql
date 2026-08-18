create or replace function public.create_or_reuse_paypal_order(
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

  select s.* into selected_system from public.systems as s
  where s.id = p_system_id and s.status = 'published' and s.pricing_type = 'fixed'
    and s.product_type in ('ready_made', 'customizable_template') and s.currency = 'PHP'
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
