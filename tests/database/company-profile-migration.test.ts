import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260725100000_phase_5_company_profile.sql"), "utf8");

describe("Phase 5 company profile migration", () => {
  it("creates one constrained profile with approved baseline copy", () => {
    expect(migration).toContain("create table if not exists public.company_profile");
    expect(migration).toContain("company_profile_singleton check (id = 1)");
    expect(migration).toContain("WebSystemBuilders helps students and business owners");
    expect(migration).toContain("AG Evangelista is the founder");
  });

  it("keeps the approved baseline private until explicit publication", () => {
    expect(migration).toContain("status public.content_status not null default 'draft'");
    expect(migration).toMatch(/values\s*\([\s\S]*'draft'[\s\S]*\)\s*on conflict/i);
    expect(migration).toContain("status = 'published' or private.has_admin_role('admin')");
  });

  it("allows administrator updates but no public insert or destructive delete", () => {
    expect(migration).toContain('create policy "company_profile_manage_admin"');
    expect(migration).toContain("on public.company_profile for update");
    expect(migration).not.toMatch(/delete from public\.company_profile/i);
  });

  it("audits lifecycle and contact presence without storing profile copy", () => {
    const audit = migration.slice(migration.indexOf("private.audit_company_profile_change"));
    expect(audit).toContain("'company_profile.published'");
    expect(audit).toContain("'has_public_email'");
    expect(audit).not.toContain("new.company_summary");
    expect(audit).not.toContain("new.founder_bio");
  });
});