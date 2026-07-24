import { z } from "zod";

export const publicSupabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().startsWith("https://"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
});

export type PublicSupabaseEnv = z.infer<typeof publicSupabaseEnvSchema>;

export function parsePublicSupabaseEnv(input: Record<string, string | undefined>): PublicSupabaseEnv {
  const result = publicSupabaseEnvSchema.safeParse(input);

  if (!result.success) {
    throw new Error("Invalid public Supabase configuration: " + z.prettifyError(result.error));
  }

  return result.data;
}

export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  return parsePublicSupabaseEnv({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}

export function isSupabasePubliclyConfigured(): boolean {
  return publicSupabaseEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }).success;
}
