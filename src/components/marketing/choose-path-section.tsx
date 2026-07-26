import Link from "next/link";

export function ChoosePathSection() {
  return (
    <section className="bg-[#F8FAFC] py-20 sm:py-28">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        {/* Section Heading */}
        <div className="text-center">
          <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">Tailored Solutions</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
            Who are you?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280] sm:text-lg">
            We serve students and business owners with specialized software systems, documentation, and technical support.
          </p>
        </div>

        {/* 2 Large Audience Cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Card 1: For Students */}
          <div className="group flex flex-col justify-between rounded-[20px] border border-[#E5E7EB] bg-white p-8 shadow-xs transition-all hover:-translate-y-1 hover:shadow-xl sm:p-10">
            <div>
              {/* Vector Illustration Container */}
              <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-blue-50/70 p-6">
                <StudentIllustration />
              </div>

              <div className="mt-8">
                <span className="inline-block rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold text-[#2563EB]">
                  Academic Technical Support
                </span>
                <h3 className="mt-3 text-2xl font-bold text-[#111827] sm:text-3xl">For Students</h3>
                <p className="mt-3 text-base leading-relaxed text-[#6B7280]">
                  Browse capstone-ready systems, documentation, source code, and customizable academic projects.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
              <Link
                href="/for-students"
                className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 text-base font-semibold text-white shadow-xs transition-all hover:bg-[#1D4ED8] hover:shadow-md"
              >
                Explore Student Systems
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Card 2: For Businesses */}
          <div className="group flex flex-col justify-between rounded-[20px] border border-[#E5E7EB] bg-white p-8 shadow-xs transition-all hover:-translate-y-1 hover:shadow-xl sm:p-10">
            <div>
              {/* Vector Illustration Container */}
              <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-emerald-50/70 p-6">
                <BusinessIllustration />
              </div>

              <div className="mt-8">
                <span className="inline-block rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-[#22C55E]">
                  Commercial Systems
                </span>
                <h3 className="mt-3 text-2xl font-bold text-[#111827] sm:text-3xl">For Businesses</h3>
                <p className="mt-3 text-base leading-relaxed text-[#6B7280]">
                  Find ready-made software or request a custom business system tailored to your day-to-day operations.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
              <Link
                href="/for-business"
                className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-6 text-base font-semibold text-[#111827] shadow-xs transition-all hover:border-[#2563EB] hover:bg-blue-50/30 hover:text-[#2563EB]"
              >
                Explore Business Systems
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StudentIllustration() {
  return (
    <svg className="h-32 w-auto" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="120" height="75" rx="8" fill="white" stroke="#2563EB" strokeWidth="3" />
      <rect x="30" y="30" width="100" height="45" rx="4" fill="#EFF6FF" />
      <path d="M40 45H90M40 55H110M40 65H75" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      <rect x="10" y="95" width="140" height="8" rx="4" fill="#93C5FD" />
      
      {/* Graduate / Student Cap and Document SVG */}
      <g transform="translate(155, 25)">
        <circle cx="35" cy="35" r="30" fill="#3B82F6" opacity="0.15" />
        <path d="M35 15L60 27L35 39L10 27L35 15Z" fill="#2563EB" />
        <path d="M20 33.5V47.5C20 47.5 26 52.5 35 52.5C44 52.5 50 47.5 50 47.5V33.5" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function BusinessIllustration() {
  return (
    <svg className="h-32 w-auto" viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="15" width="130" height="85" rx="10" fill="white" stroke="#22C55E" strokeWidth="3" />
      <path d="M20 35H150" stroke="#E5E7EB" strokeWidth="2" />
      <circle cx="32" cy="25" r="3" fill="#EF4444" />
      <circle cx="42" cy="25" r="3" fill="#F59E0B" />
      <circle cx="52" cy="25" r="3" fill="#10B981" />
      
      {/* Chart Bars */}
      <rect x="35" y="60" width="14" height="28" rx="3" fill="#DCFCE7" />
      <rect x="57" y="48" width="14" height="40" rx="3" fill="#86EFAC" />
      <rect x="79" y="40" width="14" height="48" rx="3" fill="#22C55E" />
      <rect x="101" y="55" width="14" height="33" rx="3" fill="#4ADE80" />

      {/* Briefcase Badge */}
      <g transform="translate(160, 30)">
        <rect x="5" y="15" width="40" height="30" rx="5" fill="#16A34A" />
        <path d="M17 15V10C17 8.89543 17.8954 8 19 8H31C32.1046 8 33 8.89543 33 10V15" stroke="#16A34A" strokeWidth="3" />
      </g>
    </svg>
  );
}
