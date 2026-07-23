import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

const fieldClass =
  "min-h-12 w-full rounded-[10px] border border-white/15 bg-background px-4 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none";

export function CheckoutPreview() {
  return (
    <>
      <a href="#checkout-content" className="fixed left-4 top-3 z-[100] -translate-y-24 bg-white px-3 py-2 text-sm font-semibold text-black transition-transform focus:translate-y-0">
        Skip to checkout
      </a>

      <header className="border-b border-white/10 bg-background">
        <div className="mx-auto flex min-h-[74px] w-[min(calc(100%-40px),1080px)] items-center justify-between gap-6 md:w-[min(calc(100%-64px),1080px)]">
          <Link href="/" aria-label="WebSystemBuilders home">
            <BrandLogo priority className="h-auto w-[184px] sm:w-[214px]" />
          </Link>
          <div className="text-right">
            <p className="text-xs font-semibold text-foreground">Secure checkout</p>
            <p className="mt-1 hidden text-xs text-muted sm:block">Payment opens on the hosted provider</p>
          </div>
        </div>
      </header>

      <main id="checkout-content" className="pb-20 sm:pb-24">
        <section className="border-b border-white/10 py-12 sm:py-16">
          <div className="mx-auto w-[min(calc(100%-40px),1080px)] md:w-[min(calc(100%-64px),1080px)]">
            <p className="inline-flex min-h-8 items-center rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3 text-xs font-semibold text-brand-hover">Phase 1 design preview</p>
            <h1 className="mt-6 max-w-3xl text-[clamp(2.6rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.06em]">Review your order and continue securely.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-secondary">No order or payment will be created from this preview. Live checkout remains unavailable until a complete system and payment provider are configured.</p>
          </div>
        </section>

        <section className="mx-auto grid w-[min(calc(100%-40px),1080px)] gap-8 pt-10 md:w-[min(calc(100%-64px),1080px)] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12 lg:pt-14">
          <aside className="order-1 h-fit rounded-2xl border border-white/10 bg-surface p-5 sm:p-6 lg:order-2 lg:sticky lg:top-6" aria-labelledby="order-summary-title">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <h2 id="order-summary-title" className="text-lg font-semibold tracking-[-0.025em]">Order summary</h2>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.7rem] font-semibold text-muted">Preview</span>
            </div>
            <dl className="grid gap-5 py-6 text-sm">
              <SummaryRow term="System" detail="System listing title" />
              <SummaryRow term="Version" detail="Set by administrator" />
              <SummaryRow term="License" detail="Single commercial source license" />
              <SummaryRow term="Delivery" detail="Protected access after verified payment" />
            </dl>
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-start justify-between gap-6">
                <div><p className="text-sm font-semibold">Authoritative total</p><p className="mt-1 text-xs leading-5 text-muted">PHP settlement amount</p></div>
                <p className="text-right text-lg font-semibold">Set by admin</p>
              </div>
              <p className="mt-4 rounded-lg border border-white/10 bg-background p-3 text-xs leading-5 text-secondary">A localized estimate may be shown, but the confirmed checkout currency and total will remain visible before payment.</p>
            </div>
          </aside>

          <form className="order-2 grid gap-8 lg:order-1" aria-label="Checkout preview form">
            <FormSection number="01" title="Customer details">
              <p className="mb-6 text-sm leading-6 text-secondary">The purchase and delivery access will be linked to the verified email address entered here.</p>
              <div className="grid gap-5">
                <InputField id="checkout-name" label="Full name" autoComplete="name" placeholder="Enter your full name" />
                <InputField id="checkout-email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" hint="Order confirmation and protected delivery access are sent here." />
                <InputField id="checkout-phone" label="Phone number" type="tel" autoComplete="tel" placeholder="Optional" optional />
              </div>
            </FormSection>

            <FormSection number="02" title="Required acknowledgements">
              <div className="grid gap-4">
                <CheckboxField id="license-ack">I have reviewed the license, included files, system requirements, and support coverage.</CheckboxField>
                <CheckboxField id="delivery-ack">I understand that delivery begins only after verified payment and uses protected access.</CheckboxField>
                <CheckboxField id="refund-ack">I have reviewed the no-change-of-mind refund policy and understand the stated exceptions.</CheckboxField>
              </div>
            </FormSection>

            <FormSection number="03" title="Secure payment handoff">
              <ol className="grid gap-4 text-sm text-secondary">
                <PaymentStep number="1">A pending order is created with the authoritative product and price snapshot.</PaymentStep>
                <PaymentStep number="2">The customer continues to PayMongo&apos;s hosted payment page.</PaymentStep>
                <PaymentStep number="3">Delivery unlocks only after a verified payment webhook is processed once.</PaymentStep>
              </ol>
              <button type="button" disabled className="mt-7 inline-flex min-h-13 w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-white/10 px-6 font-semibold text-muted">Continue to secure payment</button>
              <p className="mt-3 text-center text-xs leading-5 text-muted">Unavailable in the design preview</p>
            </FormSection>
          </form>
        </section>

        <div className="mx-auto mt-10 flex w-[min(calc(100%-40px),1080px)] flex-col gap-4 border-t border-white/10 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:w-[min(calc(100%-64px),1080px)]">
          <Link href="/systems/preview" className="font-semibold text-secondary hover:text-foreground">Back to system preview</Link>
          <div className="flex flex-wrap gap-4"><Link href="/legal/delivery">Delivery</Link><Link href="/legal/license">License</Link><Link href="/legal/refunds">Refunds</Link><Link href="/legal/privacy">Privacy</Link></div>
        </div>
      </main>
    </>
  );
}

function FormSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-white/10 bg-surface-subtle p-5 sm:p-7">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-center gap-4 border-b border-white/10 pb-5"><span className="text-xs text-muted">{number}</span><h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2></div>
      {children}
    </fieldset>
  );
}

function InputField({ id, label, hint, optional, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint?: string; optional?: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4"><label htmlFor={id} className="text-sm font-semibold">{label}</label>{optional && <span className="text-xs text-muted">Optional</span>}</div>
      <input id={id} aria-describedby={hint ? id + "-hint" : undefined} className={fieldClass} {...props} />
      {hint && <p id={id + "-hint"} className="mt-2 text-xs leading-5 text-muted">{hint}</p>}
    </div>
  );
}

function CheckboxField({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-background p-4 text-sm leading-6 text-secondary hover:border-white/20">
      <input id={id} type="checkbox" className="mt-1 size-4 shrink-0 accent-blue-500" />
      <span>{children}</span>
    </label>
  );
}

function PaymentStep({ number, children }: { number: string; children: React.ReactNode }) {
  return <li className="grid grid-cols-[28px_1fr] gap-3"><span className="grid size-7 place-items-center rounded-md border border-white/10 bg-background text-xs text-foreground">{number}</span><span className="pt-0.5 leading-6">{children}</span></li>;
}

function SummaryRow({ term, detail }: { term: string; detail: string }) {
  return <div className="grid grid-cols-[80px_1fr] gap-4"><dt className="text-muted">{term}</dt><dd className="text-right font-medium text-secondary">{detail}</dd></div>;
}
