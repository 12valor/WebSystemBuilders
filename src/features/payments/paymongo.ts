import "server-only";

import { z } from "zod";

const checkoutResponseSchema = z.object({
  data: z.object({
    id: z.string().regex(/^cs_[A-Za-z0-9]+$/),
    attributes: z.object({
      checkout_url: z.url(),
      livemode: z.boolean(),
    }),
  }),
});

export type CreateCheckoutInput = {
  secretKey: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  versionLabel: string;
  amountMinor: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
};

export type HostedCheckout = {
  sessionId: string;
  checkoutUrl: string;
  livemode: boolean;
};

export async function createPayMongoCheckout(input: CreateCheckoutInput): Promise<HostedCheckout> {
  const response = await fetch("https://api.paymongo.com/v2/checkout_sessions", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${input.secretKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `checkout-${input.orderId}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: { name: input.customerName, email: input.customerEmail },
          cancel_url: input.cancelUrl,
          line_items: [{
            name: input.productName,
            description: `Version ${input.versionLabel}`,
            amount: input.amountMinor,
            currency: input.currency,
            quantity: 1,
          }],
          metadata: { order_id: input.orderId, order_number: input.orderNumber },
          payment_method_types: ["card", "gcash", "qrph"],
          reference_number: input.orderNumber,
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          success_url: input.successUrl,
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`PayMongo checkout creation failed with status ${response.status}.`);
  const parsed = checkoutResponseSchema.safeParse(await response.json());
  if (!parsed.success) throw new Error("PayMongo returned an unsupported checkout response.");

  const checkoutUrl = new URL(parsed.data.data.attributes.checkout_url);
  if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.paymongo.com") {
    throw new Error("PayMongo returned an untrusted checkout URL.");
  }

  return {
    sessionId: parsed.data.data.id,
    checkoutUrl: checkoutUrl.toString(),
    livemode: parsed.data.data.attributes.livemode,
  };
}
