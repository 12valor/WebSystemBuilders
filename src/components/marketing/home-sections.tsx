import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCallToAction() {
  return (
    <section id="contact" className="border-t border-slate-200 bg-[#FAFAFC] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="grid items-end gap-8 rounded-[20px] border border-slate-200 bg-white p-7 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.3)] sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700">
              A clearer way to begin
            </p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-[#0F172A]">
              Getting the right system should feel straightforward.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              No vague promises or confusing handoffs. Just a clear path from the first look to the right next step.
            </p>
          </div>

          <div className="grid w-full shrink-0 gap-3 sm:flex lg:w-auto lg:flex-col">
            <Link
              href="/systems"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#2563EB] px-7 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(37,99,235,0.5)] transition-colors duration-200 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
            >
              Browse systems
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
            </Link>
            <Link
              href="/request-a-quote"
              className="inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-full border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none sm:w-auto"
            >
              Request a custom build
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
