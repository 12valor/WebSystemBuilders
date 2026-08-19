import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PayPalCheckout } from "@/components/checkout/paypal-checkout";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getCatalogPricePresentation } from "@/features/catalog/pricing";
import { getPublicSystemBySlug } from "@/features/catalog/repository";
import { getCurrentIdentity, getCurrentUser } from "@/lib/auth/current-user";
import { getPayPalEnv, getPayPalWebSdkUrl, isPayPalConfigured } from "@/lib/env/paypal";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { ArrowLeft, Check, ShieldCheck, Zap } from "lucide-react";

export const metadata: Metadata = { title: "Secure Checkout", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const identityPromise = isSupabasePubliclyConfigured() ? getCurrentIdentity() : Promise.resolve(null);
  const userPromise = isSupabasePubliclyConfigured() ? getCurrentUser() : Promise.resolve(null);
  const [result, identity, user] = await Promise.all([getPublicSystemBySlug(slug), identityPromise, userPromise]);
  const system = result.system;

  if (!system) {
    if (result.status === "ready") notFound();
    return <CheckoutUnavailable message="The live catalog is not connected, so checkout cannot start." />;
  }

  if (system.pricingType !== "fixed" || system.productType === "custom_service" || !system.currentVersion) {
    return (
      <CheckoutUnavailable
        message="This system requires a confirmed quotation instead of direct checkout."
        href={`/systems/${system.slug}`}
      />
    );
  }

  if (!identity || !user || user.id !== identity.id) {
    redirect(`/auth/sign-in?next=${encodeURIComponent(`/checkout/${system.slug}`)}`);
  }
  if (!user.email || !user.email_confirmed_at) {
    return (
      <CheckoutUnavailable
        message="Verify your account email before starting checkout."
        href={`/systems/${system.slug}`}
      />
    );
  }
  const paypalConfigured = isPayPalConfigured();
  if (!paypalConfigured) {
    return <CheckoutUnavailable message="PayPal Checkout is not configured." href={`/systems/${system.slug}`} />;
  }
  const paypalSdkUrl = getPayPalWebSdkUrl(getPayPalEnv().PAYPAL_ENVIRONMENT);
  const price = getCatalogPricePresentation(system);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen bg-[#FBFBFD] text-slate-900 py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Deep Dark Summary & Product Ledger Card */}
            <div className="space-y-6 lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181922] to-[#101117] border border-white/[0.12] p-6 sm:p-8 text-white shadow-2xl space-y-6">
                {/* Top Hairline Sheen */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                {/* Back to System Link */}
                <div>
                  <Link
                    href={`/systems/${system.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Back to system details</span>
                  </Link>
                </div>

                {/* Price & Summary Header */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    System Purchase
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {price.current}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    One-time payment • Lifetime source code access & database schema.
                  </p>
                </div>

                {/* Product Card */}
                <div className="rounded-2xl bg-white/[0.05] border border-white/[0.08] p-4 flex items-start gap-3.5">
                  <div className="size-11 shrink-0 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center overflow-hidden">
                    <BrandLogo priority className="size-9" />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h2 className="font-bold text-white text-sm truncate">{system.title}</h2>
                    <p className="text-[11px] text-slate-400">
                      Version {system.currentVersion?.versionLabel ?? "1.0.0"} • Single Project License
                    </p>
                    <div className="text-xs font-bold text-slate-200 pt-0.5">{price.current}</div>
                  </div>
                </div>

                {/* Itemized Financial Ledger */}
                <div className="divide-y divide-white/[0.08] border-t border-white/[0.1] text-xs pt-1">
                  <div className="flex justify-between py-2.5 text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">{price.current}</span>
                  </div>
                  <div className="flex justify-between py-2.5 text-slate-300">
                    <span>Platform & Delivery</span>
                    <span className="font-semibold text-emerald-400">Included</span>
                  </div>
                  <div className="flex justify-between py-2.5 text-slate-300">
                    <span>License Type</span>
                    <span className="text-slate-300 truncate max-w-[180px] text-right">
                      {system.licenseSummary ?? "Single business source license"}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 pb-1 text-slate-100">
                    <span className="font-bold text-sm">Total due today</span>
                    <span className="font-extrabold text-xl text-white tracking-tight">
                      {price.current}
                    </span>
                  </div>
                </div>

                {/* Trust Guarantees */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 text-[11px] text-slate-400 space-y-2">
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <Check className="size-3.5 text-emerald-400 shrink-0" />
                    <span>Private package deliverable after verified payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <Check className="size-3.5 text-emerald-400 shrink-0" />
                    <span>Full database architecture & migrations included</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <Check className="size-3.5 text-emerald-400 shrink-0" />
                    <span>Zero recurring fees or subscriptions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Multi-Method Checkout Experience Sheet */}
            <div className="lg:col-span-7">
              <PayPalCheckout
                systemId={system.id}
                systemTitle={system.title}
                priceFormatted={price.current}
                sdkUrl={paypalSdkUrl}
              />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function CheckoutUnavailable({ message, href = "/systems" }: { message: string; href?: string }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="grid min-h-[60vh] place-items-center px-5 py-20 text-center">
        <div className="max-w-xl">
          <h1 className="text-4xl font-semibold tracking-[-0.05em]">Checkout is unavailable.</h1>
          <p className="mt-4 leading-7 text-secondary">{message}</p>
          <Link
            href={href}
            className="mt-7 inline-flex min-h-11 items-center rounded-[9px] border border-white/15 px-5 font-semibold"
          >
            Return safely
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
