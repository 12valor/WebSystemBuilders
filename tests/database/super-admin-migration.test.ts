import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260725110000_phase_5_super_admin.sql"), "utf8");

describe("Phase 5 super-administrator migration", () => {
  it("removes direct role mutations and exposes restricted functions", () => {
    expect(migration).toContain('drop policy if exists "admin_roles_insert_super_admin"');
    expect(migration).toContain('drop policy if exists "admin_roles_update_super_admin"');
    expect(migration).toContain('drop policy if exists "admin_roles_delete_super_admin"');
    expect(migration).toContain("public.manage_admin_access(");
    expect(migration).toContain("private.has_admin_role('super_admin')");
  });

  it("protects self-access and the final super administrator", () => {
    expect(migration).toContain("you cannot revoke your own administrator access");
    expect(migration).toContain("you cannot demote your own super administrator access");
    expect(migration).toContain("the final super administrator cannot be removed");
    expect(migration).toContain("the final super administrator cannot be demoted");
  });

  it("resolves existing accounts without exposing emails in audit metadata", () => {
    expect(migration).toContain("from auth.users");
    expect(migration).toContain("'access_action', p_action");
    const audit = migration.slice(migration.indexOf("insert into public.audit_logs"));
    expect(audit).not.toContain("p_email");
  });

  it("grants function execution only to authenticated users", () => {
    expect(migration).toContain("revoke all on function public.get_admin_access() from public");
    expect(migration).toContain("grant execute on function public.get_admin_access() to authenticated");
    expect(migration).toContain("grant execute on function public.manage_admin_access(text,public.admin_role,text) to authenticated");
  });
});