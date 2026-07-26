import "server-only";

import { z } from "zod";

const lemonSqueezyResponseSchema = z.object({
  data: z.object({
    id: z.string().min(1),
    attributes: z.object({
      url: z.url(),
    }),
  }),
});

export type CreateLemonSqueezyCheckoutInput = {
  apiKey: string;
  storeId: string;
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

export type HostedLemonSqueezyCheckout = {
  sessionId: string;
  checkoutUrl: string;
  livemode: boolean;
};

export async function createLemonSqueezyCheckout(input: CreateLemonSqueezyCheckoutInput): Promise<HostedLemonSqueezyCheckout> {
  const payload = {
    data: {
      type: "checkouts",
      attributes: {
        custom_price: input.amountMinor,
        checkout_data: {
          email: input.customerEmail,
          name: input.customerName,
          custom: {
            order_id: input.orderId,
            order_number: input.orderNumber,
          },
        },
        product_options: {
          name: input.productName,
          description: `Version ${input.versionLabel}`,
          redirect_url: input.successUrl,
        },
      },
      relationships: {
        store: {
          data: {
            type: "stores",
            id: input.storeId,
          },
        },
      },
    },
  };

  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Lemon Squeezy checkout creation failed with status ${response.status}.`);
  }

  const json = await response.json() as unknown;
  const parsed = lemonSqueezyResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Lemon Squeezy returned an unsupported checkout response structure.");
  }

  const checkoutUrl = new URL(parsed.data.data.attributes.url);
  if (checkoutUrl.protocol !== "https:" || !checkoutUrl.hostname.includes("lemonsqueezy.com")) {
    throw new Error("Lemon Squeezy returned an untrusted checkout URL.");
  }

  return {
    sessionId: parsed.data.data.id,
    checkoutUrl: checkoutUrl.toString(),
    livemode: true,
  };
}
