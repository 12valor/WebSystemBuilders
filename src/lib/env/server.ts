import "server-only";
import { z } from "zod";
import { publicSupabaseEnvSchema } from "@/lib/env/public";

const serverSupabaseEnvSchema = publicSupabaseEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
});

export type ServerSupabaseEnv = z.infer<typeof serverSupabaseEnvSchema>;

export function getServerSupabaseEnv(): ServerSupabaseEnv {
  const result = serverSupabaseEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!result.success) {
    throw new Error("Invalid server Supabase configuration: " + z.prettifyError(result.error));
  }

  return result.data;
}
