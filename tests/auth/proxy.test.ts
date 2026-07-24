import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";
import { config } from "../../src/proxy";

describe("authentication session proxy matcher", () => {
  it("runs for application routes", () => {
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: "/account" })).toBe(true);
    expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: "/admin/systems" })).toBe(true);
  });

  it("skips Next.js assets and product images", () => {
    expect(
      unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: "/_next/static/chunk.js" }),
    ).toBe(false);
    expect(
      unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: "/images/system-preview.webp" }),
    ).toBe(false);
  });
});
