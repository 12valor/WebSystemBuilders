import "server-only";

import { z } from "zod";
import type { PaymongoPaymentMethod } from "@/lib/env/paymongo";

const checkoutResponseSchema = z.object({
  data: z.object({
    id: z.string().regex(/^cs_[A-Za-z0-9]+$/),
    type: z.literal("checkout_session"),
    attributes: z.object({ checkout_url: z.url(), livemode: z.literal(false) }),
  }),
});

export type CreatePaymongoCheckoutInput = {
  secretKey: string;
  paymentMethods: PaymongoPaymentMethod[];
  idempotencyKey: string;
  orderId: string;
  orderNumber: string;
  systemId: string;
  userId: string;
  productName: string;
  amountMinor: number;
  customerName: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
};

export class PaymongoCheckoutError extends Error {
  constructor(public readonly code: "provider_rejected" | "provider_unavailable" | "invalid_response") {
    super("PayMongo checkout could not be created.");
    this.name = "PaymongoCheckoutError";
  }
}

export async function createPaymongoCheckoutSession(
  input: CreatePaymongoCheckoutInput,
  options: { fetchImplementation?: typeof fetch; timeoutMs?: number } = {},
) {
  if (!/^sk_test_[A-Za-z0-9_]+$/.test(input.secretKey)) {
    throw new PaymongoCheckoutError("provider_rejected");
  }

  console.info("[PayMongo] Running in TEST MODE");
  const fetchImplementation = options.fetchImplementation ?? fetch;
  let response: Response;

  try {
    response = await fetchImplementation("https://api.paymongo.com/v2/checkout_sessions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${input.secretKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            billing: { name: input.customerName, email: input.customerEmail },
            line_items: [{
              name: input.productName,
              amount: input.amountMinor,
              currency: "PHP",
              quantity: 1,
            }],
            payment_method_types: input.paymentMethods,
            success_url: input.successUrl,
            cancel_url: input.cancelUrl,
            reference_number: input.orderNumber,
            send_email_receipt: true,
            metadata: {
              order_id: input.orderId,
              system_id: input.systemId,
              user_id: input.userId,
            },
          },
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(options.timeoutMs ?? 10_000),
    });
  } catch {
    throw new PaymongoCheckoutError("provider_unavailable");
  }

  if (!response.ok) throw new PaymongoCheckoutError("provider_rejected");

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new PaymongoCheckoutError("invalid_response");
  }

  const parsed = checkoutResponseSchema.safeParse(body);
  if (!parsed.success) throw new PaymongoCheckoutError("invalid_response");

  const checkoutUrl = new URL(parsed.data.data.attributes.checkout_url);
  if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.paymongo.com") {
    throw new PaymongoCheckoutError("invalid_response");
  }

  return {
    checkoutSessionId: parsed.data.data.id,
    checkoutUrl: checkoutUrl.toString(),
    livemode: false as const,
  };
}
