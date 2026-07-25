import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260725080000_phase_5_testimonials.sql"), "utf8");

describe("Phase 5 testimonial migration", () => {
  it("separates public content from administrator-only verification evidence", () => { expect(migration).toContain("create table if not exists public.testimonials"); expect(migration).toContain("create table if not exists public.testimonial_verifications"); expect(migration).toContain('create policy "testimonial_verifications_admin_only"'); });
  it("allows public reads only for published testimonials", () => { expect(migration).toContain("status = 'published' or private.has_admin_role('admin')"); expect(migration).toContain("alter table public.testimonials enable row level security"); });
  it("enforces permission and atomic administrator lifecycle functions", () => { expect(migration).toContain("private.enforce_testimonial_publication()"); expect(migration).toContain("permission_confirmed_at is not null"); expect(migration).toContain("public.create_testimonial_draft("); expect(migration).toContain("public.update_testimonial("); expect(migration).toContain("p_expected_updated_at"); });
  it("audits safe metadata without testimonial text, evidence, seed data, or deletion", () => { const audit = migration.slice(migration.indexOf("private.audit_testimonial_change")); expect(audit).toContain("'testimonial.published'"); expect(audit).not.toContain("source_reference"); expect(audit).not.toContain("new.quote"); expect(migration).not.toMatch(/delete from public\.testimonials/i); expect(migration).not.toMatch(/insert into public\.testimonials\s*\([^)]*\)\s*values\s*\([^p]/i); });
});
