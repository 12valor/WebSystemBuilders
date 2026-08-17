import { createHash } from "node:crypto";
import { z } from "zod";
import { createPayPalAdapter } from "@/features/payments/paypal";
import { capturePayPalOrder, PayPalCheckoutServiceError } from "@/features/payments/paypal-checkout-service";
import { parsePayPalWebhook } from "@/features/payments/paypal-webhook";
import { getPayPalEnv } from "@/lib/env/paypal";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_WEBHOOK_BYTES = 256 * 1024;
const reconciliationSchema = z.enum(["completed", "pending", "declined", "refunded", "reversed", "duplicate"]);
const contextSchema = z.object({
  provider_order_id: z.string(),
  provider_environment: z.enum(["sandbox", "live"]),
  amount_minor: z.number().int().positive(),
  currency: z.literal("PHP"),
});

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WEBHOOK_BYTES) return jsonError("payload_too_large", 413);
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAX_WEBHOOK_BYTES) return jsonError("payload_too_large", 413);
  let payload: unknown;
  try { payload = JSON.parse(rawBody); } catch { return jsonError("invalid_payload", 400); }

  let env;
  try { env = getPayPalEnv(); } catch { return jsonError("webhook_unavailable", 503); }
  try {
    const verified = await createPayPalAdapter(env).verifyWebhook(request.headers, payload);
    if (!verified) return jsonError("invalid_signature", 401);
  } catch {
    return jsonError("invalid_signature", 401);
  }

  const parsed = parsePayPalWebhook(payload);
  if (!parsed) return jsonError("invalid_payload", 400);
  if (parsed.kind === "ignored") return Response.json({ received: true, ignored: true });

  if (parsed.kind === "approved") {
    try {
      const capture = await capturePayPalOrder({
        providerOrderId: parsed.providerOrderId,
        providerEventId: parsed.eventId,
        eventType: parsed.eventType,
      });
      return Response.json({ received: true, status: capture.status });
    } catch (error) {
      if (error instanceof PayPalCheckoutServiceError && error.code === "order_not_found") {
        return jsonError("order_not_found", 404);
      }
      return jsonError("capture_recovery_failed", 500);
    }
  }

  const supabase = createAdminClient();
  let providerOrderId = parsed.providerOrderId;
  let storedContext: z.infer<typeof contextSchema> | null = null;
  if (!providerOrderId && parsed.relatedCaptureId) {
    const lookup = await supabase
      .from("payments")
      .select("provider_order_id,provider_environment,amount_minor,currency")
      .eq("provider", "paypal")
      .eq("provider_payment_id", parsed.relatedCaptureId)
      .maybeSingle();
    const parsedLookup = contextSchema.safeParse(lookup.data);
    if (lookup.error || !parsedLookup.success) return jsonError("order_not_found", 404);
    storedContext = parsedLookup.data;
    providerOrderId = storedContext.provider_order_id;
  }
  if (!providerOrderId) return jsonError("order_not_found", 404);
  if (!storedContext) {
    const lookup = await supabase
      .from("payments")
      .select("provider_order_id,provider_environment,amount_minor,currency")
      .eq("provider", "paypal")
      .eq("provider_order_id", providerOrderId)
      .maybeSingle();
    const parsedLookup = contextSchema.safeParse(lookup.data);
    if (lookup.error || !parsedLookup.success) return jsonError("order_not_found", 404);
    storedContext = parsedLookup.data;
  }
  const amountMinor = parsed.amountMinor ?? storedContext.amount_minor;
  const currency = parsed.currency ?? storedContext.currency;
  const result = await supabase.rpc("reconcile_paypal_payment", {
    p_provider_event_id: parsed.eventId,
    p_event_type: parsed.eventType,
    p_provider_order_id: providerOrderId,
    p_provider_payment_id: parsed.providerPaymentId,
    p_state: parsed.state,
    p_amount_minor: amountMinor,
    p_currency: currency,
    p_environment: storedContext.provider_environment,
    p_payload_sha256: createHash("sha256").update(rawBody).digest("hex"),
  });
  const reconciliation = reconciliationSchema.safeParse(result.data);
  if (result.error || !reconciliation.success) return jsonError("processing_failed", 500);
  return Response.json({ received: true, result: reconciliation.data });
}

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}
