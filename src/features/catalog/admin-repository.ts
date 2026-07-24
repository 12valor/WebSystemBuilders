import "server-only";
import { z } from "zod";
import type {
  AdminCatalogData,
  AdminEditableSystem,
  AdminSystemEditorData,
  AdminSystemResources,
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
  category_id: z.uuid().nullable(),
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

const featureSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  sort_order: z.number().int(),
});

const mediaSchema = z.object({
  id: z.uuid(),
  media_type: z.enum(["image", "video", "demo"]),
  storage_path: z.string().nullable(),
  external_url: z.string().nullable(),
  alt_text: z.string().nullable(),
  sort_order: z.number().int(),
});

const fileSchema = z.object({
  id: z.uuid(),
  storage_path: z.string(),
  original_filename: z.string(),
  byte_size: z.number().int().nullable(),
  sha256: z.string().nullable(),
});

const versionSchema = z.object({
  id: z.uuid(),
  version_label: z.string(),
  release_notes: z.string().nullable(),
  is_current: z.boolean(),
  released_at: z.string().nullable(),
  files: z.array(fileSchema),
});

const categoryColumns = "id,name,audience";
const editableSystemColumns =
  "id,category_id,title,slug,summary,description,audience,product_type,pricing_type,price_minor,regular_price_minor,sale_price_minor,sale_active,currency,status,inclusions,exclusions,requirements,license_summary,support_summary,published_at,updated_at,category:system_categories(name)";

const emptyResources: AdminSystemResources = {
  features: [],
  media: [],
  versions: [],
};

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
    return { status: "not_found", categories: [], system: null, resources: emptyResources };
  }

  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", categories: [], system: null, resources: emptyResources };
  }

  const supabase = await createClient();
  const [categoryResult, systemResult, featureResult, mediaResult, versionResult] = await Promise.all([
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
    supabase
      .from("system_features")
      .select("id,label,sort_order")
      .eq("system_id", systemId)
      .order("sort_order"),
    supabase
      .from("system_media")
      .select("id,media_type,storage_path,external_url,alt_text,sort_order")
      .eq("system_id", systemId)
      .order("sort_order"),
    supabase
      .from("system_versions")
      .select("id,version_label,release_notes,is_current,released_at,files:system_files(id,storage_path,original_filename,byte_size,sha256)")
      .eq("system_id", systemId)
      .order("created_at", { ascending: false }),
  ]);

  if (categoryResult.error || systemResult.error || featureResult.error || mediaResult.error || versionResult.error) {
    return { status: "error", categories: [], system: null, resources: emptyResources };
  }

  const categories = z.array(categorySchema).safeParse(categoryResult.data);
  if (!categories.success) {
    return { status: "error", categories: [], system: null, resources: emptyResources };
  }

  if (!systemResult.data) {
    return { status: "not_found", categories: categories.data, system: null, resources: emptyResources };
  }

  const system = editableSystemSchema.safeParse(systemResult.data);
  const features = z.array(featureSchema).safeParse(featureResult.data);
  const media = z.array(mediaSchema).safeParse(mediaResult.data);
  const versions = z.array(versionSchema).safeParse(versionResult.data);

  if (!system.success || !features.success || !media.success || !versions.success) {
    return { status: "error", categories: categories.data, system: null, resources: emptyResources };
  }

  return {
    status: "ready",
    categories: categories.data,
    system: mapEditableSystem(system.data),
    resources: {
      features: features.data.map((feature) => ({
        id: feature.id,
        label: feature.label,
        sortOrder: feature.sort_order,
      })),
      media: media.data.map((item) => ({
        id: item.id,
        mediaType: item.media_type,
        storagePath: item.storage_path,
        externalUrl: item.external_url,
        altText: item.alt_text,
        sortOrder: item.sort_order,
      })),
      versions: versions.data.map((version) => ({
        id: version.id,
        versionLabel: version.version_label,
        releaseNotes: version.release_notes,
        isCurrent: version.is_current,
        releasedAt: version.released_at,
        files: version.files.map((file) => ({
          id: file.id,
          storagePath: file.storage_path,
          originalFilename: file.original_filename,
          byteSize: file.byte_size,
          sha256: file.sha256,
        })),
      })),
    },
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
