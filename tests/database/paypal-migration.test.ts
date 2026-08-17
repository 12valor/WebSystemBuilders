import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260817072420_replace_paymongo_with_paypal.sql"), "utf8");

describe("PayPal checkout migration", () => {
  it("preserves historical provider values while making PayPal active", () => {
    expect(migration).toContain("provider in ('paypal', 'manual', 'paymongo')");
    expect(migration).toContain("provider_order_id text");
    expect(migration).toContain("drop function if exists public.create_or_reuse_paymongo_order");
  });
  it("creates server-priced authenticated orders and service-role-only operations", () => {
    expect(migration).toContain("create function public.create_or_reuse_paypal_order");
    expect(migration).toContain("selected_system.sale_price_minor");
    expect(migration).toContain("email_confirmed_at is not null");
    expect(migration).toContain("grant execute on function public.create_or_reuse_paypal_order");
    expect(migration).not.toContain("create_or_reuse_paypal_order(uuid, uuid, text, text, text, text) to authenticated");
  });
  it("atomically validates capture values without creating delivery", () => {
    const reconcile = migration.slice(migration.indexOf("create function public.reconcile_paypal_payment"), migration.indexOf("create function public.cancel_paypal_order"));
    expect(reconcile).toContain("selected_payment.amount_minor <> p_amount_minor");
    expect(reconcile).toContain("selected_payment.currency <> upper(p_currency)");
    expect(reconcile).toContain("provider_event_id = p_provider_event_id");
    expect(reconcile).not.toContain("create_delivery");
  });
  it("makes new proof uploads private and user scoped", () => {
    expect(migration).toContain("update storage.buckets set public = false");
    expect(migration).toContain("(storage.foldername(name))[1] = (select auth.uid())::text");
    expect(migration).toContain("create_authenticated_manual_order");
  });
});
