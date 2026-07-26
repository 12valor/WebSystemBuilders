import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyLemonSqueezySignature } from "@/features/payments/webhook-signature";

const body = '{"meta":{"event_name":"order_created"},"data":{"id":"order_123"}}';
const secret = "whsecret_example_12345";
const signature = createHmac("sha256", secret).update(body).digest("hex");

describe("Lemon Squeezy webhook signature", () => {
  it("accepts valid X-Signature header", () => {
    expect(verifyLemonSqueezySignature(body, signature, secret)).toEqual({ valid: true });
  });

  it("rejects altered bodies and malformed signatures", () => {
    expect(verifyLemonSqueezySignature(`${body} `, signature, secret).valid).toBe(false);
    expect(verifyLemonSqueezySignature(body, "invalid_signature", secret).valid).toBe(false);
    expect(verifyLemonSqueezySignature(body, signature, "wrong_secret").valid).toBe(false);
  });
});
