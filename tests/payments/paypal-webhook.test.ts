import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { parsePayPalWebhook } from "@/features/payments/paypal-webhook";

describe("PayPal webhook parsing", () => {
  it("parses approval for capture recovery", () => {
    expect(parsePayPalWebhook({ id: "WH-APPROVED-123", event_type: "CHECKOUT.ORDER.APPROVED", resource: { id: "5O190127TN364715T" } }))
      .toEqual({ kind: "approved", eventId: "WH-APPROVED-123", eventType: "CHECKOUT.ORDER.APPROVED", providerOrderId: "5O190127TN364715T" });
  });

  it.each([
    ["PAYMENT.CAPTURE.COMPLETED", "completed"],
    ["PAYMENT.CAPTURE.PENDING", "pending"],
    ["PAYMENT.CAPTURE.DECLINED", "declined"],
    ["PAYMENT.CAPTURE.REFUNDED", "refunded"],
    ["PAYMENT.CAPTURE.REVERSED", "reversed"],
  ])("maps %s to %s", (eventType, state) => {
    const result = parsePayPalWebhook({
      id: `WH-${eventType}-123`,
      event_type: eventType,
      resource: {
        id: "8MC585209K746392H",
        amount: { currency_code: "PHP", value: "1250.50" },
        supplementary_data: { related_ids: { order_id: "5O190127TN364715T", capture_id: "8MC585209K746392H" } },
      },
    });
    expect(result).toMatchObject({ kind: "lifecycle", state, amountMinor: 125050, currency: "PHP" });
  });

  it("ignores unrelated verified events and rejects malformed lifecycle payloads", () => {
    expect(parsePayPalWebhook({ id: "WH-OTHER-123", event_type: "CUSTOMER.CREATED", resource: {} })).toMatchObject({ kind: "ignored" });
    expect(parsePayPalWebhook({ event_type: "PAYMENT.CAPTURE.COMPLETED", resource: {} })).toBeNull();
  });
});
