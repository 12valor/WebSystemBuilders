begin;

alter type public.payment_status add value if not exists 'cancelled';

alter table public.payments
  add column if not exists provider_payment_intent_id text;

alter table public.payments
  drop constraint if exists payments_provider_supported;
alter table public.payments
  add constraint payments_provider_supported check (provider in ('paymongo', 'manual'));

alter table public.payments
  drop constraint if exists payments_payment_intent_id_format;
alter table public.payments
  add constraint payments_payment_intent_id_format check (
    provider_payment_intent_id is null or provider_payment_intent_id ~ '^pi_[A-Za-z0-9]+$'
  );

create unique index if not exists payments_provider_payment_intent_uidx
  on public.payments(provider_payment_intent_id)
  where provider_payment_intent_id is not null;

create index if not exists orders_profile_created_idx
  on public.orders(profile_user_id, created_at desc)
  where profile_user_id is not null;

create index if not exists orders_profile_pending_created_idx
  on public.orders(profile_user_id, created_at desc)
  where status = 'pending';

create index if not exists order_items_system_order_idx
  on public.order_items(system_id, order_id);

create index if not exists payments_pending_paymongo_order_idx
  on public.payments(order_id, created_at desc)
  where provider = 'paymongo' and status = 'pending';

insert into public.payments (
  order_id,
  provider,
  status,
  amount_minor,
  currency,
  livemode,
  failure_code,
  created_at,
  updated_at
)
select
  o.id,
  'manual',
  case
    when o.status in ('verified', 'completed', 'paid') then 'paid'::public.payment_status
    when o.status in ('rejected', 'failed', 'cancelled') then 'failed'::public.payment_status
    when o.status = 'expired' then 'expired'::public.payment_status
    when o.status = 'refunded' then 'refunded'::public.payment_status
    when o.status = 'disputed' then 'disputed'::public.payment_status
    else 'pending'::public.payment_status
  end,
  o.total_minor,
  o.currency,
  null,
  null,
  o.created_at,
  o.updated_at
from public.orders o
where (o.reference_number is not null or o.proof_of_payment_url is not null)
  and not exists (
    select 1 from public.payments p where p.order_id = o.id
  );

create or replace function public.create_or_reuse_paymongo_order(
  p_system_id uuid,
  p_profile_user_id uuid,
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
  currency text,
  checkout_url text,
  checkout_session_id text
)
language plpgsql
security definer
set search_path = ''
as $$
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
  if p_profile_user_id is null then
    raise exception 'Authentication is required.' using errcode = '42501';
  end if;

  select lower(email) into verified_email
  from auth.users
  where id = p_profile_user_id and email_confirmed_at is not null;

  if verified_email is null or verified_email <> normalized_email then
    raise exception 'A verified customer identity is required.' using errcode = '42501';
  end if;

  if char_length(trim(p_customer_name)) not between 2 and 120 then
    raise exception 'Customer name is invalid.' using errcode = '22023';
  end if;
  if p_return_token_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Return token is invalid.' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_profile_user_id::text || ':' || p_system_id::text, 0)
  );

  select * into selected_system
  from public.systems
  where id = p_system_id
    and status = 'published'
    and pricing_type = 'fixed'
    and product_type in ('ready_made', 'customizable_template')
    and currency = 'PHP'
  for share;

  if not found then
    raise exception 'System is not available for direct checkout.' using errcode = 'P0002';
  end if;

  select * into selected_version
  from public.system_versions
  where system_id = selected_system.id and is_current = true
  limit 1;

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
  where o.profile_user_id = p_profile_user_id
    and oi.system_id = p_system_id
    and o.status = 'pending'
    and o.created_at >= now() - interval '24 hours'
  order by o.created_at desc
  limit 1
  for update of o;

  if found then
    select * into selected_item
    from public.order_items
    where public.order_items.order_id = selected_order.id
    limit 1;

    select * into selected_payment
    from public.payments
    where public.payments.order_id = selected_order.id
      and provider = 'paymongo'
      and status = 'pending'
    order by created_at desc
    limit 1
    for update;

    if not found then
      insert into public.payments (order_id, provider, status, amount_minor, currency, livemode)
      values (selected_order.id, 'paymongo', 'pending', selected_order.total_minor, selected_order.currency, false)
      returning * into selected_payment;
    end if;

    return query select
      selected_order.id,
      selected_order.order_number,
      selected_payment.id,
      selected_item.product_name,
      selected_item.version_label,
      selected_payment.amount_minor,
      selected_payment.currency,
      selected_payment.checkout_url,
      selected_payment.provider_checkout_session_id;
    return;
  end if;

  if (
    select count(*)
    from public.orders
    where profile_user_id = p_profile_user_id
      and created_at >= now() - interval '15 minutes'
  ) >= 5 then
    raise exception 'Too many recent checkout attempts.' using errcode = 'P0001';
  end if;

  new_order_number := 'WSB-' || to_char(now() at time zone 'UTC', 'YYYYMMDD') || '-' ||
    upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 10));

  insert into public.orders (
    order_number,
    profile_user_id,
    customer_name,
    customer_email,
    status,
    subtotal_minor,
    total_minor,
    currency,
    return_token_hash,
    terms_accepted_at,
    license_accepted_at,
    refund_policy_accepted_at,
    delivery_policy_accepted_at,
    expires_at
  ) values (
    new_order_number,
    p_profile_user_id,
    trim(p_customer_name),
    normalized_email,
    'pending',
    authoritative_price,
    authoritative_price,
    selected_system.currency,
    p_return_token_hash,
    accepted_at,
    accepted_at,
    accepted_at,
    accepted_at,
    accepted_at + interval '24 hours'
  ) returning id into new_order_id;

  insert into public.order_items (
    order_id,
    system_id,
    system_version_id,
    product_name,
    product_slug,
    version_label,
    unit_price_minor,
    line_total_minor,
    currency,
    license_snapshot,
    support_snapshot,
    delivery_snapshot,
    inclusions_snapshot
  ) values (
    new_order_id,
    selected_system.id,
    selected_version.id,
    selected_system.title,
    selected_system.slug,
    selected_version.version_label,
    authoritative_price,
    authoritative_price,
    selected_system.currency,
    coalesce(nullif(trim(selected_system.license_summary), ''), 'Single business source-code license.'),
    nullif(trim(selected_system.support_summary), ''),
    coalesce(nullif(trim(selected_system.delivery_summary), ''), 'Private access after verified payment.'),
    nullif(trim(selected_system.inclusions), '')
  ) returning * into selected_item;

  insert into public.payments (order_id, provider, status, amount_minor, currency, livemode)
  values (new_order_id, 'paymongo', 'pending', authoritative_price, selected_system.currency, false)
  returning * into selected_payment;

  return query select
    new_order_id,
    new_order_number,
    selected_payment.id,
    selected_item.product_name,
    selected_item.version_label,
    authoritative_price,
    selected_system.currency,
    null::text,
    null::text;
end;
$$;

drop function if exists public.record_paid_checkout_event(text, text, text, text, bigint, text, boolean, text);

create or replace function public.record_paid_checkout_event(
  p_provider_event_id text,
  p_event_type text,
  p_checkout_session_id text,
  p_order_id uuid,
  p_order_number text,
  p_provider_payment_intent_id text,
  p_provider_payment_id text,
  p_payment_status text,
  p_amount_minor bigint,
  p_currency text,
  p_livemode boolean,
  p_payload_sha256 text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_payment public.payments%rowtype;
  selected_order public.orders%rowtype;
begin
  if exists (
    select 1 from public.payment_events where provider_event_id = p_provider_event_id
  ) then
    return 'duplicate';
  end if;

  select * into selected_payment
  from public.payments
  where provider = 'paymongo'
    and provider_checkout_session_id = p_checkout_session_id
  for update;

  if not found then
    insert into public.payment_events (
      provider_event_id,
      event_type,
      livemode,
      payload_sha256,
      processing_status,
      processing_error,
      processed_at
    ) values (
      p_provider_event_id,
      p_event_type,
      p_livemode,
      p_payload_sha256,
      'rejected',
      'checkout_not_found',
      now()
    );
    return 'rejected';
  end if;

  select * into selected_order
  from public.orders
  where id = selected_payment.order_id
  for update;

  if p_event_type <> 'checkout_session.payment.paid'
    or p_livemode
    or p_payment_status <> 'paid'
    or selected_order.id <> p_order_id
    or selected_order.order_number <> p_order_number
    or selected_payment.amount_minor <> p_amount_minor
    or selected_order.total_minor <> p_amount_minor
    or selected_payment.currency <> upper(p_currency)
    or selected_order.currency <> upper(p_currency)
    or upper(p_currency) <> 'PHP'
    or (selected_payment.provider_payment_id is not null and selected_payment.provider_payment_id <> p_provider_payment_id)
    or (selected_payment.provider_payment_intent_id is not null and selected_payment.provider_payment_intent_id is distinct from p_provider_payment_intent_id)
    or selected_payment.livemode is distinct from false then
    insert into public.payment_events (
      payment_id,
      order_id,
      provider_event_id,
      event_type,
      livemode,
      payload_sha256,
      processing_status,
      processing_error,
      processed_at
    ) values (
      selected_payment.id,
      selected_order.id,
      p_provider_event_id,
      p_event_type,
      p_livemode,
      p_payload_sha256,
      'rejected',
      'expected_values_mismatch',
      now()
    );
    return 'rejected';
  end if;

  insert into public.payment_events (
    payment_id,
    order_id,
    provider_event_id,
    event_type,
    livemode,
    payload_sha256,
    processing_status,
    processed_at
  ) values (
    selected_payment.id,
    selected_order.id,
    p_provider_event_id,
    p_event_type,
    p_livemode,
    p_payload_sha256,
    'processed',
    now()
  );

  update public.payments set
    status = 'paid',
    provider_payment_id = coalesce(provider_payment_id, p_provider_payment_id),
    provider_payment_intent_id = coalesce(provider_payment_intent_id, p_provider_payment_intent_id),
    failure_code = null
  where id = selected_payment.id and status <> 'paid';

  update public.orders set
    status = 'paid',
    paid_at = coalesce(paid_at, now())
  where id = selected_order.id and status <> 'paid';

  if selected_order.status <> 'paid' then
    insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
    values (
      null,
      'order.paid',
      'orders',
      selected_order.id::text,
      jsonb_build_object('order_number', selected_order.order_number, 'provider', 'paymongo')
    );
  end if;

  return case when selected_order.status = 'paid' then 'duplicate' else 'paid' end;
exception when unique_violation then
  return 'duplicate';
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

  select * into target_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    return false;
  end if;

  if not exists (
    select 1 from public.payments where order_id = p_order_id and provider = 'manual'
  ) then
    return false;
  end if;

  update public.orders set
    status = p_new_status,
    admin_notes = nullif(trim(p_admin_notes), ''),
    verified_at = case
      when p_new_status in ('verified', 'completed', 'paid') then coalesce(verified_at, now())
      else verified_at
    end,
    paid_at = case
      when p_new_status in ('verified', 'completed', 'paid') then coalesce(paid_at, now())
      else paid_at
    end,
    updated_at = now()
  where id = p_order_id;

  update public.payments set
    status = case
      when p_new_status in ('verified', 'completed', 'paid') then 'paid'::public.payment_status
      when p_new_status = 'rejected' then 'failed'::public.payment_status
      else 'pending'::public.payment_status
    end,
    failure_code = case when p_new_status = 'rejected' then 'manual_rejected' else null end
  where order_id = p_order_id and provider = 'manual';

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    auth.uid(),
    'order.status_updated',
    'orders',
    p_order_id::text,
    jsonb_build_object(
      'previous_status', target_order.status,
      'new_status', p_new_status,
      'provider', 'manual',
      'notes', p_admin_notes
    )
  );

  return true;
end;
$$;

create or replace function public.create_delivery_for_order(
  p_order_id uuid,
  p_token_hash text,
  p_expires_at timestamptz
)
returns table (
  fulfillment_id uuid,
  order_id uuid,
  order_number text,
  customer_name text,
  customer_email text,
  product_name text,
  version_label text,
  file_id uuid,
  original_filename text,
  byte_size bigint,
  expires_at timestamptz,
  max_downloads integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_order public.orders%rowtype;
  selected_item public.order_items%rowtype;
  created_fulfillment_id uuid;
  calculated_limit integer;
begin
  if p_token_hash !~ '^[a-f0-9]{64}$' or p_expires_at <= now() then
    raise exception 'Invalid delivery grant.' using errcode = '22023';
  end if;

  select o.* into selected_order
  from public.orders o
  where o.id = p_order_id
    and o.status in ('verified', 'completed', 'paid')
    and exists (
      select 1 from public.payments p where p.order_id = o.id and p.status = 'paid'
    )
  for update;

  if not found then
    return;
  end if;

  select * into selected_item
  from public.order_items
  where public.order_items.order_id = selected_order.id
  limit 1;

  if selected_item.system_version_id is null then
    return;
  end if;

  calculated_limit := least(100, greatest(5, (
    select count(*)::integer * 3
    from public.system_files
    where system_version_id = selected_item.system_version_id
  )));

  insert into public.fulfillments (order_id, order_item_id, system_version_id, delivery_email)
  values (selected_order.id, selected_item.id, selected_item.system_version_id, selected_order.customer_email)
  on conflict (order_id) do nothing
  returning id into created_fulfillment_id;

  if created_fulfillment_id is null then
    return;
  end if;

  insert into public.download_grants (fulfillment_id, token_hash, expires_at, max_downloads)
  values (created_fulfillment_id, p_token_hash, p_expires_at, calculated_limit);

  insert into public.delivery_events (fulfillment_id, order_id, event_type, metadata)
  values (
    created_fulfillment_id,
    selected_order.id,
    'delivery.created',
    jsonb_build_object('expires_at', p_expires_at, 'max_downloads', calculated_limit, 'initiated_by', 'admin')
  );

  return query select
    created_fulfillment_id,
    selected_order.id,
    selected_order.order_number,
    selected_order.customer_name,
    selected_order.customer_email,
    selected_item.product_name,
    selected_item.version_label,
    sf.id,
    sf.original_filename,
    sf.byte_size,
    p_expires_at,
    calculated_limit
  from public.system_files sf
  where sf.system_version_id = selected_item.system_version_id
  order by sf.created_at;
end;
$$;

drop function if exists public.get_customer_portal();

create function public.get_customer_portal()
returns table (
  order_id uuid,
  order_number text,
  order_status public.order_status,
  total_minor bigint,
  currency text,
  product_name text,
  product_slug text,
  purchased_version text,
  current_version text,
  created_at timestamptz,
  paid_at timestamptz,
  payment_provider text,
  payment_status public.payment_status,
  fulfillment_status public.fulfillment_status,
  delivery_available boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    o.id,
    o.order_number,
    o.status,
    o.total_minor,
    o.currency,
    oi.product_name,
    oi.product_slug,
    oi.version_label,
    current_version.version_label,
    o.created_at,
    o.paid_at,
    latest_payment.provider,
    latest_payment.status,
    f.status,
    (latest_payment.status = 'paid' and f.status = 'delivered' and f.revoked_at is null)
  from public.orders o
  join public.order_items oi on oi.order_id = o.id
  left join public.fulfillments f on f.order_id = o.id
  left join lateral (
    select p.provider, p.status
    from public.payments p
    where p.order_id = o.id
    order by p.created_at desc
    limit 1
  ) latest_payment on true
  left join lateral (
    select sv.version_label
    from public.system_versions sv
    where sv.system_id = oi.system_id and sv.is_current = true
    limit 1
  ) current_version on true
  where o.profile_user_id = (select auth.uid())
  order by o.created_at desc
$$;

create or replace function public.get_download_grant_by_hash(p_token_hash text)
returns table (
  grant_id uuid,
  order_number text,
  product_name text,
  version_label text,
  expires_at timestamptz,
  max_downloads integer,
  download_count integer,
  file_id uuid,
  original_filename text,
  byte_size bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    dg.id,
    o.order_number,
    oi.product_name,
    oi.version_label,
    dg.expires_at,
    dg.max_downloads,
    dg.download_count,
    sf.id,
    sf.original_filename,
    sf.byte_size
  from public.download_grants dg
  join public.fulfillments f on f.id = dg.fulfillment_id
  join public.orders o on o.id = f.order_id
  join public.order_items oi on oi.id = f.order_item_id
  join public.system_files sf on sf.system_version_id = f.system_version_id
  where dg.token_hash = p_token_hash
    and dg.revoked_at is null
    and dg.expires_at > now()
    and dg.download_count < dg.max_downloads
    and f.status = 'delivered'
    and exists (
      select 1 from public.payments p where p.order_id = o.id and p.status = 'paid'
    )
  order by sf.created_at
$$;

create or replace function public.consume_download_grant(p_token_hash text, p_file_id uuid)
returns table (storage_bucket text, storage_path text, original_filename text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_grant public.download_grants%rowtype;
  selected_fulfillment public.fulfillments%rowtype;
  selected_order public.orders%rowtype;
  selected_file public.system_files%rowtype;
begin
  select * into selected_grant
  from public.download_grants
  where token_hash = p_token_hash
  for update;

  if not found
    or selected_grant.revoked_at is not null
    or selected_grant.expires_at <= now()
    or selected_grant.download_count >= selected_grant.max_downloads then
    return;
  end if;

  select * into selected_fulfillment
  from public.fulfillments
  where id = selected_grant.fulfillment_id and status = 'delivered';

  if not found then return; end if;

  select * into selected_order
  from public.orders o
  where o.id = selected_fulfillment.order_id
    and exists (
      select 1 from public.payments p where p.order_id = o.id and p.status = 'paid'
    );

  if not found then return; end if;

  select * into selected_file
  from public.system_files
  where id = p_file_id and system_version_id = selected_fulfillment.system_version_id;

  if not found then return; end if;

  update public.download_grants
  set download_count = download_count + 1, last_downloaded_at = now()
  where id = selected_grant.id;

  insert into public.delivery_events (fulfillment_id, order_id, event_type, metadata)
  values (
    selected_fulfillment.id,
    selected_order.id,
    'download.consumed',
    jsonb_build_object('file_id', selected_file.id)
  );

  return query select selected_file.storage_bucket, selected_file.storage_path, selected_file.original_filename;
end;
$$;

revoke all on function public.create_or_reuse_paymongo_order(uuid, uuid, text, text, text) from public;
revoke all on function public.record_paid_checkout_event(text, text, text, uuid, text, text, text, text, bigint, text, boolean, text) from public;
revoke all on function public.create_delivery_for_order(uuid, text, timestamptz) from public;
revoke all on function public.get_customer_portal() from public;
revoke all on function public.get_download_grant_by_hash(text) from public;
revoke all on function public.consume_download_grant(text, uuid) from public;

grant execute on function public.create_or_reuse_paymongo_order(uuid, uuid, text, text, text) to service_role;
grant execute on function public.record_paid_checkout_event(text, text, text, uuid, text, text, text, text, bigint, text, boolean, text) to service_role;
grant execute on function public.create_delivery_for_order(uuid, text, timestamptz) to service_role;
grant execute on function public.get_customer_portal() to authenticated;
grant execute on function public.get_download_grant_by_hash(text) to service_role;
grant execute on function public.consume_download_grant(text, uuid) to service_role;

commit;
