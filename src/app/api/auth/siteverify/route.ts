import { NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/security/turnstile-siteverify";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body.token || body.response || body["cf-turnstile-response"];

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid CAPTCHA token." },
        { status: 400 }
      );
    }

    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
    const result = await verifyTurnstileToken(token, clientIp);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "CAPTCHA verification failed.",
          "error-codes": result["error-codes"] || [],
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, challenge_ts: result.challenge_ts });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal CAPTCHA verification error." },
      { status: 500 }
    );
  }
}
