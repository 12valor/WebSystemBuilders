"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createDeliveryToken } from "@/features/delivery/token";
import { supportRequestSchema } from "@/features/customer/schema";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export async function openPortalDownload(orderId: string, _formData: FormData) {
  void _formData;
  if (!isSupabasePubliclyConfigured() || !(await getCurrentIdentity())) redirect("/auth/sign-in?next=/account");
  const token = createDeliveryToken();
  const result = await (await createClient()).rpc("create_portal_download_grant", { p_order_id: orderId, p_token_hash: token.hash });
  if (result.error || result.data !== true) redirect("/account?result=download-unavailable#downloads");
  redirect(`/downloads/${token.token}`);
}

export async function createSupportRequest(_previousState: CustomerSupportState, formData: FormData): Promise<CustomerSupportState> {
  if (!isSupabasePubliclyConfigured()) return { status: "unavailable", message: "Support is not configured in this environment." };
  const identity = await getCurrentIdentity();
  if (!identity) return { status: "error", message: "Sign in again before creating a support request." };
  const values = { orderId: String(formData.get("orderId") ?? ""), subject: String(formData.get("subject") ?? ""), message: String(formData.get("message") ?? "") };
  const parsed = supportRequestSchema.safeParse(values);
  if (!parsed.success) return { status: "error", message: "Review the support request.", values, fieldErrors: parsed.error.flatten().fieldErrors };
  const supabase = await createClient();
  const recentWindow = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const recent = await supabase.from("support_requests").select("id", { count: "exact", head: true }).eq("customer_user_id", identity.id).gte("created_at", recentWindow);
  if (recent.error) return { status: "unavailable", message: "Support availability could not be verified.", values };
  if ((recent.count ?? 0) >= 5) return { status: "error", message: "Too many support requests were created recently. Please wait before trying again.", values };
  const result = await supabase.from("support_requests").insert({ customer_user_id: identity.id, order_id: parsed.data.orderId, subject: parsed.data.subject, message: parsed.data.message });
  if (result.error) return { status: "error", message: "The request could not be linked to this account and order.", values };
  revalidatePath("/account");
  return { status: "success", message: "Your order-linked support request was created." };
}

export type CustomerSupportState = {
  status: "idle" | "success" | "error" | "unavailable";
  message?: string;
  values?: { orderId?: string; subject?: string; message?: string };
  fieldErrors?: Partial<Record<"orderId" | "subject" | "message", string[]>>;
};
