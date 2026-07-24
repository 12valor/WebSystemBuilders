import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260724000000_phase_2_identity_catalog.sql"),
  "utf8",
);

describe("initial identity and catalog migration", () => {
  it("enables RLS for every exposed Phase 2 table", () => {
    const tables = [
      "profiles",
      "admin_roles",
      "system_categories",
      "systems",
      "system_features",
      "system_media",
      "system_versions",
      "system_files",
      "audit_logs",
    ];

    for (const table of tables) {
      expect(migration).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("keeps deliverable files private and seeds approved categories", () => {
    expect(migration).not.toMatch(/files_select_public/i);
    expect(migration).toContain('"files_manage_admin"');
    expect(migration).toContain("'point-of-sale'");
    expect(migration).toContain("'capstone-systems'");
    expect(migration).toContain("'custom-system-development'");
  });

  it("uses integer minor units for catalog prices", () => {
    expect(migration).toContain("price_minor bigint");
    expect(migration).toContain("sale_price_minor bigint");
  });
});
