import { describe, expect, it } from "vitest";
import { parsePaidCheckoutEvent } from "@/features/payments/webhook-event";

describe("Lemon Squeezy paid checkout event", () => {
  it("extracts only the values required for reconciliation", () => {
    const payload = {
      meta: {
        event_name: "order_created",
        custom_data: {
          order_id: "order_abc123",
          order_number: "WSB-20260725-ABCDEF1234",
        },
      },
      data: {
        id: "ls_order_123",
        attributes: {
          status: "paid",
          total: 125000,
          currency: "USD",
        },
      },
    };
    const sha = "a".repeat(64);
    const event = parsePaidCheckoutEvent(payload, sha);
    expect(event).toEqual({
      providerEventId: `ls_ls_order_123_${sha.slice(0, 8)}`,
      eventType: "checkout_session.payment.paid",
      checkoutSessionId: "order_abc123",
      providerPaymentId: "ls_order_123",
      amountMinor: 125000,
      currency: "USD",
      livemode: true,
    });
  });

  it("ignores unsupported and unpaid events", () => {
    expect(parsePaidCheckoutEvent({ meta: { event_name: "order_updated" }, data: { id: "123", attributes: { status: "pending", total: 100, currency: "USD" } } }, "b".repeat(64))).toBeNull();
    expect(parsePaidCheckoutEvent({ meta: { event_name: "order_created" }, data: { id: "123", attributes: { status: "failed", total: 100, currency: "USD" } } }, "c".repeat(64))).toBeNull();
  });
});
