import type { SystemDraftInput } from "@/features/catalog/system-draft-schema";

export type PublicationAssets = {
  featureCount: number;
  mediaCount: number;
  hasCurrentDeliverable: boolean;
};

export type PublicationContext = {
  paypalConfigured: boolean;
};

type PublicationCandidate = Pick<
  SystemDraftInput,
  | "productType"
  | "pricingType"
  | "description"
  | "inclusions"
  | "exclusions"
  | "technologyStack"
  | "deliverySummary"
  | "licenseSummary"
  | "supportSummary"
  | "paymentQrUrl"
  | "paymentInstructions"
>;

export function getPublicationIssues(
  system: PublicationCandidate,
  assets: PublicationAssets,
  context: PublicationContext,
): string[] {
  const issues: string[] = [];

  if (!system.description) issues.push("Add a full product description.");
  if (!system.inclusions) issues.push("Define the package inclusions.");
  if (!system.exclusions) issues.push("Define the package exclusions.");
  if (system.technologyStack.length < 1) issues.push("Add at least one technology.");
  if (!system.deliverySummary) issues.push("Add the delivery summary.");
  if (!system.licenseSummary) issues.push("Add the customer-facing license summary.");
  if (!system.supportSummary) issues.push("Add the support summary.");
  if (assets.featureCount < 1) issues.push("Add at least one customer-facing feature.");
  if (assets.mediaCount < 1) issues.push("Add at least one product media item.");

  const requiresCheckout = system.pricingType === "fixed" && system.productType !== "custom_service";
  const manualPaymentConfigured = Boolean(system.paymentQrUrl?.trim() && system.paymentInstructions?.trim());
  if (requiresCheckout && !context.paypalConfigured && !manualPaymentConfigured) {
    issues.push("Configure PayPal Checkout or add both a GCash / QRPH QR image and payment instructions.");
  }

  if (
    system.productType !== "custom_service" &&
    !assets.hasCurrentDeliverable
  ) {
    issues.push("Attach a private file to the current product version.");
  }

  return issues;
}
