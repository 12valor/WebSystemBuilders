import { describe, expect, it } from "vitest";
import { getPublicationIssues } from "../../src/features/catalog/publication-readiness";

const completeSystem = {
  productType: "ready_made" as const,
  pricingType: "fixed" as const,
  description: "A complete overview.",
  inclusions: "Source code and setup guide.",
  exclusions: "Hosting and third-party subscriptions.",
  technologyStack: ["Next.js", "TypeScript", "Supabase"],
  deliverySummary: "Private download access after verified payment.",
  licenseSummary: "Single-business commercial source license.",
  supportSummary: "Support boundaries are shown before purchase.",
  paymentQrUrl: null,
  paymentInstructions: null,
};

describe("catalog publication readiness", () => {
  it("accepts a complete ready-made system", () => {
    expect(
      getPublicationIssues(completeSystem, {
        featureCount: 3,
        mediaCount: 2,
        hasCurrentDeliverable: true,
      }, { paypalConfigured: true }),
    ).toEqual([]);
  });

  it("reports missing trust and delivery requirements", () => {
    const issues = getPublicationIssues(
      { ...completeSystem, description: null, technologyStack: [], deliverySummary: null, licenseSummary: null },
      { featureCount: 0, mediaCount: 0, hasCurrentDeliverable: false },
      { paypalConfigured: false },
    );

    expect(issues).toContain("Add a full product description.");
    expect(issues).toContain("Add at least one technology.");
    expect(issues).toContain("Add the delivery summary.");
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
        { paypalConfigured: false },
      ),
    ).toEqual([]);
  });

  it("does not require checkout configuration for quotation products", () => {
    expect(
      getPublicationIssues(
        { ...completeSystem, pricingType: "quotation" },
        { featureCount: 1, mediaCount: 1, hasCurrentDeliverable: true },
        { paypalConfigured: false },
      ),
    ).toEqual([]);
  });

  it("accepts PayPal as the only method for a fixed-price product", () => {
    expect(
      getPublicationIssues(
        completeSystem,
        { featureCount: 1, mediaCount: 1, hasCurrentDeliverable: true },
        { paypalConfigured: true },
      ),
    ).toEqual([]);
  });

  it("accepts a complete manual fallback when PayPal is unavailable", () => {
    expect(
      getPublicationIssues(
        {
          ...completeSystem,
          paymentQrUrl: "https://example.com/payment-qr.png",
          paymentInstructions: "Pay using GCash and submit the transaction reference.",
        },
        { featureCount: 1, mediaCount: 1, hasCurrentDeliverable: true },
        { paypalConfigured: false },
      ),
    ).toEqual([]);
  });

  it("blocks direct publication when neither checkout method is configured", () => {
    expect(
      getPublicationIssues(
        completeSystem,
        { featureCount: 1, mediaCount: 1, hasCurrentDeliverable: true },
        { paypalConfigured: false },
      ),
    ).toContain("Configure PayPal Checkout or add both a GCash / QRPH QR image and payment instructions.");
  });
});
