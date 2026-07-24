import { describe, expect, it } from "vitest";
import { getPublicationIssues } from "../../src/features/catalog/publication-readiness";

const completeSystem = {
  productType: "ready_made" as const,
  description: "A complete overview.",
  inclusions: "Source code and setup guide.",
  exclusions: "Hosting and third-party subscriptions.",
  licenseSummary: "Single-business commercial source license.",
  supportSummary: "Support boundaries are shown before purchase.",
};

describe("catalog publication readiness", () => {
  it("accepts a complete ready-made system", () => {
    expect(
      getPublicationIssues(completeSystem, {
        featureCount: 3,
        mediaCount: 2,
        hasCurrentDeliverable: true,
      }),
    ).toEqual([]);
  });

  it("reports missing trust and delivery requirements", () => {
    const issues = getPublicationIssues(
      { ...completeSystem, description: null, licenseSummary: null },
      { featureCount: 0, mediaCount: 0, hasCurrentDeliverable: false },
    );

    expect(issues).toContain("Add a full product description.");
    expect(issues).toContain("Add the customer-facing license summary.");
    expect(issues).toContain("Add at least one customer-facing feature.");
    expect(issues).toContain("Add at least one product media item.");
    expect(issues).toContain("Attach a private file to the current product version.");
  });

  it("does not require a delivery file for custom services", () => {
    expect(
      getPublicationIssues(
        { ...completeSystem, productType: "custom_service" },
        { featureCount: 1, mediaCount: 1, hasCurrentDeliverable: false },
      ),
    ).toEqual([]);
  });
});
