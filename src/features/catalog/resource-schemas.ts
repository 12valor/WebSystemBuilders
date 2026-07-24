import { z } from "zod";

export const catalogResourceIdSchema = z.uuid();

export const featureInputSchema = z.object({
  label: z.string().trim().min(2, "Enter at least 2 characters.").max(180),
});

export const externalMediaInputSchema = z.object({
  mediaType: z.enum(["video", "demo"]),
  externalUrl: z.url("Enter a valid HTTPS URL.").refine((value) => value.startsWith("https://"), "Use an HTTPS URL."),
  altText: z.string().trim().min(2, "Describe the media.").max(240),
});

export const versionInputSchema = z.object({
  versionLabel: z.string().trim().min(1, "Enter a version label.").max(40),
  releaseNotes: z.string().trim().max(5000).transform((value) => value || null),
  makeCurrent: z.boolean(),
});

export const mediaUploadRequestSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  fileSize: z.number().int().positive().max(10 * 1024 * 1024, "Images must be 10 MB or smaller."),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"], {
    message: "Upload a JPG, PNG, or WebP image.",
  }),
  altText: z.string().trim().min(2, "Describe the image.").max(240),
});

export const deliverableUploadRequestSchema = z.object({
  versionId: z.uuid(),
  fileName: z.string().trim().min(1).max(255).refine(
    (value) => value.toLowerCase().endsWith(".zip"),
    "Upload a ZIP archive.",
  ),
  fileSize: z.number().int().positive().max(250 * 1024 * 1024, "ZIP files must be 250 MB or smaller."),
  contentType: z.enum(["application/zip", "application/x-zip-compressed", "application/octet-stream"], {
    message: "Upload a ZIP archive.",
  }),
});

export const confirmUploadSchema = z.object({
  storagePath: z.string().min(1).max(1024),
  originalFileName: z.string().trim().min(1).max(255),
  expectedSize: z.number().int().positive(),
  expectedContentType: z.string().min(1).max(120),
  altText: z.string().trim().min(2).max(240).optional(),
  versionId: z.uuid().optional(),
});
