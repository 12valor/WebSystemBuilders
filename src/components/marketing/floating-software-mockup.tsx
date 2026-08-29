"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function FloatingSoftwareMockup() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Subtle scroll-driven depth
  const mockupScrollY = useTransform(scrollYProgress, [0, 1], [8, -24]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[1240px] select-none px-2 pb-0 pt-3 sm:px-4 sm:pt-4"
    >
      {/* Centerpiece Hero Product Showcase (mockup.svg) */}
      <motion.div
        style={reduceMotion ? undefined : { y: mockupScrollY }}
        initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.85,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.4,
        }}
        className="relative z-10 mx-auto flex w-full items-center justify-center will-change-transform"
      >
        <div className="mx-auto w-full max-w-[980px] drop-shadow-[0_24px_48px_rgba(15,23,42,0.12)] xl:max-w-[1060px]">
          <Image
            src="/mockup.svg"
            alt="WebSystemBuilders Software Platform Showcase"
            width={1350}
            height={1080}
            priority
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 1060px"
            className="w-full h-auto object-contain block mx-auto"
          />
        </div>
      </motion.div>
    </div>
  );
}
