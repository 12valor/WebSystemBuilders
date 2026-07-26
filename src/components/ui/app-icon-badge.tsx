"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface AppIconBadgeProps {
  icon: LucideIcon;
  color?: "blue" | "indigo" | "emerald" | "amber" | "rose" | "purple" | "slate";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function AppIconBadge({
  icon: Icon,
  color = "blue",
  size = "md",
  className = "",
}: AppIconBadgeProps) {
  const sizeMap = {
    sm: { container: "w-9 h-9 rounded-xl p-1.5", icon: "w-4 h-4" },
    md: { container: "w-12 h-12 rounded-2xl p-2.5", icon: "w-5.5 h-5.5" },
    lg: { container: "w-14 h-14 rounded-2xl p-3", icon: "w-7 h-7" },
    xl: { container: "w-16 h-16 rounded-[22px] p-3.5", icon: "w-8 h-8" },
  };

  const colorMap = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadow: "shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)]",
      ring: "ring-1 ring-blue-400/40",
      text: "text-white",
    },
    indigo: {
      bg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      shadow: "shadow-[0_8px_16px_-4px_rgba(79,70,229,0.4)]",
      ring: "ring-1 ring-indigo-400/40",
      text: "text-white",
    },
    emerald: {
      bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      shadow: "shadow-[0_8px_16px_-4px_rgba(16,185,129,0.4)]",
      ring: "ring-1 ring-emerald-400/40",
      text: "text-white",
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-500 to-orange-600",
      shadow: "shadow-[0_8px_16px_-4px_rgba(245,158,11,0.4)]",
      ring: "ring-1 ring-amber-400/40",
      text: "text-white",
    },
    rose: {
      bg: "bg-gradient-to-br from-rose-500 to-pink-600",
      shadow: "shadow-[0_8px_16px_-4px_rgba(244,63,94,0.4)]",
      ring: "ring-1 ring-rose-400/40",
      text: "text-white",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-violet-600",
      shadow: "shadow-[0_8px_16px_-4px_rgba(168,85,247,0.4)]",
      ring: "ring-1 ring-purple-400/40",
      text: "text-white",
    },
    slate: {
      bg: "bg-gradient-to-br from-slate-800 to-slate-900",
      shadow: "shadow-[0_8px_16px_-4px_rgba(15,23,42,0.3)]",
      ring: "ring-1 ring-slate-700/40",
      text: "text-white",
    },
  };

  const style = colorMap[color];
  const sizeStyle = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center ${sizeStyle.container} ${style.bg} ${style.shadow} ${style.ring} ${className} transition-transform duration-300 hover:scale-105`}
    >
      {/* 3D Glass highlight layer */}
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/30 via-transparent to-black/10 pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-1/3 bg-white/20 blur-[1px] rounded-t-full pointer-events-none" />

      {/* Icon */}
      <Icon className={`relative z-10 ${sizeStyle.icon} ${style.text} drop-shadow-sm`} />
    </div>
  );
}
