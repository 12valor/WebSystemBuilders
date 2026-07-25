"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { testimonialIdSchema, testimonialInputSchema, testimonialUpdateInputSchema } from "@/features/content/testimonial-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type TestimonialEditorState = { status: "idle" | "error" | "unavailable"; message?: string; fieldErrors?: Record<string, string[] | undefined> };

export async function createTestimonialDraft(_state: TestimonialEditorState, formData: FormData): Promise<TestimonialEditorState> {
  const input = testimonialInputSchema.safeParse(readFields(formData));
  if (!input.success) return validationFailure(input.error);
  if (!isSupabasePubliclyConfigured()) return unavailableState();
  if (!(await isAuthorized())) return authorizationFailure();
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_testimonial_draft", {
    p_quote: input.data.quote, p_attribution_name: input.data.attributionName, p_attribution_role: input.data.attributionRole,
    p_attribution_organization: input.data.attributionOrganization, p_relationship_context: input.data.relationshipContext,
    p_source_reference: input.data.verificationReference, p_permission_confirmed: input.data.permissionConfirmed,
    p_sort_order: input.data.sortOrder, p_is_featured: input.data.isFeatured,
  });
  if (error) return mutationFailure(error);
  revalidateTestimonialPaths();
  redirect("/admin/content?result=testimonial-created#testimonials");
}

export async function updateTestimonial(testimonialId: string, _state: TestimonialEditorState, formData: FormData): Promise<TestimonialEditorState> {
  const id = testimonialIdSchema.safeParse(testimonialId);
  if (!id.success) return { status: "error", message: "The testimonial identifier is invalid." };
  const input = testimonialUpdateInputSchema.safeParse({ ...readFields(formData), intent: formData.get("intent"), updatedAt: formData.get("updatedAt") });
  if (!input.success) return validationFailure(input.error);
  if (!isSupabasePubliclyConfigured()) return unavailableState();
  if (!(await isAuthorized())) return authorizationFailure();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_testimonial", {
    p_testimonial_id: id.data, p_expected_updated_at: input.data.updatedAt, p_intent: input.data.intent,
    p_quote: input.data.quote, p_attribution_name: input.data.attributionName, p_attribution_role: input.data.attributionRole,
    p_attribution_organization: input.data.attributionOrganization, p_relationship_context: input.data.relationshipContext,
    p_source_reference: input.data.verificationReference, p_permission_confirmed: input.data.permissionConfirmed,
    p_sort_order: input.data.sortOrder, p_is_featured: input.data.isFeatured,
  });
  if (error) return mutationFailure(error);
  if (!data) return { status: "error", message: "Another administrator changed this testimonial. Reload before saving again." };
  revalidateTestimonialPaths();
  const result = input.data.intent === "publish" ? "testimonial-published" : input.data.intent === "archive" ? "testimonial-archived" : "testimonial-updated";
  redirect(`/admin/content?result=${result}#testimonials`);
}

function readFields(formData: FormData) {
  return { quote: formData.get("quote"), attributionName: formData.get("attributionName"), attributionRole: formData.get("attributionRole"),
    attributionOrganization: formData.get("attributionOrganization"), relationshipContext: formData.get("relationshipContext"),
    verificationReference: formData.get("verificationReference"), permissionConfirmed: formData.get("permissionConfirmed") === "on",
    isFeatured: formData.get("isFeatured") === "on", sortOrder: formData.get("sortOrder") };
}

async function isAuthorized() { try { await requireAdmin(); return true; } catch (error) { if (error instanceof AuthorizationError) return false; throw error; } }
function authorizationFailure(): TestimonialEditorState { return { status: "error", message: "Your administrator access could not be verified." }; }
function validationFailure(error: z.ZodError): TestimonialEditorState { return { status: "error", message: "Review the highlighted testimonial fields before saving.", fieldErrors: error.flatten().fieldErrors }; }
function unavailableState(): TestimonialEditorState { return { status: "unavailable", message: "Testimonial management is unavailable until Supabase is connected." }; }
function mutationFailure(error: { code?: string }): TestimonialEditorState {
  if (error.code === "23514") return { status: "error", message: "Confirm and record the customer's publication permission before publishing.", fieldErrors: { permissionConfirmed: ["Permission is required for publication."] } };
  return { status: "error", message: "The testimonial could not be saved." };
}
function revalidateTestimonialPaths() { revalidatePath("/"); revalidatePath("/admin/content"); revalidatePath("/admin/audit-log"); revalidatePath("/admin"); }
