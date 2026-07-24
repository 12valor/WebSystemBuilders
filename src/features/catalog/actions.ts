"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { systemDraftInputSchema } from "@/features/catalog/system-draft-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type CreateSystemDraftState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createSystemDraft(
  _previousState: CreateSystemDraftState,
  formData: FormData,
): Promise<CreateSystemDraftState> {
  const result = systemDraftInputSchema.safeParse({
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
    licenseSummary: formData.get("licenseSummary"),
    supportSummary: formData.get("supportSummary"),
  });

  if (!result.success) {
    return {
      status: "error",
      message: "Review the highlighted fields before saving the draft.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  if (!isSupabasePubliclyConfigured()) {
    return {
      status: "unavailable",
      message: "Draft saving is unavailable until the Supabase project is connected.",
    };
  }

  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { status: "error", message: "Your administrator access could not be verified." };
    }
    throw error;
  }

  const supabase = await createClient();
  const { data: category, error: categoryError } = await supabase
    .from("system_categories")
    .select("id,audience")
    .eq("id", result.data.categoryId)
    .eq("is_active", true)
    .maybeSingle<{ id: string; audience: "students" | "business" | "both" }>();

  if (categoryError || !category) {
    return {
      status: "error",
      message: "The selected category is unavailable.",
      fieldErrors: { categoryId: ["Select an active category."] },
    };
  }

  if (category.audience !== "both" && category.audience !== result.data.audience) {
    return {
      status: "error",
      message: "The selected category does not match the system audience.",
      fieldErrors: { categoryId: ["Choose a category for the selected audience."] },
    };
  }

  const { data: created, error } = await supabase
    .from("systems")
    .insert({
      category_id: result.data.categoryId,
      title: result.data.title,
      slug: result.data.slug,
      summary: result.data.summary,
      description: result.data.description,
      audience: result.data.audience,
      product_type: result.data.productType,
      pricing_type: result.data.pricingType,
      price_minor: result.data.priceMinor,
      regular_price_minor: result.data.regularPriceMinor,
      sale_price_minor: result.data.salePriceMinor,
      sale_active: result.data.saleActive,
      currency: "PHP",
      status: "draft",
      inclusions: result.data.inclusions,
      exclusions: result.data.exclusions,
      requirements: result.data.requirements,
      license_summary: result.data.licenseSummary,
      support_summary: result.data.supportSummary,
      created_by: admin.identity.id,
      updated_by: admin.identity.id,
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !created) {
    if (error?.code === "23505") {
      return {
        status: "error",
        message: "A system already uses this URL slug.",
        fieldErrors: { slug: ["Choose a unique URL slug."] },
      };
    }

    return {
      status: "error",
      message: "The draft could not be saved. No publication action was attempted.",
    };
  }

  revalidatePath("/admin/systems");
  revalidatePath("/systems");
  redirect("/admin/systems?created=1");
}
