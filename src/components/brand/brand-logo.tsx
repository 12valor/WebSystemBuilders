import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
  priority?: boolean;
  className?: string;
};

export function BrandLogo({ compact = false, priority = false, className }: BrandLogoProps) {
  return (
    <Image
      src={compact ? "/brand/websystembuilders-mark-on-dark.svg" : "/brand/websystembuilders-logo-on-dark.svg"}
      alt={compact ? "" : "WebSystemBuilders"}
      width={compact ? 112 : 520}
      height={compact ? 64 : 80}
      priority={priority}
      className={className}
    />
  );
}