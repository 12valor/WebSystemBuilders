begin;

-- Hosted projects can carry direct default EXECUTE grants for API roles.
-- Revoke those explicitly instead of relying on a PUBLIC-only revoke.

revoke all on function public.claim_customer_orders() from public, anon, authenticated;
revoke all on function public.complete_user_onboarding(text, text, text, text[]) from public, anon, authenticated;
revoke all on function public.submit_seller_application(text, text, text, text, text, text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.review_seller_application(uuid, text, text) from public, anon, authenticated;
revoke all on function public.create_portal_download_grant(uuid, text) from public, anon, authenticated;
revoke all on function public.get_admin_access() from public, anon, authenticated;
revoke all on function public.manage_admin_access(text, public.admin_role, text) from public, anon, authenticated;
revoke all on function public.update_order_manual_status(uuid, public.order_status, text) from public, anon, authenticated;

grant execute on function public.claim_customer_orders() to authenticated, service_role;
grant execute on function public.complete_user_onboarding(text, text, text, text[]) to authenticated, service_role;
grant execute on function public.submit_seller_application(text, text, text, text, text, text, text, text, text, jsonb) to authenticated, service_role;
grant execute on function public.review_seller_application(uuid, text, text) to authenticated, service_role;
grant execute on function public.create_portal_download_grant(uuid, text) to authenticated, service_role;
grant execute on function public.get_admin_access() to authenticated, service_role;
grant execute on function public.manage_admin_access(text, public.admin_role, text) to authenticated, service_role;
grant execute on function public.update_order_manual_status(uuid, public.order_status, text) to authenticated, service_role;

revoke all on function public.create_pending_order(text, text, text, text) from public, anon, authenticated;
revoke all on function public.get_order_status_by_token(text, text) from public, anon, authenticated;
revoke all on function public.create_delivery_for_paid_order(text, text, timestamptz) from public, anon, authenticated;
revoke all on function public.create_delivery_for_order(uuid, text, timestamptz) from public, anon, authenticated;
revoke all on function public.rotate_delivery_grant(uuid, text, timestamptz) from public, anon, authenticated;
revoke all on function public.mark_delivery_email_result(uuid, boolean, text, text) from public, anon, authenticated;
revoke all on function public.get_download_grant_by_hash(text) from public, anon, authenticated;
revoke all on function public.consume_download_grant(text, uuid) from public, anon, authenticated;
revoke all on function public.revoke_delivery(uuid, uuid) from public, anon, authenticated;

grant execute on function public.create_pending_order(text, text, text, text) to service_role;
grant execute on function public.get_order_status_by_token(text, text) to service_role;
grant execute on function public.create_delivery_for_paid_order(text, text, timestamptz) to service_role;
grant execute on function public.create_delivery_for_order(uuid, text, timestamptz) to service_role;
grant execute on function public.rotate_delivery_grant(uuid, text, timestamptz) to service_role;
grant execute on function public.mark_delivery_email_result(uuid, boolean, text, text) to service_role;
grant execute on function public.get_download_grant_by_hash(text) to service_role;
grant execute on function public.consume_download_grant(text, uuid) to service_role;
grant execute on function public.revoke_delivery(uuid, uuid) to service_role;

commit;
