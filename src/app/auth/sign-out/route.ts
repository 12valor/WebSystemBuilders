import { NextResponse, type NextRequest } from "next/server";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  if (isSupabasePubliclyConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}

export async function POST(request: NextRequest) {
  if (isSupabasePubliclyConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}
