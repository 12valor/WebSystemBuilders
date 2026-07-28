import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getPublicCompanyProfile } from "@/features/content/company-profile-repository";
import { Mail, ArrowUpRight, Activity } from "lucide-react";

const footerGroups = [
  {
    title: "Explore",
    links: [
      ["Systems Catalog", "/systems"],
      ["For Students", "/for-students"],
      ["For Businesses", "/for-business"],
      ["Custom Development", "/services/custom-development"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Development Process", "/process"],
      ["Portfolio", "/portfolio"],
      ["FAQ", "/faq"],
      ["Contact", "/contact"],
      ["Customer Account", "/account"],
    ],
  },
  {
    title: "Policies",
    links: [
      ["Digital Delivery", "/legal/delivery"],
      ["Commercial License", "/legal/license"],
      ["Refund Policy", "/legal/refunds"],
      ["Privacy Policy", "/legal/privacy"],
      ["Terms of Service", "/legal/terms"],
    ],
  },
];

export async function SiteFooter() {
  const profile = await getPublicCompanyProfile();
  return (
    <footer id="about" className="border-t border-white/10 bg-[#08090A] text-text-primary pt-16 lg:pt-20">
      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-12 pb-14 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-12 lg:gap-16 lg:pb-16 xl:w-[min(calc(100%-96px),1280px)]">
        
        {/* Brand & Profile Section */}
        <div className="lg:col-span-5 space-y-6">
          <BrandLogo variant="dark" priority className="h-auto w-[210px]" />
          
          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-text-secondary">
            {profile.companySummary}
          </p>

          {/* Live Operational Status Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-mono text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <Activity className="h-3.5 w-3.5" />
            <span>All Systems & Webhooks Operational</span>
          </div>

          {/* Direct Email Contact Link */}
          {profile.publicEmail && (
            <div>
              <a
                href={`mailto:${profile.publicEmail}`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md px-1 py-0.5"
              >
                <Mail className="w-4 h-4" />
                <span>{profile.publicEmail}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          )}

          {/* Quick Intake Card */}
          <div className="mt-4 rounded-xl border border-white/10 bg-surface p-5 space-y-3 max-w-md">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
              Ready to build or deploy?
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Explore administrator-published web systems or request a custom proposal for your workflow.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Link
                href="/systems"
                className="rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-accent-contrast transition-all hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Browse Systems
              </Link>
              <Link
                href="/request-a-quote"
                className="rounded-lg border border-white/10 bg-surface-raised px-3.5 py-2 text-xs font-semibold text-text-primary transition-all hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Grouped Sitemap Links */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <strong className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
                {group.title}
              </strong>
              <div className="flex flex-col gap-2.5 mt-1">
                {group.links.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-xs font-medium text-text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm py-0.5"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-footer Bar */}
      <div className="border-t border-white/10 bg-[#050608] py-6">
        <div className="mx-auto flex w-[min(calc(100%-40px),1280px)] flex-col items-center justify-between gap-3 text-xs font-medium text-text-muted sm:flex-row md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
          <span>&copy; {new Date().getFullYear()} WebSystemBuilders. All rights reserved.</span>
          <span className="text-text-secondary">{profile.founderName} &middot; {profile.founderTitle}</span>
          <span className="font-mono font-semibold text-text-primary">websystembuilders.com</span>
        </div>
      </div>
    </footer>
  );
}
