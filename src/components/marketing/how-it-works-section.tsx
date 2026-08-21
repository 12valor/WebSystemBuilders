"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="purchase-process"
      aria-labelledby="purchase-process-title"
      className="relative overflow-hidden border-b border-slate-200/80 bg-[#FAFAFC] py-12 font-sans text-slate-900 sm:py-16 lg:py-24"
    >
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 max-w-3xl text-center sm:mb-10 lg:mb-12 will-change-transform"
        >
          <h2
            id="purchase-process-title"
            className="font-heading text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
          >
            How the Purchase Process Works
          </h2>
          <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:mt-3.5 sm:text-base md:text-lg">
            Four straightforward stages, with payment verified before any
            system is delivered.
          </p>
        </motion.div>

        <ol
          aria-label="Purchase process steps"
          className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
        >
          {steps.map((step, index) => (
            <motion.li
              key={step.number}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: reduceMotion ? 0 : (index % 4) * 0.08,
              }}
              className="h-full will-change-transform"
            >
              <article className="group flex h-full min-h-48 flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none sm:min-h-56 sm:p-6">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <AppIconBadge icon={step.icon} color="slate" size="md" />
                    <span className="rounded-md border border-slate-200/70 bg-slate-50 px-2 py-0.5 font-mono text-xs font-semibold text-slate-500">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-4 font-heading text-base font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 sm:mt-5 sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:mt-2 sm:text-sm">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 sm:mt-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-blue-600">
                    {step.eyebrow}
                  </span>
                </div>
              </article>
            </motion.li>
          ))}
        </ol>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.2 }}
          className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:p-7 will-change-transform"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-blue-600 shrink-0" aria-hidden="true" />
              <h3 className="text-base font-extrabold text-slate-900">
                Verified capture before delivery
              </h3>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:mt-2 sm:text-sm">
              PayPal capture and signed webhook reconciliation must match the
              authoritative order before access can be prepared.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsChatModalOpen(true)}
            className="inline-flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-bold text-white shadow-xs transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
          >
            <span>Ask before purchasing</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </motion.div>

        <PreSaleChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
        />
      </div>
    </section>
  );
}
