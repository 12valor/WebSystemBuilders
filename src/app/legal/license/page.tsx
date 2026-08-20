import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/policy-page";

export const metadata: Metadata = {
  title: "Commercial Software License",
  description: "WebSystemBuilders Commercial Software License — terms governing source code usage, deployment, and modification.",
};

export default function LicensePolicyPage() {
  return (
    <PolicyPage
      eyebrow="Software Licensing"
      title="Software License Agreement"
      description="Effective date: August 7, 2026 — Terms governing the commercial use, modification, and deployment rights for ready-made software systems."
      sideNote={{
        title: "Perpetual Source License",
        text: "Purchasing a ready-made system grants you full source code access with non-exclusive commercial deployment rights.",
      }}
      sections={[
        {
          title: "Granted permissions",
          paragraphs: [
            "Subject to verified payment, WebSystemBuilders grants you a perpetual, non-exclusive, worldwide license to:",
          ],
          items: [
            "Deploy and run the system on production, staging, or local development environments.",
            "Read, inspect, refactor, and modify the delivered source code and database schemas.",
            "Integrate the software into your internal business operations or client project deliverables.",
            "Maintain and host the application independently without recurring platform fees.",
          ],
        },
        {
          title: "License restrictions",
          paragraphs: [
            "The commercial license does not grant the right to:",
          ],
          items: [
            "Resell, redistribute, sublicense, or share the original or unmodified source code package as a standalone digital asset or competing template.",
            "Remove proprietary notices or copyright headers belonging to open-source libraries bundled in the repository.",
            "Use the WebSystemBuilders name, logo, or trademark in a manner that falsely implies official endorsement or corporate affiliation.",
          ],
        },
        {
          title: "Third-party components and dependencies",
          paragraphs: [
            "Our software packages incorporate well-tested open-source dependencies (e.g., React, Next.js, Tailwind CSS, Lucide icons, PostgreSQL clients). Each third-party library remains governed by its respective open-source license (such as MIT, Apache 2.0, or BSD).",
            "A full inventory of dependencies and license attributions is included in the root package.json of each deliverable.",
          ],
        },
        {
          title: "Support and maintenance boundaries",
          paragraphs: [
            "The license covers source code usage rights. Standard orders include 30 days of email installation and environment setup assistance.",
            "Ongoing custom development, third-party hosting costs, domain renewals, and modifications made by third parties are separate from the base license.",
          ],
        },
      ]}
    />
  );
}
