import type { Metadata } from "next";
import {
  EditorialSection,
  PublicCallToAction,
  PublicPageHero,
  PublicPageShell,
  StatementSection,
} from "@/components/marketing/public-page";

export const metadata: Metadata = {
  title: "Development and delivery process",
  description: "Understand how WebSystemBuilders handles ready-made system evaluation, custom requirements, payment verification, and private delivery.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow="Process"
        title="A clear route from requirements to access."
        description="Ready-made purchases and custom-development requests follow different paths, but both depend on transparent scope, authoritative records, and verified actions."
        primary={{ label: "Browse systems", href: "/systems" }}
        secondary={{ label: "Custom development", href: "/services/custom-development" }}
      />
      <EditorialSection
        eyebrow="Ready-made systems"
        title="Evaluate first. Pay through a verified flow. Receive private access."
        items={[
          { title: "Discover", description: "Browse administrator-published systems by audience, category, and pricing mode." },
          { title: "Evaluate", description: "Review features, requirements, inclusions, exclusions, license, support, version, and delivery information." },
          { title: "Order and pay", description: "The server records a pending order and authoritative amount before opening hosted payment." },
          { title: "Receive access", description: "Only verified server-side payment confirmation can start fulfillment and protected digital delivery." },
        ]}
      />
      <EditorialSection
        eyebrow="Custom development"
        title="Review requirements before committing to scope."
        tone="subtle"
        items={[
          { title: "Describe the need", description: "Provide the users, workflow, required outcomes, constraints, and available reference material." },
          { title: "Review feasibility", description: "Clarify uncertain requirements, dependencies, responsibilities, and exclusions." },
          { title: "Agree the proposal", description: "Confirm scope, price, deliverables, assumptions, and delivery expectations before work begins." },
          { title: "Build and review", description: "Implement against the agreed scope and review the defined outputs before handoff." },
        ]}
      />
      <StatementSection
        eyebrow="System of record"
        title="The website does not treat a browser redirect as proof."
        copy={[
          "Orders, payments, fulfillment, email, and download activity are recorded as separate events. Payment-provider webhooks must be verified before a purchase becomes eligible for delivery.",
          "ZIP deliverables remain private. Customer access will use expiring, revocable links after the order and identity checks pass.",
        ]}
      />
      <PublicCallToAction
        title="Choose the path that matches the work."
        description="Start with the catalog when an existing system may fit. Use custom development when the workflow needs its own reviewed scope."
        primary={{ label: "Browse systems", href: "/systems" }}
        secondary={{ label: "View custom development", href: "/services/custom-development" }}
      />
    </PublicPageShell>
  );
}
