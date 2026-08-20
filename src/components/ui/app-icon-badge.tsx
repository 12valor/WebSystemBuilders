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
  color = "slate",
  size = "md",
  className = "",
}: AppIconBadgeProps) {
  const sizeMap = {
    sm: { container: "w-9 h-9 rounded-lg p-2", icon: "w-4 h-4" },
    md: { container: "w-11 h-11 rounded-xl p-2.5", icon: "w-5 h-5" },
    lg: { container: "w-13 h-13 rounded-xl p-3", icon: "w-6 h-6" },
    xl: { container: "w-15 h-15 rounded-2xl p-3.5", icon: "w-7 h-7" },
  };

  const colorMap = {
    slate: {
      container: "bg-slate-100/90 text-slate-700 border border-slate-200/90 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600",
    },
    blue: {
      container: "bg-blue-50/90 text-blue-600 border border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200",
    },
    indigo: {
      container: "bg-indigo-50/90 text-indigo-600 border border-indigo-100 group-hover:bg-indigo-100 group-hover:border-indigo-200",
    },
    emerald: {
      container: "bg-emerald-50/90 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 group-hover:border-emerald-200",
    },
    amber: {
      container: "bg-amber-50/90 text-amber-700 border border-amber-100 group-hover:bg-amber-100 group-hover:border-amber-200",
    },
    rose: {
      container: "bg-rose-50/90 text-rose-600 border border-rose-100 group-hover:bg-rose-100 group-hover:border-rose-200",
    },
    purple: {
      container: "bg-purple-50/90 text-purple-600 border border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-200",
    },
  };

  const style = colorMap[color] || colorMap.slate;
  const sizeStyle = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${sizeStyle.container} ${style.container} ${className} transition-all duration-200 group-hover:scale-105 motion-reduce:transform-none`}
    >
      <Icon className={`${sizeStyle.icon} transition-colors duration-200`} strokeWidth={1.75} aria-hidden="true" />
    </div>
  );
}
