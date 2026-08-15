import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260815202937_paymongo_test_checkout.sql"), "utf8");

describe("PayMongo test checkout migration", () => {
  it("preserves legacy orders with manual payment records", () => {
    expect(migration).toContain("provider in ('paymongo', 'manual')");
    expect(migration).toContain("o.reference_number is not null or o.proof_of_payment_url is not null");
    expect(migration).toContain("'manual'");
  });

  it("serializes order reuse and creates multiple attempts under one order", () => {
    expect(migration).toContain("pg_advisory_xact_lock");
    expect(migration).toContain("o.created_at >= now() - interval '24 hours'");
    expect(migration).toContain("provider = 'paymongo'");
    expect(migration).toContain("and status = 'pending'");
    expect(migration).toContain("insert into public.payments");
    expect(migration).toContain("orders_profile_pending_created_idx");
    expect(migration).toContain("payments_pending_paymongo_order_idx");
  });

  it("checks every expected paid value and leaves fulfillment explicit", () => {
    const reconciliation = migration.slice(migration.indexOf("public.record_paid_checkout_event"), migration.indexOf("public.update_order_manual_status"));
    expect(reconciliation).toContain("provider_checkout_session_id = p_checkout_session_id");
    expect(reconciliation).toContain("selected_order.id <> p_order_id");
    expect(reconciliation).toContain("selected_order.order_number <> p_order_number");
    expect(reconciliation).toContain("selected_payment.amount_minor <> p_amount_minor");
    expect(reconciliation).toContain("upper(p_currency) <> 'PHP'");
    expect(reconciliation).toContain("selected_payment.provider_payment_id <> p_provider_payment_id");
    expect(reconciliation).toContain("selected_payment.provider_payment_intent_id is distinct from p_provider_payment_intent_id");
    expect(reconciliation).toContain("or p_livemode");
    expect(reconciliation).toContain("provider_event_id = p_provider_event_id");
    expect(reconciliation).not.toContain("create_delivery");
    expect(migration).toContain("public.create_delivery_for_order");
    expect(migration).toContain("public.consume_download_grant");
    expect(migration).toContain("select 1 from public.payments p where p.order_id = o.id and p.status = 'paid'");
  });

  it("keeps checkout mutation service-role-only and portal reads authenticated", () => {
    expect(migration).toContain("grant execute on function public.create_or_reuse_paymongo_order(uuid, uuid, text, text, text) to service_role");
    expect(migration).not.toContain("create_or_reuse_paymongo_order(uuid, uuid, text, text, text) to anon");
    expect(migration).toContain("grant execute on function public.get_customer_portal() to authenticated");
  });
});
