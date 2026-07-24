import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Website and purchase terms summary",
  description: "Pre-launch summary of the planned WebSystemBuilders website and purchase boundaries.",
  robots: { index: false, follow: false },
};

export default function TermsPolicyPage() {
  return <PolicyPage title="Product, service, and commerce boundaries must remain explicit." description="Ready-made systems, custom development, and future hosted SaaS products are distinct models with different scope, pricing, delivery, and responsibility." sections={[
    { title: "Published product information", paragraphs: ["A ready-made product page must disclose its features, requirements, inclusions, exclusions, price mode, version, license summary, support, and delivery information before purchase. The server-calculated checkout amount is authoritative."] },
    { title: "Custom work", paragraphs: ["An inquiry or requirements submission does not create a project agreement. Custom work begins only after scope, price, deliverables, responsibilities, exclusions, and delivery expectations are reviewed and accepted."] },
    { title: "Student services", paragraphs: ["Student work is limited to ethical technical support. The student remains responsible for academic authorship, research, decisions, defense, disclosures, and compliance with school policies. No grade, acceptance, or academic outcome is guaranteed."] },
    { title: "Third-party and launch status", paragraphs: ["Third-party software and services remain subject to their own terms. Production commerce must not launch until business, tax, invoice, provider, dependency-license, and legal-review gates are completed."] },
  ]} />;
}
