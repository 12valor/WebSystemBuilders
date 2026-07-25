import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyPayMongoSignature } from "@/features/payments/webhook-signature";

const body = '{"data":{"type":"checkout_session.payment.paid"}}';
const secret = "whsk_test_example_secret";
const timestamp = 1_900_000_000;
const signature = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");

describe("PayMongo webhook signature", () => {
  it("accepts the test signature slot and reports test mode", () => {
    expect(verifyPayMongoSignature(body, `t=${timestamp},te=${signature},li=`, secret, timestamp)).toEqual({ valid: true, livemode: false, timestamp });
  });

  it("accepts the live signature slot and reports live mode", () => {
    expect(verifyPayMongoSignature(body, `t=${timestamp},te=,li=${signature}`, secret, timestamp)).toEqual({ valid: true, livemode: true, timestamp });
  });

  it("rejects altered bodies, malformed signatures, and stale requests", () => {
    expect(verifyPayMongoSignature(`${body} `, `t=${timestamp},te=${signature},li=`, secret, timestamp).valid).toBe(false);
    expect(verifyPayMongoSignature(body, `t=${timestamp},te=short,li=`, secret, timestamp).valid).toBe(false);
    expect(verifyPayMongoSignature(body, `t=${timestamp},te=${signature},li=`, secret, timestamp + 301).valid).toBe(false);
  });
});
