import { z } from "zod";

export const checkoutFormSchema = z.object({
  systemSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  customerName: z.string().trim().min(2, "Enter your full name.").max(120),
  customerEmail: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  termsAccepted: z.literal("on", { message: "Accept the terms to continue." }),
  licenseAccepted: z.literal("on", { message: "Confirm the license review to continue." }),
  refundAccepted: z.literal("on", { message: "Confirm the refund policy review to continue." }),
  deliveryAccepted: z.literal("on", { message: "Confirm the delivery policy review to continue." }),
});

export type CheckoutField = keyof z.input<typeof checkoutFormSchema>;

export const pendingOrderRowSchema = z.object({
  order_id: z.uuid(),
  order_number: z.string(),
  payment_id: z.uuid(),
  product_name: z.string(),
  version_label: z.string(),
  amount_minor: z.number().int().positive(),
  currency: z.string().length(3),
});

export const orderStatusRowSchema = z.object({
  order_number: z.string(),
  status: z.enum(["pending", "paid", "failed", "expired", "cancelled", "refunded", "disputed"]),
  total_minor: z.number().int().nonnegative(),
  currency: z.string().length(3),
  product_name: z.string(),
  version_label: z.string(),
  created_at: z.string(),
  paid_at: z.string().nullable(),
});
