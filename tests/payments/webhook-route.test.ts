import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ rpc: vi.fn() }));

vi.mock("@/lib/env/paymongo", () => ({ getPaymongoWebhookEnv: () => ({ PAYMONGO_WEBHOOK_SECRET: "whsec_test_example_12345" }) }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => ({ rpc: mocks.rpc }) }));

import { POST } from "@/app/api/webhooks/paymongo/route";

const secret = "whsec_test_example_12345";
const orderId = "132ec9a4-bd04-4b25-a62b-84571fef7622";

function payload(eventType = "checkout_session.payment.paid", livemode = false) {
  return { data: {
    id: "evt_test123",
    type: "event",
    attributes: {
      type: eventType,
      livemode,
      data: {
        id: "cs_test123",
        type: "checkout_session",
        attributes: {
          reference_number: "WSB-20260816-ABCDEF1234",
          metadata: { order_id: orderId },
          payment_intent: { id: "pi_test123" },
          payments: [{ id: "pay_test123", attributes: { amount: 125000, currency: "PHP", status: "paid" } }],
        },
      },
    },
  } };
}

function request(value: unknown, options: { signatureBody?: string; liveSignature?: boolean } = {}) {
  const body = JSON.stringify(value);
  const signedBody = options.signatureBody ?? body;
  const timestamp = Math.floor(Date.now() / 1000);
  const digest = createHmac("sha256", secret).update(`${timestamp}.${signedBody}`).digest("hex");
  const slot = options.liveSignature ? "li" : "te";
  return new Request("https://websystembuilders.com/api/webhooks/paymongo", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Paymongo-Signature": `t=${timestamp},${slot}=${digest}` },
    body,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.rpc.mockResolvedValue({ data: "paid", error: null });
});

describe("PayMongo webhook route", () => {
  it("rejects missing, changed, and live-only signatures without database writes", async () => {
    const missing = new Request("https://websystembuilders.com/api/webhooks/paymongo", { method: "POST", body: JSON.stringify(payload()) });
    expect((await POST(missing)).status).toBe(401);
    expect((await POST(request(payload(), { signatureBody: "changed" }))).status).toBe(401);
    expect((await POST(request(payload(), { liveSignature: true }))).status).toBe(401);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("rejects oversized input before reconciliation", async () => {
    const oversized = new Request("https://websystembuilders.com/api/webhooks/paymongo", {
      method: "POST",
      headers: { "content-length": String(256 * 1024 + 1) },
      body: "{}",
    });
    expect((await POST(oversized)).status).toBe(413);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("reconciles paid events and acknowledges duplicates or durable rejection", async () => {
    for (const result of ["paid", "duplicate", "rejected"]) {
      mocks.rpc.mockResolvedValueOnce({ data: result, error: null });
      const response = await POST(request(payload()));
      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toMatchObject({ received: true, result });
    }
    expect(mocks.rpc).toHaveBeenCalledWith("record_paid_checkout_event", expect.objectContaining({
      p_order_id: orderId,
      p_checkout_session_id: "cs_test123",
      p_amount_minor: 125000,
      p_currency: "PHP",
      p_livemode: false,
    }));
  });

  it("acknowledges unsupported test events, rejects live payloads, and returns 5xx for persistence failures", async () => {
    const unsupported = payload("payment.failed");
    unsupported.data.attributes.data = { unrelated: true } as never;
    const ignored = await POST(request(unsupported));
    expect(ignored.status).toBe(200);
    await expect(ignored.json()).resolves.toMatchObject({ ignored: true });
    expect(mocks.rpc).not.toHaveBeenCalled();

    expect((await POST(request(payload("checkout_session.payment.paid", true)))).status).toBe(401);
    expect(mocks.rpc).not.toHaveBeenCalled();

    mocks.rpc.mockResolvedValueOnce({ data: null, error: { message: "temporary" } });
    expect((await POST(request(payload()))).status).toBe(500);
  });
});
