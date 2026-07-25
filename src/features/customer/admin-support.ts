import "server-only";

import { z } from "zod";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const rowSchema = z.object({
  id: z.uuid(), subject: z.string(), message: z.string(), status: z.enum(["open", "in_progress", "resolved", "closed"]),
  created_at: z.string(), updated_at: z.string(), order: z.object({ order_number: z.string(), customer_email: z.email() }),
});
export type AdminSupportRequest = z.infer<typeof rowSchema>;
export type AdminSupportData = { status: "ready" | "unconfigured" | "error"; requests: AdminSupportRequest[] };

export async function getAdminSupportData(): Promise<AdminSupportData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", requests: [] };
  try { await requireAdmin(); }
  catch (error) { if (error instanceof AuthorizationError) throw error; throw error; }
  const result = await (await createClient()).from("support_requests").select("id,subject,message,status,created_at,updated_at,order:orders!inner(order_number,customer_email)").order("created_at", { ascending: false }).limit(100);
  const rows = z.array(rowSchema).safeParse(result.data);
  if (result.error || !rows.success) return { status: "error", requests: [] };
  return { status: "ready", requests: rows.data };
}
