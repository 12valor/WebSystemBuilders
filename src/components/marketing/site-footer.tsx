import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getPublicCompanyProfile } from "@/features/content/company-profile-repository";

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
    <footer id="about" className="border-t border-[#E5E7EB] bg-[#F8FAFC] pt-16 lg:pt-20">
      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-12 pb-14 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-12 lg:gap-16 lg:pb-16 xl:w-[min(calc(100%-96px),1280px)]">
        <div className="lg:col-span-5">
          <BrandLogo variant="light" className="h-auto w-[200px]" />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#6B7280]">
            {profile.companySummary}
          </p>
          {profile.publicEmail && (
            <a
              href={`mailto:${profile.publicEmail}`}
              className="mt-4 inline-flex text-sm font-semibold text-[#2563EB] hover:underline"
            >
              {profile.publicEmail}
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <strong className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                {group.title}
              </strong>
              {group.links.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#2563EB]"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] bg-white py-6">
        <div className="mx-auto flex w-[min(calc(100%-40px),1280px)] flex-col items-center justify-between gap-3 text-xs text-[#6B7280] sm:flex-row md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
          <span>&copy; {new Date().getFullYear()} WebSystemBuilders. All rights reserved.</span>
          <span>{profile.founderName} &middot; {profile.founderTitle}</span>
          <span className="font-semibold text-[#111827]">websystembuilders.com</span>
        </div>
      </div>
    </footer>
  );
}
