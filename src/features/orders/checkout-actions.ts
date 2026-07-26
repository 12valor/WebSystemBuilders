"use server";

import { z } from "zod";
import { checkoutFormSchema, pendingOrderRowSchema, type CheckoutField } from "@/features/orders/checkout-schema";
import { createOrderReturnToken } from "@/features/orders/token";
import { createLemonSqueezyCheckout } from "@/features/payments/lemonsqueezy";
import { getLemonSqueezyEnv, isLemonSqueezyConfigured } from "@/lib/env/lemonsqueezy";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";

export type CheckoutState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  values?: { customerName?: string; customerEmail?: string };
  fieldErrors?: Partial<Record<CheckoutField, string[]>>;
};

export async function startCheckout(_previousState: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const values = {
    systemSlug: String(formData.get("systemSlug") ?? ""),
    customerName: String(formData.get("customerName") ?? ""),
    customerEmail: String(formData.get("customerEmail") ?? ""),
    termsAccepted: String(formData.get("termsAccepted") ?? ""),
    licenseAccepted: String(formData.get("licenseAccepted") ?? ""),
    refundAccepted: String(formData.get("refundAccepted") ?? ""),
    deliveryAccepted: String(formData.get("deliveryAccepted") ?? ""),
  };
  const parsed = checkoutFormSchema.safeParse(values);
  const retained = { customerName: values.customerName, customerEmail: values.customerEmail };
  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the checkout details and required acknowledgements.",
      values: retained,
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<Record<CheckoutField, string[]>>,
    };
  }
  if (!isSupabasePubliclyConfigured() || !isLemonSqueezyConfigured()) {
    return {
      status: "unavailable",
      message: "Secure payment setup is not connected yet. No order or charge was created.",
      values: retained,
    };
  }

  const env = getLemonSqueezyEnv();
  const supabase = createAdminClient();
  const returnToken = createOrderReturnToken();
  const orderResult = await supabase.rpc("create_pending_order", {
    p_system_slug: parsed.data.systemSlug,
    p_customer_name: parsed.data.customerName,
    p_customer_email: parsed.data.customerEmail,
    p_return_token_hash: returnToken.hash,
  });
  const orderRows = z.array(pendingOrderRowSchema).safeParse(orderResult.data);
  if (orderResult.error || !orderRows.success || orderRows.data.length !== 1) {
    return {
      status: "error",
      message: "This system is not ready for direct checkout. No charge was created.",
      values: retained,
    };
  }
  const order = orderRows.data[0];
  let hosted;
  try {
    const siteUrl = new URL(env.SITE_URL);
    hosted = await createLemonSqueezyCheckout({
      apiKey: env.LEMON_SQUEEZY_API_KEY,
      storeId: env.LEMON_SQUEEZY_STORE_ID,
      orderId: order.order_id,
      orderNumber: order.order_number,
      productName: order.product_name,
      versionLabel: order.version_label,
      amountMinor: order.amount_minor,
      currency: order.currency,
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      successUrl: new URL(`/checkout/status/${order.order_number}?token=${encodeURIComponent(returnToken.token)}`, siteUrl).toString(),
      cancelUrl: new URL(`/systems/${parsed.data.systemSlug}?checkout=cancelled`, siteUrl).toString(),
    });
  } catch {
    await supabase.rpc("fail_checkout_setup", { p_payment_id: order.payment_id, p_failure_code: "provider_setup_failed" });
    return {
      status: "error",
      message: "The payment page could not be opened. No charge was created; please try again.",
      values: retained,
    };
  }

  const attached = await supabase.rpc("attach_checkout_session", {
    p_payment_id: order.payment_id,
    p_checkout_session_id: hosted.sessionId,
    p_checkout_url: hosted.checkoutUrl,
    p_livemode: hosted.livemode,
  });
  if (attached.error || attached.data !== true) {
    return {
      status: "error",
      message: "The payment session could not be linked safely. Do not pay from an old tab; start again.",
      values: retained,
    };
  }

  return {
    status: "idle",
    values: retained,
  };
}
