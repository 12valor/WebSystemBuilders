import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getCurrentIdentity: vi.fn(), getCurrentUser: vi.fn(), createPayPalOrder: vi.fn() }));
vi.mock("@/lib/auth/current-user", () => ({ getCurrentIdentity: mocks.getCurrentIdentity, getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/features/payments/paypal-checkout-service", () => ({
  PayPalCheckoutServiceError: class PayPalCheckoutServiceError extends Error { constructor(public code: string) { super(code); } },
  createPayPalOrder: mocks.createPayPalOrder,
}));
import { POST } from "@/app/api/payments/paypal/orders/route";

const systemId = "38fb3ccd-6d59-4898-89ee-c73aab7b8cda";
const request = (body: unknown) => new Request("https://websystembuilders.com/api/payments/paypal/orders", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getCurrentIdentity.mockResolvedValue({ id: "eadfdb1e-2f32-4e26-b640-fca85acdfe81" });
  mocks.getCurrentUser.mockResolvedValue({ id: "eadfdb1e-2f32-4e26-b640-fca85acdfe81", email: "Buyer@Example.com", email_confirmed_at: "2026-08-17" });
  mocks.createPayPalOrder.mockResolvedValue({ providerOrderId: "5O190127TN364715T", orderNumber: "WSB-20260817-ABCDEF1234" });
});

describe("PayPal order route", () => {
  it("requires a verified matching account", async () => {
    mocks.getCurrentIdentity.mockResolvedValue(null);
    expect((await POST(request({ systemId }))).status).toBe(401);
  });
  it("accepts only systemId and resolves price and identity on the server", async () => {
    expect((await POST(request({ systemId }))).status).toBe(200);
    expect(mocks.createPayPalOrder).toHaveBeenCalledWith({ userId: "eadfdb1e-2f32-4e26-b640-fca85acdfe81", email: "buyer@example.com", systemId });
    expect((await POST(request({ systemId, amount: 1 }))).status).toBe(400);
  });
});
