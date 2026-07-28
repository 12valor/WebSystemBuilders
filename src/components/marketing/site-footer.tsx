import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { BackToTop } from "@/components/marketing/back-to-top";
import { getPublicCompanyProfile } from "@/features/content/company-profile-repository";
import { getPublicCatalogData } from "@/features/catalog/repository";
import { Mail } from "lucide-react";

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

  return (
    <footer
      id="about"
      className="relative border-t border-white/10 bg-[#08090A] pt-16 text-[#F5F5F7] lg:pt-20"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent" />

      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-12 pb-14 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-12 lg:gap-16 lg:pb-16 xl:w-[min(calc(100%-96px),1280px)]">
        <div className="lg:col-span-4 space-y-6">
          <BrandLogo variant="dark" priority className="h-auto w-[200px]" />

          <p className="max-w-md text-sm leading-relaxed text-[#A1A1AA]">
            {profile.companySummary}
          </p>

          {profile.publicEmail && (
            <a
              href={`mailto:${profile.publicEmail}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#3B82F6] hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A] rounded px-1 py-0.5"
            >
              <Mail className="h-4 w-4" />
              <span>{profile.publicEmail}</span>
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-4">
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <strong className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F7]">
                {group.title}
              </strong>
              <div className="flex flex-col gap-2.5">
                {group.links.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A] rounded py-0.5"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {featuredSystems.length > 0 && (
          <div className="lg:col-span-4">
            <strong className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F7]">
              Popular Systems
            </strong>
            <div className="mt-3 flex flex-col gap-2.5">
              {featuredSystems.map((system) => (
                <Link
                  key={system.id}
                  href={`/systems/${system.slug}`}
                  className="group flex flex-col gap-1 text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#3B82F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A] rounded py-0.5"
                >
                  <span className="text-sm font-semibold text-[#F5F5F7] group-hover:text-[#3B82F6]">
                    {system.title}
                  </span>
                  <span className="text-xs text-[#85858F]">
                    {system.category?.name ?? "Web System"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="mx-auto flex w-[min(calc(100%-40px),1280px)] flex-col items-center justify-between gap-4 text-sm font-medium text-[#85858F] sm:flex-row md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <span>
              &copy; {new Date().getFullYear()} WebSystemBuilders. All rights reserved.
            </span>
            <span className="text-[#A1A1AA]">
              {profile.founderName} &middot; {profile.founderTitle}
            </span>
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
