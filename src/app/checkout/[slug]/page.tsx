import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getCatalogPricePresentation } from "@/features/catalog/pricing";
import { getPublicSystemBySlug } from "@/features/catalog/repository";
import { isPayMongoConfigured } from "@/lib/env/paymongo";

export const metadata: Metadata = { title: "Secure checkout", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublicSystemBySlug(slug);
  const system = result.system;
  if (!system) {
    if (result.status === "ready") notFound();
    return <CheckoutUnavailable message="The live catalog is not connected, so checkout cannot start." />;
  }
  if (system.pricingType !== "fixed" || system.productType === "custom_service" || !system.currentVersion) {
    return <CheckoutUnavailable message="This system requires a confirmed quotation instead of immediate payment." href={`/systems/${system.slug}`} />;
  }
  const price = getCatalogPricePresentation(system);
  const configured = isPayMongoConfigured();

  return <><SiteHeader /><main id="main-content" className="py-12 sm:py-16 lg:py-24"><div className="mx-auto grid w-[min(calc(100%-40px),1080px)] gap-8 md:w-[min(calc(100%-64px),1080px)] lg:grid-cols-[minmax(0,.9fr)_minmax(360px,.7fr)] lg:gap-14">
    <section><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Secure checkout</p><h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Review before payment.</h1><p className="mt-5 max-w-xl leading-7 text-secondary">Your displayed local-currency conversion is only an estimate. PayMongo charges the authoritative PHP amount shown here.</p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-6"><p className="text-xs uppercase tracking-[0.08em] text-muted">Order item</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">{system.title}</h2><p className="mt-3 text-sm leading-6 text-secondary">Version {system.currentVersion.versionLabel}</p><dl className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-sm"><Summary term="Price" detail={price.current} /><Summary term="License" detail={system.licenseSummary ?? "Single business source-code license"} /><Summary term="Delivery" detail={system.deliverySummary ?? "Private access after verified payment"} /><Summary term="Support" detail={system.supportSummary ?? "See the published product coverage"} /></dl></div>
      <Link href={`/systems/${system.slug}`} className="mt-5 inline-flex text-sm font-semibold text-brand-hover">Back to system details</Link>
    </section>
    <section className="h-fit rounded-2xl border border-white/10 bg-surface p-6 sm:p-7"><h2 className="text-xl font-semibold tracking-[-0.03em]">Buyer information</h2><p className="mt-2 text-sm leading-6 text-secondary">Use an email address you can access. Delivery will be tied to it after verified payment.</p>{configured ? <div className="mt-6"><CheckoutForm systemSlug={system.slug} /></div> : <div role="status" className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-100">PayMongo credentials are not connected yet. Checkout is visible for review, but no order or charge can be created.</div>}</section>
  </div></main><SiteFooter /></>;
}

function Summary({ term, detail }: { term: string; detail: string }) { return <div className="grid grid-cols-[80px_1fr] gap-4"><dt className="font-semibold">{term}</dt><dd className="text-secondary">{detail}</dd></div>; }

function CheckoutUnavailable({ message, href = "/systems" }: { message: string; href?: string }) { return <><SiteHeader /><main id="main-content" className="grid min-h-[60vh] place-items-center px-5 py-20 text-center"><div className="max-w-xl"><h1 className="text-4xl font-semibold tracking-[-0.05em]">Checkout is unavailable.</h1><p className="mt-4 leading-7 text-secondary">{message}</p><Link href={href} className="mt-7 inline-flex min-h-11 items-center rounded-[9px] border border-white/15 px-5 font-semibold">Return safely</Link></div></main><SiteFooter /></>; }