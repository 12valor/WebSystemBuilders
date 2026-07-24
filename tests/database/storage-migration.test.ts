import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260724010000_phase_2_private_storage_and_sales.sql"),
  "utf8",
);

describe("private storage and catalog migration", () => {
  it("creates only private system buckets", () => {
    expect(migration).toContain("('system-media', 'system-media', false)");
    expect(migration).toContain("('system-deliverables', 'system-deliverables', false)");
    expect(migration).not.toMatch(/system_storage_.*to anon/i);
  });

  it("restricts object operations to administrators", () => {
    expect(migration.match(/private\.has_admin_role\('admin'\)/g)?.length).toBeGreaterThanOrEqual(4);
    expect(migration).toContain('"system_storage_insert_admin"');
    expect(migration).toContain('"system_storage_delete_admin"');
  });

  it("adds manual sale state and automatic system audit records", () => {
    expect(migration).toContain("sale_active boolean not null default false");
    expect(migration).toContain("systems_audit_change");
    expect(migration).toContain("system.created");
  });
});
