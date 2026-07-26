begin;

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
    (o.status in ('verified', 'completed', 'paid') and f.status = 'delivered' and f.revoked_at is null)
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
  where f.order_id = p_order_id and o.profile_user_id = (select auth.uid())
    and o.status in ('verified', 'completed', 'paid')
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

revoke all on function public.get_customer_portal() from public;
revoke all on function public.create_portal_download_grant(uuid, text) from public;
grant execute on function public.get_customer_portal() to authenticated;
grant execute on function public.create_portal_download_grant(uuid, text) to authenticated;

commit;
