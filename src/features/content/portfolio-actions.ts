"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  portfolioIdSchema,
  portfolioInputSchema,
  portfolioUpdateInputSchema,
  type PortfolioInput,
} from "@/features/content/portfolio-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type PortfolioEditorState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createPortfolioItem(
  _previousState: PortfolioEditorState,
  formData: FormData,
): Promise<PortfolioEditorState> {
  const input = portfolioInputSchema.safeParse(readPortfolioFields(formData));
  if (!input.success) return validationFailure(input.error);
  if (!isSupabasePubliclyConfigured()) return unavailableState();

  const admin = await getAuthorizedAdmin();
  if (!admin.ok) return admin.state;

  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_items").insert({
    ...toPortfolioMutation(input.data),
    status: "draft",
    published_at: null,
    created_by: admin.identityId,
    updated_by: admin.identityId,
  });

  if (error) return mutationFailure(error);
  revalidatePortfolioPaths();
  redirect("/admin/content?result=portfolio-created#portfolio");
}

export async function updatePortfolioItem(
  portfolioId: string,
  _previousState: PortfolioEditorState,
  formData: FormData,
): Promise<PortfolioEditorState> {
  const id = portfolioIdSchema.safeParse(portfolioId);
  if (!id.success) return { status: "error", message: "The portfolio identifier is invalid." };

  const input = portfolioUpdateInputSchema.safeParse({
    ...readPortfolioFields(formData),
    intent: formData.get("intent"),
    updatedAt: formData.get("updatedAt"),
  });
  if (!input.success) return validationFailure(input.error);
  if (!isSupabasePubliclyConfigured()) return unavailableState();

  const admin = await getAuthorizedAdmin();
  if (!admin.ok) return admin.state;

  const supabase = await createClient();
  const currentResult = await supabase
    .from("portfolio_items")
    .select("id,status,published_at")
    .eq("id", id.data)
    .maybeSingle<{
      id: string;
      status: "draft" | "published" | "archived";
      published_at: string | null;
    }>();

  if (currentResult.error || !currentResult.data) {
    return { status: "error", message: "The portfolio entry no longer exists or is not accessible." };
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
    .from("portfolio_items")
    .update({
      ...toPortfolioMutation(input.data),
      status: nextStatus,
      published_at: publishedAt,
      updated_by: admin.identityId,
    })
    .eq("id", id.data)
    .eq("updated_at", input.data.updatedAt)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error) return mutationFailure(error);
  if (!updated) {
    return { status: "error", message: "Another administrator changed this portfolio entry. Reload before saving again." };
  }

  revalidatePortfolioPaths();
  const result = input.data.intent === "publish" ? "portfolio-published" : input.data.intent === "archive" ? "portfolio-archived" : "portfolio-updated";
  redirect(`/admin/content?result=${result}#portfolio`);
}

function readPortfolioFields(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    audience: formData.get("audience"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    outcome: formData.get("outcome"),
    technologyStack: formData.get("technologyStack"),
    projectUrl: formData.get("projectUrl"),
    isFeatured: formData.get("isFeatured") === "on",
    sortOrder: formData.get("sortOrder"),
  };
}

function toPortfolioMutation(input: PortfolioInput) {
  return {
    title: input.title,
    slug: input.slug,
    audience: input.audience,
    summary: input.summary,
    description: input.description,
    outcome: input.outcome,
    technology_stack: input.technologyStack,
    project_url: input.projectUrl,
    is_featured: input.isFeatured,
    sort_order: input.sortOrder,
  };
}

async function getAuthorizedAdmin(): Promise<
  | { ok: true; identityId: string }
  | { ok: false; state: PortfolioEditorState }
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

function validationFailure(error: z.ZodError): PortfolioEditorState {
  return {
    status: "error",
    message: "Review the highlighted portfolio fields before saving.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function unavailableState(): PortfolioEditorState {
  return {
    status: "unavailable",
    message: "Portfolio management is unavailable until Supabase is connected.",
  };
}

function mutationFailure(error: { code?: string } | null): PortfolioEditorState {
  if (error?.code === "23505") {
    return {
      status: "error",
      message: "A portfolio entry already uses this URL slug.",
      fieldErrors: { slug: ["Choose a unique portfolio slug."] },
    };
  }
  return { status: "error", message: "The portfolio entry could not be saved." };
}

function revalidatePortfolioPaths() {
  revalidatePath("/portfolio");
  revalidatePath("/admin/content");
  revalidatePath("/admin/audit-log");
  revalidatePath("/admin");
}
