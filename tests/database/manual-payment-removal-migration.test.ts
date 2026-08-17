import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260817173523_remove_manual_qr_payments.sql"),
  "utf8",
);

describe("manual QR payment removal migration", () => {
  it("removes active manual order and review RPCs", () => {
    expect(migration).toContain("drop function if exists public.create_authenticated_manual_order");
    expect(migration).toContain("drop function if exists public.update_order_manual_status");
    expect(migration).toContain("if new.provider = 'manual'");
    expect(migration).toContain("create trigger payments_reject_new_manual");
  });

  it("retires QR configuration without deleting historical orders or payments", () => {
    expect(migration).toContain("set payment_qr_url = null");
    expect(migration).toContain("systems_manual_payment_retired");
    expect(migration).toContain("seller_qr_payment_retired");
    expect(migration).not.toMatch(/delete from public\.(orders|payments)/);
  });

  it("removes browser storage access and seller QR inputs", () => {
    expect(migration).toContain("update storage.buckets set public = false");
    expect(migration).toContain('drop policy if exists "Customer payment proofs upload"');
    expect(migration).toContain("create function public.submit_seller_application(");
    expect(migration).not.toContain("p_gcash_qr_url text");
    expect(migration).not.toContain("p_qrph_image_url text");
  });
});
