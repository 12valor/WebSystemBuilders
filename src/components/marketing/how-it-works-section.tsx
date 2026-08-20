"use client";

import { useState } from "react";
import { PreSaleChatModal } from "@/components/marketing/pre-sale-chat-modal";
import { AppIconBadge } from "@/components/ui/app-icon-badge";
import { Search, CreditCard, ShieldCheck, Download, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    eyebrow: "Explore",
    title: "Choose the right system",
    description:
      "Compare system architecture, included features, delivery scope, and licensing terms before you decide.",
    icon: Search,
  },
  {
    number: "02",
    eyebrow: "Checkout",
    title: "Confirm order & pay",
    description:
      "Review the authoritative PHP total and approve your payment securely through PayPal Checkout.",
    icon: CreditCard,
  },
  {
    number: "03",
    eyebrow: "Verify",
    title: "Instant server verification",
    description:
      "Signed webhooks reconcile the payment capture, amount, currency, and order state automatically.",
    icon: ShieldCheck,
  },
  {
    number: "04",
    eyebrow: "Delivery",
    title: "Secure access & delivery",
    description:
      "Receive expiring, revocable download access to the complete source code and technical documentation.",
    icon: Download,
  },
] as const;

export function HowItWorksSection() {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  return (
    <section
      id="purchase-process"
      aria-labelledby="purchase-process-title"
      className="relative overflow-hidden border-b border-slate-200/80 bg-[#FAFAFC] py-20 font-sans text-slate-900 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <h2
            id="purchase-process-title"
            className="font-heading text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            How the Purchase Process Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Four straightforward stages, with payment verified before any
            system is delivered.
          </p>
        </div>

        <ol
          aria-label="Purchase process steps"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <li key={step.number} className="h-full">
              <article className="group flex h-full min-h-56 flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <AppIconBadge icon={step.icon} color="slate" size="md" />
                    <span className="rounded-md border border-slate-200/70 bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold text-slate-500">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading text-lg font-bold leading-snug tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
                    {step.eyebrow}
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-blue-600 shrink-0" aria-hidden="true" />
              <h3 className="text-base font-extrabold text-slate-900">
                Verified capture before delivery
              </h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              PayPal capture and signed webhook reconciliation must match the
              authoritative order before access can be prepared.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsChatModalOpen(true)}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-xs transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            <span>Ask before purchasing</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>

        <PreSaleChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
        />
      </div>
    </section>
  );
}
