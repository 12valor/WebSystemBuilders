"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";

const navigation = [
  { label: "Systems", href: "/systems" },
  { label: "For Students", href: "/for-students" },
  { label: "For Businesses", href: "/for-business" },
  { label: "Custom Development", href: "/services/custom-development" },
  { label: "Pricing", href: "/systems" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md transition-shadow">
      <div className="mx-auto flex h-[76px] w-[min(calc(100%-40px),1280px)] items-center justify-between gap-6 md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <Link href="/" aria-label="WebSystemBuilders home" className="shrink-0 rounded-sm">
          <BrandLogo variant="light" priority className="h-auto w-[175px] sm:w-[200px]" />
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 xl:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#2563EB]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 xl:flex">
          <Link href="/account" className="text-sm font-medium text-[#4B5563] transition-colors hover:text-[#111827]">
            Account
          </Link>
          <Link
            href="/request-a-quote"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#1D4ED8] hover:shadow-md"
          >
            Request a Quote
          </Link>
        </div>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((open) => !open)}
          className="relative ml-auto grid size-11 place-items-center rounded-xl border border-[#E5E7EB] bg-white text-[#111827] xl:hidden"
        >
          <span className={`absolute h-0.5 w-5 bg-[#111827] transition-transform ${isOpen ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-0.5 w-5 bg-[#111827] transition-transform ${isOpen ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>
      <nav id="mobile-menu" aria-label="Mobile navigation" hidden={!isOpen} className="border-t border-[#E5E7EB] bg-white shadow-lg xl:hidden">
        <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-1 py-5">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="border-b border-[#F1F5F9] px-2 py-3.5 text-base font-medium text-[#374151] transition-colors hover:text-[#2563EB]"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/account" onClick={() => setIsOpen(false)} className="border-b border-[#F1F5F9] px-2 py-3.5 text-base font-medium text-[#374151]">
            Account
          </Link>
          <Link
            href="/request-a-quote"
            onClick={() => setIsOpen(false)}
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#2563EB] px-6 text-base font-semibold text-white shadow-xs"
          >
            Request a Quote
          </Link>
        </div>
      </nav>
    </header>
  );
}
