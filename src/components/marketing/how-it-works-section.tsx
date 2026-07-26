"use client";

import React, { useState } from "react";
import { PreSaleChatModal } from "@/components/marketing/pre-sale-chat-modal";

const steps = [
  {
    num: "01",
    title: "Browse & Choose System",
    desc: "Explore ready-made web systems, capstone templates, POS solutions, or custom services.",
    color: "blue",
    iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    num: "02",
    title: "Proceed to Checkout",
    desc: "Review system inclusions, select your required license, and open the Scan-to-Pay checkout page.",
    color: "indigo",
    iconPath: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  },
  {
    num: "03",
    title: "Scan GCash QR Code",
    desc: "Scan the admin-managed GCash QR code using your GCash app or QRPh-supported banking application.",
    color: "emerald",
    iconPath: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z",
  },
  {
    num: "04",
    title: "Upload Proof of Payment",
    desc: "Submit your reference number, contact information, and upload the payment receipt screenshot.",
    color: "amber",
    iconPath: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  },
  {
    num: "05",
    title: "Owner Manual Verification",
    desc: "The platform owner reviews the reference number and payment proof for security and legitimacy.",
    color: "purple",
    iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    num: "06",
    title: "Instant Deliverable Access",
    desc: "Once payment is verified, the system files unlock automatically in your customer portal for 1-click download.",
    color: "rose",
    iconPath: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  },
];

export function HowItWorksSection() {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  return (
    <section className="bg-white py-20 sm:py-28 relative overflow-hidden border-b border-slate-200/80 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider border border-blue-100 mb-4">
            <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
            Clear & Transparent Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How the Purchase Process Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Every transaction is manually verified by the owner to ensure payment legitimacy, prevent fraudulent orders, and protect both buyer and seller.
          </p>
        </div>

        {/* 6-Step Visual Timeline Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="rounded-2xl bg-white p-6 flex flex-col justify-between h-full border border-slate-200/90 shadow-xs hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    Step {step.num}
                  </span>
                  <div className="size-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 group-hover:text-blue-600 transition-colors">
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.iconPath} />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">
                <span>Phase 0{idx + 1}</span>
                <span>Verified Gateway</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Anti-Fraud Trust Container + Pre-Sale CTA */}
        <div className="mt-14 rounded-3xl border border-blue-100 bg-slate-50/80 p-8 sm:p-10 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
                Manual Verification Guarantee
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Why Manual Payment Verification?
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Manual verification ensures every transaction is authentic, prevents chargeback fraud, and guarantees that buyers receive legitimate, uncorrupted software zip packages directly tied to their verified reference number.
            </p>
          </div>

          {/* Pre-Sale Chat CTA Trigger */}
          <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
            <span className="text-xs font-bold text-slate-500">Need clarification before buying?</span>
            <button
              type="button"
              onClick={() => setIsChatModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Chat with Owner Before Purchasing &rarr;
            </button>
          </div>
        </div>

        {/* Pre-Sale Chat Modal Component */}
        <PreSaleChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
        />
      </div>
    </section>
  );
}
