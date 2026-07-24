import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Privacy notice summary",
  description: "Pre-launch summary of how WebSystemBuilders inquiry and commerce information is intended to be handled.",
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyPage() {
  return <PolicyPage title="Collect only the information needed for the requested workflow." description="The initial privacy direction covers inquiries, accounts, orders, payment references, fulfillment, downloads, email delivery, and support records." sections={[
    { title: "Inquiry information", paragraphs: ["The inquiry forms request a name, email address, audience, optional organization, message, and—when a quotation is requested—project type, requirements, and optional timeline. Visitors are instructed not to include passwords, payment data, government identifiers, or confidential records."] },
    { title: "Purpose", items: ["Evaluate and respond to submitted inquiries.", "Create and protect customer access when commerce is activated.", "Record orders, payment references, fulfillment, delivery, and support events.", "Secure the service, prevent abuse, investigate failures, and preserve required operational history."] },
    { title: "Providers and access", paragraphs: ["The approved architecture uses Supabase for database, authentication, and private storage; PayMongo for hosted payment; and Resend for transactional email. Provider accounts are not yet production-configured. Access must remain limited by server-side authorization and Row Level Security."] },
    { title: "Security and retention", paragraphs: ["Inquiry rate-limit identifiers are designed to be hashed rather than stored as raw network addresses. Exact production retention periods, deletion procedures, data-subject request handling, and final provider disclosures still require legal and operational review before launch."] },
  ]} />;
}
