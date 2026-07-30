import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("security and private-route headers", () => {
  it("sets browser hardening headers for every route", async () => {
    const entries = await nextConfig.headers?.();
    const global = entries?.find((entry) => entry.source === "/:path*");
    const headers = new Map(global?.headers.map((header) => [header.key, header.value]));
    expect(headers.get("Content-Security-Policy")).toContain("frame-ancestors 'none'");
    expect(headers.get("Content-Security-Policy")).toContain("object-src 'none'");
    expect(headers.get("Content-Security-Policy")).toContain("script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com");
    expect(headers.get("Content-Security-Policy")).toContain("frame-src https://challenges.cloudflare.com");
    expect(headers.get("Content-Security-Policy")).toContain("connect-src 'self' https://challenges.cloudflare.com");
    expect(headers.get("Strict-Transport-Security")).toContain("max-age=31536000");
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
  });

  it("marks customer, admin, checkout, download, auth, and API routes private and non-indexable", async () => {
    const entries = await nextConfig.headers?.();
    for (const source of ["/account/:path*", "/admin/:path*", "/api/:path*", "/auth/:path*", "/checkout/:path*", "/downloads/:path*"]) {
      const entry = entries?.find((candidate) => candidate.source === source);
      const headers = new Map(entry?.headers.map((header) => [header.key, header.value]));
      expect(headers.get("Cache-Control"), source).toContain("no-store");
      expect(headers.get("X-Robots-Tag"), source).toContain("noindex");
    }
  });
});
