import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260725000000_phase_4_public_catalog_media.sql"),
  "utf8",
);

describe("public catalog media migration", () => {
  it("allows reads only for media attached to published systems", () => {
    expect(migration).toContain("bucket_id = 'system-media'");
    expect(migration).toContain("system_media.storage_path = storage.objects.name");
    expect(migration).toContain("systems.status = 'published'");
  });

  it("does not expose private deliverable storage", () => {
    expect(migration).not.toContain("system-deliverables");
  });
});
