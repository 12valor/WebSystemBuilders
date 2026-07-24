import { NextResponse, type NextRequest } from "next/server";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { getSafeNextPath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextPath = getSafeNextPath(request.nextUrl.searchParams.get("next"));

  if (!isSupabasePubliclyConfigured()) {
    return NextResponse.redirect(new URL("/auth/sign-in?error=configuration", request.url));
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) return NextResponse.redirect(new URL(nextPath, request.url));
  }

  return NextResponse.redirect(new URL("/auth/sign-in?error=callback", request.url));
}
