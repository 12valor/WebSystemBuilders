import "server-only";

import { z } from "zod";
import type { IntegrationHealthItem } from "@/features/admin/settings-types";
import { isInquirySubmissionConfigured } from "@/lib/env/inquiries";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

const emailSchema = z.email();

export function getIntegrationHealth(): IntegrationHealthItem[] {
  const supabase = isSupabasePubliclyConfigured() && hasMinimum(process.env.SUPABASE_SERVICE_ROLE_KEY, 20);
  const resend = hasMinimum(process.env.RESEND_API_KEY, 10) && emailSchema.safeParse(process.env.RESEND_FROM_EMAIL).success;
  const siteUrl = validSiteUrl(process.env.SITE_URL);

  return [
    item("supabase", "Supabase database and authentication", supabase, "Configuration presence only; live RLS and connectivity still require provider verification."),
    item("inquiries", "Inquiry security", isInquirySubmissionConfigured(), "Requires Supabase service access and a private fingerprint salt."),
    item("resend", "Resend transactional email", resend, "Requires a server API key and verified sender address."),
    item("site_url", "Canonical site origin", siteUrl, "Requires a valid HTTPS production origin or localhost during development."),
  ];
}

function item(id: IntegrationHealthItem["id"], label: string, configured: boolean, detail: string): IntegrationHealthItem {
  return { id, label, status: configured ? "configured" : "not_configured", detail, liveVerified: false };
}

function hasMinimum(value: string | undefined, minimum: number) { return typeof value === "string" && value.length >= minimum; }
function validSiteUrl(value: string | undefined) {
  const parsed = z.url().safeParse(value);
  if (!parsed.success) return false;
  const url = new URL(parsed.data);
  return url.protocol === "https:" || url.hostname === "localhost";
}