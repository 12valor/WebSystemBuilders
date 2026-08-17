import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { getPayPalApiOrigin, getPayPalEnv, getPayPalWebSdkUrl } from "@/lib/env/paypal";

const original = { ...process.env };
afterEach(() => { process.env = { ...original }; });

describe("PayPal environment", () => {
  it("accepts complete sandbox configuration without a public client ID", () => {
    Object.assign(process.env, {
      PAYPAL_CLIENT_ID: "client_example_12345",
      PAYPAL_CLIENT_SECRET: "secret_example_12345",
      PAYPAL_ENVIRONMENT: "sandbox",
      PAYPAL_WEBHOOK_ID: "webhook_12345",
      SITE_URL: "http://localhost:3000",
    });
    expect(getPayPalEnv().PAYPAL_ENVIRONMENT).toBe("sandbox");
    expect(getPayPalApiOrigin("sandbox")).toBe("https://api-m.sandbox.paypal.com");
    expect(getPayPalWebSdkUrl("sandbox")).toContain("sandbox.paypal.com/web-sdk/v6/core");
    expect(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID).toBeUndefined();
  });

  it("fails closed for missing or invalid environment values", () => {
    Object.assign(process.env, {
      PAYPAL_CLIENT_ID: "short",
      PAYPAL_CLIENT_SECRET: "secret_example_12345",
      PAYPAL_ENVIRONMENT: "staging",
      PAYPAL_WEBHOOK_ID: "webhook_12345",
      SITE_URL: "http://localhost:3000",
    });
    expect(() => getPayPalEnv()).toThrow("not configured");
  });
});
