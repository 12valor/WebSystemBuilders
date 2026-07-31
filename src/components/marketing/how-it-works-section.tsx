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
    detail:
      "Use the catalog and product demo to confirm that the system fits your needs. If you need changes, request a quote before purchasing.",
    checks: [
      "Review inclusions and requirements",
      "Check the version and license",
      "Ask questions before checkout",
    ],
    iconPath: "M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    number: "02",
    eyebrow: "Checkout",
    title: "Confirm your order and pay",
    description:
      "Enter your order details, confirm the total, then scan the displayed GCash or QRPh code.",
    detail:
      "The checkout shows the system and amount connected to your order. Complete the payment using GCash or a QRPh-supported banking app.",
    checks: [
      "Confirm the system and final amount",
      "Use the QR code shown at checkout",
      "Keep your payment receipt",
    ],
    iconPath:
      "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z",
  },
  {
    number: "03",
    eyebrow: "Submit",
    title: "Send your payment proof",
    description:
      "Upload your receipt and enter the transaction reference so the payment can be matched to your order.",
    detail:
      "Your order stays pending while the submitted details are checked. A receipt screenshot and readable reference number help avoid delays.",
    checks: [
      "Upload a clear receipt screenshot",
      "Enter the correct reference number",
      "Track the order as pending",
    ],
    iconPath: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  },
  {
    number: "04",
    eyebrow: "Receive",
    title: "Verification, then secure delivery",
    description:
      "The owner reviews the payment details before protected access to the purchased system is provided.",
    detail:
      "Only a verified payment can move the order forward. Once approved, the delivery becomes available through the customer portal or the confirmed delivery method.",
    checks: [
      "Payment is reviewed before delivery",
      "Order status is updated after approval",
      "Files are provided through protected access",
    ],
    iconPath:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
] as const;

export function HowItWorksSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const activeStep = steps[activeStepIndex];
  const progress = ((activeStepIndex + 1) / steps.length) * 100;

  return (
    <section
      id="purchase-process"
      aria-labelledby="purchase-process-title"
      className="relative overflow-hidden border-b border-slate-200/80 bg-white py-20 font-sans text-slate-900 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-blue-700">
            <span className="size-2 rounded-full bg-blue-600" />
            A clear path from selection to delivery
          </div>
          <h2
            id="purchase-process-title"
            className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            How the Purchase Process Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Four straightforward stages, with payment reviewed before any
            system is delivered.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/70">
          <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                Step {activeStepIndex + 1} of {steps.length}
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {activeStep.eyebrow}
              </p>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-slate-100"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-[width] duration-200 motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ol
            aria-label="Purchase process steps"
            className="grid border-b border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((step, index) => {
              const isActive = index === activeStepIndex;
              const isComplete = index < activeStepIndex;

              return (
                <li
                  key={step.number}
                  className="border-b border-slate-200 last:border-b-0 sm:[&:nth-child(odd)]:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
                >
                  <button
                    type="button"
                    onClick={() => setActiveStepIndex(index)}
                    aria-current={isActive ? "step" : undefined}
                    aria-controls="active-process-step"
                    className={`group flex min-h-24 w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-200 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none sm:px-5 ${
                      isActive
                        ? "bg-blue-50/80"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold transition-colors duration-200 motion-reduce:transition-none ${
                        isActive
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isComplete
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {isComplete ? (
                        <svg
                          aria-hidden="true"
                          className="size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </span>
                    <span>
                      <span
                        className={`block text-sm font-bold leading-snug ${
                          isActive ? "text-blue-700" : "text-slate-800"
                        }`}
                      >
                        {step.eyebrow}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                        {step.title}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div
            id="active-process-step"
            aria-live="polite"
            className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12 lg:p-10"
          >
            <div className="flex flex-col">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
                <svg
                  aria-hidden="true"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={activeStep.iconPath}
                  />
                </svg>
              </div>

              <p className="mt-6 font-mono text-xs font-bold uppercase tracking-wider text-blue-700">
                {activeStep.eyebrow} · Step {activeStep.number}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {activeStep.title}
              </h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                {activeStep.description}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-500">
                {activeStep.detail}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveStepIndex((current) => Math.max(0, current - 1))
                  }
                  disabled={activeStepIndex === 0}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveStepIndex((current) =>
                      Math.min(steps.length - 1, current + 1),
                    )
                  }
                  disabled={activeStepIndex === steps.length - 1}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
                >
                  Next step
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <aside
              aria-label={`What to expect during ${activeStep.title}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                What to expect
              </p>
              <ul className="mt-5 space-y-4">
                {activeStep.checks.map((check) => (
                  <li
                    key={check}
                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-700"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                      <svg
                        aria-hidden="true"
                        className="size-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-xs leading-relaxed text-slate-500">
                  This walkthrough explains the current manual Scan-to-Pay
                  process. It does not submit an order or payment.
                </p>
              </div>
            </aside>
          </div>
        </div>

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
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Ask before purchasing
            <span aria-hidden="true">→</span>
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
