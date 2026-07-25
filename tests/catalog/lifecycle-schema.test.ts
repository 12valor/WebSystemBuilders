import { describe, expect, it } from "vitest";
import {
  archiveSystemConfirmationSchema,
  canArchiveSystem,
  canUnpublishSystem,
  systemLifecycleStatusSchema,
} from "../../src/features/catalog/lifecycle-schema";

describe("system lifecycle rules", () => {
  it("recognizes only supported catalog statuses", () => {
    expect(systemLifecycleStatusSchema.safeParse("published").success).toBe(true);
    expect(systemLifecycleStatusSchema.safeParse("deleted").success).toBe(false);
  });

  it("allows unpublishing only from the published state", () => {
    expect(canUnpublishSystem("published")).toBe(true);
    expect(canUnpublishSystem("draft")).toBe(false);
    expect(canUnpublishSystem("archived")).toBe(false);
  });

  it("requires explicit archive confirmation and blocks repeat archives", () => {
    expect(archiveSystemConfirmationSchema.safeParse("archive").success).toBe(true);
    expect(archiveSystemConfirmationSchema.safeParse("yes").success).toBe(false);
    expect(canArchiveSystem("published")).toBe(true);
    expect(canArchiveSystem("archived")).toBe(false);
  });
});
