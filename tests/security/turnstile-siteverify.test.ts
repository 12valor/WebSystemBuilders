import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { verifyTurnstileToken } from "../../src/lib/security/turnstile-siteverify";

describe("Cloudflare Turnstile siteverify server module", () => {
  it("handles server-side verifyTurnstileToken gracefully", async () => {
    const result = await verifyTurnstileToken("dummy-token");
    expect(result).toBeDefined();
    expect(typeof result.success).toBe("boolean");
  });
});
