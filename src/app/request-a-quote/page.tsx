import type { Metadata } from "next";
import { InquiryForm } from "@/components/inquiries/inquiry-form";
import { PublicPageHero, PublicPageShell } from "@/components/marketing/public-page";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";
import { isInquirySubmissionConfigured } from "@/lib/env/inquiries";

export const metadata: Metadata = {
  title: "Request a quotation",
  description: "Submit a defined software workflow and requirements for WebSystemBuilders to review before a custom quotation.",
  alternates: { canonical: "/request-a-quote" },
};

export default function RequestQuotePage() {
  const configured = isInquirySubmissionConfigured();

  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow="Request a quotation"
        title="Describe the workflow before discussing the build."
        description="A responsible quotation depends on the users, steps, records, reports, integrations, constraints, and desired outcome. Submission starts a requirements review; it does not create a project agreement."
        primary={{ label: "Review the development process", href: "/process" }}
        secondary={{ label: "Ask a general question", href: "/contact" }}
      />
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid w-[min(calc(100%-40px),1180px)] gap-10 md:w-[min(calc(100%-64px),1180px)] lg:grid-cols-[minmax(260px,.55fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionEyebrow>Requirements review</SectionEyebrow>
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Share enough to define the next conversation.</h2>
            <ol className="mt-8 border-t border-white/15">
              {[
                ["01", "Identify the people who will use the system."],
                ["02", "Describe the main workflow from start to finish."],
                ["03", "List essential records, reports, or integrations."],
                ["04", "Mention environment or timeline constraints."],
              ].map(([number, step]) => <li key={number} className="grid grid-cols-[40px_1fr] gap-3 border-b border-white/10 py-5 text-sm leading-6"><span className="text-muted">{number}</span><span className="text-secondary">{step}</span></li>)}
            </ol>
            <p className="mt-6 text-sm leading-6 text-muted">Price, scope, delivery expectations, responsibilities, inclusions, and exclusions are agreed only after review.</p>
          </div>
          <InquiryForm variant="quote" configured={configured} />
        </div>
      </section>
    </PublicPageShell>
  );
}
