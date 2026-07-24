import "server-only";
import { z } from "zod";
import type { CatalogData, CatalogSystemDetailData } from "@/features/catalog/types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const categoryRowSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  audience: z.enum(["students", "business", "both"]),
  description: z.string().nullable(),
});

const systemRowSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  audience: z.enum(["students", "business", "both"]),
  pricing_type: z.enum(["fixed", "starting", "quotation"]),
  price_minor: z.number().int().nullable(),
  regular_price_minor: z.number().int().nullable(),
  sale_price_minor: z.number().int().nullable(),
  sale_active: z.boolean(),
  currency: z.string(),
  is_featured: z.boolean(),
  updated_at: z.string(),
  category: z.object({ name: z.string(), slug: z.string() }).nullable(),
});

const systemDetailRowSchema = systemRowSchema.extend({
  description: z.string().nullable(),
  requirements: z.string().nullable(),
  inclusions: z.string().nullable(),
  exclusions: z.string().nullable(),
  license_summary: z.string().nullable(),
  support_summary: z.string().nullable(),
});

export async function getPublicCatalogData(): Promise<CatalogData> {
  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", categories: [], systems: [] };
  }

  const supabase = await createClient();
  const [categoriesResult, systemsResult] = await Promise.all([
    supabase
      .from("system_categories")
      .select("id,name,slug,audience,description")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("systems")
      .select("id,title,slug,summary,audience,pricing_type,price_minor,regular_price_minor,sale_price_minor,sale_active,currency,is_featured,updated_at,category:system_categories(name,slug)")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("updated_at", { ascending: false }),
  ]);

  if (categoriesResult.error || systemsResult.error) {
    return { status: "error", categories: [], systems: [] };
  }

  const categories = z.array(categoryRowSchema).safeParse(categoriesResult.data);
  const systems = z.array(systemRowSchema).safeParse(systemsResult.data);

  if (!categories.success || !systems.success) {
    return { status: "error", categories: [], systems: [] };
  }

  return {
    status: "ready",
    categories: categories.data,
    systems: systems.data.map(mapSystemRow),
  };
}

export async function getPublicSystemBySlug(slug: string): Promise<CatalogSystemDetailData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", system: null };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("systems")
    .select("id,title,slug,summary,description,audience,pricing_type,price_minor,regular_price_minor,sale_price_minor,sale_active,currency,is_featured,updated_at,requirements,inclusions,exclusions,license_summary,support_summary,category:system_categories(name,slug)")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) return { status: "error", system: null };
  if (!data) return { status: "ready", system: null };

  const parsed = systemDetailRowSchema.safeParse(data);
  if (!parsed.success) return { status: "error", system: null };

  return {
    status: "ready",
    system: {
      ...mapSystemRow(parsed.data),
      description: parsed.data.description,
      requirements: parsed.data.requirements,
      inclusions: parsed.data.inclusions,
      exclusions: parsed.data.exclusions,
      licenseSummary: parsed.data.license_summary,
      supportSummary: parsed.data.support_summary,
    },
  };
}

function mapSystemRow(system: z.infer<typeof systemRowSchema>) {
  return {
    id: system.id,
    title: system.title,
    slug: system.slug,
    summary: system.summary,
    audience: system.audience,
    pricingType: system.pricing_type,
    priceMinor: system.price_minor,
    regularPriceMinor: system.regular_price_minor,
    salePriceMinor: system.sale_price_minor,
    saleActive: system.sale_active,
    currency: system.currency,
    featured: system.is_featured,
    updatedAt: system.updated_at,
    category: system.category,
  };
}
