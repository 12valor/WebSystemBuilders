import { z } from "zod";
import { cancelPayPalOrder, PayPalCheckoutServiceError } from "@/features/payments/paypal-checkout-service";
import { getCurrentIdentity, getCurrentUser } from "@/lib/auth/current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const orderIdSchema = z.string().regex(/^[A-Z0-9]{8,32}$/);
const requestSchema = z.object({ reason: z.enum(["popup_closed", "customer_cancelled"]).default("customer_cancelled") }).strict();

export async function POST(request: Request, context: { params: Promise<{ providerOrderId: string }> }) {
  const identity = await getCurrentIdentity();
  const user = await getCurrentUser();
  if (!identity || !user || user.id !== identity.id || !user.email_confirmed_at) {
    return jsonError("verified_account_required", 401);
  }
  const orderId = orderIdSchema.safeParse((await context.params).providerOrderId);
  let body: unknown;
  try { body = await request.json(); } catch { body = {}; }
  const parsed = requestSchema.safeParse(body);
  if (!orderId.success || !parsed.success) return jsonError("invalid_request", 400);
  try {
    const result = await cancelPayPalOrder({
      providerOrderId: orderId.data,
      userId: identity.id,
      reason: parsed.data.reason,
    });
    return Response.json(result, { headers: noStoreHeaders() });
  } catch (error) {
    if (error instanceof PayPalCheckoutServiceError && error.code === "order_not_found") {
      return jsonError("order_not_found", 404);
    }
    return jsonError("cancellation_unavailable", 503);
  }
}

function jsonError(error: string, status: number) { return Response.json({ error }, { status, headers: noStoreHeaders() }); }
function noStoreHeaders() { return { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" }; }
