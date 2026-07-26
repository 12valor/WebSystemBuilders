import "server-only";

import { cache } from "react";
import { z } from "zod";
import type { AdminSiteContentData, PublicSiteContent, SiteContentBlock } from "@/features/content/site-content-types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient, createPublicClient } from "@/lib/supabase/server";

const rowSchema = z.object({
  id: z.uuid(), placement: z.enum(["announcement", "homepage_feature"]), eyebrow: z.string().nullable(), title: z.string(),
  body: z.string().nullable(), action_label: z.string().nullable(), action_href: z.string().nullable(),
  status: z.enum(["draft", "published", "archived"]), sort_order: z.number().int(), published_at: z.string().nullable(), updated_at: z.string(),
});
const columns = "id,placement,eyebrow,title,body,action_label,action_href,status,sort_order,published_at,updated_at";

export async function getAdminSiteContentData(): Promise<AdminSiteContentData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", items: [] };
  const supabase = await createClient();
  const result = await supabase.from("site_content_blocks").select(columns).order("placement").order("sort_order").order("created_at");
  if (result.error) return { status: "error", items: [] };
  const rows = z.array(rowSchema).safeParse(result.data);
  return rows.success ? { status: "ready", items: rows.data.map(mapBlock) } : { status: "error", items: [] };
}

export const getPublicSiteContent = cache(async (): Promise<PublicSiteContent> => {
  const empty = { announcement: null, homepageFeature: null };
  if (!isSupabasePubliclyConfigured()) return empty;
  const supabase = createPublicClient();
  const result = await supabase.from("site_content_blocks").select(columns).eq("status", "published").order("sort_order").order("published_at", { ascending: false });
  if (result.error) return empty;
  const rows = z.array(rowSchema).safeParse(result.data);
  if (!rows.success) return empty;
  const items = rows.data.map(mapBlock);
  return {
    announcement: items.find((item) => item.placement === "announcement") ?? null,
    homepageFeature: items.find((item) => item.placement === "homepage_feature") ?? null,
  };
});

function mapBlock(row: z.infer<typeof rowSchema>): SiteContentBlock {
  return { id: row.id, placement: row.placement, eyebrow: row.eyebrow, title: row.title, body: row.body,
    actionLabel: row.action_label, actionHref: row.action_href, status: row.status, sortOrder: row.sort_order,
    publishedAt: row.published_at, updatedAt: row.updated_at };
}
