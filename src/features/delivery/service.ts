import "server-only";

import { z } from "zod";
import { deliveryRowSchema, type DeliveryRow } from "@/features/delivery/schemas";
import { sendDeliveryEmail } from "@/features/delivery/resend";
import { createDeliveryToken } from "@/features/delivery/token";
import { getResendEnv, isResendConfigured } from "@/lib/env/resend";
import { createAdminClient } from "@/lib/supabase/admin";

const DELIVERY_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

export async function fulfillPaidCheckout(checkoutSessionId: string) {
  return createAndSend("create", checkoutSessionId);
}

export async function resendOrderDelivery(orderId: string) {
  return createAndSend("rotate", orderId);
}

async function createAndSend(mode: "create" | "rotate", identifier: string) {
  const token = createDeliveryToken();
  const expiresAt = new Date(Date.now() + DELIVERY_LIFETIME_MS).toISOString();
  const supabase = createAdminClient();
  const result = mode === "create"
    ? await supabase.rpc("create_delivery_for_paid_order", { p_checkout_session_id: identifier, p_token_hash: token.hash, p_expires_at: expiresAt })
    : await supabase.rpc("rotate_delivery_grant", { p_order_id: identifier, p_token_hash: token.hash, p_expires_at: expiresAt });
  const rows = z.array(deliveryRowSchema).safeParse(result.data);
  if (result.error || !rows.success) return { status: "error" as const };
  if (rows.data.length === 0) return { status: "unchanged" as const };
  const delivery = rows.data[0];

  if (!isResendConfigured()) {
    await markEmailResult(delivery.fulfillment_id, false, "", "resend_unconfigured");
    return { status: "email_unavailable" as const };
  }
  const env = getResendEnv();
  try {
    const emailId = await sendDeliveryEmail({
      apiKey: env.RESEND_API_KEY, fromEmail: env.RESEND_FROM_EMAIL, to: delivery.customer_email,
      customerName: delivery.customer_name, orderNumber: delivery.order_number, productName: delivery.product_name,
      versionLabel: delivery.version_label, deliveryUrl: new URL(`/downloads/${token.token}`, env.SITE_URL).toString(),
      expiresAt: delivery.expires_at, filenames: rows.data.map((row) => row.original_filename),
      idempotencyKey: `delivery-${delivery.fulfillment_id}-${token.hash.slice(0, 16)}`,
    });
    await markEmailResult(delivery.fulfillment_id, true, emailId, "");
    return { status: "sent" as const };
  } catch {
    await markEmailResult(delivery.fulfillment_id, false, "", "provider_email_failed");
    return { status: "error" as const };
  }
}

async function markEmailResult(fulfillmentId: string, sent: boolean, emailId: string, failureCode: string) {
  const supabase = createAdminClient();
  await supabase.rpc("mark_delivery_email_result", { p_fulfillment_id: fulfillmentId, p_sent: sent, p_provider_email_id: emailId, p_failure_code: failureCode });
}

export function groupDeliveryRows(rows: DeliveryRow[]) { return rows.reduce((map, row) => map.set(row.fulfillment_id, [...(map.get(row.fulfillment_id) ?? []), row]), new Map<string, DeliveryRow[]>()); }
