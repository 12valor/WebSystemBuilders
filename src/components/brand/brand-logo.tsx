import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
  priority?: boolean;
  variant?: "light" | "dark";
  className?: string;
};

export function BrandLogo({ compact = false, priority = false, variant = "light", className }: BrandLogoProps) {
  return (
    <span
      className={`relative inline-block aspect-square shrink-0 overflow-hidden ${
        variant === "light" ? "rounded-xl bg-[#08090A]" : ""
      } ${className ?? ""}`}
    >
      <Image
        src="/brand/websystembuilders-logo.png"
        alt={compact ? "" : "WebSystemBuilders"}
        width={1920}
        height={1920}
        priority={priority}
        className="absolute -left-[8.6%] -top-[9.4%] h-auto w-[118%] max-w-none"
      />
    </span>
  );
}