"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ArrowUpRight, User, Menu, X, Sparkles } from "lucide-react";

const navigation = [
  { label: "Systems Catalog", href: "/systems" },
  { label: "Students", href: "/for-students" },
  { label: "Businesses", href: "/for-business" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Process", href: "/process" },
];

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-3 md:top-4 z-50 mx-auto w-[min(calc(100%-24px),1240px)] transition-all">
      <div className="flex h-16 items-center justify-between gap-4 rounded-full bg-white/90 px-4 md:px-6 backdrop-blur-xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-slate-300/80">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          aria-label="WebSystemBuilders home"
          className="shrink-0 group flex items-center gap-2 focus-visible:outline-none"
        >
          <BrandLogo
            variant="light"
            priority
            className="h-auto w-[150px] sm:w-[170px] transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Center: Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 xl:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 rounded-full transition-all duration-200 hover:text-slate-950 hover:bg-slate-100/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Action Controls */}
        <div className="hidden items-center gap-3 xl:flex">
          <Link
            href="/account"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Account</span>
          </Link>
          <Link
            href="/request-a-quote"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] shadow-sm hover:shadow-md hover:opacity-95 transition-all duration-200 group"
          >
            <span>Request a Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((open) => !open)}
          className="relative ml-auto grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-xs hover:bg-slate-50 xl:hidden"
        >
          {isOpen ? <X className="w-4 h-4 text-slate-800" /> : <Menu className="w-4 h-4 text-slate-800" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="mt-2 rounded-2xl border border-slate-200/90 bg-white/98 p-4 backdrop-blur-2xl shadow-2xl xl:hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="grid gap-1">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
            <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Account Login</span>
              </Link>
              <Link
                href="/request-a-quote"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] shadow-sm"
              >
                <span>Request a Quote</span>
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

