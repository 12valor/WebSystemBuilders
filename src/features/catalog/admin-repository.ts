import "server-only";
import { z } from "zod";
import type { AdminCatalogData } from "@/features/catalog/admin-types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const categorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  audience: z.enum(["students", "business", "both"]),
});

const systemSchema = z.object({
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

export async function getAdminCatalogData(): Promise<AdminCatalogData> {
  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", categories: [], systems: [] };
  }

  const supabase = await createClient();
  const [categoryResult, systemResult] = await Promise.all([
    supabase
      .from("system_categories")
      .select("id,name,audience")
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
  const systems = z.array(systemSchema).safeParse(systemResult.data);

  if (!categories.success || !systems.success) {
    return { status: "error", categories: [], systems: [] };
  }

  return {
    status: "ready",
    categories: categories.data,
    systems: systems.data.map((system) => ({
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
    })),
  };
}
