export function PayPalLogo({ className = "h-4.5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 85 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M13.2 2H6.5C5.9 2 5.4 2.4 5.3 3L2 22H6.6L7.9 14.5H10.8C14.7 14.5 17.6 12.5 18.2 8.7C18.6 6.3 17.4 4.5 15.3 3.3C14.7 2.4 13.9 2 13.2 2Z"
        fill="#003087"
      />
      <path
        d="M14.7 8.3C14.3 11 12 12.7 9.1 12.7H7.3L6.1 19.8H9.6C10.1 19.8 10.5 19.4 10.6 18.9L11.5 13.5H12.2C15.3 13.5 17.6 11.9 18.1 8.8C18.4 7.2 18 5.8 17 4.9C16.3 6.3 15.3 7.6 14.7 8.3Z"
        fill="#0079C1"
      />
      <path
        d="M13.2 2H6.5C5.9 2 5.4 2.4 5.3 3L2 22H6.6L7.9 14.5H10.8C14.7 14.5 17.6 12.5 18.2 8.7C18.6 6.3 17.4 4.5 15.3 3.3C14.7 2.4 13.9 2 13.2 2Z"
        fill="#003087"
      />
      <text
        x="24"
        y="17.5"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="16"
        fontStyle="italic"
        fill="#003087"
      >
        Pay<tspan fill="#0079C1">Pal</tspan>
      </text>
    </svg>
  );
}

export function GCashLogo({ className = "h-4.5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 85 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="10.5" fill="#005CE6" />
      <path
        d="M12.2 6.8C9.2 6.8 6.8 9.2 6.8 12.2C6.8 15.2 9.2 17.6 12.2 17.6C14.7 17.6 16.8 16 17.4 13.7H12.2V11.4H19.9C20 11.8 20.1 12.3 20.1 12.8C20.1 17.2 16.5 20.8 12.2 20.8C7.4 20.8 3.5 16.9 3.5 12.2C3.5 7.4 7.4 3.5 12.2 3.5C14.7 3.5 16.9 4.6 18.4 6.2L16.4 8.2C15.3 7.1 13.8 6.8 12.2 6.8Z"
        fill="white"
      />
      <text
        x="26"
        y="17"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="15"
        letterSpacing="-0.4px"
        fill="#005CE6"
      >
        GCash
      </text>
    </svg>
  );
}

export function MayaLogo({ className = "h-4.5 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 78 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="10.5" fill="#00D665" />
      <path
        d="M7.5 15.5V8.5H9.5L12 12.5L14.5 8.5H16.5V15.5H14.7V11L12.6 14.2H11.4L9.3 11V15.5H7.5Z"
        fill="#000000"
      />
      <text
        x="26"
        y="17"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="16"
        letterSpacing="-0.6px"
        fill="#000000"
      >
        maya
      </text>
    </svg>
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
