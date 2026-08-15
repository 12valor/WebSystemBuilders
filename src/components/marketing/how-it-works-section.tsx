"use client";

import { useState } from "react";
import { PreSaleChatModal } from "@/components/marketing/pre-sale-chat-modal";

const steps = [
  {
    number: "01",
    eyebrow: "Explore",
    title: "Choose the right system",
    description:
      "Compare the system details, included features, delivery scope, and license before you decide.",
    iconPath: "M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    number: "02",
    eyebrow: "Checkout",
    title: "Confirm your order and pay",
    description:
      "Enter your order details, confirm the total, then scan the displayed GCash or QRPh code.",
    iconPath:
      "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z",
  },
  {
    number: "03",
    eyebrow: "Submit",
    title: "Send your payment proof",
    description:
      "Upload your receipt and enter the transaction reference so the payment can be matched to your order.",
    iconPath: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  },
  {
    number: "04",
    eyebrow: "Receive",
    title: "Verification, then secure delivery",
    description:
      "The owner reviews the payment details before protected access to the purchased system is provided.",
    iconPath:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
            <span className="size-2 rounded-full bg-blue-600" />
            A clear path from selection to delivery
          </div>
          <h2
            id="purchase-process-title"
            className="font-heading text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            How the Purchase Process Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Four straightforward stages, with payment reviewed before any
            system is delivered.
          </p>
        </div>

        <ol
          aria-label="Purchase process steps"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <li key={step.number} className="h-full">
              <article className="group flex h-full min-h-56 flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_4px_16px_-10px_rgba(15,23,42,0.18)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_18px_36px_-22px_rgba(37,99,235,0.3)] motion-reduce:transform-none motion-reduce:transition-none">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-extrabold text-white">
                      {step.number}
                    </span>
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-700">
                      {step.eyebrow}
                    </span>
                  </div>
                  <span className="flex size-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 transition-colors duration-200 group-hover:bg-blue-100 motion-reduce:transition-none">
                    <svg
                      aria-hidden="true"
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.75}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={step.iconPath}
                      />
                    </svg>
                  </span>
                </div>

                <h3 className="mt-7 font-heading text-xl font-bold leading-snug tracking-tight text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </article>
            </li>
          ))}
        </ol>

        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-slate-500">
          This overview explains the current manual Scan-to-Pay process. It
          does not submit an order or payment.
        </p>

        <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <svg
                aria-hidden="true"
                className="size-5 text-blue-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 className="text-base font-extrabold text-slate-900">
                Payment is checked before delivery
              </h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Manual review helps match the payment proof and reference number
              to the correct order before access is granted.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsChatModalOpen(true)}
            className="blue-button inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-blue-600 px-5 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Ask before purchasing
            <span aria-hidden="true">&rarr;</span>
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
