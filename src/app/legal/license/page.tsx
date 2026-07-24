import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Software license summary",
  description: "Pre-launch summary of the approved WebSystemBuilders commercial source-code license direction.",
  robots: { index: false, follow: false },
};

export default function LicensePolicyPage() {
  return <PolicyPage title="A broad, non-exclusive commercial source license." description="Ready-made systems are planned to include source code with broad commercial permissions, while preserving original ownership and third-party license boundaries." sections={[
    { title: "Planned permissions", items: ["Use and deploy the purchased system.", "Copy and modify the delivered source code.", "Resell or redistribute the purchased system, including the original source package.", "Use the permission perpetually on a non-exclusive basis."] },
    { title: "Rights retained", paragraphs: ["WebSystemBuilders retains ownership of its original work, may continue selling and licensing the same system, and does not grant exclusivity or ownership of the WebSystemBuilders name, logo, or other brand assets."] },
    { title: "Third-party components", paragraphs: ["Packages, fonts, media, services, and other third-party materials remain governed by their own licenses and terms. Every distributed dependency and asset requires a compliance audit before production sale."] },
    { title: "Support is separate", paragraphs: ["The original order receives the approved support entitlement. A buyer may redistribute the system, but that support does not transfer to the buyer's downstream customers. Updates, warranties, liability, and operational services are separate from source-code permissions."] },
  ]} />;
}
