"use client";

import React from "react";

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
  bg = "white",
  onClick,
}: TactileCardProps) {
  const bgStyles = {
    white: "bg-white",
    slate: "bg-slate-50/70",
    gradient: "bg-white",
    glass: "bg-white",
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl border border-slate-200/90 p-6 md:p-7 ${bgStyles[bg]} 
        shadow-2xs ${hoverEffect ? "transition-colors duration-150 hover:border-slate-400/80" : ""} 
        overflow-hidden group ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
