"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FloatingSoftwareMockup } from "@/components/marketing/floating-software-mockup";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Scroll-driven exit parallax (active as hero leaves the viewport)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.96, 0.7]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 36]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden -mt-14 pb-4 pt-20 sm:-mt-16 sm:pb-5 sm:pt-28 md:pt-32"
    >
      {/* Purple Gradient Grid Right Background with subtle parallax */}
      <motion.div
        style={reduceMotion ? undefined : { y: bgY }}
        className="pointer-events-none absolute -top-20 inset-x-0 bottom-0 z-0 h-[calc(100%+80px)] w-full will-change-transform"
      >
        <div
          className="h-full w-full bg-white"
          style={{
            backgroundImage: `
              linear-gradient(to right, #f0f0f0 1px, transparent 1px),
              linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
              radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent)
            `,
            backgroundSize: "96px 64px, 96px 64px, 100% 100%",
          }}
        />
        {/* Soft bottom blend to transition smoothly into #FAFAFC */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAFAFC] to-transparent pointer-events-none" />
      </motion.div>

      <div className="relative z-10 mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Hero Headline & Supporting Description */}
        <motion.div
          style={reduceMotion ? undefined : { y: textY, opacity: textOpacity }}
          className="mx-auto mb-8 max-w-5xl text-center md:mb-10 will-change-transform"
        >
          <h1 className="font-heading text-[clamp(1.85rem,6.5vw,4.5rem)] font-bold leading-[1.06] tracking-[-0.035em] text-[#0F172A] sm:text-[clamp(2.25rem,5.2vw,4.5rem)] sm:leading-[0.98] sm:tracking-[-0.052em]">
            {/* Line 1: Masked Line Reveal */}
            <span className="block overflow-hidden pb-1.5 -mb-1.5">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.08,
                }}
              >
                Handcrafted Software Systems
              </motion.span>
            </span>
            {" "}
            {/* Line 2: Masked Line Reveal */}
            <span className="mt-1 block overflow-hidden pb-1.5 -mb-1.5">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.75,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.18,
                }}
              >
                for Students &amp; <span className="text-[#2563EB]">Businesses</span>
              </motion.span>
            </span>
          </h1>

          {/* Supporting Copy: Soft Fade-up */}
          <motion.p
            initial={reduceMotion ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.28,
            }}
            className="mx-auto mt-4 max-w-[680px] font-sans text-sm font-normal leading-relaxed text-[#64748B] sm:mt-5 sm:text-base sm:leading-8 md:text-lg"
          >
            Compare administrator-published systems for POS, inventory, warehouse, and approved academic use, or request clearly scoped custom development.
          </motion.p>

          {/* Action CTAs: Quick Stagger Reveal */}
          <motion.div
            initial={reduceMotion ? false : { y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.38,
            }}
            className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row"
          >
            <Link
              href="/systems"
              className="blue-button group inline-flex min-h-[48px] h-12 w-full items-center justify-center gap-2 bg-[#2563EB] px-7 text-sm font-semibold text-white motion-reduce:transition-none sm:w-auto"
            >
              <span>Explore Ready Systems</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/request-a-quote"
              className="inline-flex min-h-[48px] h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-7 text-sm font-semibold text-[#0F172A] shadow-sm transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 motion-reduce:transform-none motion-reduce:transition-none sm:w-auto"
            >
              <span>Request Custom Development</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Product Showcase */}
        <div className="mt-4 md:mt-6">
          <FloatingSoftwareMockup />
        </div>
      </div>
    </section>
  );
}
