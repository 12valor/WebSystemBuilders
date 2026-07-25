import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getPublicCompanyProfile } from "@/features/content/company-profile-repository";

const footerGroups = [
  { title: "Explore", links: [["Systems", "/systems"], ["For students", "/for-students"], ["For business", "/for-business"], ["Custom development", "/services/custom-development"]] },
  { title: "Company", links: [["About", "/about"], ["Process", "/process"], ["Portfolio", "/portfolio"], ["FAQ", "/faq"], ["Contact", "/contact"], ["Account", "/account"]] },
  { title: "Policies", links: [["Delivery", "/legal/delivery"], ["License", "/legal/license"], ["Refunds", "/legal/refunds"], ["Privacy", "/legal/privacy"], ["Terms", "/legal/terms"]] },
];

export async function SiteFooter() {
  const profile = await getPublicCompanyProfile();
  return (
    <footer id="about" className="border-t border-white/10 bg-[#060708] pt-20 lg:pt-24">
      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-14 pb-16 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-2 lg:gap-24 lg:pb-20 xl:w-[min(calc(100%-96px),1280px)]">
        <div><BrandLogo className="h-auto w-[230px]" /><p className="mt-6 max-w-lg text-secondary">{profile.companySummary}</p>{profile.publicEmail && <a href={`mailto:${profile.publicEmail}`} className="mt-5 inline-flex text-sm font-semibold text-foreground underline underline-offset-4">{profile.publicEmail}</a>}</div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => <div key={group.title} className="grid content-start gap-2.5"><strong className="mb-2 text-xs">{group.title}</strong>{group.links.map(([label, href]) => <Link key={label} href={href} className="text-sm text-secondary transition-colors hover:text-foreground">{label}</Link>)}</div>)}
        </div>
      </div>
      <div className="mx-auto flex min-h-20 w-[min(calc(100%-40px),1280px)] flex-col items-start justify-center gap-2 border-t border-white/10 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <span>&copy; 2026 WebSystemBuilders</span><span>{profile.founderName} &middot; {profile.founderTitle}</span><span>websystembuilders.com</span>
      </div>
    </footer>
  );
}
