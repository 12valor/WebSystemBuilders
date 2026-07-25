import { describe, expect, it } from "vitest";
import {
  categoryInputSchema,
  isCategoryAudienceCompatible,
} from "../../src/features/admin/category-schema";

describe("admin category validation", () => {
  it("normalizes a valid category record", () => {
    const result = categoryInputSchema.parse({
      name: " Inventory Management ",
      slug: "inventory-management",
      audience: "business",
      description: " ",
      sortOrder: "20",
      isActive: true,
    });

    expect(result.name).toBe("Inventory Management");
    expect(result.description).toBeNull();
    expect(result.sortOrder).toBe(20);
  });

  it("rejects unsafe slugs and negative sort order", () => {
    expect(categoryInputSchema.safeParse({
      name: "Inventory",
      slug: "Inventory Management",
      audience: "business",
      description: "Stock control",
      sortOrder: -1,
      isActive: true,
    }).success).toBe(false);
  });

  it("keeps linked system audiences compatible", () => {
    expect(isCategoryAudienceCompatible("both", "students")).toBe(true);
    expect(isCategoryAudienceCompatible("business", "business")).toBe(true);
    expect(isCategoryAudienceCompatible("business", "students")).toBe(false);
    expect(isCategoryAudienceCompatible("students", "both")).toBe(false);
  });
});
