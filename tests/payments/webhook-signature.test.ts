import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyPaymongoSignature } from "@/features/payments/webhook-signature";

const body = '{"event_type":"checkout_session.payment.paid"}';
const secret = "whsec_test_example_12345";
const nowSeconds = 1_800_000_000;

function signatureFor(value: string, timestamp = nowSeconds) {
  const signature = createHmac("sha256", secret).update(`${timestamp}.${value}`).digest("hex");
  return `t=${timestamp},te=${signature}`;
}

describe("PayMongo webhook signature", () => {
  it("accepts a current test-mode signature", () => {
    expect(verifyPaymongoSignature(body, signatureFor(body), secret, { nowSeconds })).toEqual({ valid: true, timestamp: nowSeconds });
  });

  it("rejects changed bodies, live-only, missing, and malformed signatures", () => {
    expect(verifyPaymongoSignature(`${body} `, signatureFor(body), secret, { nowSeconds }).valid).toBe(false);
    expect(verifyPaymongoSignature(body, `t=${nowSeconds},li=${"a".repeat(64)}`, secret, { nowSeconds }).valid).toBe(false);
    expect(verifyPaymongoSignature(body, null, secret, { nowSeconds }).valid).toBe(false);
    expect(verifyPaymongoSignature(body, `t=${nowSeconds},te=invalid`, secret, { nowSeconds }).valid).toBe(false);
  });

  it("rejects stale and future timestamps outside five minutes", () => {
    expect(verifyPaymongoSignature(body, signatureFor(body, nowSeconds - 301), secret, { nowSeconds }).valid).toBe(false);
    expect(verifyPaymongoSignature(body, signatureFor(body, nowSeconds + 301), secret, { nowSeconds }).valid).toBe(false);
  });
});
