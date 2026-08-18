import "server-only";
import { z } from "zod";
import type {
  CatalogData,
  CatalogSystemDetailData,
  CatalogSystemMedia,
} from "@/features/catalog/types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createPublicClient } from "@/lib/supabase/server";

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
  media: z.array(z.object({
    id: z.uuid(),
    media_type: z.enum(["image", "video", "demo"]),
    storage_path: z.string().nullable(),
    external_url: z.url().startsWith("https://").nullable(),
    alt_text: z.string().nullable(),
  })).optional().default([]),
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

const systemSelect = "id,title,slug,summary,audience,product_type,pricing_type,price_minor,regular_price_minor,sale_price_minor,sale_active,currency,is_featured,updated_at,category:system_categories(name,slug),media:system_media(id,media_type,storage_path,external_url,alt_text)";

export async function getPublicCatalogData(): Promise<CatalogData> {
  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", categories: [], systems: [] };
  }

  const supabase = createPublicClient();
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

  const allMediaRows = systems.data.flatMap((s) => s.media ?? []);
  const storagePaths = allMediaRows.flatMap((m) => (m.storage_path ? [m.storage_path] : []));
  const signedMap = new Map<string, string>();

  if (storagePaths.length > 0) {
    const { data } = await supabase.storage
      .from("system-media")
      .createSignedUrls(storagePaths, 60 * 60);

    data?.forEach((item) => {
      if (item.path && item.signedUrl) {
        signedMap.set(item.path, item.signedUrl);
      }
    });
  }

  const mappedSystems = systems.data.map((row) => {
    const resolvedMedia = (row.media ?? []).map((m) => {
      const url = m.external_url || (m.storage_path ? signedMap.get(m.storage_path) ?? "" : "");
      return {
        id: m.id,
        mediaType: m.media_type,
        url,
        altText: m.alt_text ?? "",
        storageBacked: Boolean(m.storage_path),
      };
    });
    const firstImage = resolvedMedia.find((m) => m.mediaType === "image" && m.url);
    return {
      ...mapSystemRow(row),
      media: resolvedMedia,
      coverImageUrl: firstImage?.url ?? null,
    };
  });

  return {
    status: "ready",
    categories: categories.data,
    systems: mappedSystems,
  };
}

export async function getPublicSystemBySlug(slug: string): Promise<CatalogSystemDetailData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", system: null };

  const supabase = createPublicClient();
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
  const firstImage = resolvedMedia.find((m) => m.mediaType === "image" && m.url);

  const relatedMediaRows = related.data.flatMap((s) => s.media ?? []);
  const relatedStoragePaths = relatedMediaRows.flatMap((m) => (m.storage_path ? [m.storage_path] : []));
  const relatedSignedMap = new Map<string, string>();

  if (relatedStoragePaths.length > 0) {
    const { data: relatedData } = await supabase.storage
      .from("system-media")
      .createSignedUrls(relatedStoragePaths, 60 * 60);

    relatedData?.forEach((item) => {
      if (item.path && item.signedUrl) {
        relatedSignedMap.set(item.path, item.signedUrl);
      }
    });
  }

  const mappedRelatedSystems = related.data.map((row) => {
    const rMedia = (row.media ?? []).map((m) => {
      const url = m.external_url || (m.storage_path ? relatedSignedMap.get(m.storage_path) ?? "" : "");
      return {
        id: m.id,
        mediaType: m.media_type,
        url,
        altText: m.alt_text ?? "",
        storageBacked: Boolean(m.storage_path),
      };
    });
    const rFirstImage = rMedia.find((m) => m.mediaType === "image" && m.url);
    return {
      ...mapSystemRow(row),
      media: rMedia,
      coverImageUrl: rFirstImage?.url ?? null,
    };
  });

  return {
    status: "ready",
    system: {
      ...mapSystemRow(parsed.data),
      coverImageUrl: firstImage?.url ?? null,
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
      relatedSystems: mappedRelatedSystems,
    },
  };
}

function mapSystemRow(row: z.infer<typeof systemRowSchema>) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    audience: row.audience,
    productType: row.product_type,
    pricingType: row.pricing_type,
    priceMinor: row.price_minor,
    regularPriceMinor: row.regular_price_minor,
    salePriceMinor: row.sale_price_minor,
    saleActive: row.sale_active,
    currency: row.currency,
    featured: row.is_featured,
    updatedAt: row.updated_at,
    category: row.category,
  };
}

async function resolvePublicMedia(
  supabase: ReturnType<typeof createPublicClient>,
  rows: z.infer<typeof mediaRowSchema>[],
): Promise<CatalogSystemMedia[]> {
  const storagePaths = rows.flatMap((row) => (row.storage_path ? [row.storage_path] : []));
  const signedMap = new Map<string, string>();

  if (storagePaths.length > 0) {
    const { data } = await supabase.storage
      .from("system-media")
      .createSignedUrls(storagePaths, 60 * 60);

    data?.forEach((item) => {
      if (item.path && item.signedUrl) {
        signedMap.set(item.path, item.signedUrl);
      }
    });
  }

  return rows.map((row) => {
    if (row.external_url) {
      return {
        id: row.id,
        mediaType: row.media_type,
        url: row.external_url,
        altText: row.alt_text ?? "",
        storageBacked: false,
      };
    }

    if (row.storage_path) {
      return {
        id: row.id,
        mediaType: row.media_type,
        url: signedMap.get(row.storage_path) ?? "",
        altText: row.alt_text ?? "",
        storageBacked: true,
      };
    }

    return {
      id: row.id,
      mediaType: row.media_type,
      url: "",
      altText: row.alt_text ?? "",
      storageBacked: false,
    };
  });
}
