import type { CatalogAudienceValue, CatalogPricingType } from "@/features/catalog/types";

export type AdminCategoryRecord = {
  id: string;
  name: string;
  audience: CatalogAudienceValue;
};

export type AdminSystemRecord = {
  id: string;
  title: string;
  slug: string;
  audience: CatalogAudienceValue;
  pricingType: CatalogPricingType;
  priceMinor: number | null;
  currency: string;
  status: "draft" | "published" | "unlisted" | "archived";
  updatedAt: string;
  categoryName: string | null;
};

export type AdminEditableSystem = AdminSystemRecord & {
  categoryId: string | null;
  productType: "ready_made" | "customizable_template" | "custom_service";
  summary: string;
  description: string | null;
  regularPriceMinor: number | null;
  salePriceMinor: number | null;
  saleActive: boolean;
  inclusions: string | null;
  exclusions: string | null;
  requirements: string | null;
  licenseSummary: string | null;
  supportSummary: string | null;
  publishedAt: string | null;
};

export type AdminCatalogData = {
  status: "ready" | "unconfigured" | "error";
  categories: AdminCategoryRecord[];
  systems: AdminSystemRecord[];
};

export type AdminSystemFeature = {
  id: string;
  label: string;
  sortOrder: number;
};

export type AdminSystemMedia = {
  id: string;
  mediaType: "image" | "video" | "demo";
  storagePath: string | null;
  externalUrl: string | null;
  altText: string | null;
  sortOrder: number;
};

export type AdminSystemFile = {
  id: string;
  storagePath: string;
  originalFilename: string;
  byteSize: number | null;
  sha256: string | null;
};

export type AdminSystemVersion = {
  id: string;
  versionLabel: string;
  releaseNotes: string | null;
  isCurrent: boolean;
  releasedAt: string | null;
  files: AdminSystemFile[];
};

export type AdminSystemResources = {
  features: AdminSystemFeature[];
  media: AdminSystemMedia[];
  versions: AdminSystemVersion[];
};

export type AdminSystemEditorData = {
  status: "ready" | "unconfigured" | "error" | "not_found";
  categories: AdminCategoryRecord[];
  system: AdminEditableSystem | null;
  resources: AdminSystemResources;
};
