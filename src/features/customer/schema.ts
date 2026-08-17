import { z } from "zod";

export const portalOrderRowSchema = z.object({
  order_id: z.uuid(),
  order_number: z.string(),
  order_status: z.enum(["pending_verification", "verified", "rejected", "completed", "pending", "paid", "failed", "expired", "cancelled", "refunded", "disputed"]),
  total_minor: z.number().int(),
  currency: z.string(),
  product_name: z.string(),
  product_slug: z.string(),
  purchased_version: z.string(),
  current_version: z.string().nullable(),
  created_at: z.string(),
  paid_at: z.string().nullable(),
  payment_provider: z.enum(["paypal", "paymongo", "manual"]).nullable(),
  payment_status: z.enum(["pending", "processing", "paid", "failed", "expired", "cancelled", "refunded", "disputed"]).nullable(),
  provider_order_id: z.string().nullable(),
  provider_payment_id: z.string().nullable(),
  fulfillment_status: z.enum(["processing", "delivered", "failed", "revoked"]).nullable(),
  delivery_available: z.boolean().nullable(),
});

export const supportRowSchema = z.object({
  id: z.uuid(),
  order_id: z.uuid(),
  subject: z.string(),
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
  created_at: z.string(),
  updated_at: z.string(),
});

export const supportRequestSchema = z.object({
  orderId: z.uuid("Select a valid order."),
  subject: z.string().trim().min(5, "Add a more specific subject.").max(140),
  message: z.string().trim().min(20, "Describe the issue in at least 20 characters.").max(4000),
});
