import { z } from "zod";
import { CheckoutServiceError, startPaymongoCheckout } from "@/features/payments/checkout-service";
import { getCurrentIdentity, getCurrentUser } from "@/lib/auth/current-user";

export const runtime = "nodejs";

const checkoutRequestSchema = z.object({ systemId: z.uuid() }).strict();

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) return jsonError("authentication_required", 401);

  const user = await getCurrentUser();
  if (!user || user.id !== identity.id || !user.email || !user.email_confirmed_at) {
    return jsonError("verified_email_required", 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("invalid_request", 400);
  }

  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) return jsonError("invalid_request", 400);

  try {
    const checkout = await startPaymongoCheckout({
      userId: identity.id,
      email: user.email.toLowerCase(),
      systemId: parsed.data.systemId,
    });
    return Response.json(checkout, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof CheckoutServiceError && error.code === "invalid_product") {
      return jsonError("product_unavailable", 404);
    }
    if (error instanceof CheckoutServiceError && error.code === "provider_failed") {
      return jsonError("checkout_provider_unavailable", 502);
    }
    return jsonError("checkout_unavailable", 503);
  }
}

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}
