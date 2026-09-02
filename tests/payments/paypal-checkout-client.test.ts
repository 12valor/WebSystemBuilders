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

  it("reviews the PayPal-only purchase before opening the provider window", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/checkout/paypal-checkout.tsx"), "utf8");

    expect(source).toContain("Review and pay");
    expect(source).toContain("Confirm these details before the secure PayPal window opens.");
    expect(source).toContain("buyerEmail={props.buyerEmail}");
    expect(source).toContain("All required policies reviewed");
    expect(source).toContain("Prepared separately after verified payment");
    expect(source).toContain("onClick: () => setReviewOpen(true)");
    expect(source).toContain("onClick={onConfirm}");
  });

  it("does not present inactive payment methods", () => {
    const source = readFileSync(resolve(process.cwd(), "src/components/checkout/paypal-checkout.tsx"), "utf8");

    expect(source).not.toContain('selectedTab === "card"');
    expect(source).not.toContain('selectedTab === "gcash"');
    expect(source).not.toContain('selectedTab === "maya"');
    expect(source).not.toContain("CardBrandIcons");
    expect(source).not.toContain("GCashLogo");
    expect(source).not.toContain("MayaLogo");
  });
});
