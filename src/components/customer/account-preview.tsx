import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

const accountNavigation = [
  ["Overview", "#overview"],
  ["Orders", "#orders"],
  ["Downloads", "#downloads"],
  ["Support", "#support"],
] as const;

export function AccountPreview() {
  return (
    <div className="min-h-screen bg-background">
      <a href="#account-content" className="fixed left-4 top-3 z-[100] -translate-y-24 bg-white px-3 py-2 text-sm font-semibold text-black transition-transform focus:translate-y-0">
        Skip to account content
      </a>

      <header className="border-b border-white/10 bg-background">
        <div className="mx-auto flex min-h-[74px] w-[min(calc(100%-40px),1280px)] items-center gap-5 md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
          <Link href="/" aria-label="WebSystemBuilders home" className="shrink-0">
            <BrandLogo priority className="h-auto w-[184px] sm:w-[214px]" />
          </Link>
          <span className="hidden h-5 w-px bg-white/15 sm:block" aria-hidden="true" />
          <span className="hidden text-xs font-semibold uppercase tracking-[0.12em] text-muted sm:block">Customer account</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted sm:block">Preview mode</span>
            <span className="grid size-9 place-items-center rounded-full border border-white/15 bg-surface text-xs font-semibold text-secondary" aria-label="No customer is signed in">--</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-8 py-8 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:py-12 xl:w-[min(calc(100%-96px),1280px)]">
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <div className="flex items-center justify-between lg:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Account workspace</p>
              <p className="mt-2 text-sm font-semibold text-foreground">Signed-out preview</p>
            </div>
            <Link href="/" className="text-xs font-semibold text-secondary hover:text-foreground lg:hidden">Back home</Link>
          </div>
          <nav aria-label="Account sections" className="mt-5 flex gap-2 overflow-x-auto border-b border-white/10 pb-3 lg:grid lg:gap-1 lg:border-b-0 lg:pb-0">
            {accountNavigation.map(([label, href], index) => (
              <Link key={label} href={href} aria-current={index === 0 ? "page" : undefined} className={`inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 text-sm transition-colors ${index === 0 ? "bg-white/[0.07] font-semibold text-foreground" : "text-secondary hover:bg-white/[0.035] hover:text-foreground"}`}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-7 hidden border-t border-white/10 pt-5 lg:block">
            <p className="text-xs leading-5 text-muted">Account access will require verification of the same email used at checkout.</p>
            <Link href="/" className="mt-4 inline-flex text-xs font-semibold text-secondary hover:text-foreground">Back to public site</Link>
          </div>
        </aside>

        <main id="account-content" className="min-w-0 pb-16">
          <section id="overview" aria-labelledby="account-heading" className="scroll-mt-8 border-b border-white/10 pb-8 sm:pb-10">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <span className="inline-flex min-h-8 items-center rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3 text-xs font-semibold text-brand-hover">Phase 1 design preview</span>
                <h1 id="account-heading" className="mt-5 max-w-3xl text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.06em]">Your systems, orders, and support in one place.</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-secondary sm:text-lg sm:leading-8">This preview contains no customer records. Secure email verification, order history, and protected downloads will be connected during the account implementation phase.</p>
              </div>
              <button type="button" disabled className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-[9px] bg-white/10 px-5 text-sm font-semibold text-muted sm:w-auto">Sign in with email</button>
            </div>

            <div className="mt-8 rounded-xl border border-blue-400/20 bg-blue-500/[0.06] p-4 sm:flex sm:items-start sm:gap-4 sm:p-5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-blue-400/20 text-sm font-semibold text-brand-hover" aria-hidden="true">i</span>
              <div className="mt-3 sm:mt-0">
                <h2 className="text-sm font-semibold">Verified-email access</h2>
                <p className="mt-1 text-sm leading-6 text-secondary">Guest orders will attach to the checkout email. Account access becomes available only after that address is verified through a secure sign-in or activation link.</p>
              </div>
            </div>

            <dl className="mt-8 grid overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
              <Metric label="Orders" value="0" detail="No verified purchases" />
              <Metric label="Available downloads" value="0" detail="Protected access only" />
              <Metric label="Open support requests" value="0" detail="No requests created" />
            </dl>
          </section>

          <section id="orders" aria-labelledby="orders-heading" className="scroll-mt-8 border-b border-white/10 py-10 sm:py-12">
            <SectionHeading eyebrow="Purchase history" title="Orders" description="Track payment, fulfillment, delivery, and receipt status from one durable order record." />
            <EmptyPanel marker="01" title="No orders to show" description="Once a verified purchase exists, its system version, charge currency, payment status, and delivery state will appear here." actionLabel="Browse systems" actionHref="/systems" />
          </section>

          <section id="downloads" aria-labelledby="downloads-heading" className="scroll-mt-8 border-b border-white/10 py-10 sm:py-12">
            <SectionHeading eyebrow="Protected delivery" title="Downloads" description="Purchased files remain private. Every eligible download request creates a new short-lived access link." />
            <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
              <DeliveryRule number="01" title="Verify ownership">The signed-in email must match the customer attached to the paid order.</DeliveryRule>
              <DeliveryRule number="02" title="Check eligibility">The order, fulfillment, version, and access state are checked on the server.</DeliveryRule>
              <DeliveryRule number="03" title="Issue fresh access">An authorized request creates a one-hour link without exposing the stored file.</DeliveryRule>
            </div>
            <EmptyPanel marker="0" title="No files are available" description="Downloads appear only for fulfilled orders associated with a verified customer account." />
          </section>

          <section id="support" aria-labelledby="support-heading" className="scroll-mt-8 pt-10 sm:pt-12">
            <SectionHeading eyebrow="Order support" title="Support" description="Keep order-linked questions, replies, and resolution status together with the purchase they concern." />
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
              <EmptyPanel marker="0" title="No support requests" description="Eligible customers will be able to open a request from an order and follow its status here." />
              <aside className="mt-6 rounded-xl border border-white/10 bg-surface p-5" aria-labelledby="support-policy-heading">
                <h3 id="support-policy-heading" className="text-sm font-semibold">Before submitting</h3>
                <ul className="mt-4 grid gap-3 text-sm leading-6 text-secondary">
                  <li className="border-t border-white/10 pt-3">Choose the related order and system version.</li>
                  <li className="border-t border-white/10 pt-3">Describe the issue and the steps already tried.</li>
                  <li className="border-t border-white/10 pt-3">Never include passwords or private access keys.</li>
                </ul>
                <button type="button" disabled className="mt-5 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-[9px] border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-muted">Create support request</button>
              </aside>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="bg-surface p-5 sm:p-6"><dt className="text-xs font-semibold text-muted">{label}</dt><dd className="mt-3 text-3xl font-semibold tabular-nums tracking-[-0.04em]">{value}</dd><dd className="mt-2 text-xs text-muted">{detail}</dd></div>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  const id = title.toLowerCase() + "-heading";
  return <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{eyebrow}</p><h2 id={id} className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{title}</h2><p className="mt-3 text-sm leading-6 text-secondary sm:text-base sm:leading-7">{description}</p></div>;
}

function EmptyPanel({ marker, title, description, actionLabel, actionHref }: { marker: string; title: string; description: string; actionLabel?: string; actionHref?: string }) {
  return <div className="mt-6 grid min-h-56 place-items-center rounded-xl border border-white/10 bg-surface-subtle p-6 text-center"><div className="max-w-md"><span className="mx-auto grid size-11 place-items-center rounded-xl border border-white/10 bg-surface text-sm font-semibold text-brand-hover" aria-hidden="true">{marker}</span><h3 className="mt-4 text-lg font-semibold tracking-[-0.025em]">{title}</h3><p className="mt-2 text-sm leading-6 text-secondary">{description}</p>{actionLabel && actionHref && <Link href={actionHref} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[9px] border border-white/15 px-5 text-sm font-semibold hover:bg-white/[0.04]">{actionLabel}</Link>}</div></div>;
}

function DeliveryRule({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <article className="bg-surface p-5"><p className="text-xs font-semibold text-brand-hover">{number}</p><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-secondary">{children}</p></article>;
}
