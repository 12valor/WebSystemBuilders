import { z } from "zod";

export const deliveryRowSchema = z.object({
  fulfillment_id: z.uuid(), order_id: z.uuid(), order_number: z.string(), customer_name: z.string(),
  customer_email: z.email(), product_name: z.string(), version_label: z.string(), file_id: z.uuid(),
  original_filename: z.string(), byte_size: z.number().int().nullable(), expires_at: z.string(),
  max_downloads: z.number().int().positive(),
});

export const downloadGrantRowSchema = z.object({
  grant_id: z.uuid(), order_number: z.string(), product_name: z.string(), version_label: z.string(),
  expires_at: z.string(), max_downloads: z.number().int().positive(), download_count: z.number().int().nonnegative(),
  file_id: z.uuid(), original_filename: z.string(), byte_size: z.number().int().nullable(),
});

export const consumedFileSchema = z.object({ storage_bucket: z.string(), storage_path: z.string(), original_filename: z.string() });
export type DeliveryRow = z.infer<typeof deliveryRowSchema>;
export type DownloadGrantRow = z.infer<typeof downloadGrantRowSchema>;
