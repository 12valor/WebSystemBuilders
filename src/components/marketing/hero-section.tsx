import Link from "next/link";

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32">
      {/* Background Subtle Gradient Glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[540px] rounded-full bg-blue-50/70 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-1/2 -z-10 size-[480px] rounded-full bg-slate-50/80 blur-3xl" />

      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] items-center gap-12 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-12 xl:w-[min(calc(100%-96px),1280px)] xl:gap-16">
        {/* Left Column: Typography & CTAs */}
        <div className="lg:col-span-7 xl:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-4 py-1.5 text-xs font-semibold text-[#2563EB]">
            <span className="inline-block size-2 rounded-full bg-[#2563EB]" />
            Software Marketplace & Custom Development
          </div>

          <h1 className="mt-6 text-[clamp(2.75rem,5.5vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-[#111827]">
            Ready-made Software <br className="hidden sm:inline" />
            <span className="text-[#2563EB]">for Businesses and Students.</span>
          </h1>

          <p className="mt-6 max-w-[580px] text-lg leading-relaxed text-[#6B7280]">
            Browse professionally developed software systems or request a custom-built solution tailored to your needs.
          </p>

          <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <Link
              href="/systems"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-7 text-base font-semibold text-white shadow-md transition-all hover:bg-[#1D4ED8] hover:shadow-lg focus:outline-hidden"
            >
              Browse Systems
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/request-a-quote"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-7 text-base font-semibold text-[#111827] shadow-xs transition-all hover:border-gray-300 hover:bg-slate-50"
            >
              Request Quote
            </Link>
          </div>

          {/* Quick Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-[#E5E7EB] pt-6 text-xs font-medium text-[#6B7280]">
            <div className="flex items-center gap-2">
              <svg className="size-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>Full Source Code Included</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="size-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>Documentation Included</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="size-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>Deployment Assistance</span>
            </div>
          </div>
        </div>

        {/* Right Column: Combined Integrated Software Illustration */}
        <div className="lg:col-span-5 xl:col-span-6">
          <IntegratedSoftwareIllustration />
        </div>
      </div>
    </section>
  );
}

function IntegratedSoftwareIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      {/* Container Box */}
      <div className="relative rounded-[24px] border border-[#E5E7EB] bg-gradient-to-b from-[#F8FAFC] to-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs font-semibold tracking-wider text-[#6B7280] uppercase">We Build Software Systems</span>
        </div>

        {/* Multi-System Grid Nodes Vector Illustration */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
          {/* POS System Tile */}
          <div className="group rounded-[18px] border border-[#E5E7EB] bg-white p-4 shadow-xs transition-all hover:border-[#3B82F6]/40 hover:shadow-md">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5a1.5 1.5 0 011.5 1.5v9.75a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5z" />
              </svg>
            </div>
            <h3 className="mt-3 font-semibold text-[#111827]">Point of Sale</h3>
            <p className="mt-1 text-xs text-[#6B7280]">Checkout, receipt, billing</p>
          </div>

          {/* Inventory System Tile */}
          <div className="group rounded-[18px] border border-[#E5E7EB] bg-white p-4 shadow-xs transition-all hover:border-[#3B82F6]/40 hover:shadow-md">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#22C55E]">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="mt-3 font-semibold text-[#111827]">Inventory</h3>
            <p className="mt-1 text-xs text-[#6B7280]">Stock, tracking, alerts</p>
          </div>

          {/* Warehouse System Tile */}
          <div className="group rounded-[18px] border border-[#E5E7EB] bg-white p-4 shadow-xs transition-all hover:border-[#3B82F6]/40 hover:shadow-md">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36rem" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21v-9a3.75 3.75 0 013.75-3.75h9a3.75 3.75 0 013.75 3.75v9" />
              </svg>
            </div>
            <h3 className="mt-3 font-semibold text-[#111827]">Warehouse</h3>
            <p className="mt-1 text-xs text-[#6B7280]">Logistics & movement</p>
          </div>

          {/* School & Hospital Tile */}
          <div className="group rounded-[18px] border border-[#E5E7EB] bg-white p-4 shadow-xs transition-all hover:border-[#3B82F6]/40 hover:shadow-md">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
            </div>
            <h3 className="mt-3 font-semibold text-[#111827]">School & Capstone</h3>
            <p className="mt-1 text-xs text-[#6B7280]">Grades, thesis, medical</p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs">
          <span className="font-semibold text-[#2563EB]">Clean Source Code & Documentation Included</span>
          <span className="font-semibold text-[#111827]">Production Ready</span>
        </div>
      </div>
    </div>
  );
}