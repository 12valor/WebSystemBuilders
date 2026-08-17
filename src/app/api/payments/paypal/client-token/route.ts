import { createPayPalAdapter, PayPalProviderError } from "@/features/payments/paypal";
import { getCurrentIdentity, getCurrentUser } from "@/lib/auth/current-user";
import { getPayPalEnv } from "@/lib/env/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  const user = await getCurrentUser();
  if (!identity || !user || user.id !== identity.id || !user.email_confirmed_at) {
    return jsonError("verified_account_required", 401);
  }
  try {
    const requestOrigin = new URL(request.url).origin;
    const env = getPayPalEnv();
    const siteOrigin = new URL(env.SITE_URL).origin;
    if (requestOrigin !== siteOrigin && process.env.NODE_ENV === "production") {
      return jsonError("invalid_origin", 403);
    }
    const token = await createPayPalAdapter(env).createBrowserSafeClientToken(siteOrigin);
    return Response.json(token, { headers: noStoreHeaders() });
  } catch (error) {
    return jsonError(error instanceof PayPalProviderError ? "paypal_unavailable" : "checkout_unavailable", 503);
  }
}

function jsonError(error: string, status: number) {
  return Response.json({ error }, { status, headers: noStoreHeaders() });
}
function noStoreHeaders() {
  return { "Cache-Control": "no-store, max-age=0", Pragma: "no-cache" };
}
