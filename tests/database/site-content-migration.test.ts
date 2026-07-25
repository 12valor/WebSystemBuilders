import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(resolve("supabase/migrations/20260725090000_phase_5_site_content.sql"), "utf8");

describe("Phase 5 site content migration", () => {
  it("creates constrained draft-first placement records", () => { expect(migration).toContain("create table if not exists public.site_content_blocks"); expect(migration).toContain("status public.content_status not null default 'draft'"); expect(migration).toContain("site_content_placement_fields"); expect(migration).toContain("site_content_action_internal"); });
  it("allows only one published record per placement", () => { expect(migration).toContain("site_content_one_published_per_placement_idx"); expect(migration).toContain("where status = 'published'"); });
  it("protects mutations with administrator RLS", () => { expect(migration).toContain("alter table public.site_content_blocks enable row level security"); expect(migration).toContain("status = 'published' or private.has_admin_role('admin')"); expect(migration).toContain("site_content_manage_admin"); });
  it("audits safe lifecycle metadata without content or seed records", () => { const audit = migration.slice(migration.indexOf("private.audit_site_content_change")); expect(audit).toContain("'content_block.published'"); expect(audit).toContain("'placement', new.placement"); expect(audit).not.toContain("new.title"); expect(audit).not.toContain("new.body"); const schema = migration.slice(0, migration.indexOf("private.audit_site_content_change")); expect(schema).not.toMatch(/insert into public\.site_content_blocks/i); expect(migration).not.toMatch(/delete from public\.site_content_blocks/i); });
});
