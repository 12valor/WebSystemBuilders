"use client";

import React from "react";
import { motion } from "framer-motion";

interface TactileCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glassHighlight?: boolean;
  bg?: "white" | "slate" | "gradient" | "glass";
  onClick?: () => void;
}

export function TactileCard({
  children,
  className = "",
  hoverEffect = true,
  glassHighlight = true,
  bg = "white",
  onClick,
}: TactileCardProps) {
  const bgStyles = {
    white: "bg-white",
    slate: "bg-slate-50/70",
    gradient: "bg-gradient-to-b from-white via-white to-slate-50/50",
    glass: "bg-white/80 backdrop-blur-xl",
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverEffect ? { y: -6, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-[24px] border border-slate-900/[0.08] p-6 md:p-8 ${bgStyles[bg]} 
        shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05),0_12px_32px_-12px_rgba(15,23,42,0.08)] 
        hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12),0_12px_32px_-8px_rgba(15,23,42,0.08)] 
        hover:border-slate-900/[0.12] transition-colors overflow-hidden group ${
          onClick ? "cursor-pointer" : ""
        } ${className}`}
    >
      {/* Top glass highlight sheen */}
      {glassHighlight && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-80" />
      )}

      {/* Subtle hover gradient illumination */}
      {hoverEffect && (
        <div className="absolute -inset-px rounded-[24px] bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
