import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentIdentity: vi.fn(),
  getCurrentUser: vi.fn(),
  capturePayPalOrder: vi.fn(),
  cancelPayPalOrder: vi.fn(),
}));
vi.mock("@/lib/auth/current-user", () => ({ getCurrentIdentity: mocks.getCurrentIdentity, getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/features/payments/paypal-checkout-service", () => ({
  PayPalCheckoutServiceError: class PayPalCheckoutServiceError extends Error { constructor(public code: string) { super(code); } },
  capturePayPalOrder: mocks.capturePayPalOrder,
  cancelPayPalOrder: mocks.cancelPayPalOrder,
}));
import { PayPalCheckoutServiceError } from "@/features/payments/paypal-checkout-service";
import { POST as capture } from "@/app/api/payments/paypal/orders/[providerOrderId]/capture/route";
import { POST as cancel } from "@/app/api/payments/paypal/orders/[providerOrderId]/cancel/route";

const providerOrderId = "5O190127TN364715T";
const context = { params: Promise.resolve({ providerOrderId }) };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getCurrentIdentity.mockResolvedValue({ id: "eadfdb1e-2f32-4e26-b640-fca85acdfe81" });
  mocks.getCurrentUser.mockResolvedValue({ id: "eadfdb1e-2f32-4e26-b640-fca85acdfe81", email_confirmed_at: "2026-08-17" });
  mocks.capturePayPalOrder.mockResolvedValue({ status: "COMPLETED", orderNumber: "WSB-20260817-ABCDEF1234", transactionId: "8MC585209K746392H" });
  mocks.cancelPayPalOrder.mockResolvedValue({ cancelled: true });
});

describe("PayPal capture and cancellation routes", () => {
  it("captures only an owned order through the server", async () => {
    const response = await capture(new Request("https://websystembuilders.com", { method: "POST" }), context);
    expect(response.status).toBe(200);
    expect(mocks.capturePayPalOrder).toHaveBeenCalledWith({ providerOrderId, userId: "eadfdb1e-2f32-4e26-b640-fca85acdfe81" });
  });
  it("hides foreign or missing orders", async () => {
    mocks.capturePayPalOrder.mockRejectedValue(new PayPalCheckoutServiceError("order_not_found"));
    expect((await capture(new Request("https://websystembuilders.com", { method: "POST" }), context)).status).toBe(404);
  });
  it("records explicit popup cancellation without provider capture", async () => {
    const request = new Request("https://websystembuilders.com", { method: "POST", body: JSON.stringify({ reason: "popup_closed" }) });
    expect((await cancel(request, context)).status).toBe(200);
    expect(mocks.cancelPayPalOrder).toHaveBeenCalledWith({ providerOrderId, userId: "eadfdb1e-2f32-4e26-b640-fca85acdfe81", reason: "popup_closed" });
  });
});
