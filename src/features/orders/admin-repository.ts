import "server-only";

import { z } from "zod";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const grantSchema = z.object({ expires_at: z.string(), max_downloads: z.number().int(), download_count: z.number().int(), revoked_at: z.string().nullable(), created_at: z.string() });
const fulfillmentSchema = z.object({ status: z.enum(["processing", "delivered", "failed", "revoked"]), attempt_count: z.number().int(), email_sent_at: z.string().nullable(), revoked_at: z.string().nullable(), download_grants: z.array(grantSchema) });
const orderRowSchema = z.object({
  id: z.uuid(),
  order_number: z.string(),
  customer_name: z.string(),
  customer_email: z.email(),
  contact_number: z.string().nullable().optional(),
  reference_number: z.string().nullable().optional(),
  proof_of_payment_url: z.string().nullable().optional(),
  admin_notes: z.string().nullable().optional(),
  status: z.enum(["pending_verification", "verified", "rejected", "completed", "pending", "paid", "failed", "expired", "cancelled", "refunded", "disputed"]),
  total_minor: z.number().int(),
  currency: z.string(),
  paid_at: z.string().nullable(),
  created_at: z.string(),
  order_items: z.array(z.object({ product_name: z.string(), version_label: z.string() })).min(1),
  fulfillments: z.array(fulfillmentSchema),
});

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  contactNumber: string | null;
  referenceNumber: string | null;
  proofOfPaymentUrl: string | null;
  adminNotes: string | null;
  status: z.infer<typeof orderRowSchema>["status"];
  totalMinor: number;
  currency: string;
  productName: string;
  versionLabel: string;
  paidAt: string | null;
  createdAt: string;
  delivery: null | {
    status: z.infer<typeof fulfillmentSchema>["status"];
    attemptCount: number;
    emailSentAt: string | null;
    expiresAt: string | null;
    downloadCount: number;
    maxDownloads: number;
  };
};

export type AdminOrdersData = { status: "ready" | "unconfigured" | "error"; orders: AdminOrder[] };

export async function getAdminOrdersData(): Promise<AdminOrdersData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", orders: [] };
  try { await requireAdmin(); }
  catch (error) { if (error instanceof AuthorizationError) throw error; throw error; }

  const supabase = await createClient();
  const result = await supabase.from("orders").select("id,order_number,customer_name,customer_email,contact_number,reference_number,proof_of_payment_url,admin_notes,status,total_minor,currency,paid_at,created_at,order_items(product_name,version_label),fulfillments(status,attempt_count,email_sent_at,revoked_at,download_grants(expires_at,max_downloads,download_count,revoked_at,created_at))").order("created_at", { ascending: false }).limit(100);
  const rows = z.array(orderRowSchema).safeParse(result.data);
  if (result.error || !rows.success) return { status: "error", orders: [] };

  return { status: "ready", orders: rows.data.map((row) => {
    const fulfillment = row.fulfillments[0] ?? null;
    const activeGrant = fulfillment?.download_grants
      .filter((grant) => !grant.revoked_at)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null;
    return {
      id: row.id,
      orderNumber: row.order_number,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      contactNumber: row.contact_number ?? null,
      referenceNumber: row.reference_number ?? null,
      proofOfPaymentUrl: row.proof_of_payment_url ?? null,
      adminNotes: row.admin_notes ?? null,
      status: row.status,
      totalMinor: row.total_minor,
      currency: row.currency,
      productName: row.order_items[0].product_name,
      versionLabel: row.order_items[0].version_label,
      paidAt: row.paid_at,
      createdAt: row.created_at,
      delivery: fulfillment ? {
        status: fulfillment.status, attemptCount: fulfillment.attempt_count, emailSentAt: fulfillment.email_sent_at,
        expiresAt: activeGrant?.expires_at ?? null, downloadCount: activeGrant?.download_count ?? 0,
        maxDownloads: activeGrant?.max_downloads ?? 0,
      } : null,
    };
  }) };
}