import "server-only";
import { z } from "zod";
import type {
  AdminCatalogData,
  AdminEditableSystem,
  AdminSystemEditorData,
} from "@/features/catalog/admin-types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const categorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  audience: z.enum(["students", "business", "both"]),
});

const systemListSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  slug: z.string(),
  audience: z.enum(["students", "business", "both"]),
  pricing_type: z.enum(["fixed", "starting", "quotation"]),
  price_minor: z.number().int().nullable(),
  currency: z.string(),
  status: z.enum(["draft", "published", "unlisted", "archived"]),
  updated_at: z.string(),
  category: z.object({ name: z.string() }).nullable(),
});

const editableSystemSchema = systemListSchema.extend({
  category_id: z.uuid(),
  product_type: z.enum(["ready_made", "customizable_template", "custom_service"]),
  summary: z.string(),
  description: z.string().nullable(),
  regular_price_minor: z.number().int().nullable(),
  sale_price_minor: z.number().int().nullable(),
  sale_active: z.boolean(),
  inclusions: z.string().nullable(),
  exclusions: z.string().nullable(),
  requirements: z.string().nullable(),
  license_summary: z.string().nullable(),
  support_summary: z.string().nullable(),
  published_at: z.string().nullable(),
});

const categoryColumns = "id,name,audience";
const editableSystemColumns =
  "id,category_id,title,slug,summary,description,audience,product_type,pricing_type,price_minor,regular_price_minor,sale_price_minor,sale_active,currency,status,inclusions,exclusions,requirements,license_summary,support_summary,published_at,updated_at,category:system_categories(name)";

export async function getAdminCatalogData(): Promise<AdminCatalogData> {
  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", categories: [], systems: [] };
  }

  const supabase = await createClient();
  const [categoryResult, systemResult] = await Promise.all([
    supabase
      .from("system_categories")
      .select(categoryColumns)
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("systems")
      .select("id,title,slug,audience,pricing_type,price_minor,currency,status,updated_at,category:system_categories(name)")
      .order("updated_at", { ascending: false }),
  ]);

  if (categoryResult.error || systemResult.error) {
    return { status: "error", categories: [], systems: [] };
  }

  const categories = z.array(categorySchema).safeParse(categoryResult.data);
  const systems = z.array(systemListSchema).safeParse(systemResult.data);

  if (!categories.success || !systems.success) {
    return { status: "error", categories: [], systems: [] };
  }

  return {
    status: "ready",
    categories: categories.data,
    systems: systems.data.map(mapSystemListRecord),
  };
}

export async function getAdminSystemEditorData(
  systemId: string,
): Promise<AdminSystemEditorData> {
  if (!z.uuid().safeParse(systemId).success) {
    return { status: "not_found", categories: [], system: null };
  }

  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", categories: [], system: null };
  }

  const supabase = await createClient();
  const [categoryResult, systemResult] = await Promise.all([
    supabase
      .from("system_categories")
      .select(categoryColumns)
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("systems")
      .select(editableSystemColumns)
      .eq("id", systemId)
      .maybeSingle(),
  ]);

  if (categoryResult.error || systemResult.error) {
    return { status: "error", categories: [], system: null };
  }

  const categories = z.array(categorySchema).safeParse(categoryResult.data);
  if (!categories.success) {
    return { status: "error", categories: [], system: null };
  }

  if (!systemResult.data) {
    return { status: "not_found", categories: categories.data, system: null };
  }

  const system = editableSystemSchema.safeParse(systemResult.data);
  if (!system.success) {
    return { status: "error", categories: categories.data, system: null };
  }

  return {
    status: "ready",
    categories: categories.data,
    system: mapEditableSystem(system.data),
  };
}

function mapSystemListRecord(system: z.infer<typeof systemListSchema>) {
  return {
    id: system.id,
    title: system.title,
    slug: system.slug,
    audience: system.audience,
    pricingType: system.pricing_type,
    priceMinor: system.price_minor,
    currency: system.currency,
    status: system.status,
    updatedAt: system.updated_at,
    categoryName: system.category?.name ?? null,
  };
}

function mapEditableSystem(
  system: z.infer<typeof editableSystemSchema>,
): AdminEditableSystem {
  return {
    ...mapSystemListRecord(system),
    categoryId: system.category_id,
    productType: system.product_type,
    summary: system.summary,
    description: system.description,
    regularPriceMinor: system.regular_price_minor,
    salePriceMinor: system.sale_price_minor,
    saleActive: system.sale_active,
    inclusions: system.inclusions,
    exclusions: system.exclusions,
    requirements: system.requirements,
    licenseSummary: system.license_summary,
    supportSummary: system.support_summary,
    publishedAt: system.published_at,
  };
}
