import { describe, expect, it } from "vitest";
import {
  deliverableUploadRequestSchema,
  externalMediaInputSchema,
  mediaUploadRequestSchema,
} from "../../src/features/catalog/resource-schemas";

describe("catalog resource validation", () => {
  it("requires HTTPS for external media", () => {
    const insecure = externalMediaInputSchema.safeParse({
      mediaType: "demo",
      externalUrl: "http://example.com/demo",
      altText: "Inventory system demonstration",
    });
    expect(insecure.success).toBe(false);
  });

  it("accepts only supported product image types and sizes", () => {
    const valid = mediaUploadRequestSchema.safeParse({
      fileName: "dashboard.webp",
      fileSize: 1024,
      contentType: "image/webp",
      altText: "Dashboard showing inventory totals",
    });
    const invalid = mediaUploadRequestSchema.safeParse({
      fileName: "dashboard.svg",
      fileSize: 1024,
      contentType: "image/svg+xml",
      altText: "Dashboard",
    });
    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it("requires ZIP deliverables owned by a version and accepts standard ZIP mime types", () => {
    const validTypes = [
      "application/zip",
      "application/x-zip-compressed",
      "application/octet-stream",
      "application/x-zip",
      "multipart/x-zip",
      "application/zip-compressed",
    ];

    for (const contentType of validTypes) {
      const valid = deliverableUploadRequestSchema.safeParse({
        versionId: "11111111-1111-4111-8111-111111111111",
        fileName: "inventory-system.zip",
        fileSize: 5_000_000,
        contentType,
      });
      expect(valid.success).toBe(true);
    }

    const invalidExtension = deliverableUploadRequestSchema.safeParse({
      versionId: "11111111-1111-4111-8111-111111111111",
      fileName: "inventory-system.exe",
      fileSize: 5_000_000,
      contentType: "application/octet-stream",
    });
    expect(invalidExtension.success).toBe(false);

    const invalidVersion = deliverableUploadRequestSchema.safeParse({
      versionId: "",
      fileName: "inventory-system.zip",
      fileSize: 5_000_000,
      contentType: "application/zip",
    });
    expect(invalidVersion.success).toBe(false);
  });
});
