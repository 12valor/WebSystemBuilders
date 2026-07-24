import type { Metadata } from "next";
import {
  EditorialSection,
  PublicCallToAction,
  PublicPageHero,
  PublicPageShell,
  StatementSection,
} from "@/components/marketing/public-page";

export const metadata: Metadata = {
  title: "Software systems for business operations",
  description: "Explore ready-made and custom software systems for sales, inventory, warehouse, and management workflows.",
  alternates: { canonical: "/for-business" },
};

export default function ForBusinessPage() {
  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow="For business owners"
        title="Systems shaped around day-to-day operations."
        description="Evaluate ready-made software for common workflows or request a custom system based on the way your business actually works."
        primary={{ label: "Browse business systems", href: "/systems?audience=business" }}
        secondary={{ label: "Request custom development", href: "/services/custom-development" }}
      />
      <EditorialSection
        eyebrow="Business systems"
        title="Choose a practical operational starting point."
        items={[
          { title: "Point of sale", description: "Support transaction recording, sales workflows, and the operational information needed at the point of sale." },
          { title: "Inventory management", description: "Track stock, movements, availability, and the records used in day-to-day inventory work." },
          { title: "Warehouse management", description: "Organize receiving, storage, stock control, and warehouse-related workflows." },
          { title: "Other management systems", description: "Review requirements for payroll, attendance, booking, customer management, school, enrollment, or another defined workflow." },
        ]}
      />
      <StatementSection
        eyebrow="Evaluation before purchase"
        title="Know what the package does and does not include."
        copy={[
          "Published system pages separate features, requirements, package inclusions, exclusions, license terms, support coverage, and delivery details.",
          "A ready-made system may still require deployment, configuration, data preparation, or customization. Those services must be scoped separately unless the product page explicitly includes them.",
        ]}
      />
      <PublicCallToAction
        title="Find the closest operational fit."
        description="Browse administrator-published business systems, then request custom development if the available workflow does not match your requirements."
        primary={{ label: "Explore business systems", href: "/systems?audience=business" }}
        secondary={{ label: "Custom development", href: "/services/custom-development" }}
      />
    </PublicPageShell>
  );
}
