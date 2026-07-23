import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute -right-72 -top-80 -z-10 size-[660px] rounded-full border border-blue-500/10 shadow-[0_0_0_120px_rgba(59,130,246,0.018),0_0_0_240px_rgba(59,130,246,0.012)] max-lg:hidden" />
      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] items-center gap-14 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[minmax(0,1.04fr)_minmax(390px,.96fr)] lg:gap-14 xl:w-[min(calc(100%-96px),1280px)] xl:gap-20">
        <div className="max-w-3xl">
          <SectionEyebrow>Ready-made systems and custom development</SectionEyebrow>
          <h1 className="max-w-[780px] text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.96] tracking-[-0.065em] text-foreground">Software systems for your next step.</h1>
          <p className="mt-7 max-w-[650px] text-[1.05rem] leading-7 text-secondary sm:text-lg sm:leading-8">Explore practical systems for school and business, or work with us to build one around your exact requirements.</p>
          <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
            <Link href="/systems" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[10px] bg-foreground px-6 font-semibold text-[#08090a] transition-transform hover:-translate-y-px hover:bg-white">Browse systems <span aria-hidden="true">↗</span></Link>
            <Link href="#custom" className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-white/15 bg-surface px-6 font-semibold transition-colors hover:bg-surface-raised">Request a custom system</Link>
          </div>
          <div className="mt-11 grid gap-3 sm:mt-14 sm:grid-cols-2" aria-label="Choose an audience">
            <AudienceLink href="#students" kicker="For students">Capstone and thesis-related systems</AudienceLink>
            <AudienceLink href="#businesses" kicker="For business">Systems for day-to-day operations</AudienceLink>
          </div>
        </div>
        <SystemWorkspace />
      </div>
    </section>
  );
}

function AudienceLink({ href, kicker, children }: { href: string; kicker: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative grid min-h-[96px] gap-1 border-t border-white/15 px-5 py-5 pr-12 transition-colors hover:border-brand hover:bg-white/[0.018] sm:min-h-[108px]">
      <span className="text-xs uppercase tracking-[0.08em] text-muted">{kicker}</span>
      <strong className="text-[0.95rem] font-medium leading-snug">{children}</strong>
      <span className="absolute right-5 top-5 text-muted transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
    </Link>
  );
}

function SystemWorkspace() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-white/15 bg-[#0c0d0f] shadow-[0_32px_90px_rgba(0,0,0,.24)]">
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-5 text-xs text-muted">
        <div className="flex items-center gap-2.5 font-semibold text-secondary"><BrandLogo compact className="h-auto w-7" /> System workspace</div>
        <span>Overview</span>
      </div>
      <div className="p-3.5 sm:p-6">
        <p className="mb-3 text-xs uppercase tracking-[0.09em] text-muted">Choose how you want to start</p>
        <div className="rounded-[13px] border border-white/10 bg-surface p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-secondary"><span className="size-[7px] rounded-full bg-emerald-400" />Ready-made systems</div>
          <strong className="mt-5 block max-w-xs text-xl leading-tight tracking-[-0.03em] sm:text-2xl">Browse by audience and category</strong>
          <div className="mt-6 grid grid-cols-3 gap-2" aria-hidden="true">{["POS", "Inventory", "Capstone"].map((item) => <span key={item} className="rounded-md border border-white/10 bg-[#0c0d0f] px-2 py-2 text-center text-[0.7rem] text-secondary">{item}</span>)}</div>
        </div>
        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
          <WorkspaceCard index="01" title="Review the system" detail="Features, inclusions, requirements" />
          <WorkspaceCard index="02" title="Purchase securely" detail="Verified payment before delivery" accent />
        </div>
        <div className="flex flex-col items-start gap-1 px-1 pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between"><span>Need something different?</span><strong className="font-medium text-secondary">Request custom development →</strong></div>
      </div>
    </div>
  );
}

function WorkspaceCard({ index, title, detail, accent = false }: { index: string; title: string; detail: string; accent?: boolean }) {
  return (
    <div className={`min-h-36 rounded-xl border p-4 ${accent ? "border-blue-400/20 bg-blue-600/10" : "border-white/10 bg-[#101113]"}`}>
      <span className={`text-[0.68rem] ${accent ? "text-brand-hover" : "text-muted"}`}>{index}</span>
      <p className="mb-1 mt-5 text-sm font-semibold">{title}</p>
      <small className="block text-[0.7rem] leading-5 text-muted">{detail}</small>
    </div>
  );
}