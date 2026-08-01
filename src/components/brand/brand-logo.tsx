import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
  priority?: boolean;
  className?: string;
};

export function BrandLogo({ compact = false, priority = false, className }: BrandLogoProps) {
  return (
    <span className={`relative inline-block aspect-square shrink-0 overflow-hidden ${className ?? ""}`}>
      <Image
        src="/brand/websystembuilders-logo.png"
        alt={compact ? "" : "WebSystemBuilders"}
        width={1920}
        height={1920}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="absolute -left-[8.6%] -top-[9.4%] h-auto w-[118%] max-w-none"
      />
    </span>
  );
}