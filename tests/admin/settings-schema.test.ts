import { describe, expect, it } from "vitest";
import { adminAccessInputSchema } from "../../src/features/admin/settings-schema";

describe("administrator access validation", () => {
  it("normalizes an existing account email", () => {
    expect(adminAccessInputSchema.parse({ email: " Owner@Example.com ", role: "super_admin", action: "grant" })).toMatchObject({ email: "owner@example.com" });
  });

  it("rejects unknown roles and destructive actions", () => {
    expect(adminAccessInputSchema.safeParse({ email: "owner@example.com", role: "owner", action: "grant" }).success).toBe(false);
    expect(adminAccessInputSchema.safeParse({ email: "owner@example.com", role: "admin", action: "delete" }).success).toBe(false);
  });
});