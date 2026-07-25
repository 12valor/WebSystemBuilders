"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { companyProfileInputSchema, type CompanyProfileInput } from "@/features/content/company-profile-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type CompanyProfileEditorState = { status: "idle" | "error" | "unavailable"; message?: string; fieldErrors?: Record<string, string[] | undefined> };

export async function updateCompanyProfile(_state: CompanyProfileEditorState, formData: FormData): Promise<CompanyProfileEditorState> {
  const input = companyProfileInputSchema.safeParse({ companySummary: formData.get("companySummary"), founderBio: formData.get("founderBio"), publicEmail: formData.get("publicEmail"), publicPhone: formData.get("publicPhone"), intent: formData.get("intent"), updatedAt: formData.get("updatedAt") });
  if (!input.success) return validationFailure(input.error);
  if (!isSupabasePubliclyConfigured()) return { status: "unavailable", message: "Company profile management is unavailable until Supabase is connected." };
  const admin = await getAuthorizedAdmin();
  if (!admin.ok) return admin.state;
  const supabase = await createClient();
  const current = await supabase.from("company_profile").select("id,status,published_at").eq("id", 1).maybeSingle<{ id: number; status: "draft" | "published" | "archived"; published_at: string | null }>();
  if (current.error || !current.data) return { status: "error", message: "The company profile is unavailable. Confirm the latest migration has been applied." };
  const nextStatus = input.data.intent === "publish" ? "published" : input.data.intent === "archive" ? "archived" : current.data.status;
  const publishedAt = nextStatus === "published" ? current.data.published_at ?? new Date().toISOString() : current.data.published_at;
  const { data: updated, error } = await supabase.from("company_profile").update({ ...toMutation(input.data), status: nextStatus, published_at: publishedAt, updated_by: admin.identityId }).eq("id", 1).eq("updated_at", input.data.updatedAt).select("id").maybeSingle<{ id: number }>();
  if (error) return { status: "error", message: "The company profile could not be saved." };
  if (!updated) return { status: "error", message: "Another administrator changed the company profile. Reload before saving again." };
  revalidateCompanyProfilePaths();
  const result = input.data.intent === "publish" ? "company-published" : input.data.intent === "archive" ? "company-archived" : "company-updated";
  redirect(`/admin/content?result=${result}#company-profile`);
}

function toMutation(input: CompanyProfileInput) { return { company_summary: input.companySummary, founder_bio: input.founderBio, public_email: input.publicEmail, public_phone: input.publicPhone }; }
async function getAuthorizedAdmin(): Promise<{ ok: true; identityId: string } | { ok: false; state: CompanyProfileEditorState }> { try { const admin = await requireAdmin(); return { ok: true, identityId: admin.identity.id }; } catch (error) { if (error instanceof AuthorizationError) return { ok: false, state: { status: "error", message: "Your administrator access could not be verified." } }; throw error; } }
function validationFailure(error: z.ZodError): CompanyProfileEditorState { return { status: "error", message: "Review the highlighted company-profile fields before saving.", fieldErrors: error.flatten().fieldErrors }; }
function revalidateCompanyProfilePaths() { revalidatePath("/", "layout"); revalidatePath("/about"); revalidatePath("/contact"); revalidatePath("/admin/content"); revalidatePath("/admin/audit-log"); revalidatePath("/admin"); }