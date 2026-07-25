import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260725020000_phase_5_admin_operations.sql"),
  "utf8",
);

describe("Phase 5 admin operations migration", () => {
  it("records category changes through a protected trigger", () => {
    expect(migration).toContain("private.audit_category_change()");
    expect(migration).toContain("system_categories_audit_change");
    expect(migration).toContain("category.created");
    expect(migration).toContain("category.updated");
    expect(migration).toContain("revoke all on function private.audit_category_change() from public");
  });

  it("stores only bounded operational category metadata", () => {
    expect(migration).toContain("'name', new.name");
    expect(migration).toContain("'slug', new.slug");
    expect(migration).toContain("'is_active', new.is_active");
    expect(migration).not.toContain("new.description");
  });
});
