import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260725070000_phase_5_portfolio_content.sql"),
  "utf8",
);

describe("Phase 5 portfolio content migration", () => {
  it("creates constrained portfolio persistence and lifecycle indexes", () => {
    expect(migration).toContain("create table if not exists public.portfolio_items");
    expect(migration).toContain("audience public.catalog_audience not null");
    expect(migration).toContain("status public.content_status not null default 'draft'");
    expect(migration).toContain("portfolio_items_project_url");
    expect(migration).toContain("portfolio_items_status_sort_idx");
  });

  it("allows only published public reads or administrator access", () => {
    expect(migration).toContain("alter table public.portfolio_items enable row level security");
    expect(migration).toContain("status = 'published' or private.has_admin_role('admin')");
    expect(migration).toContain("portfolio_items_manage_admin");
  });

  it("audits safe lifecycle metadata without seeding or deleting projects", () => {
    expect(migration).toContain("'portfolio.created'");
    expect(migration).toContain("'portfolio.published'");
    expect(migration).toContain("'portfolio.archived'");
    expect(migration).toContain("'is_featured', new.is_featured");
    expect(migration).not.toMatch(/insert into public\.portfolio_items/i);
    expect(migration).not.toMatch(/delete from public\.portfolio_items/i);
  });
});
