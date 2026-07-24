import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getServerSupabaseEnv } from "@/lib/env/server";

export function createAdminClient() {
  const env = getServerSupabaseEnv();

  return createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
