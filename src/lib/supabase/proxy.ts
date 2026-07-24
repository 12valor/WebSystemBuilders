import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicSupabaseEnv, isSupabasePubliclyConfigured } from "@/lib/env/public";

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-websystembuilders-pathname", request.nextUrl.pathname);

  if (!isSupabasePubliclyConfigured()) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const env = getPublicSupabaseEnv();
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  await supabase.auth.getClaims();
  return response;
}
