import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260725040000_phase_5_system_lifecycle.sql"),
  "utf8",
);

describe("Phase 5 system lifecycle migration", () => {
  it("exposes an administrator-only invoker function for duplication", () => {
    expect(migration).toContain("public.duplicate_system(p_system_id uuid)");
    expect(migration).toContain("security invoker");
    expect(migration).toContain("private.has_admin_role('admin')");
    expect(migration).toContain("revoke all on function public.duplicate_system(uuid) from public");
    expect(migration).toContain("grant execute on function public.duplicate_system(uuid) to authenticated");
  });

  it("duplicates safe reusable content without sharing uploaded artifacts", () => {
    expect(migration).toContain("insert into public.system_features");
    expect(migration).toContain("and storage_path is null");
    expect(migration).toContain("and external_url is not null");
    expect(migration).not.toContain("insert into public.system_versions");
    expect(migration).not.toContain("insert into public.system_files");
    expect(migration).toContain("'draft'");
    expect(migration).toContain("false,");
  });

  it("classifies lifecycle audit events without deleting records", () => {
    expect(migration).toContain("system.duplicated");
    expect(migration).toContain("system.unpublished");
    expect(migration).toContain("system.archived");
    expect(migration).not.toMatch(/delete from public\.systems/i);
  });
});
