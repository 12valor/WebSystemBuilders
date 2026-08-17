import { z } from "zod";

export const orderStatusRowSchema = z.object({
  order_number: z.string(),
  status: z.enum(["pending_verification", "verified", "rejected", "completed", "pending", "paid", "failed", "expired", "cancelled", "refunded", "disputed"]),
  total_minor: z.number().int().nonnegative(),
  currency: z.string().length(3),
  product_name: z.string(),
  version_label: z.string(),
  created_at: z.string(),
  paid_at: z.string().nullable(),
});
