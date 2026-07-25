"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  categoryInputSchema,
  isCategoryAudienceCompatible,
  type CategoryInput,
} from "@/features/admin/category-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type CategoryEditorState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const categoryIdSchema = z.uuid();

export async function createCategory(
  _previousState: CategoryEditorState,
  formData: FormData,
): Promise<CategoryEditorState> {
  const parsed = parseCategoryInput(formData, true);
  if (!parsed.success) return validationFailure(parsed.error);
  if (!isSupabasePubliclyConfigured()) return unavailableState();

  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    return authorizationFailure(error);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("system_categories").insert({
    ...toCategoryMutation(parsed.data),
    created_by: admin.identity.id,
    updated_by: admin.identity.id,
  });

  if (error) return mutationFailure(error);
  revalidateCategoryPaths();
  redirect("/admin/categories?result=created");
}

export async function updateCategory(
  categoryId: string,
  _previousState: CategoryEditorState,
  formData: FormData,
): Promise<CategoryEditorState> {
  const id = categoryIdSchema.safeParse(categoryId);
  if (!id.success) return { status: "error", message: "The category identifier is invalid." };

  const parsed = parseCategoryInput(formData, false);
  if (!parsed.success) return validationFailure(parsed.error);
  if (!isSupabasePubliclyConfigured()) return unavailableState();

  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    return authorizationFailure(error);
  }

  const supabase = await createClient();
  const [currentResult, systemsResult] = await Promise.all([
    supabase
      .from("system_categories")
      .select("id,is_active")
      .eq("id", id.data)
      .maybeSingle<{ id: string; is_active: boolean }>(),
    supabase
      .from("systems")
      .select("id,audience,status")
      .eq("category_id", id.data),
  ]);

  if (currentResult.error || systemsResult.error) {
    return { status: "error", message: "The category relationships could not be verified." };
  }
  if (!currentResult.data) {
    return { status: "error", message: "The category no longer exists or is not accessible." };
  }

  const linkedSystems = z
    .array(
      z.object({
        id: z.uuid(),
        audience: z.enum(["students", "business", "both"]),
        status: z.enum(["draft", "published", "unlisted", "archived"]),
      }),
    )
    .safeParse(systemsResult.data);

  if (!linkedSystems.success) {
    return { status: "error", message: "Linked system records could not be verified." };
  }

  if (linkedSystems.data.some((system) => !isCategoryAudienceCompatible(parsed.data.audience, system.audience))) {
    return {
      status: "error",
      message: "This audience would make one or more linked systems incompatible.",
      fieldErrors: { audience: ["Move the linked systems before changing this audience."] },
    };
  }

  if (!parsed.data.isActive && linkedSystems.data.some((system) => system.status !== "archived")) {
    return {
      status: "error",
      message: "This category is still used by an active catalog record.",
      fieldErrors: { isActive: ["Move or archive every linked system before archiving this category."] },
    };
  }

  const { error } = await supabase
    .from("system_categories")
    .update({ ...toCategoryMutation(parsed.data), updated_by: admin.identity.id })
    .eq("id", id.data);

  if (error) return mutationFailure(error);
  revalidateCategoryPaths();
  const result = currentResult.data.is_active && !parsed.data.isActive ? "archived" : "updated";
  redirect(`/admin/categories?result=${result}`);
}

function parseCategoryInput(formData: FormData, creating: boolean) {
  return categoryInputSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    audience: formData.get("audience"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder"),
    isActive: creating || formData.get("isActive") === "on",
  });
}

function toCategoryMutation(input: CategoryInput) {
  return {
    name: input.name,
    slug: input.slug,
    audience: input.audience,
    description: input.description,
    sort_order: input.sortOrder,
    is_active: input.isActive,
  };
}

function validationFailure(error: z.ZodError): CategoryEditorState {
  return {
    status: "error",
    message: "Review the highlighted fields before saving.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function authorizationFailure(error: unknown): CategoryEditorState {
  if (error instanceof AuthorizationError) {
    return { status: "error", message: "Your administrator access could not be verified." };
  }
  throw error;
}

function unavailableState(): CategoryEditorState {
  return {
    status: "unavailable",
    message: "Category management is unavailable until the Supabase project is connected.",
  };
}

function mutationFailure(error: { code?: string } | null): CategoryEditorState {
  if (error?.code === "23505") {
    return {
      status: "error",
      message: "A category already uses this URL slug.",
      fieldErrors: { slug: ["Choose a unique category slug."] },
    };
  }
  return { status: "error", message: "The category could not be saved." };
}

function revalidateCategoryPaths() {
  revalidatePath("/");
  revalidatePath("/for-students");
  revalidatePath("/for-business");
  revalidatePath("/systems");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/systems");
}
