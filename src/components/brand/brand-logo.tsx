import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
  priority?: boolean;
  className?: string;
  variant?: "icon" | "full";
  textClassName?: string;
};

export function BrandLogo({
  compact = false,
  priority = false,
  className,
  variant = "icon",
  textClassName,
}: BrandLogoProps) {
  const icon = (
    <span className={`relative inline-block aspect-square shrink-0 overflow-hidden ${className ?? "size-10"}`}>
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

  if (variant === "full") {
    return (
      <span className="inline-flex items-center gap-2.5 shrink-0">
        {icon}
        <span className={textClassName ?? "font-heading text-lg sm:text-xl font-bold tracking-tight text-[#F5F5F7]"}>
          WebSystemBuilders
        </span>
      </span>
    );
  }

  return icon;
}