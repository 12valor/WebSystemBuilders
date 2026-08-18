import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { createPayPalAdapter, formatMinorUnits, parseMinorUnits, PayPalProviderError } from "@/features/payments/paypal";

const env = {
  PAYPAL_CLIENT_ID: "client_example_12345",
  PAYPAL_CLIENT_SECRET: "secret_example_12345",
  PAYPAL_ENVIRONMENT: "sandbox" as const,
  PAYPAL_WEBHOOK_ID: "webhook_12345",
  SITE_URL: "http://localhost:3000",
};

describe("PayPal adapter", () => {
  it("converts authoritative PHP minor units without floating point input", () => {
    expect(formatMinorUnits(125050)).toBe("1250.50");
    expect(parseMinorUnits("1250.50")).toBe(125050);
    expect(() => parseMinorUnits("12.5")).toThrow(PayPalProviderError);
  });

  it("requests a short-lived browser token for the site origin", async () => {
    const fetchImplementation = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(String(init?.body)).toContain("response_type=client_token");
      expect(String(init?.body)).toContain("intent=sdk_init");
      expect(String(init?.body)).not.toContain("domains%5B%5D");
      return Response.json({ access_token: "browser_safe_token_123456789", expires_in: 900 });
    }) as unknown as typeof fetch;
    const result = await createPayPalAdapter(env, { fetchImplementation }).createBrowserSafeClientToken(env.SITE_URL);
    expect(result).toEqual({ clientToken: "browser_safe_token_123456789", expiresIn: 900 });
  });

  it("binds live browser tokens to the root domain without a protocol", async () => {
    const fetchImplementation = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      expect(String(init?.body)).toContain("domains%5B%5D=websystembuilders.com");
      expect(String(init?.body)).not.toContain("https%3A");
      return Response.json({ access_token: "browser_safe_token_123456789", expires_in: 900 });
    }) as unknown as typeof fetch;
    const liveEnv = { ...env, PAYPAL_ENVIRONMENT: "live" as const, SITE_URL: "https://www.websystembuilders.com" };
    await createPayPalAdapter(liveEnv, { fetchImplementation }).createBrowserSafeClientToken(liveEnv.SITE_URL);
  });

  it("uses bounded requests and safe provider errors", async () => {
    const fetchImplementation = vi.fn(async () => { throw new Error("secret provider detail"); }) as unknown as typeof fetch;
    await expect(createPayPalAdapter(env, { fetchImplementation, timeoutMs: 25 }).createBrowserSafeClientToken(env.SITE_URL))
      .rejects.toMatchObject({ code: "provider_unavailable", message: "PayPal could not complete the payment request." });
  });
});
