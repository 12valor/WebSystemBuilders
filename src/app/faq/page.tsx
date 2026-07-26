import type { Metadata } from "next";
import Link from "next/link";
import { PublicCallToAction, PublicPageHero, PublicPageShell } from "@/components/marketing/public-page";
import { getPublicFaqItems } from "@/features/content/faq-repository";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Answers about WebSystemBuilders systems, custom development, student support, pricing, licensing, delivery, support, and refunds.",
  alternates: { canonical: "/faq" },
};


export default async function FaqPage() {
  const questions = await getPublicFaqItems();
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
              <details key={item.id} className="group border-b border-white/10 py-6">
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
