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

export type AdminCatalogData = {
  status: "ready" | "unconfigured" | "error";
  categories: AdminCategoryRecord[];
  systems: AdminSystemRecord[];
};
