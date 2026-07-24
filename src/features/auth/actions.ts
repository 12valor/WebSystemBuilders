"use server";

import { redirect } from "next/navigation";
import { signInLinkSchema } from "@/features/auth/schemas";
import { getSiteUrl, isSiteUrlConfigured } from "@/lib/env/site";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  status: "idle" | "success" | "error" | "unavailable";
  message?: string;
  email?: string;
  fieldErrors?: { email?: string[] };
};

export async function requestSignInLink(
  _previousState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const result = signInLinkSchema.safeParse({
    email: formData.get("email"),
    next: formData.get("next") || undefined,
  });

  if (!result.success) {
    return {
      status: "error",
      message: "Check the highlighted field and try again.",
      email: String(formData.get("email") ?? ""),
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  if (!isSupabasePubliclyConfigured() || !isSiteUrlConfigured()) {
    return {
      status: "unavailable",
      message: "Secure account access is still being configured. No sign-in email was sent.",
      email: result.data.email,
    };
  }

  const callbackUrl = new URL("/auth/callback", getSiteUrl());
  callbackUrl.searchParams.set("next", result.data.next);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
      shouldCreateUser: true,
    },
  });

  if (error) {
    return {
      status: "error",
      message: "We could not send the secure sign-in link. Please wait a moment and try again.",
      email: result.data.email,
    };
  }

  return {
    status: "success",
    message: "If the address can receive account access, a secure sign-in link is on its way.",
    email: result.data.email,
  };
}

export async function signOut() {
  if (isSupabasePubliclyConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
