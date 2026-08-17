import { z } from "zod";
import { createPayPalOrder, PayPalCheckoutServiceError } from "@/features/payments/paypal-checkout-service";
import { getCurrentIdentity, getCurrentUser } from "@/lib/auth/current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const requestSchema = z.object({ systemId: z.uuid() }).strict();

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  const user = await getCurrentUser();
  if (!identity || !user || user.id !== identity.id || !user.email || !user.email_confirmed_at) {
    return jsonError("verified_account_required", 401);
  }
  let body: unknown;
  try { body = await request.json(); } catch { return jsonError("invalid_request", 400); }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return jsonError("invalid_request", 400);
  try {
    const result = await createPayPalOrder({
      userId: identity.id,
      email: user.email.toLowerCase(),
      systemId: parsed.data.systemId,
    });
    return Response.json(result, { headers: noStoreHeaders() });
  } catch (error) {
    if (error instanceof PayPalCheckoutServiceError && error.code === "invalid_product") {
      return jsonError("product_unavailable", 404);
    }
    if (error instanceof PayPalCheckoutServiceError && error.code === "provider_failed") {
      return jsonError("paypal_unavailable", 502);
    }
    return jsonError("checkout_unavailable", 503);
  }
}

function jsonError(error: string, status: number) { return Response.json({ error }, { status, headers: noStoreHeaders() }); }
function noStoreHeaders() { return { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" }; }
