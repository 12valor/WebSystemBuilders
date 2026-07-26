import "server-only";

import { cache } from "react";
import { z } from "zod";
import { approvedCompanyProfile, toPublicCompanyProfile } from "@/features/content/company-profile-defaults";
import type { AdminCompanyProfileData, CompanyProfile, PublicCompanyProfile } from "@/features/content/company-profile-types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient, createPublicClient } from "@/lib/supabase/server";

const rowSchema = z.object({ id: z.literal(1), company_summary: z.string(), founder_bio: z.string(), public_email: z.string().nullable(), public_phone: z.string().nullable(), status: z.enum(["draft", "published", "archived"]), published_at: z.string().nullable(), updated_at: z.string() });
const columns = "id,company_summary,founder_bio,public_email,public_phone,status,published_at,updated_at";

export async function getAdminCompanyProfileData(): Promise<AdminCompanyProfileData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", profile: approvedCompanyProfile };
  const supabase = await createClient();
  const result = await supabase.from("company_profile").select(columns).eq("id", 1).maybeSingle();
  if (result.error || !result.data) return { status: "error", profile: approvedCompanyProfile };
  const row = rowSchema.safeParse(result.data);
  return row.success ? { status: "ready", profile: mapProfile(row.data) } : { status: "error", profile: approvedCompanyProfile };
}

export const getPublicCompanyProfile = cache(async (): Promise<PublicCompanyProfile> => {
  const fallback = toPublicCompanyProfile(approvedCompanyProfile);
  if (!isSupabasePubliclyConfigured()) return fallback;
  const supabase = createPublicClient();
  const result = await supabase.from("company_profile").select(columns).eq("id", 1).eq("status", "published").maybeSingle();
  if (result.error || !result.data) return fallback;
  const row = rowSchema.safeParse(result.data);
  return row.success ? toPublicCompanyProfile(mapProfile(row.data)) : fallback;
});

function mapProfile(row: z.infer<typeof rowSchema>): CompanyProfile {
  return { id: 1, brandName: "WebSystemBuilders", companySummary: row.company_summary, founderName: "AG Evangelista", founderTitle: "Web Developer", founderBio: row.founder_bio, publicEmail: row.public_email, publicPhone: row.public_phone, status: row.status, publishedAt: row.published_at, updatedAt: row.updated_at };
}
