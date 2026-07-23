export type CatalogAudience = "All audiences" | "Students" | "Business";

export type CatalogCategory = {
  name: string;
  audience: Exclude<CatalogAudience, "All audiences"> | "Students + Business";
  description: string;
};

export const catalogAudiences: CatalogAudience[] = [
  "All audiences",
  "Students",
  "Business",
];

export const catalogCategories: CatalogCategory[] = [
  {
    name: "Point of sale",
    audience: "Business",
    description: "Sales, transaction, and operational workflows.",
  },
  {
    name: "Inventory management",
    audience: "Business",
    description: "Stock, movement, and inventory record workflows.",
  },
  {
    name: "Warehouse management",
    audience: "Business",
    description: "Receiving, storage, tracking, and warehouse operations.",
  },
  {
    name: "Capstone systems",
    audience: "Students",
    description: "Technical foundations for ethical project development.",
  },
  {
    name: "Thesis-related systems",
    audience: "Students",
    description: "Systems and guidance that respect academic requirements.",
  },
];

export const catalogPricingModes = [
  "All pricing",
  "Fixed price",
  "Starting price",
  "Request a quote",
] as const;
