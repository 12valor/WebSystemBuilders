"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { siteContentIdSchema, siteContentInputSchema, siteContentUpdateSchema, type SiteContentInput } from "@/features/content/site-content-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type SiteContentEditorState = { status: "idle" | "error" | "unavailable"; message?: string; fieldErrors?: Record<string, string[] | undefined> };

export async function createSiteContentBlock(_state: SiteContentEditorState, formData: FormData): Promise<SiteContentEditorState> {
  const input = siteContentInputSchema.safeParse(readFields(formData));
  if (!input.success) return validationFailure(input.error);
  if (!isSupabasePubliclyConfigured()) return unavailableState();
  const admin = await getAuthorizedAdmin();
  if (!admin.ok) return admin.state;
  const supabase = await createClient();
  const { error } = await supabase.from("site_content_blocks").insert({ ...toMutation(input.data), status: "draft", published_at: null, created_by: admin.identityId, updated_by: admin.identityId });
  if (error) return mutationFailure(error);
  revalidateSiteContentPaths();
  redirect("/admin/content?result=content-created#site-content");
}

export async function updateSiteContentBlock(contentId: string, _state: SiteContentEditorState, formData: FormData): Promise<SiteContentEditorState> {
  const id = siteContentIdSchema.safeParse(contentId);
  if (!id.success) return { status: "error", message: "The content-block identifier is invalid." };
  const input = siteContentUpdateSchema.safeParse({ ...readFields(formData), intent: formData.get("intent"), updatedAt: formData.get("updatedAt") });
  if (!input.success) return validationFailure(input.error);
  if (!isSupabasePubliclyConfigured()) return unavailableState();
  const admin = await getAuthorizedAdmin();
  if (!admin.ok) return admin.state;
  const supabase = await createClient();
  const current = await supabase.from("site_content_blocks").select("id,status,published_at").eq("id", id.data).maybeSingle<{ id: string; status: "draft" | "published" | "archived"; published_at: string | null }>();
  if (current.error || !current.data) return { status: "error", message: "The content block no longer exists or is not accessible." };
  const nextStatus = input.data.intent === "publish" ? "published" : input.data.intent === "archive" ? "archived" : current.data.status;
  const publishedAt = nextStatus === "published" ? current.data.published_at ?? new Date().toISOString() : current.data.published_at;
  const { data: updated, error } = await supabase.from("site_content_blocks").update({ ...toMutation(input.data), status: nextStatus, published_at: publishedAt, updated_by: admin.identityId }).eq("id", id.data).eq("updated_at", input.data.updatedAt).select("id").maybeSingle<{ id: string }>();
  if (error) return mutationFailure(error);
  if (!updated) return { status: "error", message: "Another administrator changed this content block. Reload before saving again." };
  revalidateSiteContentPaths();
  const result = input.data.intent === "publish" ? "content-published" : input.data.intent === "archive" ? "content-archived" : "content-updated";
  redirect(`/admin/content?result=${result}#site-content`);
}

function readFields(formData: FormData) { return { placement: formData.get("placement"), eyebrow: formData.get("eyebrow"), title: formData.get("title"), body: formData.get("body"), actionLabel: formData.get("actionLabel"), actionHref: formData.get("actionHref"), sortOrder: formData.get("sortOrder") }; }
function toMutation(input: SiteContentInput) { return { placement: input.placement, eyebrow: input.eyebrow, title: input.title, body: input.body, action_label: input.actionLabel, action_href: input.actionHref, sort_order: input.sortOrder }; }

async function getAuthorizedAdmin(): Promise<{ ok: true; identityId: string } | { ok: false; state: SiteContentEditorState }> {
  try { const admin = await requireAdmin(); return { ok: true, identityId: admin.identity.id }; }
  catch (error) { if (error instanceof AuthorizationError) return { ok: false, state: { status: "error", message: "Your administrator access could not be verified." } }; throw error; }
}
function validationFailure(error: z.ZodError): SiteContentEditorState { return { status: "error", message: "Review the highlighted content fields before saving.", fieldErrors: error.flatten().fieldErrors }; }
function unavailableState(): SiteContentEditorState { return { status: "unavailable", message: "Site content management is unavailable until Supabase is connected." }; }
function mutationFailure(error: { code?: string }): SiteContentEditorState {
  if (error.code === "23505") return { status: "error", message: "This placement already has published content. Archive that record before publishing another." };
  return { status: "error", message: "The site content block could not be saved." };
}
function revalidateSiteContentPaths() { revalidatePath("/", "layout"); revalidatePath("/admin/content"); revalidatePath("/admin/audit-log"); revalidatePath("/admin"); }
