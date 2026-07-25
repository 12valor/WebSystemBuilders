import "server-only";

import { z } from "zod";
import type { AdminTestimonialData, PublicTestimonial, TestimonialItem } from "@/features/content/testimonial-types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const testimonialRowSchema = z.object({
  id: z.uuid(), quote: z.string(), attribution_name: z.string(), attribution_role: z.string().nullable(),
  attribution_organization: z.string().nullable(), relationship_context: z.string(), is_featured: z.boolean(),
  status: z.enum(["draft", "published", "archived"]), sort_order: z.number().int(), published_at: z.string().nullable(), updated_at: z.string(),
});

const verificationRowSchema = z.object({
  testimonial_id: z.uuid(), source_reference: z.string(), permission_confirmed_at: z.string().nullable(),
});

const columns = "id,quote,attribution_name,attribution_role,attribution_organization,relationship_context,is_featured,status,sort_order,published_at,updated_at";

export async function getAdminTestimonialData(): Promise<AdminTestimonialData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", items: [] };
  const supabase = await createClient();
  const [contentResult, verificationResult] = await Promise.all([
    supabase.from("testimonials").select(columns).order("is_featured", { ascending: false }).order("sort_order").order("created_at"),
    supabase.from("testimonial_verifications").select("testimonial_id,source_reference,permission_confirmed_at"),
  ]);
  if (contentResult.error || verificationResult.error) return { status: "error", items: [] };
  const rows = z.array(testimonialRowSchema).safeParse(contentResult.data);
  const verifications = z.array(verificationRowSchema).safeParse(verificationResult.data);
  if (!rows.success || !verifications.success) return { status: "error", items: [] };
  const byId = new Map(verifications.data.map((item) => [item.testimonial_id, item]));
  if (rows.data.some((row) => !byId.has(row.id))) return { status: "error", items: [] };
  return { status: "ready", items: rows.data.map((row) => mapAdminItem(row, byId.get(row.id)!)) };
}

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  if (!isSupabasePubliclyConfigured()) return [];
  const supabase = await createClient();
  const result = await supabase.from("testimonials").select(columns).eq("status", "published")
    .order("is_featured", { ascending: false }).order("sort_order").order("published_at", { ascending: false });
  if (result.error) return [];
  const rows = z.array(testimonialRowSchema).safeParse(result.data);
  if (!rows.success) return [];
  return rows.data.map((row) => ({
    id: row.id, quote: row.quote, attributionName: row.attribution_name, attributionRole: row.attribution_role,
    attributionOrganization: row.attribution_organization, relationshipContext: row.relationship_context, isFeatured: row.is_featured,
  }));
}

function mapAdminItem(row: z.infer<typeof testimonialRowSchema>, verification: z.infer<typeof verificationRowSchema>): TestimonialItem {
  return {
    id: row.id, quote: row.quote, attributionName: row.attribution_name, attributionRole: row.attribution_role,
    attributionOrganization: row.attribution_organization, relationshipContext: row.relationship_context,
    verificationReference: verification.source_reference, permissionConfirmedAt: verification.permission_confirmed_at,
    isFeatured: row.is_featured, status: row.status, sortOrder: row.sort_order, publishedAt: row.published_at, updatedAt: row.updated_at,
  };
}
