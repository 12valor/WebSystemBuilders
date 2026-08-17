import { z } from "zod";
import { capturePayPalOrder, PayPalCheckoutServiceError } from "@/features/payments/paypal-checkout-service";
import { getCurrentIdentity, getCurrentUser } from "@/lib/auth/current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const orderIdSchema = z.string().regex(/^[A-Z0-9]{8,32}$/);

export async function POST(_request: Request, context: { params: Promise<{ providerOrderId: string }> }) {
  const identity = await getCurrentIdentity();
  const user = await getCurrentUser();
  if (!identity || !user || user.id !== identity.id || !user.email_confirmed_at) {
    return jsonError("verified_account_required", 401);
  }
  const parsed = orderIdSchema.safeParse((await context.params).providerOrderId);
  if (!parsed.success) return jsonError("invalid_request", 400);
  try {
    const result = await capturePayPalOrder({ providerOrderId: parsed.data, userId: identity.id });
    return Response.json(result, { headers: noStoreHeaders() });
  } catch (error) {
    if (error instanceof PayPalCheckoutServiceError && error.code === "order_not_found") {
      return jsonError("order_not_found", 404);
    }
    if (error instanceof PayPalCheckoutServiceError && error.code === "capture_mismatch") {
      return jsonError("capture_validation_failed", 409);
    }
    return jsonError("capture_unavailable", 503);
  }
}

function jsonError(error: string, status: number) { return Response.json({ error }, { status, headers: noStoreHeaders() }); }
function noStoreHeaders() { return { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" }; }
