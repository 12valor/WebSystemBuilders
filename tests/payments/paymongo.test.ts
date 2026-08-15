import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { createPaymongoCheckoutSession, PaymongoCheckoutError } from "@/features/payments/paymongo";

const input = {
  secretKey: "sk_test_example_123456",
  paymentMethods: ["qrph", "gcash"] as const,
  idempotencyKey: "checkout-132ec9a4-bd04-4b25-a62b-84571fef7622",
  orderId: "132ec9a4-bd04-4b25-a62b-84571fef7622",
  orderNumber: "WSB-20260816-ABCDEF1234",
  systemId: "38fb3ccd-6d59-4898-89ee-c73aab7b8cda",
  userId: "eadfdb1e-2f32-4e26-b640-fca85acdfe81",
  productName: "Inventory System",
  amountMinor: 125000,
  customerName: "Test Customer",
  customerEmail: "test@example.com",
  successUrl: "https://websystembuilders.com/account/orders/WSB-1?checkout=returned",
  cancelUrl: "https://websystembuilders.com/account/orders/WSB-1?checkout=cancelled",
};

afterEach(() => vi.restoreAllMocks());

describe("PayMongo checkout adapter", () => {
  it("sends authoritative v2 checkout fields and parses a test response", async () => {
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const fetchImplementation = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(init?.headers).toMatchObject({ "Idempotency-Key": input.idempotencyKey });
      expect(body.data.attributes.payment_method_types).toEqual(["qrph", "gcash"]);
      expect(body.data.attributes.line_items[0]).toMatchObject({ amount: 125000, currency: "PHP", quantity: 1 });
      expect(body.data.attributes.metadata).toEqual({ order_id: input.orderId, system_id: input.systemId, user_id: input.userId });
      expect(body.data.attributes).toMatchObject({ send_email_receipt: true, reference_number: input.orderNumber });
      expect(body.data.attributes).not.toHaveProperty("fee");
      return Response.json({ data: { id: "cs_test123", type: "checkout_session", attributes: { checkout_url: "https://checkout.paymongo.com/test123", livemode: false } } });
    });

    await expect(createPaymongoCheckoutSession({ ...input, paymentMethods: [...input.paymentMethods] }, { fetchImplementation: fetchImplementation as typeof fetch }))
      .resolves.toEqual({ checkoutSessionId: "cs_test123", checkoutUrl: "https://checkout.paymongo.com/test123", livemode: false });
  });

  it("rejects live keys, provider failures, invalid responses, and timeouts safely", async () => {
    await expect(createPaymongoCheckoutSession({ ...input, secretKey: "sk_live_forbidden", paymentMethods: ["card"] }, { fetchImplementation: vi.fn() as typeof fetch }))
      .rejects.toMatchObject({ code: "provider_rejected", message: "PayMongo checkout could not be created." });

    vi.spyOn(console, "info").mockImplementation(() => undefined);
    await expect(createPaymongoCheckoutSession({ ...input, paymentMethods: ["card"] }, { fetchImplementation: vi.fn(async () => new Response("no", { status: 422 })) as typeof fetch }))
      .rejects.toBeInstanceOf(PaymongoCheckoutError);
    await expect(createPaymongoCheckoutSession({ ...input, paymentMethods: ["card"] }, { fetchImplementation: vi.fn(async () => Response.json({ data: { id: "bad" } })) as typeof fetch }))
      .rejects.toMatchObject({ code: "invalid_response" });
    await expect(createPaymongoCheckoutSession({ ...input, paymentMethods: ["card"] }, { fetchImplementation: vi.fn(async () => { throw new Error("AbortError"); }) as typeof fetch }))
      .rejects.toMatchObject({ code: "provider_unavailable" });
  });
});
