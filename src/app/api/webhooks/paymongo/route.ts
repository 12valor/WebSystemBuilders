import { createHash } from "node:crypto";
import { z } from "zod";
import { parsePaymongoWebhook } from "@/features/payments/webhook-event";
import { verifyPaymongoSignature } from "@/features/payments/webhook-signature";
import { getPaymongoWebhookEnv } from "@/lib/env/paymongo";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_WEBHOOK_BYTES = 256 * 1024;
const reconciliationResultSchema = z.enum(["paid", "duplicate", "rejected"]);

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WEBHOOK_BYTES) {
    return Response.json({ error: "payload_too_large" }, { status: 413 });
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAX_WEBHOOK_BYTES) {
    return Response.json({ error: "payload_too_large" }, { status: 413 });
  }

  let secret: string;
  try {
    secret = getPaymongoWebhookEnv().PAYMONGO_WEBHOOK_SECRET;
  } catch {
    return Response.json({ error: "webhook_unavailable" }, { status: 503 });
  }

  const signature = verifyPaymongoSignature(rawBody, request.headers.get("paymongo-signature"), secret);
  if (!signature.valid) return Response.json({ error: "invalid_signature" }, { status: 401 });

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const payloadSha256 = createHash("sha256").update(rawBody).digest("hex");
  const parsed = parsePaymongoWebhook(payload, payloadSha256);
  if (!parsed) return Response.json({ error: "invalid_payload" }, { status: 400 });
  if (parsed.kind === "ignored") {
    if (parsed.livemode) return Response.json({ error: "live_event_rejected" }, { status: 401 });
    return Response.json({ received: true, ignored: true });
  }
  if (parsed.event.livemode) return Response.json({ error: "live_event_rejected" }, { status: 401 });

  const event = parsed.event;
  const result = await createAdminClient().rpc("record_paid_checkout_event", {
    p_provider_event_id: event.providerEventId,
    p_event_type: event.eventType,
    p_checkout_session_id: event.checkoutSessionId,
    p_order_id: event.orderId,
    p_order_number: event.orderNumber,
    p_provider_payment_intent_id: event.providerPaymentIntentId,
    p_provider_payment_id: event.providerPaymentId,
    p_payment_status: event.paymentStatus,
    p_amount_minor: event.amountMinor,
    p_currency: event.currency,
    p_livemode: false,
    p_payload_sha256: payloadSha256,
  });
  const reconciliation = reconciliationResultSchema.safeParse(result.data);

  if (result.error || !reconciliation.success) {
    return Response.json({ error: "processing_failed" }, { status: 500 });
  }

  return Response.json({ received: true, result: reconciliation.data });
}
