import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Refund Policy & Remedies",
  description: "WebSystemBuilders Refund Policy — guidelines on digital purchases, material defect corrections, and statutory remedies.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Refunds & Remedies"
      title="Refund Policy & Remedies"
      description="Effective date: August 7, 2026 — Clear guidelines regarding digital software purchases, material defect resolutions, and statutory consumer remedies."
      sideNote={{
        title: "Digital Purchase Notice",
        text: "Due to the irrevocable nature of downloadable source code, change-of-mind refunds are not supported once files are accessed. Material defects are fully eligible for remedy or refund.",
      }}
      sections={[
        {
          title: "Digital product finality",
          paragraphs: [
            "Because ready-made software systems include complete, unencrypted source code that cannot be retrieved once delivered, sales are final for change-of-mind purchases, overlooked technical prerequisites, or post-delivery scope changes.",
          ],
        },
        {
          title: "Circumstances eligible for review and remedy",
          paragraphs: [
            "We provide full support, defect correction, or refunds in the following qualifying circumstances:",
          ],
          items: [
            "Duplicate transactions or accidental double billing verified via PayPal logs.",
            "Permanent failure to deliver or provide access to the purchased digital package.",
            "A material defect where core documented features fail to function as advertised and cannot be corrected within 5 business days.",
            "A material misrepresentation of database schemas or technology stack in the product listing.",
          ],
        },
        {
          title: "Resolution process",
          paragraphs: [
            "To request assistance or report a defect with a purchased system:",
          ],
          items: [
            "Step 1: Contact evangelista.agdiaz@gmail.com with your order number, system name, and a clear description of the defect or error log.",
            "Step 2: Our engineering team will review the issue and provide a patch, code fix, or setup guidance within 24–48 hours.",
            "Step 3: If the defect is genuine and cannot be resolved, we will process a refund directly to your original PayPal payment method.",
          ],
        },
        {
          title: "Access status following refund",
          paragraphs: [
            "Upon issuance of a refund, commercial license permissions for the refunded system are revoked, and download token generation for that order will be deactivated in the customer portal.",
          ],
        },
      ]}
    />
  );
}
