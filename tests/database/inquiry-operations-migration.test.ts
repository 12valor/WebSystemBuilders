import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  resolve("supabase/migrations/20260725030000_phase_5_inquiry_operations.sql"),
  "utf8",
);

describe("Phase 5 inquiry operations migration", () => {
  it("creates append-only administrator-readable inquiry history", () => {
    expect(migration).toContain("create table if not exists public.inquiry_events");
    expect(migration).toContain("alter table public.inquiry_events enable row level security");
    expect(migration).toContain("inquiry_events_select_admin");
    expect(migration).not.toMatch(/inquiry_events_.*(?:insert|update|delete).*policy/i);
  });

  it("records assignment and status changes through a protected trigger", () => {
    expect(migration).toContain("private.record_inquiry_change()");
    expect(migration).toContain("inquiries_record_change");
    expect(migration).toContain("status_changed");
    expect(migration).toContain("revoke all on function private.record_inquiry_change() from public");
  });

  it("keeps customer message content out of the global audit metadata", () => {
    expect(migration).toContain("'status', new.status");
    expect(migration).toContain("'assigned', new.assigned_to is not null");
    expect(migration).not.toContain("new.message");
    expect(migration).not.toContain("new.email");
  });
});
