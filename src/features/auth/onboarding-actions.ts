"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export async function completeOnboardingAction(formData: FormData): Promise<void> {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/auth/sign-in");

  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const country = String(formData.get("country") ?? "").trim();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
  const rawInterests = formData.getAll("interests").map(String);

  if (!username || username.length < 3) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("complete_user_onboarding", {
    p_username: username,
    p_country: country,
    p_avatar_url: avatarUrl,
    p_interests: rawInterests,
  });

  if (error) {
    return;
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function submitSellerApplicationAction(formData: FormData) {
  const identity = await getCurrentIdentity();
  if (!identity) redirect("/auth/sign-in");

  const displayName = String(formData.get("displayName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const portfolioUrl = String(formData.get("portfolioUrl") ?? "").trim();
  const githubUrl = String(formData.get("githubUrl") ?? "").trim();
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim();

  if (!displayName) {
    return { error: "Display Name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_seller_application", {
    p_display_name: displayName,
    p_bio: bio,
    p_country: country,
    p_portfolio_url: portfolioUrl,
    p_github_url: githubUrl,
    p_linkedin_url: linkedinUrl,
    p_banner_image_url: "",
    p_bank_details: {},
  });

  if (error) {
    return { error: "Could not submit seller application." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
