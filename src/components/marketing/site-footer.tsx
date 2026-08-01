import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { BackToTop } from "@/components/marketing/back-to-top";
import { getPublicCompanyProfile } from "@/features/content/company-profile-repository";
import { getPublicCatalogData } from "@/features/catalog/repository";
import { ArrowUpRight, Mail } from "lucide-react";

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
      ["About", "/about"],
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
  const [profile, catalog] = await Promise.all([
    getPublicCompanyProfile(),
    getPublicCatalogData(),
  ]);

  const featuredSystems = catalog.systems
    .filter((s) => s.featured)
    .slice(0, 4);

  const hasFeatured = featuredSystems.length > 0;

  return (
    <footer
      id="site-footer"
      aria-labelledby="footer-heading"
      className="relative border-t border-white/10 bg-[#08090A] pt-16 text-[#F5F5F7] lg:pt-20"
    >
      <h2 id="footer-heading" className="sr-only">
        Site Footer
      </h2>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent" />

      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-12 pb-14 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-12 lg:gap-16 lg:pb-16 xl:w-[min(calc(100%-96px),1280px)]">
        {/* Brand & Summary Column */}
        <div className="space-y-6 lg:col-span-4">
          <BrandLogo variant="dark" priority className="size-16" />

          <p className="max-w-md text-sm leading-relaxed text-[#A1A1AA]">
            {profile.companySummary}
          </p>

          {profile.publicEmail && (
            <div className="pt-1">
              <a
                href={`mailto:${profile.publicEmail}`}
                className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-[#121316] px-3.5 py-2.5 text-sm font-medium text-[#F5F5F7] transition-all duration-150 hover:border-white/20 hover:bg-[#17181C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <Mail className="h-4 w-4 text-[#3B82F6] transition-transform duration-150 group-hover:scale-110" />
                <span className="truncate">{profile.publicEmail}</span>
              </a>
            </div>
          )}
        </div>

        {/* Dynamic Link Groups */}
        <div
          className={`grid grid-cols-2 gap-8 sm:grid-cols-3 ${
            hasFeatured ? "lg:col-span-4" : "lg:col-span-8"
          }`}
        >
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F7]">
                {group.title}
              </h3>
              <div className="flex flex-col gap-1.5">
                {group.links.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="-mx-1.5 inline-flex items-center rounded-md px-1.5 py-1 text-sm font-medium text-[#A1A1AA] transition-colors duration-150 hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Popular Systems Column */}
        {hasFeatured && (
          <div className="lg:col-span-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F7]">
              Popular Systems
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              {featuredSystems.map((system) => (
                <Link
                  key={system.id}
                  href={`/systems/${system.slug}`}
                  className="group -mx-2 flex items-center justify-between rounded-lg p-2 transition-colors duration-150 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                    <span className="truncate text-sm font-semibold text-[#F5F5F7] group-hover:text-[#3B82F6] transition-colors duration-150">
                      {system.title}
                    </span>
                    <span className="text-xs text-[#85858F]">
                      {system.category?.name ?? "Web System"}
                    </span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#85858F] opacity-60 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#3B82F6] group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="mx-auto flex w-[min(calc(100%-40px),1280px)] flex-col items-center justify-between gap-4 text-xs font-medium text-[#85858F] sm:flex-row md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:justify-start">
            <span>
              &copy; {new Date().getFullYear()} WebSystemBuilders. All rights reserved.
            </span>
            <span className="hidden select-none text-white/20 sm:inline">&middot;</span>
            <span className="text-[#A1A1AA]">
              {profile.founderName} &middot; {profile.founderTitle}
            </span>
            <span className="hidden select-none text-white/20 sm:inline">&middot;</span>
            <span className="font-mono font-semibold text-[#F5F5F7]">
              websystembuilders.com
            </span>
          </div>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
