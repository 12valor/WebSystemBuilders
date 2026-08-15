import "server-only";

import { z } from "zod";
import { createPaymongoCheckoutSession, PaymongoCheckoutError } from "@/features/payments/paymongo";
import { createOrderReturnToken } from "@/features/orders/token";
import { getPaymongoCheckoutEnv } from "@/lib/env/paymongo";
import { createAdminClient } from "@/lib/supabase/admin";

const orderRowSchema = z.object({
  order_id: z.uuid(),
  order_number: z.string(),
  payment_id: z.uuid(),
  product_name: z.string(),
  version_label: z.string(),
  amount_minor: z.number().int().positive(),
  currency: z.literal("PHP"),
  checkout_url: z.url().nullable(),
  checkout_session_id: z.string().nullable(),
});

const profileSchema = z.object({ full_name: z.string().nullable(), display_name: z.string().nullable() });

export class CheckoutServiceError extends Error {
  constructor(public readonly code: "unavailable" | "invalid_product" | "provider_failed") {
    super("Secure checkout could not be started.");
    this.name = "CheckoutServiceError";
  }
}

export async function startPaymongoCheckout(input: { userId: string; email: string; systemId: string }) {
  const env = getPaymongoCheckoutEnv();
  const supabase = createAdminClient();
  const profileResult = await supabase
    .from("profiles")
    .select("full_name,display_name")
    .eq("user_id", input.userId)
    .maybeSingle();
  const profile = profileSchema.safeParse(profileResult.data);
  const customerName = profile.success
    ? profile.data.full_name?.trim() || profile.data.display_name?.trim() || fallbackCustomerName(input.email)
    : fallbackCustomerName(input.email);
  const returnToken = createOrderReturnToken();

  const orderResult = await supabase.rpc("create_or_reuse_paymongo_order", {
    p_system_id: input.systemId,
    p_profile_user_id: input.userId,
    p_customer_name: customerName,
    p_customer_email: input.email,
    p_return_token_hash: returnToken.hash,
  });
  const orderRows = z.array(orderRowSchema).safeParse(orderResult.data);

  if (orderResult.error || !orderRows.success || orderRows.data.length !== 1) {
    if (orderResult.error?.code === "P0002") throw new CheckoutServiceError("invalid_product");
    throw new CheckoutServiceError("unavailable");
  }

  const order = orderRows.data[0];
  if (order.checkout_url && order.checkout_session_id) {
    return { checkoutUrl: assertPaymongoCheckoutUrl(order.checkout_url) };
  }

  const successUrl = new URL(`/account/orders/${order.order_number}?checkout=returned`, env.SITE_URL).toString();
  const cancelUrl = new URL(`/account/orders/${order.order_number}?checkout=cancelled`, env.SITE_URL).toString();

  try {
    const checkout = await createPaymongoCheckoutSession({
      secretKey: env.PAYMONGO_SECRET_KEY,
      paymentMethods: env.PAYMONGO_PAYMENT_METHODS,
      idempotencyKey: `checkout-${order.payment_id}`,
      orderId: order.order_id,
      orderNumber: order.order_number,
      systemId: input.systemId,
      userId: input.userId,
      productName: order.product_name,
      amountMinor: order.amount_minor,
      customerName,
      customerEmail: input.email,
      successUrl,
      cancelUrl,
    });

    const attachment = await supabase.rpc("attach_checkout_session", {
      p_payment_id: order.payment_id,
      p_checkout_session_id: checkout.checkoutSessionId,
      p_checkout_url: checkout.checkoutUrl,
      p_livemode: false,
    });
    if (attachment.error) throw new CheckoutServiceError("unavailable");

    if (attachment.data !== true) {
      const stored = await supabase
        .from("payments")
        .select("provider_checkout_session_id,checkout_url")
        .eq("id", order.payment_id)
        .maybeSingle();
      if (
        stored.error ||
        stored.data?.provider_checkout_session_id !== checkout.checkoutSessionId ||
        stored.data.checkout_url !== checkout.checkoutUrl
      ) {
        throw new CheckoutServiceError("unavailable");
      }
    }

    return { checkoutUrl: checkout.checkoutUrl };
  } catch (error) {
    if (error instanceof CheckoutServiceError) throw error;
    const failureCode = error instanceof PaymongoCheckoutError ? error.code : "provider_error";
    await supabase.rpc("fail_checkout_setup", {
      p_payment_id: order.payment_id,
      p_failure_code: failureCode,
    });
    throw new CheckoutServiceError("provider_failed");
  }
}

function fallbackCustomerName(email: string) {
  const localPart = email.split("@")[0]?.replace(/[._-]+/g, " ").trim() || "Customer";
  return localPart.length >= 2 ? localPart.slice(0, 120) : "Customer";
}

function assertPaymongoCheckoutUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== "checkout.paymongo.com") {
    throw new CheckoutServiceError("unavailable");
  }
  return url.toString();
}
