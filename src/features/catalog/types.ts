export type CatalogAudienceValue = "students" | "business" | "both";
export type CatalogPricingType = "fixed" | "starting" | "quotation";

export type CatalogCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  audience: CatalogAudienceValue;
  description: string | null;
};

export type CatalogSystemRecord = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  audience: CatalogAudienceValue;
  pricingType: CatalogPricingType;
  priceMinor: number | null;
  regularPriceMinor: number | null;
  salePriceMinor: number | null;
  saleActive: boolean;
  currency: string;
  featured: boolean;
  updatedAt: string;
  category: { name: string; slug: string } | null;
};

export type CatalogData = {
  status: "ready" | "unconfigured" | "error";
  categories: CatalogCategoryRecord[];
  systems: CatalogSystemRecord[];
};

export type CatalogSystemDetail = CatalogSystemRecord & {
  description: string | null;
  requirements: string | null;
  inclusions: string | null;
  exclusions: string | null;
  licenseSummary: string | null;
  supportSummary: string | null;
};

export type CatalogSystemDetailData = {
  status: CatalogData["status"];
  system: CatalogSystemDetail | null;
};
