"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";

const navigation = [
  { label: "Systems", href: "/systems" },
  { label: "For students", href: "/#students" },
  { label: "For business", href: "/#businesses" },
  { label: "Custom development", href: "/#custom" },
  { label: "Process", href: "/#process" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08090a]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] w-[min(calc(100%-40px),1280px)] items-center gap-8 md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <Link href="/" aria-label="WebSystemBuilders home" className="shrink-0 rounded-sm">
          <BrandLogo priority className="h-auto w-[184px] sm:w-[214px]" />
        </Link>

        <nav aria-label="Primary navigation" className="ml-auto hidden items-center gap-6 xl:flex">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium text-secondary transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-4 xl:flex">
          <span className="text-sm font-medium text-secondary" aria-label="Display currency: Philippine peso">PHP</span>
          <Link href="/account" className="text-sm font-medium text-secondary transition-colors hover:text-foreground">Account</Link>
          <Link href="/#contact" className="inline-flex min-h-10 items-center justify-center rounded-[10px] bg-foreground px-4 text-sm font-semibold text-[#08090a] transition-transform hover:-translate-y-px hover:bg-white">
            Request a quote
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((open) => !open)}
          className="relative ml-auto grid size-11 place-items-center rounded-[9px] border border-white/10 xl:hidden"
        >
          <span className={`absolute h-px w-[18px] bg-foreground transition-transform ${isOpen ? "rotate-45" : "-translate-y-1"}`} />
          <span className={`absolute h-px w-[18px] bg-foreground transition-transform ${isOpen ? "-rotate-45" : "translate-y-1"}`} />
        </button>
      </div>

      <nav id="mobile-menu" aria-label="Mobile navigation" hidden={!isOpen} className="border-t border-white/10 bg-background xl:hidden">
        <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-1 py-5">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)} className="border-b border-white/10 px-1 py-3 text-secondary transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <Link href="/#about" onClick={() => setIsOpen(false)} className="border-b border-white/10 px-1 py-3 text-secondary">About</Link>
          <Link href="/account" onClick={() => setIsOpen(false)} className="border-b border-white/10 px-1 py-3 text-secondary">Account</Link>
          <Link href="/#contact" onClick={() => setIsOpen(false)} className="mt-3 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foreground px-5 font-semibold text-[#08090a]">Request a quote</Link>
        </div>
      </nav>
    </header>
  );
}