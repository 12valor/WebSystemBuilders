import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("PayPal Web SDK checkout", () => {
  it("passes a Promise resolving to an order reference to the SDK", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/checkout/paypal-checkout.tsx"), "utf8");

    expect(source).toContain("const orderPromise = createOrder().then");
    expect(source).toContain("return { orderId }");
    expect(source).toContain('paymentSession.start({ presentationMode: "auto" }, orderPromise)');
    expect(source).not.toContain("Promise.resolve(providerOrderId)");
    expect(source).not.toContain('paymentSession.start({ presentationMode: "auto" }, providerOrderId)');
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
