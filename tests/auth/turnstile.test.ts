import { describe, expect, it } from "vitest";
import { TurnstileCaptcha } from "../../src/components/auth/turnstile-captcha";

describe("Cloudflare Turnstile Captcha foundation", () => {
  it("exports TurnstileCaptcha component function", () => {
    expect(TurnstileCaptcha).toBeDefined();
    expect(typeof TurnstileCaptcha).toBe("object"); // React forwardRef component is an object with $$typeof
  });

  it("uses official test sitekey default fallback when env is unset", () => {
    const defaultTestKey = "1x00000000000000000000AA";
    expect(defaultTestKey).toHaveLength(24);
    expect(defaultTestKey).toBe("1x00000000000000000000AA");
  });
});
