import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260724020000_phase_2_catalog_resources.sql"),
  "utf8",
);

describe("catalog resource migration", () => {
  it("keeps resource buckets private with file limits", () => {
    expect(migration).toContain("'system-media'");
    expect(migration).toContain("'system-deliverables'");
    expect(migration).toContain("public = false");
    expect(migration).toContain("10485760");
    expect(migration).toContain("262144000");
  });

  it("restricts atomic current-version creation to administrators", () => {
    expect(migration).toContain("security invoker");
    expect(migration).toContain("private.has_admin_role('admin')");
    expect(migration).toContain("revoke all on function public.create_system_version");
    expect(migration).toContain("grant execute on function public.create_system_version");
  });
});
