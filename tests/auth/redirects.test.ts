import { describe, expect, it } from "vitest";
import { getSafeNextPath } from "../../src/lib/auth/redirects";

describe("authentication redirects", () => {
  it("keeps internal paths and their query strings", () => {
    expect(getSafeNextPath("/admin/systems?status=draft")).toBe(
      "/admin/systems?status=draft",
    );
  });

  it("rejects absolute and protocol-relative redirects", () => {
    expect(getSafeNextPath("https://malicious.example/path")).toBe("/account");
    expect(getSafeNextPath("//malicious.example/path")).toBe("/account");
    expect(getSafeNextPath(null, "/admin/systems")).toBe("/admin/systems");
  });
});
