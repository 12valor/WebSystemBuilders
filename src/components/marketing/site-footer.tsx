import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ShieldCheck, FolderOpen, Mail, ArrowRight } from "lucide-react";

const exploreLinks = [
  ["Systems Catalog", "/systems"],
  ["For Students", "/for-students"],
  ["For Businesses", "/for-business"],
  ["Custom Development", "/services/custom-development"],
];

const companyLinks = [
  ["About", "/about"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
  ["Privacy Policy", "/legal/privacy"],
  ["Terms of Service", "/legal/terms"],
];

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      aria-labelledby="footer-heading"
      className="relative bg-[#08090A] text-[#F5F5F7] before:absolute before:inset-0 before:bg-gradient-to-t before:from-[#08090A] before:to-transparent before:opacity-50"
    >
      {/* FOLDER SILHOUETTE TOP EDGE */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full text-[#08090A]"
          style={{ filter: "drop-shadow(0 -4px 8px rgba(0,0,0,0.3))" }}
        >
          <defs>
            <linearGradient id="folderGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D0E10" />
              <stop offset="100%" stopColor="#08090A" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 L0,28 C0,12.58 12.58,0 28,0 L1412,0 C1427.42,0 1440,12.58 1440,28 L1440,80 L0,80 Z"
            fill="url(#folderGradient)"
          />
          {/* Folder tab highlight */}
          <path
            d="M28,0 L1412,0 C1412,0 1412,4 1412,4 C1412,4 28,4 28,4 C28,4 28,0 28,0 Z"
            fill="#1A1C1F"
            opacity="0.6"
          />
          {/* Subtle tab ridge */}
          <path
            d="M56,0 L1384,0"
            stroke="#1A1C1F"
            strokeWidth="1.5"
            opacity="0.4"
          />
        </svg>
      </div>

      <h2 id="footer-heading" className="sr-only">
        Site Footer
      </h2>

      <div className="relative z-10 mx-auto w-[min(calc(100%-32px),1280px)] py-10 sm:py-12 md:w-[min(calc(100%-64px),1280px)] lg:py-16 lg:pt-20">
        <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* 1. LEFT — BRAND */}
          <div className="flex flex-col gap-3.5 lg:col-span-4">
            <Link
              href="/"
              aria-label="WebSystemBuilders home"
              className="-m-1 inline-flex w-fit items-center gap-3 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A] group"
            >
              <BrandLogo variant="full" priority className="size-9 shrink-0 transition-opacity group-hover:opacity-85" />
            </Link>
            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-[#94A3B8]">
              Ready-made software systems and custom development for students and growing businesses.
            </p>
            
            {/* Folder tag indicator */}
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#94A3B8]">
              <FolderOpen className="h-3.5 w-3.5" />
              <span>Systems Folder</span>
            </div>
          </div>

          {/* 2. CENTER — NAVIGATION */}
          <nav aria-label="Footer Navigation" className="grid grid-cols-2 gap-6 sm:gap-8 lg:col-span-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F7] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                Explore
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
                {exploreLinks.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 rounded px-2 py-1.5 text-[#94A3B8] transition-all duration-200 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 hover:pl-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F7] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                Company
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
                {companyLinks.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 rounded px-2 py-1.5 text-[#94A3B8] transition-all duration-200 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 hover:pl-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* 3. RIGHT — CONTACT */}
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-4 lg:pl-4">
            <h3 className="text-sm sm:text-base font-semibold text-[#F5F5F7]">
              Let&apos;s build something useful.
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[#94A3B8]">
              Have a project in mind or need help choosing a system?
            </p>
            <div className="flex flex-col items-start gap-3.5 pt-1">
              <a
                href="mailto:evangelista.agdiaz@gmail.com"
                className="flex items-center gap-2 w-fit rounded px-3 py-2 bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-[#94A3B8] transition-all duration-200 hover:bg-[#3B82F6]/10 hover:border-[#3B82F6]/30 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
              >
                <Mail className="h-4 w-4 shrink-0" />
                evangelista.agdiaz@gmail.com
              </a>

              <Link
                href="/contact"
                className="blue-button inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 text-xs sm:text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
              >
                Get in Touch
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
            
            {/* Social / trust indicators */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10 w-full">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#3B82F6]" />
                Verified Systems & Development
              </span>
              <span className="text-white/10">|</span>
              <span className="text-xs text-[#64748B]">websystembuilders.com</span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR - Clean and minimal */}
        <div className="mt-10 pt-6 border-t border-white/10">
          <div className="flex flex-col items-center justify-between gap-3 text-center text-xs font-medium text-[#94A3B8] sm:flex-row sm:text-left">
            <p className="text-[#64748B]">© 2026 WebSystemBuilders. All rights reserved.</p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <Link
                href="/legal/privacy"
                className="rounded transition-colors duration-150 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
              >
                Privacy Policy
              </Link>
              <span className="select-none text-white/20">|</span>
              <Link
                href="/legal/terms"
                className="rounded transition-colors duration-150 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
