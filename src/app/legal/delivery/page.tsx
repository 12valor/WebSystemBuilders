import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Digital delivery policy summary",
  description: "Pre-launch summary of the approved WebSystemBuilders digital delivery direction.",
  robots: { index: false, follow: false },
};

export default function DeliveryPolicyPage() {
  return <PolicyPage title="Digital delivery should begin only after verified payment." description="The initial commerce design keeps system files private and separates checkout return pages from authoritative payment confirmation." sections={[
    { title: "Payment confirmation", paragraphs: ["A pending order is created before hosted checkout. A browser redirect is never proof of payment; fulfillment starts only after a verified server-side payment event matches the expected order, amount, and currency."] },
    { title: "Private access", items: ["ZIP packages remain in private storage.", "Each authorized download receives a new signed URL that expires after one hour.", "Access is designed to be revocable and every download attempt is recorded.", "The paid customer can return through the customer portal for eligible re-downloads."] },
    { title: "Purchased version", paragraphs: ["The customer keeps permanent portal entitlement to the version purchased and eligible corrective patches attached to that version. Future major versions are separate unless the product page explicitly includes an upgrade."] },
    { title: "Delivery problems", paragraphs: ["A failed or missing delivery requires order, payment, fulfillment, email, and download-event review. Redelivery or correction should be attempted before escalation to another legally required or approved remedy."] },
  ]} />;
}
