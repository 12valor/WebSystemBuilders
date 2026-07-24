"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getPublicationIssues } from "@/features/catalog/publication-readiness";
import {
  systemDraftInputSchema,
  type SystemDraftInput,
} from "@/features/catalog/system-draft-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type SystemEditorState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  publicationIssues?: string[];
};

export type CreateSystemDraftState = SystemEditorState;

const systemIdSchema = z.uuid();
const editorIntentSchema = z.enum(["save", "publish"]);

export async function createSystemDraft(
  _previousState: SystemEditorState,
  formData: FormData,
): Promise<SystemEditorState> {
  const result = parseSystemInput(formData);
  if (!result.success) return validationFailure(result.error);

  if (!isSupabasePubliclyConfigured()) {
    return unavailableState();
  }

  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    return authorizationFailure(error);
  }

  const supabase = await createClient();
  const categoryFailure = await validateCategory(
    supabase,
    result.data.categoryId,
    result.data.audience,
  );
  if (categoryFailure) return categoryFailure;

  const { data: created, error } = await supabase
    .from("systems")
    .insert({
      ...toSystemMutation(result.data),
      currency: "PHP",
      status: "draft",
      published_at: null,
      created_by: admin.identity.id,
      updated_by: admin.identity.id,
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !created) {
    return mutationFailure(error);
  }

  revalidateCatalog(created.id, result.data.slug);
  redirect(`/admin/systems/${created.id}/edit?created=1`);
}

export async function updateSystem(
  systemId: string,
  _previousState: SystemEditorState,
  formData: FormData,
): Promise<SystemEditorState> {
  const id = systemIdSchema.safeParse(systemId);
  if (!id.success) {
    return { status: "error", message: "The system identifier is invalid." };
  }

  const intent = editorIntentSchema.safeParse(formData.get("intent"));
  if (!intent.success) {
    return { status: "error", message: "Choose a valid editor action." };
  }

  const result = parseSystemInput(formData);
  if (!result.success) return validationFailure(result.error);

  if (!isSupabasePubliclyConfigured()) {
    return unavailableState();
  }

  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    return authorizationFailure(error);
  }

  const supabase = await createClient();
  const [categoryFailure, currentResult] = await Promise.all([
    validateCategory(supabase, result.data.categoryId, result.data.audience),
    supabase
      .from("systems")
      .select("id,status,published_at,slug")
      .eq("id", id.data)
      .maybeSingle<{
        id: string;
        status: "draft" | "published" | "unlisted" | "archived";
        published_at: string | null;
        slug: string;
      }>(),
  ]);

  if (categoryFailure) return categoryFailure;
  if (currentResult.error) {
    return { status: "error", message: "The existing system could not be verified." };
  }
  if (!currentResult.data) {
    return { status: "error", message: "The system no longer exists or is not accessible." };
  }

  let nextStatus = currentResult.data.status;
  let publishedAt = currentResult.data.published_at;

  if (intent.data === "publish") {
    const readiness = await loadPublicationReadiness(supabase, id.data);
    if (readiness.status === "error") {
      return {
        status: "error",
        message: "Publication readiness could not be verified. The system remains unchanged.",
      };
    }

    const publicationIssues = getPublicationIssues(result.data, readiness.assets);
    if (publicationIssues.length > 0) {
      return {
        status: "error",
        message: "Complete the publication checklist before making this system public.",
        publicationIssues,
      };
    }

    nextStatus = "published";
    publishedAt = publishedAt ?? new Date().toISOString();
  }

  const { data: updated, error } = await supabase
    .from("systems")
    .update({
      ...toSystemMutation(result.data),
      status: nextStatus,
      published_at: publishedAt,
      updated_by: admin.identity.id,
    })
    .eq("id", id.data)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error || !updated) {
    return mutationFailure(error);
  }

  revalidateCatalog(id.data, currentResult.data.slug, result.data.slug);
  const resultFlag = intent.data === "publish" ? "published" : "saved";
  redirect(`/admin/systems/${id.data}/edit?${resultFlag}=1`);
}

function parseSystemInput(formData: FormData) {
  return systemDraftInputSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    audience: formData.get("audience"),
    categoryId: formData.get("categoryId"),
    productType: formData.get("productType"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    pricingType: formData.get("pricingType"),
    regularPrice: formData.get("regularPrice"),
    salePrice: formData.get("salePrice"),
    saleActive: formData.get("saleActive") === "on",
    inclusions: formData.get("inclusions"),
    exclusions: formData.get("exclusions"),
    requirements: formData.get("requirements"),
    technologyStack: formData.get("technologyStack"),
    deliverySummary: formData.get("deliverySummary"),
    demoInstructions: formData.get("demoInstructions"),
    licenseSummary: formData.get("licenseSummary"),
    supportSummary: formData.get("supportSummary"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  });
}

function toSystemMutation(input: SystemDraftInput) {
  return {
    category_id: input.categoryId,
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    description: input.description,
    audience: input.audience,
    product_type: input.productType,
    pricing_type: input.pricingType,
    price_minor: input.priceMinor,
    regular_price_minor: input.regularPriceMinor,
    sale_price_minor: input.salePriceMinor,
    sale_active: input.saleActive,
    inclusions: input.inclusions,
    exclusions: input.exclusions,
    requirements: input.requirements,
    technology_stack: input.technologyStack,
    delivery_summary: input.deliverySummary,
    demo_instructions: input.demoInstructions,
    license_summary: input.licenseSummary,
    support_summary: input.supportSummary,
    seo_title: input.seoTitle,
    seo_description: input.seoDescription,
  };
}

async function validateCategory(
  supabase: Awaited<ReturnType<typeof createClient>>,
  categoryId: string,
  audience: SystemDraftInput["audience"],
): Promise<SystemEditorState | null> {
  const { data: category, error } = await supabase
    .from("system_categories")
    .select("id,audience")
    .eq("id", categoryId)
    .eq("is_active", true)
    .maybeSingle<{ id: string; audience: "students" | "business" | "both" }>();

  if (error || !category) {
    return {
      status: "error",
      message: "The selected category is unavailable.",
      fieldErrors: { categoryId: ["Select an active category."] },
    };
  }

  if (category.audience !== "both" && category.audience !== audience) {
    return {
      status: "error",
      message: "The selected category does not match the system audience.",
      fieldErrors: { categoryId: ["Choose a category for the selected audience."] },
    };
  }

  return null;
}

async function loadPublicationReadiness(
  supabase: Awaited<ReturnType<typeof createClient>>,
  systemId: string,
) {
  const [features, media, currentVersion] = await Promise.all([
    supabase
      .from("system_features")
      .select("id", { count: "exact", head: true })
      .eq("system_id", systemId),
    supabase
      .from("system_media")
      .select("id", { count: "exact", head: true })
      .eq("system_id", systemId),
    supabase
      .from("system_versions")
      .select("id")
      .eq("system_id", systemId)
      .eq("is_current", true)
      .maybeSingle<{ id: string }>(),
  ]);

  if (features.error || media.error || currentVersion.error) {
    return { status: "error" as const };
  }

  let hasCurrentDeliverable = false;
  if (currentVersion.data) {
    const files = await supabase
      .from("system_files")
      .select("id", { count: "exact", head: true })
      .eq("system_version_id", currentVersion.data.id);

    if (files.error) return { status: "error" as const };
    hasCurrentDeliverable = (files.count ?? 0) > 0;
  }

  return {
    status: "ready" as const,
    assets: {
      featureCount: features.count ?? 0,
      mediaCount: media.count ?? 0,
      hasCurrentDeliverable,
    },
  };
}

function validationFailure(
  error: z.ZodError,
): SystemEditorState {
  return {
    status: "error",
    message: "Review the highlighted fields before saving.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function unavailableState(): SystemEditorState {
  return {
    status: "unavailable",
    message: "Saving is unavailable until the Supabase project is connected.",
  };
}

function authorizationFailure(error: unknown): SystemEditorState {
  if (error instanceof AuthorizationError) {
    return {
      status: "error",
      message: "Your administrator access could not be verified.",
    };
  }
  throw error;
}

function mutationFailure(error: { code?: string } | null): SystemEditorState {
  if (error?.code === "23505") {
    return {
      status: "error",
      message: "A system already uses this URL slug.",
      fieldErrors: { slug: ["Choose a unique URL slug."] },
    };
  }

  return {
    status: "error",
    message: "The system could not be saved. No publication change was applied.",
  };
}

function revalidateCatalog(
  systemId: string,
  ...slugs: string[]
) {
  revalidatePath("/admin/systems");
  revalidatePath(`/admin/systems/${systemId}/edit`);
  revalidatePath("/systems");
  for (const slug of new Set(slugs)) {
    revalidatePath(`/systems/${slug}`);
  }
}
