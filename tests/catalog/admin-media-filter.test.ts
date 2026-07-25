import { describe, expect, it } from "vitest";
import {
  filterAdminMedia,
  getAdminMediaMetrics,
} from "../../src/features/catalog/admin-media-filter";
import type { AdminMediaRecord } from "../../src/features/catalog/admin-media-types";

const media: AdminMediaRecord[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    mediaType: "image",
    source: "upload",
    previewUrl: "https://example.com/signed-image",
    externalUrl: null,
    altText: "POS checkout screen",
    sortOrder: 0,
    createdAt: "2026-07-25T00:00:00.000Z",
    system: {
      id: "20000000-0000-4000-8000-000000000001",
      title: "Retail POS",
      slug: "retail-pos",
      status: "published",
    },
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    mediaType: "demo",
    source: "external",
    previewUrl: null,
    externalUrl: "https://example.com/demo",
    altText: null,
    sortOrder: 1,
    createdAt: "2026-07-25T01:00:00.000Z",
    system: {
      id: "20000000-0000-4000-8000-000000000002",
      title: "Inventory Suite",
      slug: "inventory-suite",
      status: "draft",
    },
  },
];

describe("admin media workspace filtering", () => {
  it("searches media descriptions and owning systems", () => {
    expect(filterAdminMedia(media, {
      query: "retail",
      mediaType: "all",
      source: "all",
      systemStatus: "all",
    })).toEqual([media[0]]);
  });

  it("combines type, source, and lifecycle filters", () => {
    expect(filterAdminMedia(media, {
      query: "",
      mediaType: "demo",
      source: "external",
      systemStatus: "draft",
    })).toEqual([media[1]]);
  });

  it("summarizes sources and assets needing attention", () => {
    expect(getAdminMediaMetrics(media)).toEqual({
      total: 2,
      uploads: 1,
      external: 1,
      needsAttention: 1,
    });
  });
});
