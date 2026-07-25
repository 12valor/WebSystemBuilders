import "server-only";

import { z } from "zod";
import type {
  AdminPortfolioData,
  PortfolioItem,
  PublicPortfolioData,
} from "@/features/content/portfolio-types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const portfolioRowSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  slug: z.string(),
  audience: z.enum(["students", "business", "both"]),
  summary: z.string(),
  description: z.string(),
  outcome: z.string().nullable(),
  technology_stack: z.array(z.string()),
  project_url: z.url().refine((value) => value.startsWith("https://")).nullable(),
  is_featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]),
  sort_order: z.number().int(),
  published_at: z.string().nullable(),
  updated_at: z.string(),
});

const portfolioColumns = "id,title,slug,audience,summary,description,outcome,technology_stack,project_url,is_featured,status,sort_order,published_at,updated_at";

export async function getAdminPortfolioData(): Promise<AdminPortfolioData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", items: [] };

  const supabase = await createClient();
  const result = await supabase
    .from("portfolio_items")
    .select(portfolioColumns)
    .order("is_featured", { ascending: false })
    .order("sort_order")
    .order("created_at");

  if (result.error) return { status: "error", items: [] };
  const rows = z.array(portfolioRowSchema).safeParse(result.data);
  if (!rows.success) return { status: "error", items: [] };
  return { status: "ready", items: rows.data.map(mapPortfolioItem) };
}

export async function getPublicPortfolioData(): Promise<PublicPortfolioData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", items: [] };

  const supabase = await createClient();
  const result = await supabase
    .from("portfolio_items")
    .select(portfolioColumns)
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("sort_order")
    .order("published_at", { ascending: false });

  if (result.error) return { status: "error", items: [] };
  const rows = z.array(portfolioRowSchema).safeParse(result.data);
  if (!rows.success) return { status: "error", items: [] };

  return {
    status: "ready",
    items: rows.data.map((row) => {
      const { status: _status, updatedAt: _updatedAt, ...item } = mapPortfolioItem(row);
      void _status;
      void _updatedAt;
      return item;
    }),
  };
}

function mapPortfolioItem(row: z.infer<typeof portfolioRowSchema>): PortfolioItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    audience: row.audience,
    summary: row.summary,
    description: row.description,
    outcome: row.outcome,
    technologyStack: row.technology_stack,
    projectUrl: row.project_url,
    isFeatured: row.is_featured,
    status: row.status,
    sortOrder: row.sort_order,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}
