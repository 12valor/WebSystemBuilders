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
});
