import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Refund policy summary",
  description: "Pre-launch summary of the approved WebSystemBuilders digital-sale refund direction and mandatory remedies.",
  robots: { index: false, follow: false },
};

export default function RefundPolicyPage() {
  return <PolicyPage title="Digital sales are final for change-of-mind purchases." description="That commercial direction remains subject to applicable consumer rights, payment-provider rules, and remedies that cannot legally be excluded." sections={[
    { title: "Change of mind", paragraphs: ["Discretionary refunds are not planned when a buyer changes their mind, finds another product, no longer needs the system, overlooks disclosed requirements, or mishandles delivered files."] },
    { title: "Issues that require review", items: ["Duplicate or unauthorized charges.", "Failure to deliver the purchased system.", "A materially defective or nonconforming system.", "Material misrepresentation of the product or its inclusions.", "A breached warranty or another remedy that cannot legally be excluded."] },
    { title: "Resolution workflow", paragraphs: ["The order, payment, delivery, product version, and reported problem must be verified. Redelivery, guidance, correction, repair, or replacement should be attempted when appropriate. A full or partial refund remains available when required by law, provider rules, duplicate payment, or an approved exceptional resolution."] },
    { title: "Access after resolution", paragraphs: ["Future download access may be revoked when appropriate. Source code already downloaded cannot be technically recovered, so resolution records must preserve the reason, evidence, amount, provider reference, and responsible administrator."] },
  ]} />;
}
