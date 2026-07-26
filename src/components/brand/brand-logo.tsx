import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
  priority?: boolean;
  variant?: "light" | "dark";
  className?: string;
};

export function BrandLogo({ compact = false, priority = false, variant = "light", className }: BrandLogoProps) {
  const src = compact
    ? variant === "dark" ? "/brand/websystembuilders-mark-on-dark.svg" : "/brand/websystembuilders-mark.svg"
    : variant === "dark" ? "/brand/websystembuilders-logo-on-dark.svg" : "/brand/websystembuilders-logo.svg";

  return (
    <Image
      src={src}
      alt={compact ? "" : "WebSystemBuilders"}
      width={compact ? 112 : 520}
      height={compact ? 64 : 80}
      priority={priority}
      className={className}
    />
  );
}