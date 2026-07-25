import { NextResponse } from "next/server";
import { isInquirySubmissionConfigured } from "@/lib/env/inquiries";
import { isPayMongoConfigured } from "@/lib/env/paymongo";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { isResendConfigured } from "@/lib/env/resend";

export const dynamic = "force-dynamic";

export function GET() {
  const production = process.env.NODE_ENV === "production" && process.env.SITE_URL === "https://websystembuilders.com";
  const ready = isSupabasePubliclyConfigured()
    && typeof process.env.SUPABASE_SERVICE_ROLE_KEY === "string"
    && process.env.SUPABASE_SERVICE_ROLE_KEY.length >= 20
    && isInquirySubmissionConfigured()
    && isPayMongoConfigured()
    && process.env.PAYMONGO_SECRET_KEY?.startsWith("sk_live_") === true
    && isResendConfigured();
  const status = production ? (ready ? "ready" : "blocked") : "development";
  return NextResponse.json({ status }, { status: production && !ready ? 503 : 200, headers: { "Cache-Control": "no-store" } });
}
