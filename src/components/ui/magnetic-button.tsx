"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "indigo" | "white" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  magneticStrength?: number;
}

export function MagneticButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  magneticStrength = 0.25,
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * magneticStrength;
    const y = (clientY - (top + height / 2)) * magneticStrength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles =
    "relative inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none overflow-hidden group cursor-pointer";

  const sizeStyles = {
    sm: "h-9 px-4 rounded-xl text-xs gap-1.5",
    md: "h-11 px-6 rounded-2xl text-sm gap-2",
    lg: "h-13 px-8 rounded-2xl text-base gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "blue-button bg-blue-600 text-white",
    indigo:
      "bg-indigo-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:bg-indigo-700 hover:shadow-[0_6px_20px_rgba(79,70,229,0.45)] border border-indigo-500/30",
    secondary:
      "bg-slate-900 text-white shadow-[0_4px_14px_rgba(15,23,42,0.15)] hover:bg-slate-800 border border-slate-800",
    outline:
      "bg-white/80 backdrop-blur-md text-slate-900 border border-slate-200 shadow-xs hover:bg-slate-50 hover:border-slate-300",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900",
    white:
      "bg-white text-slate-900 font-extrabold shadow-[0_10px_25px_-5px_rgba(0,0,0,0.25)] hover:bg-slate-50 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] border border-white/90",
    glass:
      "bg-white/15 text-white font-semibold backdrop-blur-md border border-white/30 hover:bg-white/25 shadow-xs",
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 250, damping: 18, mass: 0.5 }}
      onClick={onClick}
      {...(props as any)}
    >
      {/* Subtle shine sheen effect on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
