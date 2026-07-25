import { createHash } from "node:crypto";
import { after, NextResponse } from "next/server";
import { z } from "zod";
import { fulfillPaidCheckout } from "@/features/delivery/service";
import { parsePaidCheckoutEvent } from "@/features/payments/webhook-event";
import { verifyPayMongoSignature } from "@/features/payments/webhook-signature";
import { getPayMongoEnv, isPayMongoConfigured } from "@/lib/env/paymongo";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";

const processingResultSchema = z.enum(["paid", "duplicate", "rejected"]);

export async function POST(request: Request) {
  if (!isSupabasePubliclyConfigured() || !isPayMongoConfigured()) {
    return NextResponse.json({ received: false, reason: "unconfigured" }, { status: 503 });
  }
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > 262_144) {
    return NextResponse.json({ received: false }, { status: 413 });
  }
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > 262_144) {
    return NextResponse.json({ received: false }, { status: 413 });
  }
  const env = getPayMongoEnv();
  const signature = verifyPayMongoSignature(rawBody, request.headers.get("paymongo-signature"), env.PAYMONGO_WEBHOOK_SECRET);
  if (!signature.valid) return NextResponse.json({ received: false }, { status: 401 });

  const payloadHash = createHash("sha256").update(rawBody).digest("hex");
  let payload: unknown;
  try { payload = JSON.parse(rawBody) as unknown; }
  catch { return NextResponse.json({ received: false }, { status: 400 }); }
  const event = parsePaidCheckoutEvent(payload, payloadHash);
  if (!event) return NextResponse.json({ received: true, ignored: true });
  if (event.livemode !== signature.livemode) return NextResponse.json({ received: false }, { status: 401 });

  const supabase = createAdminClient();
  const result = await supabase.rpc("record_paid_checkout_event", {
    p_provider_event_id: event.providerEventId,
    p_event_type: event.eventType,
    p_checkout_session_id: event.checkoutSessionId,
    p_provider_payment_id: event.providerPaymentId,
    p_amount_minor: event.amountMinor,
    p_currency: event.currency,
    p_livemode: event.livemode,
    p_payload_sha256: payloadHash,
  });
  const processed = processingResultSchema.safeParse(result.data);
  if (result.error || !processed.success) return NextResponse.json({ received: false }, { status: 500 });
  if (processed.data === "paid") {
    after(() => fulfillPaidCheckout(event.checkoutSessionId).then(() => undefined).catch(() => undefined));
  }
  return NextResponse.json({ received: true, result: processed.data });
}
