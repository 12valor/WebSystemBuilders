import { cn } from "@/lib/utils";
import React from "react";

interface GradientBlurBgProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function GradientBlurBg({ className, children, ...props }: GradientBlurBgProps) {
  return (
    <div className={cn("min-h-full w-full bg-white relative", className)} {...props}>
      {/* Dual Gradient Overlay (Top) Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
            radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.3), transparent),
            radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.3), transparent)
          `,
          backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
        }}
      />
      {children}
    </div>
  );
}

export const Component = GradientBlurBg;
