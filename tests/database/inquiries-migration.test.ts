import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260724030000_phase_3_inquiries.sql"),
  "utf8",
);

describe("inquiries migration", () => {
  it("creates constrained inquiry records and rate-limit indexes", () => {
    expect(migration).toContain("create table public.inquiries");
    expect(migration).toContain("inquiries_quote_requirements");
    expect(migration).toContain("inquiries_request_rate_idx");
    expect(migration).toContain("inquiries_email_rate_idx");
  });

  it("enables RLS without granting anonymous insert access", () => {
    expect(migration).toContain("alter table public.inquiries enable row level security");
    expect(migration).not.toMatch(/inquiries_.*insert.*anon/i);
    expect(migration).toContain("inquiries_select_admin");
    expect(migration).toContain("inquiries_update_admin");
  });
});
