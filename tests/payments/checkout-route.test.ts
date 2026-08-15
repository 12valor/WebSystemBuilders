import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentIdentity: vi.fn(),
  getCurrentUser: vi.fn(),
  startPaymongoCheckout: vi.fn(),
}));

vi.mock("@/lib/auth/current-user", () => ({
  getCurrentIdentity: mocks.getCurrentIdentity,
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("@/features/payments/checkout-service", () => ({
  CheckoutServiceError: class CheckoutServiceError extends Error {
    constructor(public readonly code: string) { super("checkout failed"); }
  },
  startPaymongoCheckout: mocks.startPaymongoCheckout,
}));

import { CheckoutServiceError } from "@/features/payments/checkout-service";
import { POST } from "@/app/api/payments/paymongo/checkout/route";

const systemId = "38fb3ccd-6d59-4898-89ee-c73aab7b8cda";

function request(body: unknown) {
  return new Request("https://websystembuilders.com/api/payments/paymongo/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getCurrentIdentity.mockResolvedValue({ id: "eadfdb1e-2f32-4e26-b640-fca85acdfe81", email: "test@example.com" });
  mocks.getCurrentUser.mockResolvedValue({ id: "eadfdb1e-2f32-4e26-b640-fca85acdfe81", email: "Test@Example.com", email_confirmed_at: "2026-08-16T00:00:00Z" });
  mocks.startPaymongoCheckout.mockResolvedValue({ checkoutUrl: "https://checkout.paymongo.com/test123" });
});

describe("PayMongo checkout route", () => {
  it("requires authentication and a verified matching user", async () => {
    mocks.getCurrentIdentity.mockResolvedValue(null);
    expect((await POST(request({ systemId }))).status).toBe(401);

    mocks.getCurrentIdentity.mockResolvedValue({ id: "eadfdb1e-2f32-4e26-b640-fca85acdfe81" });
    mocks.getCurrentUser.mockResolvedValue({ id: "different", email: "test@example.com", email_confirmed_at: null });
    expect((await POST(request({ systemId }))).status).toBe(403);
  });

  it("accepts only a system ID and resolves customer identity server-side", async () => {
    const response = await POST(request({ systemId }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ checkoutUrl: "https://checkout.paymongo.com/test123" });
    expect(mocks.startPaymongoCheckout).toHaveBeenCalledWith({
      userId: "eadfdb1e-2f32-4e26-b640-fca85acdfe81",
      email: "test@example.com",
      systemId,
    });
    expect((await POST(request({ systemId, amount: 1 }))).status).toBe(400);
    expect((await POST(request({ systemId: "missing" }))).status).toBe(400);
  });

  it("maps unavailable products and provider failures to safe responses", async () => {
    mocks.startPaymongoCheckout.mockRejectedValueOnce(new CheckoutServiceError("invalid_product"));
    expect((await POST(request({ systemId }))).status).toBe(404);
    mocks.startPaymongoCheckout.mockRejectedValueOnce(new CheckoutServiceError("provider_failed"));
    const response = await POST(request({ systemId }));
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "checkout_provider_unavailable" });
  });
});
