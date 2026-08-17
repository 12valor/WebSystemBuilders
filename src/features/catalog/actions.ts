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
import { isPayPalConfigured } from "@/lib/env/paypal";
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

  const { data: existing, error: existingError } = await supabase
    .from("systems")
    .select("id,slug,status,published_at")
    .eq("id", id.data)
    .maybeSingle<{
      id: string;
      slug: string;
      status: "draft" | "published" | "unlisted" | "archived";
      published_at: string | null;
    }>();

  if (existingError || !existing) {
    return { status: "error", message: "The system was not found." };
  }

  const categoryFailure = await validateCategory(
    supabase,
    result.data.categoryId,
    result.data.audience,
  );
  if (categoryFailure) return categoryFailure;

  if (intent.data === "publish") {
    const readiness = await loadPublicationReadiness(supabase, id.data);
    if (readiness.status === "error") {
      return { status: "error", message: "Publication checks could not be loaded safely." };
    }

    const issues = getPublicationIssues(
      {
        productType: result.data.productType,
        pricingType: result.data.pricingType,
        description: result.data.description,
        inclusions: result.data.inclusions,
        exclusions: result.data.exclusions,
        technologyStack: result.data.technologyStack,
        deliverySummary: result.data.deliverySummary,
        licenseSummary: result.data.licenseSummary,
        supportSummary: result.data.supportSummary,
        paymentQrUrl: result.data.paymentQrUrl,
        paymentInstructions: result.data.paymentInstructions,
      },
      readiness.assets,
      { paypalConfigured: isPayPalConfigured() },
    );

    if (issues.length > 0) {
      return {
        status: "error",
        message: "Resolve all publication issues before publishing this system.",
        publicationIssues: issues,
      };
    }
  }

  const newStatus = intent.data === "publish" ? "published" : existing.status;
  const newPublishedAt =
    intent.data === "publish" ? existing.published_at ?? new Date().toISOString() : existing.published_at;

  const { error: updateError } = await supabase
    .from("systems")
    .update({
      ...toSystemMutation(result.data),
      status: newStatus,
      published_at: newPublishedAt,
      updated_by: admin.identity.id,
    })
    .eq("id", id.data);

  if (updateError) {
    return mutationFailure(updateError);
  }

  revalidateCatalog(id.data, existing.slug, result.data.slug);
  return { status: "idle", message: intent.data === "publish" ? "System published successfully." : "Draft saved." };
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
    paymentQrUrl: formData.get("paymentQrUrl"),
    paymentInstructions: formData.get("paymentInstructions"),
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
    payment_qr_url: input.paymentQrUrl,
    payment_instructions: input.paymentInstructions,
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
