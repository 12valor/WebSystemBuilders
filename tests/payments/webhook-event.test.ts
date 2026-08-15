import { describe, expect, it } from "vitest";
import { parsePaymongoWebhook } from "@/features/payments/webhook-event";

const orderId = "132ec9a4-bd04-4b25-a62b-84571fef7622";

function checkoutSession() {
  return {
    id: "cs_test123",
    type: "checkout_session",
    attributes: {
      reference_number: "WSB-20260816-ABCDEF1234",
      metadata: { order_id: orderId, system_id: "38fb3ccd-6d59-4898-89ee-c73aab7b8cda" },
      payment_intent: { id: "pi_test123" },
      payments: [{ id: "pay_test123", attributes: { amount: 125000, currency: "php", status: "paid" } }],
    },
  };
}

describe("PayMongo hosted checkout webhook event", () => {
  it("parses the current hosted envelope", () => {
    const result = parsePaymongoWebhook({
      event_type: "send.webhook",
      data: { type: "checkout_session.payment.paid", resource: "checkout_session", livemode: false, data: checkoutSession() },
    }, "a".repeat(64));

    expect(result).toEqual({ kind: "paid", event: {
      providerEventId: `sha256:${"a".repeat(64)}`,
      eventType: "checkout_session.payment.paid",
      checkoutSessionId: "cs_test123",
      orderId,
      orderNumber: "WSB-20260816-ABCDEF1234",
      providerPaymentIntentId: "pi_test123",
      providerPaymentId: "pay_test123",
      paymentStatus: "paid",
      amountMinor: 125000,
      currency: "PHP",
      livemode: false,
    } });
  });

  it("parses the documented legacy event envelope", () => {
    const result = parsePaymongoWebhook({ data: {
      id: "evt_legacy123",
      type: "event",
      attributes: { type: "checkout_session.payment.paid", livemode: false, data: checkoutSession() },
    } }, "b".repeat(64));
    expect(result?.kind).toBe("paid");
    if (result?.kind === "paid") expect(result.event.providerEventId).toBe("evt_legacy123");
  });

  it("acknowledges structurally valid unsupported events", () => {
    const result = parsePaymongoWebhook({
      data: { id: "evt_other123", type: "event", attributes: { type: "payment.failed", livemode: false, data: { unrelated: true } } },
    }, "c".repeat(64));
    expect(result).toEqual({ kind: "ignored", eventType: "payment.failed", livemode: false });
  });

  it("retains live mode for rejection and rejects unpaid or malformed paid events", () => {
    const live = parsePaymongoWebhook({
      data: { id: "evt_live123", type: "event", attributes: { type: "checkout_session.payment.paid", livemode: true, data: checkoutSession() } },
    }, "d".repeat(64));
    expect(live?.kind === "paid" && live.event.livemode).toBe(true);

    const unpaid = checkoutSession();
    unpaid.attributes.payments[0].attributes.status = "pending";
    expect(parsePaymongoWebhook({
      data: { id: "evt_pending123", type: "event", attributes: { type: "checkout_session.payment.paid", livemode: false, data: unpaid } },
    }, "e".repeat(64))).toBeNull();
    expect(parsePaymongoWebhook({ data: {} }, "f".repeat(64))).toBeNull();
  });
});
