import "server-only";

export interface SiteverifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

/**
 * Performs canonical server-side Cloudflare Turnstile siteverify verification.
 * 
 * POST https://challenges.cloudflare.com/turnstile/v0/siteverify
 * body: { secret: process.env.TURNSTILE_SECRET, response: token, remoteip?: clientIp }
 * Checks success === true before letting the request through.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<SiteverifyResponse> {
  const secret = process.env.TURNSTILE_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === "test") {
      return { success: true };
    }
    return { success: false, "error-codes": ["missing-input-secret"] };
  }

  try {
    const params = new URLSearchParams({
      secret,
      response: token,
    });
    
    if (remoteIp) {
      params.append("remoteip", remoteIp);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!res.ok) {
      return { success: false, "error-codes": [`siteverify-http-${res.status}`] };
    }

    const data = (await res.json()) as SiteverifyResponse;
    return data;
  } catch {
    return { success: false, "error-codes": ["siteverify-network-error"] };
  }
}
