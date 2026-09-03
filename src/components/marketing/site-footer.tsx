"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const navigationLinks = [
  { label: "Systems Catalog", href: "/systems" },
  { label: "For Students", href: "/for-students" },
  { label: "For Business", href: "/for-business" },
  { label: "Custom Builds", href: "/contact?type=custom" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/websystembuilders" },
  { label: "LinkedIn", href: "https://linkedin.com/company/websystembuilders" },
  { label: "Twitter", href: "https://twitter.com/websysbuilders" },
];

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      aria-labelledby="footer-heading"
      className="relative overflow-hidden bg-[#07080A] text-[#F5F5F7] min-h-screen min-h-[100dvh] flex flex-col justify-between pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 border-t border-white/[0.08]"
    >
      <h2 id="footer-heading" className="sr-only">
        Site Footer
      </h2>

      {/* ATMOSPHERIC BACKGROUND AURA (Matching reference deep cosmic glow) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Deep blue / indigo glow on left-center */}
        <div className="absolute -bottom-16 left-[28%] h-[420px] w-[580px] -translate-x-1/2 rounded-full bg-[#1E3A8A]/30 blur-[130px]" />
        {/* Muted violet / magenta aura on right */}
        <div className="absolute -bottom-12 right-[22%] h-[400px] w-[520px] translate-x-1/2 rounded-full bg-[#4C1D95]/25 blur-[140px]" />
        {/* Subtle center ambient floor fill */}
        <div className="absolute bottom-0 left-1/2 h-[260px] w-[760px] -translate-x-1/2 rounded-full bg-[#2563EB]/10 blur-[110px]" />
        {/* Subtle upper ambient glow for full-screen depth */}
        <div className="absolute top-1/4 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-[#1E3A8A]/10 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto w-[min(calc(100%-32px),1340px)] md:w-[min(calc(100%-64px),1340px)] flex-1 flex flex-col justify-between">
        {/* TOP SECTION: EDITORIAL HEADLINE & NAVIGATION */}
        <div className="flex flex-col justify-start">
          {/* Large Editorial Headline */}
          <div className="mb-10 sm:mb-14 md:mb-16 max-w-3xl">
            <p className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-medium leading-[1.22] sm:leading-[1.18] tracking-[-0.025em] text-[#F3F4F6]">
              Interested in working together, exploring ready-made systems, or requesting a custom build?
            </p>
          </div>

          {/* Middle Row: Direct Contact & Horizontal Navigation */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 sm:pb-14 border-b border-white/[0.08]">
            {/* Left: Direct Contact */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs sm:text-sm text-[#85858F] font-normal tracking-wide">
                Reach out directly at:
              </span>
              <a
                href="mailto:evangelista.agdiaz@gmail.com"
                className="group inline-flex items-center gap-1.5 text-base sm:text-lg md:text-xl font-medium text-white transition-colors duration-200 hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A] rounded w-fit"
              >
                <span className="border-b border-transparent group-hover:border-[#60A5FA]/40 transition-colors">
                  evangelista.agdiaz@gmail.com
                </span>
                <ArrowUpRight
                  className="size-4 sm:size-5 text-[#85858F] transition-all duration-200 group-hover:text-[#60A5FA] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                  aria-hidden="true"
                />
              </a>
            </div>

            {/* Right: Horizontal Navigation Links */}
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8 text-sm sm:text-base font-medium text-[#A1A1AA]">
                {navigationLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A] rounded py-1"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* GIANT SIGNATURE BRAND DISPLAY */}
        <div className="py-10 sm:py-16 md:py-20 my-auto select-none overflow-hidden" aria-hidden="true">
          <div className="w-full flex items-center justify-between gap-4 sm:gap-6 md:gap-10">
            {/* Modular W Monogram */}
            <div className="shrink-0 size-12 sm:size-20 md:size-28 lg:size-36 flex items-center justify-center">
              <svg
                viewBox="0 0 112 64"
                className="w-full h-auto drop-shadow-[0_0_28px_rgba(59,130,246,0.18)]"
                fill="none"
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
            </div>

            {/* Giant Full-Width Typography Wordmark */}
            <div className="flex-1 min-w-0 flex items-center">
              <svg
                viewBox="0 0 920 90"
                className="w-full h-auto text-[#F5F5F7]"
                preserveAspectRatio="xMidYMid meet"
              >
                <text
                  x="0"
                  y="70"
                  fill="currentColor"
                  className="font-heading font-extrabold"
                  style={{
                    fontSize: "86px",
                    letterSpacing: "-0.045em",
                    fontFamily: "var(--font-poppins), var(--font-plus-jakarta-sans), system-ui, sans-serif",
                    fontWeight: 800,
                  }}
                >
                  websystembuilders
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* BOTTOM UTILITY BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 sm:pt-8 text-xs sm:text-[13px] text-[#71717A] border-t border-white/[0.06]">
          {/* Copyright */}
          <p>© 2026 WebSystemBuilders. All rights reserved.</p>

          {/* Legal & Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {/* Legal */}
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors duration-150 hover:text-[#D4D4D8] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6] rounded"
              >
                {item.label}
              </Link>
            ))}

            <span className="text-white/15 hidden sm:inline" aria-hidden="true">|</span>

            {/* Social */}
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-150 hover:text-[#D4D4D8] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3B82F6] rounded"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}