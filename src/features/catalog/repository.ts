import "server-only";
import { z } from "zod";
import type {
  CatalogData,
  CatalogSystemDetailData,
  CatalogSystemMedia,
} from "@/features/catalog/types";
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
  product_type: z.enum(["ready_made", "customizable_template", "custom_service"]),
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
  category_id: z.uuid().nullable(),
  description: z.string().nullable(),
  requirements: z.string().nullable(),
  inclusions: z.string().nullable(),
  exclusions: z.string().nullable(),
  technology_stack: z.array(z.string()),
  delivery_summary: z.string().nullable(),
  demo_instructions: z.string().nullable(),
  license_summary: z.string().nullable(),
  support_summary: z.string().nullable(),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
});

const featureRowSchema = z.object({
  id: z.uuid(),
  label: z.string(),
});

const mediaRowSchema = z.object({
  id: z.uuid(),
  media_type: z.enum(["image", "video", "demo"]),
  storage_path: z.string().nullable(),
  external_url: z.url().startsWith("https://").nullable(),
  alt_text: z.string().nullable(),
});

const versionRowSchema = z.object({
  version_label: z.string(),
  released_at: z.string().nullable(),
});

const systemSelect = "id,title,slug,summary,audience,product_type,pricing_type,price_minor,regular_price_minor,sale_price_minor,sale_active,currency,is_featured,updated_at,category:system_categories(name,slug)";

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
      .select(systemSelect)
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
    .select(`${systemSelect},category_id,description,requirements,inclusions,exclusions,technology_stack,delivery_summary,demo_instructions,license_summary,support_summary,seo_title,seo_description`)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) return { status: "error", system: null };
  if (!data) return { status: "ready", system: null };

  const parsed = systemDetailRowSchema.safeParse(data);
  if (!parsed.success) return { status: "error", system: null };

  const relatedFilters = [
    parsed.data.category_id ? `category_id.eq.${parsed.data.category_id}` : null,
    `audience.eq.${parsed.data.audience}`,
    "audience.eq.both",
  ].filter((filter): filter is string => Boolean(filter));

  const [featuresResult, mediaResult, versionResult, relatedResult] = await Promise.all([
    supabase
      .from("system_features")
      .select("id,label")
      .eq("system_id", parsed.data.id)
      .order("sort_order"),
    supabase
      .from("system_media")
      .select("id,media_type,storage_path,external_url,alt_text")
      .eq("system_id", parsed.data.id)
      .order("sort_order"),
    supabase
      .from("system_versions")
      .select("version_label,released_at")
      .eq("system_id", parsed.data.id)
      .eq("is_current", true)
      .maybeSingle(),
    supabase
      .from("systems")
      .select(systemSelect)
      .eq("status", "published")
      .neq("id", parsed.data.id)
      .or(relatedFilters.join(","))
      .order("is_featured", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(3),
  ]);

  if (featuresResult.error || mediaResult.error || versionResult.error) {
    return { status: "error", system: null };
  }

  const features = z.array(featureRowSchema).safeParse(featuresResult.data);
  const media = z.array(mediaRowSchema).safeParse(mediaResult.data);
  const version = versionRowSchema.nullable().safeParse(versionResult.data);
  const related = relatedResult.error
    ? { success: true as const, data: [] as z.infer<typeof systemRowSchema>[] }
    : z.array(systemRowSchema).safeParse(relatedResult.data);

  if (!features.success || !media.success || !version.success || !related.success) {
    return { status: "error", system: null };
  }

  const resolvedMedia = await resolvePublicMedia(supabase, media.data);

  return {
    status: "ready",
    system: {
      ...mapSystemRow(parsed.data),
      description: parsed.data.description,
      requirements: parsed.data.requirements,
      inclusions: parsed.data.inclusions,
      exclusions: parsed.data.exclusions,
      technologyStack: parsed.data.technology_stack,
      deliverySummary: parsed.data.delivery_summary,
      demoInstructions: parsed.data.demo_instructions,
      licenseSummary: parsed.data.license_summary,
      supportSummary: parsed.data.support_summary,
      seoTitle: parsed.data.seo_title,
      seoDescription: parsed.data.seo_description,
      features: features.data,
      media: resolvedMedia,
      currentVersion: version.data
        ? { versionLabel: version.data.version_label, releasedAt: version.data.released_at }
        : null,
      relatedSystems: related.data.map(mapSystemRow),
    },
  };
}

async function resolvePublicMedia(
  supabase: Awaited<ReturnType<typeof createClient>>,
  media: z.infer<typeof mediaRowSchema>[],
): Promise<CatalogSystemMedia[]> {
  const imagePaths = media
    .filter((item) => item.media_type === "image" && item.storage_path)
    .map((item) => item.storage_path as string);
  const signedByPath = new Map<string, string>();

  if (imagePaths.length > 0) {
    const { data } = await supabase.storage.from("system-media").createSignedUrls(imagePaths, 3600);
    data?.forEach((item) => {
      if (item.path && item.signedUrl) signedByPath.set(item.path, item.signedUrl);
    });
  }

  return media.flatMap((item) => {
    const url = item.storage_path ? signedByPath.get(item.storage_path) : item.external_url;
    if (!url || !item.alt_text) return [];
    return [{
      id: item.id,
      mediaType: item.media_type,
      url,
      altText: item.alt_text,
      storageBacked: Boolean(item.storage_path),
    }];
  });
}

function mapSystemRow(system: z.infer<typeof systemRowSchema>) {
  return {
    id: system.id,
    title: system.title,
    slug: system.slug,
    summary: system.summary,
    audience: system.audience,
    productType: system.product_type,
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