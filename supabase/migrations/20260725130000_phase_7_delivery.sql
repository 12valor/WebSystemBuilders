begin;

do $$ begin create type public.fulfillment_status as enum ('processing', 'delivered', 'failed', 'revoked'); exception when duplicate_object then null; end $$;

create table if not exists public.fulfillments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete restrict,
  order_item_id uuid not null unique references public.order_items(id) on delete restrict,
  system_version_id uuid not null references public.system_versions(id) on delete restrict,
  status public.fulfillment_status not null default 'processing',
  delivery_email text not null,
  attempt_count integer not null default 1,
  provider_email_id text,
  email_sent_at timestamptz,
  delivered_at timestamptz,
  revoked_at timestamptz,
  failure_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fulfillments_email_normalized check (delivery_email = lower(trim(delivery_email))),
  constraint fulfillments_attempt_count check (attempt_count between 1 and 100)
);

create table if not exists public.download_grants (
  id uuid primary key default gen_random_uuid(),
  fulfillment_id uuid not null references public.fulfillments(id) on delete restrict,
  token_hash text not null unique,
  expires_at timestamptz not null,
  max_downloads integer not null,
  download_count integer not null default 0,
  last_downloaded_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint download_grants_token_hash check (token_hash ~ '^[a-f0-9]{64}$'),
  constraint download_grants_limits check (max_downloads between 1 and 100 and download_count between 0 and max_downloads),
  constraint download_grants_expiry check (expires_at > created_at)
);

create table if not exists public.delivery_events (
  id bigint generated always as identity primary key,
  fulfillment_id uuid not null references public.fulfillments(id) on delete restrict,
  order_id uuid not null references public.orders(id) on delete restrict,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint delivery_events_type_length check (char_length(event_type) between 3 and 100)
);

create index if not exists fulfillments_status_created_idx on public.fulfillments(status, created_at desc);
create index if not exists download_grants_fulfillment_created_idx on public.download_grants(fulfillment_id, created_at desc);
create index if not exists delivery_events_order_created_idx on public.delivery_events(order_id, created_at desc);
create unique index if not exists download_grants_one_active_per_fulfillment on public.download_grants(fulfillment_id) where revoked_at is null;

drop trigger if exists fulfillments_set_updated_at on public.fulfillments;
create trigger fulfillments_set_updated_at before update on public.fulfillments for each row execute function private.set_updated_at();

alter table public.fulfillments enable row level security;
alter table public.download_grants enable row level security;
alter table public.delivery_events enable row level security;
create policy "fulfillments_select_admin" on public.fulfillments for select to authenticated using (private.has_admin_role('admin'));
create policy "download_grants_select_admin" on public.download_grants for select to authenticated using (private.has_admin_role('admin'));
create policy "delivery_events_select_admin" on public.delivery_events for select to authenticated using (private.has_admin_role('admin'));

create or replace function public.create_delivery_for_paid_order(
  p_checkout_session_id text,
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
language plpgsql security definer set search_path = '' as $$
declare
  selected_order public.orders%rowtype;
  selected_item public.order_items%rowtype;
  created_fulfillment_id uuid;
  calculated_limit integer;
begin
  if p_token_hash !~ '^[a-f0-9]{64}$' or p_expires_at <= now() then raise exception 'Invalid delivery grant.' using errcode = '22023'; end if;
  select o.* into selected_order from public.orders o
  join public.payments p on p.order_id = o.id
  where p.provider_checkout_session_id = p_checkout_session_id and p.status = 'paid' and o.status = 'paid'
  for update of o;
  if not found then return; end if;
  select * into selected_item from public.order_items where public.order_items.order_id = selected_order.id limit 1;
  if selected_item.system_version_id is null then return; end if;
  calculated_limit := least(100, greatest(5, (select count(*)::integer * 3 from public.system_files where system_version_id = selected_item.system_version_id)));

  insert into public.fulfillments (order_id, order_item_id, system_version_id, delivery_email)
  values (selected_order.id, selected_item.id, selected_item.system_version_id, selected_order.customer_email)
  on conflict (order_id) do nothing returning id into created_fulfillment_id;
  if created_fulfillment_id is null then return; end if;

  insert into public.download_grants (fulfillment_id, token_hash, expires_at, max_downloads)
  values (created_fulfillment_id, p_token_hash, p_expires_at, calculated_limit);
  insert into public.delivery_events (fulfillment_id, order_id, event_type, metadata)
  values (created_fulfillment_id, selected_order.id, 'delivery.created', jsonb_build_object('expires_at', p_expires_at, 'max_downloads', calculated_limit));

  return query select created_fulfillment_id, selected_order.id, selected_order.order_number,
    selected_order.customer_name, selected_order.customer_email, selected_item.product_name,
    selected_item.version_label, sf.id, sf.original_filename, sf.byte_size, p_expires_at, calculated_limit
  from public.system_files sf where sf.system_version_id = selected_item.system_version_id order by sf.created_at;
end;
$$;

create or replace function public.rotate_delivery_grant(
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
language plpgsql security definer set search_path = '' as $$
declare
  selected_fulfillment public.fulfillments%rowtype;
  selected_order public.orders%rowtype;
  selected_item public.order_items%rowtype;
  calculated_limit integer;
begin
  if p_token_hash !~ '^[a-f0-9]{64}$' or p_expires_at <= now() then raise exception 'Invalid delivery grant.' using errcode = '22023'; end if;
  select * into selected_order from public.orders where id = p_order_id and status = 'paid' for update;
  if not found then return; end if;
  select * into selected_fulfillment from public.fulfillments where public.fulfillments.order_id = p_order_id and status <> 'revoked' for update;
  if not found then return; end if;
  select * into selected_item from public.order_items where id = selected_fulfillment.order_item_id;
  calculated_limit := least(100, greatest(5, (select count(*)::integer * 3 from public.system_files where system_version_id = selected_fulfillment.system_version_id)));

  update public.download_grants set revoked_at = coalesce(revoked_at, now()) where fulfillment_id = selected_fulfillment.id and revoked_at is null;
  insert into public.download_grants (fulfillment_id, token_hash, expires_at, max_downloads)
  values (selected_fulfillment.id, p_token_hash, p_expires_at, calculated_limit);
  update public.fulfillments set status = 'processing', attempt_count = attempt_count + 1, failure_code = null
  where id = selected_fulfillment.id;
  insert into public.delivery_events (fulfillment_id, order_id, event_type, metadata)
  values (selected_fulfillment.id, selected_order.id, 'delivery.resent', jsonb_build_object('expires_at', p_expires_at, 'max_downloads', calculated_limit));

  return query select selected_fulfillment.id, selected_order.id, selected_order.order_number,
    selected_order.customer_name, selected_order.customer_email, selected_item.product_name,
    selected_item.version_label, sf.id, sf.original_filename, sf.byte_size, p_expires_at, calculated_limit
  from public.system_files sf where sf.system_version_id = selected_fulfillment.system_version_id order by sf.created_at;
end;
$$;

create or replace function public.mark_delivery_email_result(
  p_fulfillment_id uuid,
  p_sent boolean,
  p_provider_email_id text,
  p_failure_code text
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare selected_order_id uuid;
begin
  update public.fulfillments set
    status = case when p_sent then 'delivered'::public.fulfillment_status else 'failed'::public.fulfillment_status end,
    provider_email_id = case when p_sent then left(p_provider_email_id, 160) else provider_email_id end,
    email_sent_at = case when p_sent then now() else email_sent_at end,
    delivered_at = case when p_sent then coalesce(delivered_at, now()) else delivered_at end,
    failure_code = case when p_sent then null else left(coalesce(p_failure_code, 'email_failed'), 80) end
  where id = p_fulfillment_id and status <> 'revoked'
  returning order_id into selected_order_id;
  if not found then return false; end if;
  insert into public.delivery_events (fulfillment_id, order_id, event_type, metadata)
  values (p_fulfillment_id, selected_order_id, case when p_sent then 'email.sent' else 'email.failed' end, '{}'::jsonb);
  return true;
end;
$$;

create or replace function public.get_download_grant_by_hash(p_token_hash text)
returns table (
  grant_id uuid, order_number text, product_name text, version_label text,
  expires_at timestamptz, max_downloads integer, download_count integer,
  file_id uuid, original_filename text, byte_size bigint
)
language sql stable security definer set search_path = '' as $$
  select dg.id, o.order_number, oi.product_name, oi.version_label, dg.expires_at,
    dg.max_downloads, dg.download_count, sf.id, sf.original_filename, sf.byte_size
  from public.download_grants dg
  join public.fulfillments f on f.id = dg.fulfillment_id
  join public.orders o on o.id = f.order_id
  join public.order_items oi on oi.id = f.order_item_id
  join public.system_files sf on sf.system_version_id = f.system_version_id
  where dg.token_hash = p_token_hash and dg.revoked_at is null and dg.expires_at > now()
    and dg.download_count < dg.max_downloads and f.status = 'delivered' and o.status = 'paid'
  order by sf.created_at
$$;

create or replace function public.consume_download_grant(p_token_hash text, p_file_id uuid)
returns table (storage_bucket text, storage_path text, original_filename text)
language plpgsql security definer set search_path = '' as $$
declare
  selected_grant public.download_grants%rowtype;
  selected_fulfillment public.fulfillments%rowtype;
  selected_order public.orders%rowtype;
  selected_file public.system_files%rowtype;
begin
  select * into selected_grant from public.download_grants where token_hash = p_token_hash for update;
  if not found or selected_grant.revoked_at is not null or selected_grant.expires_at <= now()
    or selected_grant.download_count >= selected_grant.max_downloads then return; end if;
  select * into selected_fulfillment from public.fulfillments where id = selected_grant.fulfillment_id and status = 'delivered';
  if not found then return; end if;
  select * into selected_order from public.orders where id = selected_fulfillment.order_id and status = 'paid';
  if not found then return; end if;
  select * into selected_file from public.system_files where id = p_file_id and system_version_id = selected_fulfillment.system_version_id;
  if not found then return; end if;

  update public.download_grants set download_count = download_count + 1, last_downloaded_at = now() where id = selected_grant.id;
  insert into public.delivery_events (fulfillment_id, order_id, event_type, metadata)
  values (selected_fulfillment.id, selected_order.id, 'download.consumed', jsonb_build_object('file_id', selected_file.id));
  return query select selected_file.storage_bucket, selected_file.storage_path, selected_file.original_filename;
end;
$$;

create or replace function public.revoke_delivery(p_order_id uuid, p_actor_user_id uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare selected_fulfillment_id uuid;
begin
  update public.fulfillments set status = 'revoked', revoked_at = coalesce(revoked_at, now()), failure_code = null
  where order_id = p_order_id and status <> 'revoked' returning id into selected_fulfillment_id;
  if not found then return false; end if;
  update public.download_grants set revoked_at = coalesce(revoked_at, now()) where fulfillment_id = selected_fulfillment_id and revoked_at is null;
  insert into public.delivery_events (fulfillment_id, order_id, event_type, metadata) values (selected_fulfillment_id, p_order_id, 'delivery.revoked', '{}'::jsonb);
  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (p_actor_user_id, 'delivery.revoked', 'orders', p_order_id::text, '{}'::jsonb);
  return true;
end;
$$;

revoke all on function public.create_delivery_for_paid_order(text, text, timestamptz) from public;
revoke all on function public.rotate_delivery_grant(uuid, text, timestamptz) from public;
revoke all on function public.mark_delivery_email_result(uuid, boolean, text, text) from public;
revoke all on function public.get_download_grant_by_hash(text) from public;
revoke all on function public.consume_download_grant(text, uuid) from public;
revoke all on function public.revoke_delivery(uuid, uuid) from public;
grant execute on function public.create_delivery_for_paid_order(text, text, timestamptz) to service_role;
grant execute on function public.rotate_delivery_grant(uuid, text, timestamptz) to service_role;
grant execute on function public.mark_delivery_email_result(uuid, boolean, text, text) to service_role;
grant execute on function public.get_download_grant_by_hash(text) to service_role;
grant execute on function public.consume_download_grant(text, uuid) to service_role;
grant execute on function public.revoke_delivery(uuid, uuid) to service_role;

commit;
