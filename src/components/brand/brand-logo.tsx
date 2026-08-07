import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
  priority?: boolean;
  className?: string;
  variant?: "icon" | "full";
};

export function BrandLogo({ compact = false, priority = false, className, variant = "icon" }: BrandLogoProps) {
  if (variant === "full") {
    return (
      <span className={`relative inline-flex items-center shrink-0 ${className ?? ""}`}>
        <Image
          src="/brand/websystembuilders-logo-on-dark.svg"
          alt="WebSystemBuilders"
          width={520}
          height={80}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="h-auto w-full object-contain"
        />
      </span>
    );
  }

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