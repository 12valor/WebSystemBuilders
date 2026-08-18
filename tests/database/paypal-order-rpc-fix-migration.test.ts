import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260818185748_fix_paypal_order_currency_ambiguity.sql"),
  "utf8",
);

describe("PayPal order RPC ambiguity repair", () => {
  it("qualifies the catalog currency against the systems table", () => {
    expect(migration).toContain("select s.* into selected_system from public.systems as s");
    expect(migration).toContain("s.currency = 'PHP'");
    expect(migration).not.toMatch(/\band currency = 'PHP'/);
  });
});
