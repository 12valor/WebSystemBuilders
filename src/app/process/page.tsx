import type { Metadata } from "next";
import {
  PublicCallToAction,
  PublicPageHero,
  PublicPageShell,
  StatementSection,
} from "@/components/marketing/public-page";
import {
  ProcessPipelineSwitcher,
  SecurityFulfillmentSimulator,
} from "@/components/marketing/process-interactive";

export const metadata: Metadata = {
  title: "Development and delivery process",
  description:
    "Understand how WebSystemBuilders handles ready-made system evaluation, custom requirements, payment verification, and private delivery.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <PublicPageShell>
      {/* Hero Section */}
      <PublicPageHero
        eyebrow="Development Process"
        title="A clear, transparent route from requirements to delivery."
        description="Ready-made purchases and custom-development requests follow distinct, rigorous paths. Both depend on transparent scope, server-authoritative calculations, and verified actions."
        primary={{ label: "Browse systems", href: "/systems" }}
        secondary={{ label: "Request custom quote", href: "/request-a-quote" }}
      />

      {/* Main Interactive Process Switcher Section */}
      <section className="px-5 py-12 md:py-16">
        <div className="mx-auto max-w-6xl mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
            Explore the Process Pipelines
          </h2>
          <p className="mt-2 text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            Select a pathway below to view the step-by-step technical execution, architectural diagrams, and stage assurances.
          </p>
        </div>

        <ProcessPipelineSwitcher />
      </section>

      {/* System of Record & Security Verification Simulator */}
      <section className="px-5 py-12 md:py-16 bg-surface-subtle border-y border-white/10">
        <div className="mx-auto max-w-6xl space-y-12">
          <StatementSection
            eyebrow="System of Record & Security"
            title="We never treat a browser return URL as proof of payment."
            copy={[
              "Orders, payments, fulfillment, email notifications, and download activity are logged as independent events in immutable server logs. Payment-provider webhooks must pass HMAC-SHA256 signature verification before any order is marked eligible for delivery.",
              "Source code deliverables remain isolated in private Supabase Storage buckets. Authorized customers receive expiring, 1-hour revocable signed links after server-side identity and payment checks pass.",
            ]}
          />

          {/* Interactive Security Simulator Component */}
          <SecurityFulfillmentSimulator />
        </div>
      </section>

      {/* Trust & Audience Guarantees Section */}
      <section className="px-5 py-12 md:py-16">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Ethical Standards & Commercial Guarantees
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Clear boundaries built specifically for students and business owners.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Student Assurance Card */}
            <div className="rounded-xl border border-white/10 bg-surface p-6 md:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-mono text-accent">
                STUDENT AUDIENCE PATH
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                Ethical Technical Guidance
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                We provide ready-made system templates, clean source code, database ERDs, and architectural documentation for educational analysis. We strictly do not engage in academic dishonesty or ghostwriting.
              </p>
              <ul className="space-y-2 text-xs text-text-secondary pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">✓</span> Full source code & database schemas provided
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">✓</span> Detailed setup & architectural documentation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">✓</span> Clear ethical boundary policy
                </li>
              </ul>
            </div>

            {/* Business Assurance Card */}
            <div className="rounded-xl border border-white/10 bg-surface p-6 md:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
                BUSINESS OWNER PATH
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                Commercial Code Ownership
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Deploy production-ready web applications built on Next.js, Supabase, and Tailwind. Receive explicit license terms, no recurring percentage fees, and comprehensive system documentation.
              </p>
              <ul className="space-y-2 text-xs text-text-secondary pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Clean TypeScript modular monolith codebase
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Explicit commercial software licenses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Direct developer communication during custom sprints
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <PublicCallToAction
        title="Choose the path that matches your project."
        description="Start with the catalog when an existing system fits your requirements. Use custom development when your workflow needs a tailored scope."
        primary={{ label: "Browse ready-made systems", href: "/systems" }}
        secondary={{ label: "Request a custom quote", href: "/request-a-quote" }}
      />
    </PublicPageShell>
  );
}
