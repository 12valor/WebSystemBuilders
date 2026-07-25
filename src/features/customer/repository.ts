import "server-only";

import { z } from "zod";
import { portalOrderRowSchema, supportRowSchema } from "@/features/customer/schema";
import { createClient } from "@/lib/supabase/server";

export type CustomerPortalOrder = z.infer<typeof portalOrderRowSchema>;
export type CustomerSupportRequest = z.infer<typeof supportRowSchema>;
export type CustomerPortalData = { status: "ready" | "error"; orders: CustomerPortalOrder[]; supportRequests: CustomerSupportRequest[] };

export async function getCustomerPortalData(): Promise<CustomerPortalData> {
  const supabase = await createClient();
  const claim = await supabase.rpc("claim_customer_orders");
  if (claim.error) return { status: "error", orders: [], supportRequests: [] };
  const [ordersResult, supportResult] = await Promise.all([
    supabase.rpc("get_customer_portal"),
    supabase.from("support_requests").select("id,order_id,subject,status,created_at,updated_at").order("created_at", { ascending: false }),
  ]);
  const orders = z.array(portalOrderRowSchema).safeParse(ordersResult.data);
  const support = z.array(supportRowSchema).safeParse(supportResult.data);
  if (ordersResult.error || supportResult.error || !orders.success || !support.success) return { status: "error", orders: [], supportRequests: [] };
  return { status: "ready", orders: orders.data, supportRequests: support.data };
}
