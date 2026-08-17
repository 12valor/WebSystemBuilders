import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckoutPaymentMethods } from "@/components/checkout/checkout-payment-methods";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getCatalogPricePresentation } from "@/features/catalog/pricing";
import { getPublicSystemBySlug } from "@/features/catalog/repository";
import { getCurrentIdentity, getCurrentUser } from "@/lib/auth/current-user";
import { getPayPalEnv, getPayPalWebSdkUrl, isPayPalConfigured } from "@/lib/env/paypal";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

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
    return <CheckoutUnavailable message="This system requires a confirmed quotation instead of direct checkout." href={`/systems/${system.slug}`} />;
  }

  if (!identity || !user || user.id !== identity.id) redirect(`/auth/sign-in?next=${encodeURIComponent(`/checkout/${system.slug}`)}`);
  if (!user.email || !user.email_confirmed_at) {
    return <CheckoutUnavailable message="Verify your account email before starting checkout." href={`/systems/${system.slug}`} />;
  }
  const paypalConfigured = isPayPalConfigured();
  const manualConfigured = Boolean(system.paymentQrUrl?.trim() && system.paymentInstructions?.trim());
  if (!paypalConfigured && !manualConfigured) {
    return <CheckoutUnavailable message="No payment method is configured for this system." href={`/systems/${system.slug}`} />;
  }
  const paypalSdkUrl = paypalConfigured ? getPayPalWebSdkUrl(getPayPalEnv().PAYPAL_ENVIRONMENT) : null;

  const price = getCatalogPricePresentation(system);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="py-12 sm:py-16 lg:py-24">
        <div className="mx-auto grid w-[min(calc(100%-40px),1080px)] gap-8 md:w-[min(calc(100%-64px),1080px)] lg:grid-cols-[minmax(0,.9fr)_minmax(420px,1.1fr)] lg:gap-14">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Secure Checkout</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Order Summary</h1>
            <p className="mt-5 max-w-xl leading-7 text-secondary">
              Review your purchase details, then use PayPal or submit a GCash / QRPH payment proof. Payment confirmation and private delivery remain separate steps.
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
            <CheckoutPaymentMethods
              systemId={system.id}
              systemTitle={system.title}
              priceFormatted={price.current}
              userId={identity.id}
              verifiedEmail={user.email.toLowerCase()}
              paypalSdkUrl={paypalSdkUrl}
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
