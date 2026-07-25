begin;

do $$ begin create type public.support_status as enum ('open', 'in_progress', 'resolved', 'closed'); exception when duplicate_object then null; end $$;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid not null references auth.users(id) on delete restrict,
  order_id uuid not null references public.orders(id) on delete restrict,
  subject text not null,
  message text not null,
  status public.support_status not null default 'open',
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint support_requests_subject_length check (char_length(subject) between 5 and 140),
  constraint support_requests_message_length check (char_length(message) between 20 and 4000),
  constraint support_requests_resolution check ((status in ('resolved', 'closed') and resolved_at is not null) or (status in ('open', 'in_progress') and resolved_at is null))
);

create index if not exists support_requests_customer_created_idx on public.support_requests(customer_user_id, created_at desc);
create index if not exists support_requests_status_created_idx on public.support_requests(status, created_at desc);
drop trigger if exists support_requests_set_updated_at on public.support_requests;
create trigger support_requests_set_updated_at before update on public.support_requests for each row execute function private.set_updated_at();

alter table public.support_requests enable row level security;
create policy "support_requests_select_own_or_admin" on public.support_requests for select to authenticated
using ((select auth.uid()) = customer_user_id or private.has_admin_role('admin'));
create policy "support_requests_insert_own_order" on public.support_requests for insert to authenticated
with check (
  (select auth.uid()) = customer_user_id
  and exists (select 1 from public.orders where orders.id = support_requests.order_id and orders.profile_user_id = (select auth.uid()))
);
create policy "support_requests_update_admin" on public.support_requests for update to authenticated
using (private.has_admin_role('admin')) with check (private.has_admin_role('admin'));

drop policy if exists "orders_select_admin" on public.orders;
create policy "orders_select_own_or_admin" on public.orders for select to authenticated
using (profile_user_id = (select auth.uid()) or private.has_admin_role('admin'));
drop policy if exists "order_items_select_admin" on public.order_items;
create policy "order_items_select_own_or_admin" on public.order_items for select to authenticated
using (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.profile_user_id = (select auth.uid())) or private.has_admin_role('admin'));

create or replace function public.claim_customer_orders()
returns integer language plpgsql security definer set search_path = '' as $$
declare
  current_user_id uuid := (select auth.uid());
  verified_email text;
  claimed_count integer;
begin
  if current_user_id is null then raise exception 'Authentication is required.' using errcode = '42501'; end if;
  select lower(email) into verified_email from auth.users where id = current_user_id and email_confirmed_at is not null;
  if verified_email is null then raise exception 'A verified email is required.' using errcode = '42501'; end if;
  update public.orders set profile_user_id = current_user_id
  where profile_user_id is null and customer_email = verified_email;
  get diagnostics claimed_count = row_count;
  return claimed_count;
end;
$$;

create or replace function public.get_customer_portal()
returns table (
  order_id uuid, order_number text, order_status public.order_status, total_minor bigint, currency text,
  product_name text, product_slug text, purchased_version text, current_version text,
  created_at timestamptz, paid_at timestamptz, fulfillment_status public.fulfillment_status,
  delivery_available boolean
)
language sql stable security definer set search_path = '' as $$
  select o.id, o.order_number, o.status, o.total_minor, o.currency, oi.product_name, oi.product_slug,
    oi.version_label, current_version.version_label, o.created_at, o.paid_at, f.status,
    (o.status = 'paid' and f.status = 'delivered' and f.revoked_at is null)
  from public.orders o
  join public.order_items oi on oi.order_id = o.id
  left join public.fulfillments f on f.order_id = o.id
  left join lateral (
    select sv.version_label from public.system_versions sv
    where sv.system_id = oi.system_id and sv.is_current = true limit 1
  ) current_version on true
  where o.profile_user_id = (select auth.uid())
  order by o.created_at desc
$$;

create or replace function public.create_portal_download_grant(p_order_id uuid, p_token_hash text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  selected_fulfillment public.fulfillments%rowtype;
  calculated_limit integer;
begin
  if (select auth.uid()) is null or p_token_hash !~ '^[a-f0-9]{64}$' then return false; end if;
  select f.* into selected_fulfillment from public.fulfillments f
  join public.orders o on o.id = f.order_id
  where f.order_id = p_order_id and o.profile_user_id = (select auth.uid()) and o.status = 'paid'
    and f.status = 'delivered' and f.revoked_at is null
  for update of f;
  if not found then return false; end if;
  calculated_limit := least(100, greatest(5, (select count(*)::integer * 3 from public.system_files where system_version_id = selected_fulfillment.system_version_id)));
  update public.download_grants set revoked_at = coalesce(revoked_at, now()) where fulfillment_id = selected_fulfillment.id and revoked_at is null;
  insert into public.download_grants (fulfillment_id, token_hash, expires_at, max_downloads)
  values (selected_fulfillment.id, p_token_hash, now() + interval '1 hour', calculated_limit);
  insert into public.delivery_events (fulfillment_id, order_id, event_type, metadata)
  values (selected_fulfillment.id, p_order_id, 'delivery.portal_access', jsonb_build_object('expires_in_seconds', 3600, 'max_downloads', calculated_limit));
  return true;
end;
$$;

create or replace function private.audit_support_request()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values ((select auth.uid()), case when tg_op = 'INSERT' then 'support.created' else 'support.updated' end,
    'support_requests', new.id::text, jsonb_build_object('status', new.status, 'order_id', new.order_id));
  return new;
end;
$$;
revoke all on function private.audit_support_request() from public;
drop trigger if exists support_requests_audit_change on public.support_requests;
create trigger support_requests_audit_change after insert or update on public.support_requests for each row execute function private.audit_support_request();

revoke all on function public.claim_customer_orders() from public;
revoke all on function public.get_customer_portal() from public;
revoke all on function public.create_portal_download_grant(uuid, text) from public;
grant execute on function public.claim_customer_orders() to authenticated;
grant execute on function public.get_customer_portal() to authenticated;
grant execute on function public.create_portal_download_grant(uuid, text) to authenticated;

commit;
