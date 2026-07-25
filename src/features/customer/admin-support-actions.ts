"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const inputSchema = z.object({ id: z.uuid(), status: z.enum(["open", "in_progress", "resolved", "closed"]) });

export async function updateSupportStatus(requestId: string, formData: FormData) {
  const input = inputSchema.safeParse({ id: requestId, status: formData.get("status") });
  if (!input.success || !isSupabasePubliclyConfigured()) redirect("/admin/support?result=unavailable");
  try { await requireAdmin(); }
  catch (error) { if (error instanceof AuthorizationError) redirect("/admin/support?result=unauthorized"); throw error; }
  const resolvedAt = ["resolved", "closed"].includes(input.data.status) ? new Date().toISOString() : null;
  const result = await (await createClient()).from("support_requests").update({ status: input.data.status, resolved_at: resolvedAt }).eq("id", input.data.id).select("id").maybeSingle();
  revalidatePath("/admin/support");
  revalidatePath("/account");
  redirect(`/admin/support?result=${result.error || !result.data ? "error" : "updated"}`);
}
