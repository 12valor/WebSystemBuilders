import { describe, expect, it } from "vitest";
import { systemDraftInputSchema } from "../../src/features/catalog/system-draft-schema";

const validDraft = {
  title: "Inventory system",
  slug: "inventory-system",
  audience: "business",
  categoryId: "11111111-1111-4111-8111-111111111111",
  productType: "ready_made",
  summary: "Track stock movement and inventory availability.",
  description: "",
  pricingType: "fixed",
  regularPrice: "12500.00",
  salePrice: "",
  saleActive: false,
  inclusions: "",
  exclusions: "",
  requirements: "",
  licenseSummary: "",
  supportSummary: "",
} as const;

describe("system draft validation", () => {
  it("normalizes a valid fixed-price draft", () => {
    const result = systemDraftInputSchema.parse(validDraft);
    expect(result.priceMinor).toBe(1_250_000);
    expect(result.regularPriceMinor).toBe(1_250_000);
    expect(result.description).toBeNull();
  });

  it("requires a lower sale amount before activation", () => {
    const missing = systemDraftInputSchema.safeParse({ ...validDraft, saleActive: true });
    const higher = systemDraftInputSchema.safeParse({ ...validDraft, saleActive: true, salePrice: "13000" });
    expect(missing.success).toBe(false);
    expect(higher.success).toBe(false);
  });

  it("keeps quotation products free of catalog prices", () => {
    const invalid = systemDraftInputSchema.safeParse({ ...validDraft, pricingType: "quotation" });
    const valid = systemDraftInputSchema.parse({ ...validDraft, pricingType: "quotation", regularPrice: "" });
    expect(invalid.success).toBe(false);
    expect(valid.priceMinor).toBeNull();
  });
});
