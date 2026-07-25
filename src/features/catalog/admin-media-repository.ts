import "server-only";

import { z } from "zod";
import type { AdminMediaData } from "@/features/catalog/admin-media-types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const mediaRecordSchema = z.object({
  id: z.uuid(),
  media_type: z.enum(["image", "video", "demo"]),
  storage_path: z.string().nullable(),
  external_url: z.url().refine((value) => value.startsWith("https://"), "External media must use HTTPS.").nullable(),
  alt_text: z.string().nullable(),
  sort_order: z.number().int().nonnegative(),
  created_at: z.string(),
  system: z.object({
    id: z.uuid(),
    title: z.string(),
    slug: z.string(),
    status: z.enum(["draft", "published", "unlisted", "archived"]),
  }),
});

export async function getAdminMediaData(): Promise<AdminMediaData> {
  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", media: [] };
  }

  const supabase = await createClient();
  const result = await supabase
    .from("system_media")
    .select("id,media_type,storage_path,external_url,alt_text,sort_order,created_at,system:systems!inner(id,title,slug,status)")
    .order("created_at", { ascending: false });

  if (result.error) return { status: "error", media: [] };

  const records = z.array(mediaRecordSchema).safeParse(result.data);
  if (!records.success) return { status: "error", media: [] };

  const storagePaths = records.data.flatMap((item) => item.storage_path ? [item.storage_path] : []);
  const signedByPath = new Map<string, string>();

  if (storagePaths.length > 0) {
    const { data } = await supabase.storage
      .from("system-media")
      .createSignedUrls(storagePaths, 15 * 60);

    data?.forEach((item) => {
      if (item.path && item.signedUrl) signedByPath.set(item.path, item.signedUrl);
    });
  }

  return {
    status: "ready",
    media: records.data.map((item) => ({
      id: item.id,
      mediaType: item.media_type,
      source: item.storage_path ? "upload" : "external",
      previewUrl: item.storage_path ? signedByPath.get(item.storage_path) ?? null : null,
      externalUrl: item.external_url,
      altText: item.alt_text,
      sortOrder: item.sort_order,
      createdAt: item.created_at,
      system: {
        id: item.system.id,
        title: item.system.title,
        slug: item.system.slug,
        status: item.system.status,
      },
    })),
  };
}
