"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowUpRight, Sparkles, User, Menu, X } from "lucide-react";

const navigation = [
  { label: "Systems Catalog", href: "/systems" },
  { label: "For Students", href: "/for-students" },
  { label: "For Business", href: "/for-business" },
  { label: "Custom Development", href: "/services/custom-development" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Process", href: "/process" },
];

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-900/[0.06] transition-all">
      <div className="mx-auto flex h-[76px] w-[min(calc(100%-40px),1280px)] items-center justify-between gap-6 md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        {/* Brand Mark */}
        <Link
          href="/"
          aria-label="WebSystemBuilders home"
          className="shrink-0 group flex items-center gap-2 focus-visible:outline-none"
        >
          <BrandLogo variant="light" priority className="h-auto w-[175px] sm:w-[200px] transition-transform duration-300 group-hover:scale-[1.02]" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-1.5 xl:flex bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60 shadow-xs">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-full transition-all duration-200 hover:text-slate-900 hover:bg-white hover:shadow-xs"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/account"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Account</span>
          </Link>
          <Link href="/request-a-quote">
            <MagneticButton size="sm" variant="primary">
              <span>Request a Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((open) => !open)}
          className="relative ml-auto grid size-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xs hover:bg-slate-50 xl:hidden"
        >
          {isOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="border-t border-slate-200 bg-white/98 backdrop-blur-xl shadow-xl xl:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-2 py-6">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Account Login</span>
              </Link>
              <Link href="/request-a-quote" onClick={() => setIsOpen(false)} className="w-full">
                <MagneticButton size="md" variant="primary" className="w-full">
                  <span>Request a Quote</span>
                  <Sparkles className="w-4 h-4" />
                </MagneticButton>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
