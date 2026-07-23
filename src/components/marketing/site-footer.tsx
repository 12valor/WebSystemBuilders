import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

const footerGroups = [
  { title: "Explore", links: [["Systems", "#systems"], ["For students", "#students"], ["For business", "#businesses"], ["Custom development", "#custom"]] },
  { title: "Company", links: [["About", "#about"], ["Process", "#process"], ["Contact", "#contact"], ["Account", "/account"]] },
  { title: "Policies", links: [["Delivery", "/legal/delivery"], ["License", "/legal/license"], ["Refunds", "/legal/refunds"], ["Privacy", "/legal/privacy"]] },
];

export function SiteFooter() {
  return (
    <footer id="about" className="border-t border-white/10 bg-[#060708] pt-20 lg:pt-24">
      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-14 pb-16 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-2 lg:gap-24 lg:pb-20 xl:w-[min(calc(100%-96px),1280px)]">
        <div><BrandLogo className="h-auto w-[230px]" /><p className="mt-6 max-w-lg text-secondary">WebSystemBuilders helps students and business owners access ready-made software systems and request custom development through one professional platform.</p></div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => <div key={group.title} className="grid content-start gap-2.5"><strong className="mb-2 text-xs">{group.title}</strong>{group.links.map(([label, href]) => <Link key={label} href={href} className="text-sm text-secondary transition-colors hover:text-foreground">{label}</Link>)}</div>)}
        </div>
      </div>
      <div className="mx-auto flex min-h-20 w-[min(calc(100%-40px),1280px)] flex-col items-start justify-center gap-2 border-t border-white/10 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <span>© 2026 WebSystemBuilders</span><span>AG Evangelista · Web Developer</span><span>websystembuilders.com</span>
      </div>
    </footer>
  );
}