import { cn } from "@/lib/utils";
import React from "react";

interface GradientBlurBgProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function GradientBlurBg({ className, children, ...props }: GradientBlurBgProps) {
  return (
    <div className={cn("min-h-full w-full bg-white relative", className)} {...props}>
      {/* Purple Gradient Grid Right Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f0f0f0 1px, transparent 1px),
            linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
            radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent)
          `,
          backgroundSize: "96px 64px, 96px 64px, 100% 100%",
        }}
      />
      {children}
    </div>
  );
}

export const Component = GradientBlurBg;
