"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminAccessInputSchema } from "@/features/admin/settings-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type AdminAccessActionState = { status: "idle" | "error" | "unavailable"; message?: string; fieldErrors?: Record<string, string[] | undefined> };

export async function manageAdminAccess(_state: AdminAccessActionState, formData: FormData): Promise<AdminAccessActionState> {
  const input = adminAccessInputSchema.safeParse({ email: formData.get("email"), role: formData.get("role"), action: formData.get("action") });
  if (!input.success) return { status: "error", message: "Review the administrator access fields.", fieldErrors: input.error.flatten().fieldErrors };
  if (!isSupabasePubliclyConfigured()) return { status: "unavailable", message: "Administrator access management is unavailable until Supabase is connected." };
  try { await requireAdmin("super_admin"); }
  catch (error) { if (error instanceof AuthorizationError) return { status: "error", message: "Your super-administrator access could not be verified." }; throw error; }
  const supabase = await createClient();
  const { error } = await supabase.rpc("manage_admin_access", { p_email: input.data.email, p_role: input.data.role, p_action: input.data.action });
  if (error) return mutationFailure(error);
  revalidatePath("/admin/settings"); revalidatePath("/admin/audit-log"); revalidatePath("/admin");
  redirect(`/admin/settings?result=${input.data.action === "revoke" ? "access-revoked" : "access-granted"}`);
}

function mutationFailure(error: { code?: string; message?: string }): AdminAccessActionState {
  if (error.code === "P0002") return { status: "error", message: "No matching account with administrator access eligibility was found." };
  if (error.code === "23514") return { status: "error", message: "This change would remove required super-administrator access or alter your own protected role." };
  if (error.code === "42501") return { status: "error", message: "Super-administrator authorization was rejected." };
  return { status: "error", message: "Administrator access could not be changed." };
}
