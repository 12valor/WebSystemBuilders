import "server-only";

import { z } from "zod";
import { orderStatusRowSchema } from "@/features/orders/status-schema";
import { hashOrderReturnToken } from "@/features/orders/token";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";

export type PublicOrderStatus = z.infer<typeof orderStatusRowSchema>;

export async function getPublicOrderStatus(orderNumber: string, token: string): Promise<PublicOrderStatus | null> {
  if (!isSupabasePubliclyConfigured() || token.length < 32 || token.length > 128) return null;
  const supabase = createAdminClient();
  const result = await supabase.rpc("get_order_status_by_token", {
    p_order_number: orderNumber,
    p_return_token_hash: hashOrderReturnToken(token),
  });
  const parsed = z.array(orderStatusRowSchema).safeParse(result.data);
  if (result.error || !parsed.success || parsed.data.length !== 1) return null;
  return parsed.data[0];
}
