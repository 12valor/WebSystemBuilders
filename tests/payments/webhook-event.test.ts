import { describe, expect, it } from "vitest";
import { parsePaidCheckoutEvent } from "@/features/payments/webhook-event";

describe("PayMongo paid checkout event", () => {
  it("extracts only the values required for reconciliation", () => {
    const event = parsePaidCheckoutEvent({ data: { type: "checkout_session.payment.paid", livemode: false, data: { id: "cs_abc123", attributes: { reference_number: "WSB-20260725-ABCDEF1234", payments: [{ id: "pay_abc123", attributes: { amount: 125000, currency: "php", status: "paid" } }] } } } }, "a".repeat(64));
    expect(event).toEqual({ providerEventId: `payload_${"a".repeat(64)}`, eventType: "checkout_session.payment.paid", checkoutSessionId: "cs_abc123", providerPaymentId: "pay_abc123", amountMinor: 125000, currency: "PHP", livemode: false });
  });

  it("ignores unsupported and unpaid events", () => {
    expect(parsePaidCheckoutEvent({ data: { type: "payment.failed" } }, "b".repeat(64))).toBeNull();
    expect(parsePaidCheckoutEvent({ data: { type: "checkout_session.payment.paid", livemode: false, data: { id: "cs_abc123", attributes: { reference_number: "order", payments: [{ id: "pay_abc123", attributes: { amount: 100, currency: "PHP", status: "failed" } }] } } } }, "c".repeat(64))).toBeNull();
  });
});
