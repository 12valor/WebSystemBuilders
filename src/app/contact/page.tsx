import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/inquiries/inquiry-form";
import { PublicPageHero, PublicPageShell } from "@/components/marketing/public-page";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";
import { isInquirySubmissionConfigured } from "@/lib/env/inquiries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send a general inquiry to WebSystemBuilders or continue to the detailed project quotation form.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const configured = isInquirySubmissionConfigured();

  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow="Contact"
        title="Start with the question you need answered."
        description="Use this form for a general question about systems, services, or the website. Project requirements belong in the detailed quotation form."
        primary={{ label: "Request a quotation", href: "/request-a-quote" }}
        secondary={{ label: "Browse systems", href: "/systems" }}
      />
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid w-[min(calc(100%-40px),1180px)] gap-10 md:w-[min(calc(100%-64px),1180px)] lg:grid-cols-[minmax(260px,.55fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionEyebrow>General inquiry</SectionEyebrow>
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Keep the first message focused.</h2>
            <p className="mt-6 leading-7 text-secondary">Explain what you are trying to understand and include enough context for the request to be reviewed. Do not submit passwords, payment details, identification numbers, or confidential records.</p>
            <div className="mt-8 border-t border-white/15 pt-6 text-sm leading-6 text-secondary">
              <p>Business contact details will be published only after the owner confirms them for public use.</p>
              <Link href="/faq" className="mt-4 inline-flex font-semibold text-foreground underline underline-offset-4">Check common questions first</Link>
            </div>
          </div>
          <InquiryForm variant="contact" configured={configured} />
        </div>
      </section>
    </PublicPageShell>
  );
}
