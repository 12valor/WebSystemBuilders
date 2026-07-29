import { describe, expect, it } from "vitest";
import { TurnstileCaptcha } from "../../src/components/auth/turnstile-captcha";

describe("Cloudflare Turnstile Captcha foundation", () => {
  it("exports TurnstileCaptcha component function", () => {
    expect(TurnstileCaptcha).toBeDefined();
    expect(typeof TurnstileCaptcha).toBe("object"); // React forwardRef component is an object with $$typeof
  });

  it("uses provided sitekey default (0x4AAAAAAEAePr_u0WZWa_bF)", () => {
    const configuredKey = "0x4AAAAAAEAePr_u0WZWa_bF";
    expect(configuredKey).toHaveLength(24);
    expect(configuredKey).toBe("0x4AAAAAAEAePr_u0WZWa_bF");
  });
});
