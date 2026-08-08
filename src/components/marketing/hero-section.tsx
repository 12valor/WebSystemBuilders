"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingSoftwareMockup } from "@/components/marketing/floating-software-mockup";
import { FoldText } from "@/components/ui/fold-text";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-2 sm:pb-4 md:pb-6">
      {/* Radial Gradient Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #ffffff 35%, #93c5fd 85%, #60a5fa 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Hero Headline & Supporting Description */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="font-extrabold tracking-[-0.035em] text-[#0F172A] leading-[1.04]"
          >
            <FoldText
              text="Handcrafted Software Systems for Students & Businesses"
              splitBy="word"
              hinge="top"
              trigger="scroll"
              duration={0.65}
              stagger={0.045}
              ease="power3.out"
              perspective={700}
              creaseShading={0.55}
              fontSize="clamp(2.25rem, 5.5vw, 4.75rem)"
              fontWeight={800}
              color="#0F172A"
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
            className="mt-6 text-lg sm:text-xl text-[#64748B] leading-relaxed font-normal max-w-[720px] mx-auto"
          >
            Compare administrator-published systems for POS, inventory, warehouse, and approved academic use, or request clearly scoped custom development.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              href="/systems"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-full bg-[#2563EB] shadow-[0_10px_25px_-8px_rgba(37,99,235,0.32)] hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
            >
              <span>Explore Ready Systems</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/request-a-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#0F172A] rounded-full bg-white/90 border border-[#E5E7EB] shadow-[0_4px_14px_rgba(15,23,42,0.04)] hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Request Custom Development</span>
            </Link>
          </motion.div>
        </div>

        {/* Product Showcase & Floating Cards */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: "easeOut" }}
          className="mt-6 md:mt-10"
        >
          <FloatingSoftwareMockup />
        </motion.div>
      </div>
    </section>
  );
}
