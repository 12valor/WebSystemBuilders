import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260725050000_phase_5_media_audit.sql"),
  "utf8",
);

describe("Phase 5 catalog media audit migration", () => {
  it("records every media mutation through a protected trigger", () => {
    expect(migration).toContain("security definer");
    expect(migration).toContain("after insert or update or delete on public.system_media");
    expect(migration).toContain("revoke all on function private.audit_system_media_change() from public");
  });

  it("classifies media events without logging URLs or storage paths", () => {
    expect(migration).toContain("'media.created'");
    expect(migration).toContain("'media.updated'");
    expect(migration).toContain("'media.removed'");
    expect(migration).toContain("'media_type', v_media_type");
    expect(migration).toContain("'source', case when v_storage_path is null");
    expect(migration).not.toContain("'storage_path',");
    expect(migration).not.toContain("'external_url',");
  });
});
