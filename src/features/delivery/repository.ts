import "server-only";

import { z } from "zod";
import { consumedFileSchema, downloadGrantRowSchema, type DownloadGrantRow } from "@/features/delivery/schemas";
import { hashDeliveryToken } from "@/features/delivery/token";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createAdminClient } from "@/lib/supabase/admin";

export type DownloadGrant = { orderNumber: string; productName: string; versionLabel: string; expiresAt: string; maxDownloads: number; downloadCount: number; files: { id: string; filename: string; byteSize: number | null }[] };

export async function getDownloadGrant(token: string): Promise<DownloadGrant | null> {
  if (!isSupabasePubliclyConfigured() || token.length < 32 || token.length > 128) return null;
  const result = await createAdminClient().rpc("get_download_grant_by_hash", { p_token_hash: hashDeliveryToken(token) });
  const rows = z.array(downloadGrantRowSchema).safeParse(result.data);
  if (result.error || !rows.success || rows.data.length === 0) return null;
  return mapGrant(rows.data);
}

export async function consumeDownload(token: string, fileId: string) {
  if (!isSupabasePubliclyConfigured() || token.length < 32 || token.length > 128 || !z.uuid().safeParse(fileId).success) return null;
  const supabase = createAdminClient();
  const result = await supabase.rpc("consume_download_grant", { p_token_hash: hashDeliveryToken(token), p_file_id: fileId });
  const rows = z.array(consumedFileSchema).safeParse(result.data);
  if (result.error || !rows.success || rows.data.length !== 1) return null;
  const file = rows.data[0];
  const signed = await supabase.storage.from(file.storage_bucket).createSignedUrl(file.storage_path, 60, { download: file.original_filename });
  if (signed.error || !signed.data.signedUrl) return null;
  return signed.data.signedUrl;
}

function mapGrant(rows: DownloadGrantRow[]): DownloadGrant {
  const first = rows[0];
  return { orderNumber: first.order_number, productName: first.product_name, versionLabel: first.version_label, expiresAt: first.expires_at, maxDownloads: first.max_downloads, downloadCount: first.download_count, files: rows.map((row) => ({ id: row.file_id, filename: row.original_filename, byteSize: row.byte_size })) };
}
