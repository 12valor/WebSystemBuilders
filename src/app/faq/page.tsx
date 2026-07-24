import type { Metadata } from "next";
import Link from "next/link";
import { PublicCallToAction, PublicPageHero, PublicPageShell } from "@/components/marketing/public-page";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Answers about WebSystemBuilders systems, custom development, student support, pricing, licensing, delivery, support, and refunds.",
  alternates: { canonical: "/faq" },
};

const questions = [
  {
    question: "What is the difference between a ready-made system and custom development?",
    answer: "A ready-made system is an existing administrator-published product with defined features, requirements, inclusions, exclusions, price, and delivery terms. Custom development begins with a requirements review and receives a separate scope and quotation before work starts.",
  },
  {
    question: "What support is available for student projects?",
    answer: "Student services cover ethical technical work such as system development, templates, interface implementation, debugging, deployment, documentation guidance, and mentoring. Students remain responsible for authorship, academic decisions, research, defense, and compliance with school rules.",
  },
  {
    question: "Is source code included with ready-made systems?",
    answer: "Yes. The approved ready-made package direction includes the purchased source-code package, supplied documentation, and 30 calendar days of support for the original purchaser. The exact product page must confirm every inclusion and exclusion before checkout.",
  },
  {
    question: "Can a purchased ready-made system be modified or resold?",
    answer: "The approved license direction is broad, perpetual, non-exclusive commercial use that allows use, modification, deployment, resale, and redistribution of the purchased system. WebSystemBuilders retains its original ownership and may continue selling the same system. Third-party assets and packages remain governed by their own licenses, and final legal wording still requires review before production commerce.",
  },
  {
    question: "How are prices shown?",
    answer: "Ready-made systems may use a fixed price or a visible starting price. Custom development uses a quotation. PHP is the canonical catalog and default settlement currency; future localized display amounts are estimates and must not silently change the authoritative checkout price.",
  },
  {
    question: "When are purchased files delivered?",
    answer: "A pending order is created before hosted checkout. Files are fulfilled only after verified server-side payment confirmation, never from the browser return page alone. Delivery is designed to use private storage and expiring, revocable download access through email and the customer portal.",
  },
  {
    question: "How long is support included?",
    answer: "The original purchaser receives 30 calendar days of support beginning when the paid order is fulfilled. It covers access, installation using supplied documentation, documented requirements, and reproducible defects in the unmodified delivered version. Customization, hosting, deployment, training, and ongoing maintenance are separate unless a product page explicitly includes them.",
  },
  {
    question: "Are digital purchases refundable?",
    answer: "The approved direction is that digital sales are final for change-of-mind purchases, subject to applicable consumer rights and legally required remedies. Duplicate or unauthorized charges, delivery failures, material defects, misrepresentation, and other non-excludable remedies require review. Final production wording is still subject to legal review.",
  },
  {
    question: "Why are there no placeholder products or portfolio claims?",
    answer: "Systems and project evidence appear only after real records and approved materials are available. The website does not invent clients, testimonials, projects, metrics, credentials, or availability to fill an empty state.",
  },
] as const;

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <PublicPageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PublicPageHero
        eyebrow="Frequently asked questions"
        title="Clear answers before the next step."
        description="Review the current product, service, delivery, licensing, support, and policy direction. Product-specific details remain authoritative on each published system page."
        primary={{ label: "Browse systems", href: "/systems" }}
        secondary={{ label: "Contact WebSystemBuilders", href: "/contact" }}
      />
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto w-[min(calc(100%-40px),900px)] md:w-[min(calc(100%-64px),900px)]">
          <div className="border-t border-white/15">
            {questions.map((item, index) => (
              <details key={item.question} className="group border-b border-white/10 py-6">
                <summary className="grid cursor-pointer list-none grid-cols-[38px_1fr_auto] gap-3 text-left text-lg font-semibold tracking-[-0.025em] marker:hidden sm:grid-cols-[50px_1fr_auto]">
                  <span className="text-xs font-normal text-muted">{String(index + 1).padStart(2, "0")}</span>
                  <span>{item.question}</span>
                  <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="ml-[38px] mt-4 max-w-3xl leading-7 text-secondary sm:ml-[50px]">{item.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-sm leading-6 text-muted">Need a product-specific answer? <Link href="/contact" className="font-semibold text-foreground underline underline-offset-4">Send a focused inquiry</Link>.</p>
        </div>
      </section>
      <PublicCallToAction
        title="Ready to define the work?"
        description="Use the detailed quotation form for custom development or compare published ready-made systems first."
        primary={{ label: "Request a quotation", href: "/request-a-quote" }}
        secondary={{ label: "Browse systems", href: "/systems" }}
      />
    </PublicPageShell>
  );
}
