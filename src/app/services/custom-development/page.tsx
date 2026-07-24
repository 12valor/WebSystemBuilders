import type { Metadata } from "next";
import {
  EditorialSection,
  PublicCallToAction,
  PublicPageHero,
  PublicPageShell,
  StatementSection,
} from "@/components/marketing/public-page";

export const metadata: Metadata = {
  title: "Custom software development",
  description: "Request a custom software system based on reviewed requirements, an agreed scope, and transparent delivery expectations.",
  alternates: { canonical: "/services/custom-development" },
};

export default function CustomDevelopmentPage() {
  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow="Custom software development"
        title="Build around the workflow, not a generic promise."
        description="Custom work begins with requirements review. Scope, price, deliverables, responsibilities, and delivery expectations must be agreed before development starts."
        primary={{ label: "Request a quotation", href: "/request-a-quote" }}
        secondary={{ label: "Review the process", href: "/process" }}
      />
      <EditorialSection
        eyebrow="What can be scoped"
        title="A service for defined software requirements."
        items={[
          { title: "New system development", description: "Plan and implement a web-based system around an agreed set of users, workflows, data, and outcomes." },
          { title: "Customization", description: "Adapt an eligible ready-made system when the required changes are clear and compatible with the product." },
          { title: "Interface development", description: "Design and implement focused user interfaces for approved system workflows." },
          { title: "Technical assistance", description: "Scope debugging, deployment, setup, or documentation work separately when a full new system is unnecessary." },
        ]}
      />
      <StatementSection
        eyebrow="Before a quotation"
        title="Requirements create the boundary."
        copy={[
          "A useful request explains who will use the system, the problem it should address, the essential workflow, required reports or integrations, and any deadline or environment constraints.",
          "A quotation is not generated from a generic package. The requested work is reviewed first so the proposal can identify inclusions, exclusions, assumptions, price, and delivery expectations.",
        ]}
      />
      <PublicCallToAction
        title="Prepare the workflow you want reviewed."
        description="Use the detailed inquiry form to submit the users, workflow, requirements, and constraints needed for a responsible review."
        primary={{ label: "Request a quotation", href: "/request-a-quote" }}
        secondary={{ label: "Browse systems", href: "/systems" }}
      />
    </PublicPageShell>
  );
}
