import { describe, expect, it } from "vitest";
import { hasRequiredAdminRole } from "../../src/lib/auth/roles";

describe("administrator role hierarchy", () => {
  it("allows a super administrator to satisfy every admin requirement", () => {
    expect(hasRequiredAdminRole("super_admin", "admin")).toBe(true);
    expect(hasRequiredAdminRole("super_admin", "super_admin")).toBe(true);
  });

  it("keeps routine administrators out of super-admin operations", () => {
    expect(hasRequiredAdminRole("admin", "admin")).toBe(true);
    expect(hasRequiredAdminRole("admin", "super_admin")).toBe(false);
    expect(hasRequiredAdminRole(null, "admin")).toBe(false);
  });
});
