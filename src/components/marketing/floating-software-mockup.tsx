"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function FloatingSoftwareMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[1250px] mx-auto flex items-center justify-center px-2 sm:px-4 select-none"
    >
      <div className="w-[92%] sm:w-[85%] lg:w-[82%] max-w-[1250px] mx-auto filter drop-shadow-[0_20px_45px_rgba(15,23,42,0.1)]">
        <Image
          src="/mockup.svg"
          alt="WebSystemBuilders Software Platform Showcase"
          width={1350}
          height={1080}
          priority
          sizes="(max-width: 640px) 95vw, (max-width: 1024px) 85vw, 1250px"
          className="w-full h-auto object-contain block mx-auto"
        />
      </div>
    </motion.div>
  );
}
