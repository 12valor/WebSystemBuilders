import { createHash } from "node:crypto";
import { after, NextResponse } from "next/server";
import { z } from "zod";
import { fulfillPaidCheckout } from "@/features/delivery/service";
import { parsePaidCheckoutEvent } from "@/features/payments/webhook-event";
import { verifyLemonSqueezySignature } from "@/features/payments/webhook-signature";
import { getLemonSqueezyEnv, isLemonSqueezyConfigured } from "@/lib/env/lemonsqueezy";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";

const processingResultSchema = z.enum(["paid", "duplicate", "rejected"]);

export async function POST(request: Request) {
  if (!isSupabasePubliclyConfigured() || !isLemonSqueezyConfigured()) {
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

  const env = getLemonSqueezyEnv();
  const signatureHeader = request.headers.get("x-signature");
  const signature = verifyLemonSqueezySignature(rawBody, signatureHeader, env.LEMON_SQUEEZY_WEBHOOK_SECRET);
  if (!signature.valid) {
    return NextResponse.json({ received: false }, { status: 401 });
  }

  const payloadHash = createHash("sha256").update(rawBody).digest("hex");
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const event = parsePaidCheckoutEvent(payload, payloadHash);
  if (!event) {
    return NextResponse.json({ received: true, ignored: true });
  }

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
  if (result.error || !processed.success) {
    return NextResponse.json({ received: false }, { status: 500 });
  }

  if (processed.data === "paid") {
    after(() => fulfillPaidCheckout(event.checkoutSessionId).then(() => undefined).catch(() => undefined));
  }

  return NextResponse.json({ received: true, result: processed.data });
}
