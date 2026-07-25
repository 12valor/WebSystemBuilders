"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  faqIdSchema,
  faqInputSchema,
  faqUpdateInputSchema,
} from "@/features/content/faq-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type FaqEditorState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createFaqItem(
  _previousState: FaqEditorState,
  formData: FormData,
): Promise<FaqEditorState> {
  const input = faqInputSchema.safeParse(readFaqFields(formData));
  if (!input.success) return validationFailure(input.error);
  if (!isSupabasePubliclyConfigured()) return unavailableState();

  const admin = await getAuthorizedAdmin();
  if (!admin.ok) return admin.state;

  const supabase = await createClient();
  const { error } = await supabase.from("faq_items").insert({
    question: input.data.question,
    answer: input.data.answer,
    category: input.data.category,
    sort_order: input.data.sortOrder,
    status: "draft",
    published_at: null,
    created_by: admin.identityId,
    updated_by: admin.identityId,
  });

  if (error) return mutationFailure();
  revalidateFaqPaths();
  redirect("/admin/content?result=created");
}

export async function updateFaqItem(
  faqId: string,
  _previousState: FaqEditorState,
  formData: FormData,
): Promise<FaqEditorState> {
  const id = faqIdSchema.safeParse(faqId);
  if (!id.success) return { status: "error", message: "The FAQ identifier is invalid." };

  const input = faqUpdateInputSchema.safeParse({
    ...readFaqFields(formData),
    intent: formData.get("intent"),
    updatedAt: formData.get("updatedAt"),
  });
  if (!input.success) return validationFailure(input.error);
  if (!isSupabasePubliclyConfigured()) return unavailableState();

  const admin = await getAuthorizedAdmin();
  if (!admin.ok) return admin.state;

  const supabase = await createClient();
  const currentResult = await supabase
    .from("faq_items")
    .select("id,status,published_at")
    .eq("id", id.data)
    .maybeSingle<{
      id: string;
      status: "draft" | "published" | "archived";
      published_at: string | null;
    }>();

  if (currentResult.error || !currentResult.data) {
    return { status: "error", message: "The FAQ no longer exists or is not accessible." };
  }

  const nextStatus = input.data.intent === "publish"
    ? "published"
    : input.data.intent === "archive"
      ? "archived"
      : currentResult.data.status;
  const publishedAt = nextStatus === "published"
    ? currentResult.data.published_at ?? new Date().toISOString()
    : currentResult.data.published_at;

  const { data: updated, error } = await supabase
    .from("faq_items")
    .update({
      question: input.data.question,
      answer: input.data.answer,
      category: input.data.category,
      sort_order: input.data.sortOrder,
      status: nextStatus,
      published_at: publishedAt,
      updated_by: admin.identityId,
    })
    .eq("id", id.data)
    .eq("updated_at", input.data.updatedAt)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error) return mutationFailure();
  if (!updated) {
    return { status: "error", message: "Another administrator changed this FAQ. Reload before saving again." };
  }

  revalidateFaqPaths();
  const result = input.data.intent === "publish" ? "published" : input.data.intent === "archive" ? "archived" : "updated";
  redirect(`/admin/content?result=${result}`);
}

function readFaqFields(formData: FormData) {
  return {
    question: formData.get("question"),
    answer: formData.get("answer"),
    category: formData.get("category"),
    sortOrder: formData.get("sortOrder"),
  };
}

async function getAuthorizedAdmin(): Promise<
  | { ok: true; identityId: string }
  | { ok: false; state: FaqEditorState }
> {
  try {
    const admin = await requireAdmin();
    return { ok: true, identityId: admin.identity.id };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { ok: false, state: { status: "error", message: "Your administrator access could not be verified." } };
    }
    throw error;
  }
}

function validationFailure(error: z.ZodError): FaqEditorState {
  return {
    status: "error",
    message: "Review the highlighted FAQ fields before saving.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function unavailableState(): FaqEditorState {
  return {
    status: "unavailable",
    message: "FAQ management is unavailable until Supabase is connected.",
  };
}

function mutationFailure(): FaqEditorState {
  return { status: "error", message: "The FAQ could not be saved." };
}

function revalidateFaqPaths() {
  revalidatePath("/faq");
  revalidatePath("/admin/content");
  revalidatePath("/admin/audit-log");
  revalidatePath("/admin");
}
