"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prepareOrderDelivery, resendOrderDelivery } from "@/features/delivery/service";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";

const orderIdSchema = z.uuid();

export async function prepareDelivery(orderId: string, _formData: FormData) {
  void _formData;
  const id = orderIdSchema.safeParse(orderId);
  if (!id.success || !isSupabasePubliclyConfigured()) redirect("/admin/orders?result=unavailable");
  try { await requireAdmin(); }
  catch (error) { if (error instanceof AuthorizationError) redirect("/admin/orders?result=unauthorized"); throw error; }
  const result = await prepareOrderDelivery(id.data);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders?result=${result.status}`);
}

export async function resendDelivery(orderId: string, _formData: FormData) {
  void _formData;
  const id = orderIdSchema.safeParse(orderId);
  if (!id.success || !isSupabasePubliclyConfigured()) redirect("/admin/orders?result=unavailable");
  try { await requireAdmin(); }
  catch (error) { if (error instanceof AuthorizationError) redirect("/admin/orders?result=unauthorized"); throw error; }
  const result = await resendOrderDelivery(id.data);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders?result=${result.status}`);
}

export async function revokeDelivery(orderId: string, _formData: FormData) {
  void _formData;
  const id = orderIdSchema.safeParse(orderId);
  if (!id.success || !isSupabasePubliclyConfigured()) redirect("/admin/orders?result=unavailable");
  let actorId: string;
  try { actorId = (await requireAdmin()).identity.id; }
  catch (error) { if (error instanceof AuthorizationError) redirect("/admin/orders?result=unauthorized"); throw error; }
  const result = await createAdminClient().rpc("revoke_delivery", { p_order_id: id.data, p_actor_user_id: actorId });
  revalidatePath("/admin/orders");
  redirect(`/admin/orders?result=${result.error || result.data !== true ? "error" : "revoked"}`);
}
