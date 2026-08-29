"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  ShieldCheck,
  FolderOpen,
  ArrowRight,
  ChevronDown,
  FileCode,
  Database,
  Globe,
  Users,
  GraduationCap,
  Briefcase,
  Zap,
  Shield,
  Send,
  X,
  GitBranch,
  Link2,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";

const systemCategories = [
  { name: "Student Systems", href: "/systems?category=student", icon: GraduationCap, description: "Templates for academic projects", count: 12, color: "#3B82F6" },
  { name: "Business Systems", href: "/systems?category=business", icon: Briefcase, description: "SaaS, CRM, dashboards", count: 18, color: "#8B5CF6" },
  { name: "Developer Tools", href: "/systems?category=dev", icon: FileCode, description: "CLI tools, APIs, starters", count: 15, color: "#10B981" },
  { name: "Data & Analytics", href: "/systems?category=data", icon: Database, description: "Dashboards, pipelines, viz", count: 8, color: "#F59E0B" },
  { name: "Web Applications", href: "/systems?category=web", icon: Globe, description: "Full-stack Next.js apps", count: 22, color: "#EC4899" },
  { name: "Team Workspaces", href: "/systems?category=team", icon: Users, description: "Collaboration & productivity", count: 6, color: "#06B6D4" },
  { name: "Auth & Security", href: "/systems?category=auth", icon: Shield, description: "Auth, RBAC, compliance", count: 9, color: "#EF4444" },
  { name: "Automation", href: "/systems?category=auto", icon: Zap, description: "Workflows, bots, scheduled jobs", count: 11, color: "#6366F1" },
];

const footerColumns: { title: string; links: [string, string][] }[] = [
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Our Story", "/about#story"],
      ["Careers", "/careers"],
      ["Press Kit", "/press"],
      ["Partnerships", "/partners"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Documentation", "/docs"],
      ["API Reference", "/docs/api"],
      ["Community", "/community"],
      ["Blog", "/blog"],
      ["Changelog", "/changelog"],
      ["System Status", "/status"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Help Center", "/help"],
      ["Contact Sales", "/contact?type=sales"],
      ["Technical Support", "/support"],
      ["FAQ", "/faq"],
      ["Request a System", "/request"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/legal/privacy"],
      ["Terms of Service", "/legal/terms"],
      ["Cookie Policy", "/legal/cookies"],
      ["Security", "/security"],
      ["Licenses", "/licenses"],
    ],
  },
];

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/websysbuilders", icon: X },
  { name: "GitHub", href: "https://github.com/websystembuilders", icon: GitBranch },
  { name: "LinkedIn", href: "https://linkedin.com/company/websystembuilders", icon: Link2 },
];

function FolderCard({ category }: { category: typeof systemCategories[0] }) {
  return (
    <Link
      href={category.href}
      className="group relative flex flex-col h-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/7.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
      style={{ borderLeft: `3px solid ${category.color}` }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${category.color}15` }}
        >
          <category.icon className="h-5 w-5" style={{ color: category.color }} />
        </div>
        <ExternalLink className="opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 text-[#64748B]" aria-hidden="true" />
      </div>
      <h4 className="font-semibold text-sm text-[#F5F5F7] group-hover:text-[#3B82F6] transition-colors">{category.name}</h4>
      <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 flex-1">{category.description}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <span className="text-xs text-[#64748B]">{category.count} systems</span>
        <ArrowRight className="h-3.5 w-3.5 text-[#64748B] group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all" aria-hidden="true" />
      </div>
    </Link>
  );
}

function ColumnSection({ title, links, initiallyOpen = true }: { title: string; links: [string, string][]; initiallyOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-2 py-2 text-left lg:hidden"
        aria-expanded={isOpen}
        aria-controls={`footer-${title.toLowerCase()}`}
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F7] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
          {title}
        </h3>
        <ChevronDown className="h-4 w-4 text-[#94A3B8] transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }} aria-hidden="true" />
      </button>
      <h3 id={`footer-${title.toLowerCase()}-heading`} className="hidden lg:block text-xs font-semibold uppercase tracking-wider text-[#F5F5F7] flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
        {title}
      </h3>
      <ul id={`footer-${title.toLowerCase()}`} className="flex flex-col gap-2" style={{ display: isOpen ? "flex" : "none" }}>
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-xs sm:text-sm text-[#94A3B8] transition-all duration-200 hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 hover:pl-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || newsletterStatus === "submitting") return;
    setNewsletterStatus("submitting");
    await new Promise((r) => setTimeout(r, 1000));
    setNewsletterStatus("success");
    setNewsletterEmail("");
    setTimeout(() => setNewsletterStatus("idle"), 3000);
  };

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
          <path
            d="M28,0 L1412,0 C1412,0 1412,4 1412,4 C1412,4 28,4 28,4 C28,4 28,0 28,0 Z"
            fill="#1A1C1F"
            opacity="0.6"
          />
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

      <div className="relative z-10 mx-auto w-[min(calc(100%-32px),1400px)] py-10 sm:py-12 md:w-[min(calc(100%-64px),1400px)] lg:py-16 lg:pt-20">
        {/* MAIN GRID - 5 Columns on desktop */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)] lg:gap-12 mb-16">
          
          {/* COLUMN 1: SYSTEMS FOLDER GRID (wider) */}
          <div className="lg:col-span-1.5 lg:pr-4">
            <h3 className="hidden lg:block text-xs font-semibold uppercase tracking-wider text-[#F5F5F7] flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
              Systems Folder
            </h3>
            <button
              type="button"
              className="lg:hidden w-full flex items-center justify-between gap-2 px-2 py-2 text-left mb-4"
              aria-expanded="true"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F7] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                Systems Folder
              </h3>
              <ChevronDown className="h-4 w-4 text-[#94A3B8]" aria-hidden="true" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {systemCategories.map((category) => (
                <FolderCard key={category.name} category={category} />
              ))}
            </div>
            <Link
              href="/systems"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#3B82F6] hover:text-[#60A5FA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
            >
              <FolderOpen className="h-4 w-4" />
              View All Systems
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* COLUMN 2: COMPANY */}
          <ColumnSection title="Company" links={footerColumns[0].links} />

          {/* COLUMN 3: RESOURCES */}
          <ColumnSection title="Resources" links={footerColumns[1].links} />

          {/* COLUMN 4: SUPPORT */}
          <ColumnSection title="Support" links={footerColumns[2].links} />

          {/* COLUMN 5: LEGAL + NEWSLETTER */}
          <div className="lg:col-span-1">
            <ColumnSection title="Legal" links={footerColumns[3].links} />
            
            {/* NEWSLETTER SIGNUP */}
            <div className="mt-8 lg:mt-12 pt-8 border-t border-white/10">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F7] flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                Newsletter
              </h3>
              <p className="text-xs text-[#94A3B8] mb-4 max-w-xs">
                Weekly updates on new systems, dev tips & launches. No spam.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2 max-w-xs" aria-label="Newsletter signup">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={newsletterStatus === "submitting" || newsletterStatus === "success"}
                    className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-[#F5F5F7] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]/50 focus:ring-1 focus:ring-[#3B82F6]/50 transition-all disabled:opacity-50"
                    aria-label="Email address"
                  />
                  {newsletterStatus === "success" && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#10B981]" aria-hidden="true" />
                  )}
                  {newsletterStatus === "submitting" && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3B82F6] animate-spin" aria-hidden="true" />
                  )}
                </div>
                <button
                  type="submit"
                  disabled={newsletterStatus === "submitting" || newsletterStatus === "success" || !newsletterEmail}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-[#3B82F6] rounded-lg hover:bg-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {newsletterStatus === "submitting" ? "Subscribing..." : newsletterStatus === "success" ? "Subscribed!" : "Subscribe"}
                </button>
                <p className="text-[10px] text-[#64748B]">By subscribing, you agree to our <Link href="/legal/privacy" className="underline hover:text-[#3B82F6]">Privacy Policy</Link>.</p>
              </form>
            </div>
          </div>
        </div>

        {/* BRAND ROW - Logo, tagline, social, trust badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 pb-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/"
              aria-label="WebSystemBuilders home"
              className="-m-1 inline-flex w-fit items-center gap-3 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A] group"
            >
              <BrandLogo variant="full" priority className="size-10 shrink-0 transition-opacity group-hover:opacity-85" />
            </Link>
            <div className="flex flex-col gap-1">
              <p className="text-xs sm:text-sm leading-relaxed text-[#94A3B8] max-w-xs">
                Ready-made software systems and custom development for students and growing businesses.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#94A3B8]">
                <FolderOpen className="h-3.5 w-3.5" />
                <span>Systems Folder</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            {/* SOCIAL LINKS */}
            <div className="flex items-center gap-3" aria-label="Social links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:bg-[#3B82F6]/10 hover:border-[#3B82F6]/30 hover:text-[#3B82F6] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
                >
                  <social.icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>

            {/* TRUST BADGES */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#3B82F6]" />
                Verified Systems
              </span>
              <span className="text-white/10">|</span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                Secure Payments
              </span>
              <span className="text-white/10">|</span>
              <span className="inline-flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5 text-[#8B5CF6]" />
                Instant Delivery
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs font-medium text-[#64748B]">
          <p>© 2026 WebSystemBuilders. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <Link
              href="/legal/privacy"
              className="rounded transition-colors duration-150 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
            >
              Privacy Policy
            </Link>
            <span className="select-none text-white/20 hidden sm:inline">|</span>
            <Link
              href="/legal/terms"
              className="rounded transition-colors duration-150 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
            >
              Terms of Service
            </Link>
            <span className="select-none text-white/20 hidden sm:inline">|</span>
            <Link
              href="/legal/cookies"
              className="rounded transition-colors duration-150 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
            >
              Cookie Policy
            </Link>
            <span className="select-none text-white/20 hidden sm:inline">|</span>
            <span className="text-[#94A3B8]">websystembuilders.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}