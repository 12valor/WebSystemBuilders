import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260725010000_phase_4_catalog_metadata.sql"),
  "utf8",
);

describe("catalog metadata migration", () => {
  it("adds structured technology, delivery, demo, and SEO fields", () => {
    for (const column of [
      "technology_stack text[] not null default '{}'",
      "delivery_summary text",
      "demo_instructions text",
      "seo_title text",
      "seo_description text",
    ]) {
      expect(migration).toContain(column);
    }
  });

  it("limits metadata stored on systems", () => {
    expect(migration).toContain("systems_technology_stack_count");
    expect(migration).toContain("cardinality(technology_stack) <= 30");
    expect(migration).toContain("systems_seo_title_length");
    expect(migration).toContain("systems_seo_description_length");
  });
});