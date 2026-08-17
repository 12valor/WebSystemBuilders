import "server-only";

import { createHash } from "node:crypto";
import { z } from "zod";
import { createOrderReturnToken } from "@/features/orders/token";
import { createPayPalAdapter, PayPalProviderError } from "@/features/payments/paypal";
import { getPayPalEnv } from "@/lib/env/paypal";
import { createAdminClient } from "@/lib/supabase/admin";

const orderRowSchema = z.object({
  order_id: z.uuid(),
  order_number: z.string(),
  payment_id: z.uuid(),
  product_name: z.string(),
  version_label: z.string(),
  amount_minor: z.number().int().positive(),
  currency: z.literal("PHP"),
  provider_order_id: z.string().nullable(),
});

const captureContextSchema = z.object({
  order_id: z.uuid(),
  order_number: z.string(),
  profile_user_id: z.uuid(),
  payment_id: z.uuid(),
  amount_minor: z.number().int().positive(),
  currency: z.literal("PHP"),
  provider_environment: z.enum(["sandbox", "live"]),
  payment_status: z.enum(["pending", "processing", "paid", "failed", "cancelled", "expired", "refunded", "disputed"]),
  provider_payment_id: z.string().nullable(),
});

const profileSchema = z.object({ full_name: z.string().nullable(), display_name: z.string().nullable() });
const reconcileResultSchema = z.enum(["completed", "pending", "declined", "refunded", "reversed", "duplicate"]);

export class PayPalCheckoutServiceError extends Error {
  constructor(
    public readonly code:
      | "unavailable"
      | "invalid_product"
      | "provider_failed"
      | "order_not_found"
      | "capture_mismatch",
  ) {
    super("PayPal Checkout could not complete the request.");
    this.name = "PayPalCheckoutServiceError";
  }
}

export async function createPayPalOrder(input: { userId: string; email: string; systemId: string }) {
  const env = getPayPalEnv();
  const adapter = createPayPalAdapter(env);
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
  const orderResult = await supabase.rpc("create_or_reuse_paypal_order", {
    p_system_id: input.systemId,
    p_profile_user_id: input.userId,
    p_customer_name: customerName,
    p_customer_email: input.email,
    p_return_token_hash: returnToken.hash,
    p_environment: env.PAYPAL_ENVIRONMENT,
  });
  const parsedRows = z.array(orderRowSchema).safeParse(orderResult.data);
  if (orderResult.error || !parsedRows.success || parsedRows.data.length !== 1) {
    if (orderResult.error?.code === "P0002") throw new PayPalCheckoutServiceError("invalid_product");
    throw new PayPalCheckoutServiceError("unavailable");
  }
  const order = parsedRows.data[0];
  if (order.provider_order_id) {
    return { providerOrderId: order.provider_order_id, orderNumber: order.order_number };
  }

  try {
    const providerOrder = await adapter.createOrder({
      requestId: `create-${order.payment_id}`,
      orderId: order.order_id,
      orderNumber: order.order_number,
      productName: order.product_name,
      versionLabel: order.version_label,
      amountMinor: order.amount_minor,
      currency: order.currency,
    });
    const attached = await supabase.rpc("attach_paypal_order", {
      p_payment_id: order.payment_id,
      p_provider_order_id: providerOrder.providerOrderId,
      p_environment: providerOrder.environment,
    });
    if (attached.error || attached.data !== true) throw new PayPalCheckoutServiceError("unavailable");
    return { providerOrderId: providerOrder.providerOrderId, orderNumber: order.order_number };
  } catch (error) {
    const failureCode = error instanceof PayPalProviderError ? error.code : "provider_error";
    await supabase.rpc("fail_paypal_order_setup", {
      p_payment_id: order.payment_id,
      p_failure_code: failureCode,
    });
    if (error instanceof PayPalCheckoutServiceError) throw error;
    throw new PayPalCheckoutServiceError("provider_failed");
  }
}

export async function capturePayPalOrder(input: {
  providerOrderId: string;
  userId?: string;
  providerEventId?: string;
  eventType?: string;
}) {
  const env = getPayPalEnv();
  const supabase = createAdminClient();
  const contextResult = await supabase.rpc("get_paypal_capture_context", {
    p_provider_order_id: input.providerOrderId,
    p_profile_user_id: input.userId ?? null,
  });
  const parsedContext = z.array(captureContextSchema).safeParse(contextResult.data);
  if (contextResult.error || !parsedContext.success || parsedContext.data.length !== 1) {
    throw new PayPalCheckoutServiceError("order_not_found");
  }
  const context = parsedContext.data[0];
  if (context.provider_environment !== env.PAYPAL_ENVIRONMENT) {
    throw new PayPalCheckoutServiceError("capture_mismatch");
  }
  if (context.payment_status === "paid" && context.provider_payment_id) {
    return {
      status: "COMPLETED" as const,
      orderNumber: context.order_number,
      transactionId: context.provider_payment_id,
    };
  }

  let capture;
  try {
    capture = await createPayPalAdapter(env).captureOrder(
      input.providerOrderId,
      `capture-${context.payment_id}`,
    );
  } catch {
    throw new PayPalCheckoutServiceError("provider_failed");
  }
  if (
    capture.providerOrderId !== input.providerOrderId ||
    capture.environment !== context.provider_environment ||
    capture.amountMinor !== context.amount_minor ||
    capture.currency !== context.currency
  ) {
    throw new PayPalCheckoutServiceError("capture_mismatch");
  }
  const state = normalizeCaptureState(capture.captureStatus);
  const eventId = input.providerEventId ?? `capture:${capture.captureId}`;
  const payload = JSON.stringify(capture);
  const reconcile = await supabase.rpc("reconcile_paypal_payment", {
    p_provider_event_id: eventId,
    p_event_type: input.eventType ?? `PAYMENT.CAPTURE.${capture.captureStatus}`,
    p_provider_order_id: capture.providerOrderId,
    p_provider_payment_id: capture.captureId,
    p_state: state,
    p_amount_minor: capture.amountMinor,
    p_currency: capture.currency,
    p_environment: capture.environment,
    p_payload_sha256: createHash("sha256").update(payload).digest("hex"),
  });
  const parsedReconcile = reconcileResultSchema.safeParse(reconcile.data);
  if (reconcile.error || !parsedReconcile.success) {
    throw new PayPalCheckoutServiceError("unavailable");
  }
  return {
    status: capture.captureStatus,
    orderNumber: context.order_number,
    transactionId: capture.captureId,
  };
}

export async function cancelPayPalOrder(input: { providerOrderId: string; userId: string; reason: string }) {
  const result = await createAdminClient().rpc("cancel_paypal_order", {
    p_provider_order_id: input.providerOrderId,
    p_profile_user_id: input.userId,
    p_reason: input.reason,
  });
  if (result.error) throw new PayPalCheckoutServiceError("unavailable");
  if (result.data !== true) throw new PayPalCheckoutServiceError("order_not_found");
  return { cancelled: true as const };
}

function normalizeCaptureState(status: string) {
  if (status === "COMPLETED") return "completed";
  if (status === "PENDING") return "pending";
  if (status === "DECLINED" || status === "DENIED" || status === "FAILED") return "declined";
  throw new PayPalCheckoutServiceError("capture_mismatch");
}

function fallbackCustomerName(email: string) {
  const localPart = email.split("@")[0]?.replace(/[._-]+/g, " ").trim() || "Customer";
  return localPart.length >= 2 ? localPart.slice(0, 120) : "Customer";
}
