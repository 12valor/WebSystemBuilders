import "server-only";
import { createClient } from "@/lib/supabase/server";

export type CurrentIdentity = {
  id: string;
  email: string | null;
};

export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) return null;

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
  };
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) return null;
  return data.user;
}
