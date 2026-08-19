import Image from "next/image";

export function PayPalLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/logos/PayPal.svg.webp"
      alt="PayPal"
      width={120}
      height={32}
      className={`object-contain ${className}`}
      priority
    />
  );
}

export function GCashLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/logos/GCash_logo.svg.webp"
      alt="GCash"
      width={120}
      height={32}
      className={`object-contain ${className}`}
      priority
    />
  );
}

export function MayaLogo({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/logos/Maya_logo.svg.webp"
      alt="Maya"
      width={120}
      height={32}
      className={`object-contain ${className}`}
      priority
    />
  );
}

export function CardBrandIcons({ className = "h-3.5 w-auto" }: { className?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Visa SVG */}
      <svg viewBox="0 0 32 10" className={className} fill="#1434CB">
        <path d="M12.3 0.5L8.1 10H5.5L3.3 2.1C3.1 1.5 2.9 1.3 2.5 1C1.8 0.6 0.8 0.3 0 0.2L0.1 0.5H4.3C4.9 0.5 5.4 0.9 5.5 1.5L6.6 7L9.8 0.5H12.3ZM23.2 6.8C23.2 4.2 19.5 4.1 19.5 2.9C19.5 2.6 19.9 2.2 20.7 2.1C21 2 22.1 2 23.3 2.5L23.7 0.7C23.1 0.4 22.3 0.2 21.2 0.2C18.6 0.2 16.8 1.6 16.8 3.6C16.8 5.1 18.2 5.9 19.2 6.4C20.3 6.9 20.6 7.2 20.6 7.7C20.6 8.4 19.8 8.7 19 8.7C17.7 8.7 16.9 8.5 16.2 8.1L15.8 10C16.5 10.3 17.7 10.6 18.9 10.6C21.7 10.6 23.2 9.3 23.2 6.8ZM30.1 10H32.3L30.3 0.5H28.4C27.9 0.5 27.5 0.7 27.3 1.1L23.4 10H26L26.5 8.6H29.8L30.1 10ZM27.3 6.7L28.6 3L29.4 6.7H27.3ZM16 0.5L14 10H11.5L13.6 0.5H16Z" />
      </svg>
      {/* Mastercard SVG */}
      <svg viewBox="0 0 20 12" className={className}>
        <circle cx="6" cy="6" r="5" fill="#EB001B" />
        <circle cx="14" cy="6" r="5" fill="#F79E1B" fillOpacity="0.85" />
      </svg>
    </div>
  );
}
