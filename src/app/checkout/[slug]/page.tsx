import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ScanToPayCheckout } from "@/components/checkout/scan-to-pay-checkout";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getCatalogPricePresentation } from "@/features/catalog/pricing";
import { getPublicSystemBySlug } from "@/features/catalog/repository";

export const metadata: Metadata = { title: "Scan to Pay Checkout", robots: { index: false, follow: false } };
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
    return <CheckoutUnavailable message="This system requires a confirmed quotation instead of direct checkout." href={`/systems/${system.slug}`} />;
  }

  const price = getCatalogPricePresentation(system);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="py-12 sm:py-16 lg:py-24">
        <div className="mx-auto grid w-[min(calc(100%-40px),1080px)] gap-8 md:w-[min(calc(100%-64px),1080px)] lg:grid-cols-[minmax(0,.9fr)_minmax(420px,1.1fr)] lg:gap-14">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Scan to Pay Checkout</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Order Summary</h1>
            <p className="mt-5 max-w-xl leading-7 text-secondary">
              Review your purchase details below. Scan the payment QR code using GCash or any QRPH-supported app, then submit your transaction reference and proof.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-6">
              <p className="text-xs uppercase tracking-[0.08em] text-muted">Order Item</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">{system.title}</h2>
              <p className="mt-3 text-sm leading-6 text-secondary">Version {system.currentVersion.versionLabel}</p>
              <dl className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-sm">
                <Summary term="Price" detail={price.current} />
                <Summary term="License" detail={system.licenseSummary ?? "Single business source-code license"} />
                <Summary term="Delivery" detail={system.deliverySummary ?? "Private deliverable unlocked after verified payment"} />
                <Summary term="Support" detail={system.supportSummary ?? "See published product coverage"} />
              </dl>
            </div>

            <Link href={`/systems/${system.slug}`} className="mt-5 inline-flex text-sm font-semibold text-brand-hover">
              ← Back to system details
            </Link>
          </section>

          <section>
            <ScanToPayCheckout
              systemSlug={system.slug}
              systemTitle={system.title}
              priceFormatted={price.current}
              paymentQrUrl={system.paymentQrUrl}
              paymentInstructions={system.paymentInstructions}
            />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Summary({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      <dt className="font-semibold">{term}</dt>
      <dd className="text-secondary">{detail}</dd>
    </div>
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
          <Link href={href} className="mt-7 inline-flex min-h-11 items-center rounded-[9px] border border-white/15 px-5 font-semibold">
            Return safely
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}