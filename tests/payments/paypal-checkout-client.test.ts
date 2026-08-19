import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("PayPal Web SDK checkout", () => {
  it("starts checkout with the in-flight order promise to preserve the click gesture", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/checkout/paypal-checkout.tsx"), "utf8");

    expect(source).toContain("const orderPromise = createOrder().then");
    expect(source).toContain('paymentSession.start({ presentationMode: "auto" }, orderPromise)');
    expect(source).not.toContain("const providerOrderId = await createOrder()");
  });

  it("shows a prominent alert and logs sanitized checkout diagnostics", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/checkout/paypal-checkout.tsx"), "utf8");

    expect(source).toContain("PayPal Checkout needs attention");
    expect(source).toContain('aria-live="assertive"');
    expect(source).toContain("[paypal-checkout] PayPal SDK session error");
    expect(source).toContain("[paypal-checkout] Checkout start failed");
    expect(source).toContain("getPayPalSdkErrorDetails(paymentError)");
  });
});
