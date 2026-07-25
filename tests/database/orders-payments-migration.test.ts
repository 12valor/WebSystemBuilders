import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260725120000_phase_6_orders_payments.sql"), "utf8");

describe("Phase 6 orders and payments migration", () => {
  it("stores immutable product and policy snapshots in integer minor units", () => {
    expect(migration).toContain("create table if not exists public.order_items");
    expect(migration).toContain("unit_price_minor bigint not null");
    expect(migration).toContain("license_snapshot text not null");
    expect(migration).toContain("version_label text not null");
    expect(migration).toContain("terms_accepted_at timestamptz not null");
  });

  it("calculates fixed PHP prices and requires a current private deliverable inside the database", () => {
    const createOrder = migration.slice(migration.indexOf("public.create_pending_order"), migration.indexOf("public.attach_checkout_session"));
    expect(createOrder).toContain("status = 'published' and pricing_type = 'fixed'");
    expect(createOrder).toContain("currency = 'PHP'");
    expect(createOrder).toContain("public.system_files");
    expect(createOrder).toContain("selected_system.sale_active");
    expect(createOrder).toContain("created_at >= now() - interval '15 minutes'");
    expect(createOrder).toContain("Too many recent checkout attempts.");
  });

  it("makes payment reconciliation idempotent and verifies expected values", () => {
    const paymentEvent = migration.slice(migration.indexOf("public.record_paid_checkout_event"), migration.indexOf("public.get_order_status_by_token"));
    expect(migration).toContain("provider_event_id text not null unique");
    expect(paymentEvent).toContain("return 'duplicate'");
    expect(paymentEvent).toContain("expected_values_mismatch");
    expect(paymentEvent).toContain("selected_payment.amount_minor <> p_amount_minor");
  });

  it("keeps commerce tables admin-read-only and server RPCs service-role-only", () => {
    expect(migration).toContain("alter table public.orders enable row level security");
    expect(migration).toContain("orders_select_admin");
    expect(migration).toContain("grant execute on function public.create_pending_order(text, text, text, text) to service_role");
    expect(migration).not.toContain("grant execute on function public.create_pending_order(text, text, text, text) to anon");
  });
});
