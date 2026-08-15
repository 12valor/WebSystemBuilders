import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ShieldCheck } from "lucide-react";

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
      className="border-t border-white/10 bg-[#08090A] text-[#F5F5F7]"
    >
      <h2 id="footer-heading" className="sr-only">
        Site Footer
      </h2>

      <div className="mx-auto w-[min(calc(100%-40px),1280px)] py-12 md:w-[min(calc(100%-64px),1280px)] lg:py-16 xl:w-[min(calc(100%-96px),1280px)]">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* 1. LEFT — BRAND */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Link
              href="/"
              className="-m-1 inline-flex w-fit items-center gap-3 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
            >
              <BrandLogo variant="full" priority className="h-8 w-auto" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#94A3B8]">
              Ready-made software systems and custom development for students and growing businesses.
            </p>
          </div>

          {/* 2. CENTER — NAVIGATION */}
          <nav aria-label="Footer Navigation" className="grid grid-cols-2 gap-8 sm:gap-10 lg:col-span-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F7]">
                Explore
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm">
                {exploreLinks.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="rounded text-[#94A3B8] transition-colors duration-150 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F7]">
                Company
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm">
                {companyLinks.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="rounded text-[#94A3B8] transition-colors duration-150 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* 3. RIGHT — CONTACT */}
          <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-4 lg:pl-4">
            <h3 className="text-base font-semibold text-[#F5F5F7]">
              Let’s build something useful.
            </h3>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              Have a project in mind or need help choosing a system?
            </p>
            <div className="flex flex-col items-start gap-4 pt-1">
              <a
                href="mailto:evangelista.agdiaz@gmail.com"
                className="w-fit rounded text-sm font-medium text-[#94A3B8] transition-colors duration-150 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
              >
                evangelista.agdiaz@gmail.com
              </a>

              <Link
                href="/contact"
                className="blue-button inline-flex min-h-[44px] items-center justify-center bg-[#3B82F6] px-5 py-2.5 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-6">
        <div className="mx-auto flex w-[min(calc(100%-40px),1280px)] flex-col items-center justify-between gap-4 text-xs font-medium text-[#94A3B8] sm:flex-row md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
          <p>© 2026 WebSystemBuilders. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-3">
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
            <span className="select-none text-white/20">|</span>
            <span className="inline-flex items-center gap-1.5 text-[#94A3B8]">
              <ShieldCheck className="h-4 w-4 text-[#94A3B8]" />
              Verified Systems & Development
            </span>
            <span className="select-none text-white/20">|</span>
            <span className="text-[#F5F5F7]">websystembuilders.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

