"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MessageSquare, ShieldCheck, Clock } from "lucide-react";
import { PreSaleChatModal } from "@/components/marketing/pre-sale-chat-modal";

export function FinalCallToAction() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <section
      id="contact"
      aria-labelledby="cta-title"
      className="border-t border-slate-200/80 bg-[#FAFAFC] py-16 sm:py-20 lg:py-24"
    >
      <PreSaleChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr] items-stretch">
          
          {/* ================= LEFT CARD: MAIN SYSTEM DISCOVERY ================= */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-slate-800 bg-[#090C15] p-7 text-white shadow-md sm:p-10 lg:p-11">
            {/* Ambient background glow */}
            <div
              className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-blue-600/15 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-400">
                READY TO DEPLOY
              </span>
              <h2
                id="cta-title"
                className="mt-3 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl leading-[1.12]"
              >
                Launch your next software system today.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Browse production-ready systems with complete source code, or request a custom build scoped directly with the developer.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/systems"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none"
                >
                  <span>Browse Systems</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>

                <Link
                  href="/request-a-quote"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-6 text-sm font-semibold text-slate-200 shadow-xs transition-colors duration-150 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 motion-reduce:transition-none"
                >
                  <span>Request Custom Build</span>
                </Link>
              </div>
            </div>

            {/* Software Mockup Image */}
            <div className="relative z-10 mt-8 -mb-7 -mr-7 sm:-mb-10 sm:-mr-10 lg:-mb-11 lg:-mr-11 overflow-hidden rounded-tl-2xl border-t border-l border-slate-700/80 bg-slate-900/90 shadow-2xl">
              <Image
                src="/images/cta-dashboard-preview.jpg"
                alt="WebSystemBuilders Software Dashboard Preview"
                width={960}
                height={540}
                className="w-full h-auto object-cover object-left-top transition-transform duration-300 hover:scale-[1.01] motion-reduce:transform-none"
              />
            </div>
          </div>

          {/* ================= RIGHT CARD: DIRECT DEVELOPER CONSULTATION ================= */}
          <div className="relative flex flex-col justify-between rounded-[28px] border border-slate-200/90 bg-white p-7 shadow-xs sm:p-9">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500">
                PRE-SALE SUPPORT
              </span>
              <h3 className="mt-3 font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl leading-snug">
                Talk directly with the developer.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Have questions about system architecture, licensing, or custom requirements? Get honest technical answers before you decide.
              </p>

              {/* Inclusions / Highlights */}
              <div className="mt-6 space-y-3.5 border-y border-slate-100 py-5 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 shrink-0">
                    <MessageSquare className="size-3.5" aria-hidden="true" />
                  </div>
                  <span>Direct technical answers (no sales reps)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 shrink-0">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                  </div>
                  <span>Requirements & scope validation</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 shrink-0">
                    <Clock className="size-3.5" aria-hidden="true" />
                  </div>
                  <span>Responsive, same-day consultation</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 motion-reduce:transition-none"
              >
                <span>Ask a Question</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>

              <p className="text-center text-xs text-slate-500">
                Need a full project quote?{" "}
                <Link
                  href="/request-a-quote"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Request a quote
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
