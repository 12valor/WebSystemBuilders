import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
  priority?: boolean;
  className?: string;
  variant?: "icon" | "full";
  textClassName?: string;
  onDark?: boolean;
};

export function BrandLogo({
  compact = false,
  priority = false,
  className,
  variant = "icon",
  textClassName,
  onDark = false,
}: BrandLogoProps) {
  const icon = onDark ? (
    <span className={`relative inline-flex items-center justify-center shrink-0 ${className ?? "size-9"}`}>
      <svg
        viewBox="0 0 112 64"
        className="w-full h-auto drop-shadow-[0_0_12px_rgba(59,130,246,0.25)]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 12 32 52 56 12 80 52 100 12"
          stroke="#F5F5F7"
          strokeWidth="12"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M32 52 56 12"
          stroke="#3B82F6"
          strokeWidth="12"
          strokeLinecap="butt"
        />
      </svg>
    </span>
  ) : (
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