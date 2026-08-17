import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifyWebhook: vi.fn(),
  capturePayPalOrder: vi.fn(),
  getPayPalEnv: vi.fn(),
}));
vi.mock("@/features/payments/paypal", () => ({ createPayPalAdapter: () => ({ verifyWebhook: mocks.verifyWebhook }) }));
vi.mock("@/features/payments/paypal-checkout-service", () => ({
  PayPalCheckoutServiceError: class PayPalCheckoutServiceError extends Error { constructor(public code: string) { super(code); } },
  capturePayPalOrder: mocks.capturePayPalOrder,
}));
vi.mock("@/lib/env/paypal", () => ({ getPayPalEnv: mocks.getPayPalEnv }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: vi.fn() }));
import { POST } from "@/app/api/webhooks/paypal/route";

const approved = { id: "WH-APPROVED-123", event_type: "CHECKOUT.ORDER.APPROVED", resource: { id: "5O190127TN364715T" } };
const request = () => new Request("https://websystembuilders.com/api/webhooks/paypal", { method: "POST", body: JSON.stringify(approved) });

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getPayPalEnv.mockReturnValue({ PAYPAL_WEBHOOK_ID: "webhook_12345" });
  mocks.verifyWebhook.mockResolvedValue(true);
  mocks.capturePayPalOrder.mockResolvedValue({ status: "COMPLETED" });
});

describe("PayPal webhook route", () => {
  it("rejects events that PayPal does not verify", async () => {
    mocks.verifyWebhook.mockResolvedValue(false);
    expect((await POST(request())).status).toBe(401);
  });
  it("uses the idempotent capture service to recover approved orders", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(mocks.capturePayPalOrder).toHaveBeenCalledWith({
      providerOrderId: "5O190127TN364715T",
      providerEventId: "WH-APPROVED-123",
      eventType: "CHECKOUT.ORDER.APPROVED",
    });
  });
  it("rejects oversized payload declarations before signature work", async () => {
    const oversized = request();
    oversized.headers.set("content-length", String(300 * 1024));
    expect((await POST(oversized)).status).toBe(413);
    expect(mocks.verifyWebhook).not.toHaveBeenCalled();
  });
});
