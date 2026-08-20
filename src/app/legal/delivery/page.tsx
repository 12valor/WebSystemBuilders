import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Digital Delivery Policy",
  description: "WebSystemBuilders Digital Delivery Policy — how software files, licenses, and private downloads are fulfilled.",
};

export default function DeliveryPolicyPage() {
  return (
    <PolicyPage
      eyebrow="Delivery & Access"
      title="Digital Delivery Policy"
      description="Effective date: August 7, 2026 — How software systems, source code packages, and access credentials are electronically fulfilled after verified payment."
      sideNote={{
        title: "Private Storage Fulfillment",
        text: "System packages are stored in private Supabase Storage buckets. Downloads are authorized exclusively through expiring, single-use signed URLs.",
      }}
      sections={[
        {
          title: "Payment verification before fulfillment",
          paragraphs: [
            "A pending order is initialized before entering checkout. A client-side redirect or browser return is never treated as proof of payment.",
            "Fulfillment begins only after our server validates the PayPal capture event or signed webhook payload, confirming the exact order number, amount, and currency.",
          ],
        },
        {
          title: "Private storage and secure access tokens",
          paragraphs: [
            "We maintain rigorous security controls for digital deliverables:",
          ],
          items: [
            "ZIP packages and repositories remain strictly protected in private cloud storage.",
            "Each authorized download request generates a unique signed URL that automatically expires after 60 minutes.",
            "Download attempts, IP addresses, and token timestamps are logged to prevent link leakage and unauthorized distribution.",
            "Customers can generate new download tokens at any time through their authenticated customer portal.",
          ],
        },
        {
          title: "Purchased versions and patch entitlement",
          paragraphs: [
            "Purchasing a system grants permanent portal access to the specific version acquired at the time of order, including any eligible security patches or bug fixes issued for that major release.",
            "Subsequent major releases with new architecture or substantial feature additions are separate unless explicitly noted on the product listing.",
          ],
        },
        {
          title: "Delivery assistance and redownloads",
          paragraphs: [
            "If you experience a network interruption or corrupted archive download, you can immediately regenerate a fresh signed download link in your account.",
            "If your download token fails or your order status does not update within 5 minutes of PayPal payment, contact evangelista.agdiaz@gmail.com with your order number for same-day manual verification.",
          ],
        },
      ]}
    />
  );
}
