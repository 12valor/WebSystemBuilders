import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260725060000_phase_5_faq_content.sql"),
  "utf8",
);

describe("Phase 5 FAQ content migration", () => {
  it("creates lifecycle-constrained FAQ persistence with RLS", () => {
    expect(migration).toContain("create table if not exists public.faq_items");
    expect(migration).toContain("status public.content_status not null default 'draft'");
    expect(migration).toContain("alter table public.faq_items enable row level security");
    expect(migration).toContain("status = 'published' or private.has_admin_role('admin')");
    expect(migration).toContain("private.has_admin_role('admin')");
  });

  it("preserves verified baseline questions without placeholder claims", () => {
    expect(migration).toContain("What support is available for student projects?");
    expect(migration).toContain("Why are there no placeholder products or portfolio claims?");
    expect(migration).not.toContain("insert into public.testimonials");
    expect(migration).not.toContain("insert into public.portfolio_items");
  });

  it("audits lifecycle changes without storing answers", () => {
    expect(migration).toContain("'faq.created'");
    expect(migration).toContain("'faq.published'");
    expect(migration).toContain("'faq.archived'");
    expect(migration).toContain("'previous_status'");
    expect(migration).not.toContain("'answer', new.answer");
    expect(migration).not.toMatch(/delete from public\.faq_items/i);
  });
});
