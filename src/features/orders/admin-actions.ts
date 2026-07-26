"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";

const updateOrderStatusSchema = z.object({
  orderId: z.uuid(),
  newStatus: z.enum(["verified", "rejected", "completed", "pending_verification"]),
  adminNotes: z.string().optional(),
});

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  if (!isSupabasePubliclyConfigured()) return;

  try {
    await requireAdmin();
  } catch {
    return;
  }

  const parsed = updateOrderStatusSchema.safeParse({
    orderId: String(formData.get("orderId") ?? ""),
    newStatus: String(formData.get("newStatus") ?? ""),
    adminNotes: String(formData.get("adminNotes") ?? ""),
  });

  if (!parsed.success) return;

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("update_order_manual_status", {
    p_order_id: parsed.data.orderId,
    p_new_status: parsed.data.newStatus,
    p_admin_notes: parsed.data.adminNotes || null,
  });

  if (error || data !== true) {
    return;
  }

  revalidatePath("/admin/orders");
}
