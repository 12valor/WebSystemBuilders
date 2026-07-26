import { z } from "zod";

export const scanToPayFormSchema = z.object({
  systemSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  customerName: z.string().trim().min(2, "Enter your full name.").max(120),
  customerEmail: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  contactNumber: z.string().trim().max(30).optional().or(z.literal("")),
  referenceNumber: z.string().trim().min(3, "Enter your payment reference number.").max(100).optional().default("0000000"),
  proofOfPaymentUrl: z.string().optional().default(""),
  termsAccepted: z.literal("on", { message: "Accept the terms to continue." }),
  licenseAccepted: z.literal("on", { message: "Confirm the license review to continue." }),
  refundAccepted: z.literal("on", { message: "Confirm the refund policy review to continue." }),
  deliveryAccepted: z.literal("on", { message: "Confirm the delivery policy review to continue." }),
});

export const checkoutFormSchema = scanToPayFormSchema;

export type ScanToPayField = keyof z.input<typeof scanToPayFormSchema>;
export type CheckoutField = ScanToPayField;

export const scanToPayOrderRowSchema = z.object({
  order_id: z.uuid(),
  order_number: z.string(),
  product_name: z.string(),
  version_label: z.string(),
  amount_minor: z.number().int().positive(),
  currency: z.string().length(3),
});

export const pendingOrderRowSchema = scanToPayOrderRowSchema;

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
