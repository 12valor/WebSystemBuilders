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
  technology_stack: z.array(z.string()),
  delivery_summary: z.string().nullable(),
  demo_instructions: z.string().nullable(),
  license_summary: z.string().nullable(),
  support_summary: z.string().nullable(),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
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
  "id,category_id,title,slug,summary,description,audience,product_type,pricing_type,price_minor,regular_price_minor,sale_price_minor,sale_active,currency,status,inclusions,exclusions,requirements,technology_stack,delivery_summary,demo_instructions,license_summary,support_summary,seo_title,seo_description,published_at,updated_at,category:system_categories(name)";

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
    supabase.from("system_categories").select(categoryColumns).order("sort_order"),
    supabase.from("systems").select(editableSystemColumns).order("updated_at", { ascending: false }),
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
    systems: systems.data.map(mapSystemSummary),
  };
}

export async function getAdminSystemEditorData(id?: string): Promise<AdminSystemEditorData> {
  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", categories: [], system: null, resources: emptyResources };
  }

  const supabase = await createClient();
  const categoryResult = await supabase.from("system_categories").select(categoryColumns).order("sort_order");
  if (categoryResult.error) {
    return { status: "error", categories: [], system: null, resources: emptyResources };
  }

  const categories = z.array(categorySchema).safeParse(categoryResult.data);
  if (!categories.success) {
    return { status: "error", categories: [], system: null, resources: emptyResources };
  }

  if (!id) {
    return {
      status: "ready",
      categories: categories.data,
      system: null,
      resources: emptyResources,
    };
  }

  const [systemResult, featureResult, mediaResult, versionResult] = await Promise.all([
    supabase.from("systems").select(editableSystemColumns).eq("id", id).maybeSingle(),
    supabase.from("system_features").select("id,label,sort_order").eq("system_id", id).order("sort_order"),
    supabase.from("system_media").select("id,media_type,storage_path,external_url,alt_text,sort_order").eq("system_id", id).order("sort_order"),
    supabase
      .from("system_versions")
      .select("id,version_label,release_notes,is_current,released_at,files:system_files(id,storage_path,original_filename,byte_size,sha256)")
      .eq("system_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (systemResult.error || featureResult.error || mediaResult.error || versionResult.error) {
    return { status: "error", categories: categories.data, system: null, resources: emptyResources };
  }

  if (!systemResult.data) {
    return { status: "not_found", categories: categories.data, system: null, resources: emptyResources };
  }

  const parsedSystem = editableSystemSchema.safeParse(systemResult.data);
  const parsedFeatures = z.array(featureSchema).safeParse(featureResult.data);
  const parsedMedia = z.array(mediaSchema).safeParse(mediaResult.data);
  const parsedVersions = z.array(versionSchema).safeParse(versionResult.data);

  if (!parsedSystem.success || !parsedFeatures.success || !parsedMedia.success || !parsedVersions.success) {
    return { status: "error", categories: categories.data, system: null, resources: emptyResources };
  }

  return {
    status: "ready",
    categories: categories.data,
    system: mapEditableSystem(parsedSystem.data),
    resources: {
      features: parsedFeatures.data.map((f) => ({ id: f.id, label: f.label, sortOrder: f.sort_order })),
      media: parsedMedia.data.map((m) => ({
        id: m.id,
        mediaType: m.media_type,
        storagePath: m.storage_path,
        externalUrl: m.external_url,
        altText: m.alt_text,
        sortOrder: m.sort_order,
      })),
      versions: parsedVersions.data.map((v) => ({
        id: v.id,
        versionLabel: v.version_label,
        releaseNotes: v.release_notes,
        isCurrent: v.is_current,
        releasedAt: v.released_at,
        files: v.files.map((file) => ({
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

function mapSystemSummary(row: z.infer<typeof systemListSchema>) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    audience: row.audience,
    pricingType: row.pricing_type,
    priceMinor: row.price_minor,
    currency: row.currency,
    status: row.status,
    updatedAt: row.updated_at,
    categoryName: row.category?.name ?? null,
  };
}

function mapEditableSystem(row: z.infer<typeof editableSystemSchema>): AdminEditableSystem {
  return {
    ...mapSystemSummary(row),
    categoryId: row.category_id,
    productType: row.product_type,
    summary: row.summary,
    description: row.description,
    regularPriceMinor: row.regular_price_minor,
    salePriceMinor: row.sale_price_minor,
    saleActive: row.sale_active,
    inclusions: row.inclusions,
    exclusions: row.exclusions,
    requirements: row.requirements,
    technologyStack: row.technology_stack,
    deliverySummary: row.delivery_summary,
    demoInstructions: row.demo_instructions,
    licenseSummary: row.license_summary,
    supportSummary: row.support_summary,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    publishedAt: row.published_at,
  };
}
