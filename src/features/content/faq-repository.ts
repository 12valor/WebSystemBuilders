import "server-only";

import { z } from "zod";
import { defaultFaqItems } from "@/features/content/faq-defaults";
import type { PublicFaqItem } from "@/features/content/faq-public-types";
import type { AdminFaqData, FaqItem } from "@/features/content/faq-types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const faqRowSchema = z.object({
  id: z.uuid(),
  question: z.string(),
  answer: z.string(),
  category: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  sort_order: z.number().int(),
  published_at: z.string().nullable(),
  updated_at: z.string(),
});

const faqColumns = "id,question,answer,category,status,sort_order,published_at,updated_at";

export async function getAdminFaqData(): Promise<AdminFaqData> {
  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", items: [] };
  }

  const supabase = await createClient();
  const result = await supabase
    .from("faq_items")
    .select(faqColumns)
    .order("sort_order")
    .order("created_at");

  if (result.error) return { status: "error", items: [] };

  const rows = z.array(faqRowSchema).safeParse(result.data);
  if (!rows.success) return { status: "error", items: [] };

  return { status: "ready", items: rows.data.map(mapFaqItem) };
}

export async function getPublicFaqItems(): Promise<PublicFaqItem[]> {
  if (!isSupabasePubliclyConfigured()) return [...defaultFaqItems];

  const supabase = await createClient();
  const result = await supabase
    .from("faq_items")
    .select(faqColumns)
    .eq("status", "published")
    .order("sort_order")
    .order("created_at");

  if (result.error) return [...defaultFaqItems];

  const rows = z.array(faqRowSchema).safeParse(result.data);
  if (!rows.success) return [...defaultFaqItems];

  return rows.data.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    category: item.category,
  }));
}

function mapFaqItem(item: z.infer<typeof faqRowSchema>): FaqItem {
  return {
    id: item.id,
    question: item.question,
    answer: item.answer,
    category: item.category,
    status: item.status,
    sortOrder: item.sort_order,
    publishedAt: item.published_at,
    updatedAt: item.updated_at,
  };
}
