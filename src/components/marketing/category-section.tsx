import Link from "next/link";
import { LocalizedCatalogPrice } from "@/components/catalog/localized-catalog-price";
import type {
  CatalogData,
  CatalogSystemRecord,
} from "@/features/catalog/types";

const standards = [
  { id: "01", title: "Professional Source Code", desc: "Full clean code & documentation included" },
  { id: "02", title: "Transparent Pricing", desc: "No hidden fees or recurring surprises" },
  { id: "03", title: "Verified Payment", desc: "Encrypted checkout & instant access" },
  { id: "04", title: "Deployment Support", desc: "Technical guidance & installation support" },
];

export function TrustStrip() {
  return (
    <section aria-label="Service standards" className="border-y border-[#E5E7EB] bg-[#F8FAFC]">
      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] sm:grid-cols-2 md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)] xl:grid-cols-4">
        {standards.map((standard) => (
          <div
            key={standard.id}
            className="flex items-center gap-3.5 border-b border-[#E5E7EB] py-5 last:border-b-0 sm:border-r sm:px-6 sm:nth-[2]:border-r-0 sm:nth-[3]:border-b-0 xl:border-b-0 xl:nth-[2]:border-r xl:nth-[3]:border-r xl:first:pl-0 xl:last:border-r-0"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-blue-100/70 text-xs font-bold text-[#2563EB]">
              {standard.id}
            </span>
            <div>
              <h4 className="text-sm font-semibold text-[#111827]">{standard.title}</h4>
              <p className="text-xs text-[#6B7280]">{standard.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategorySection({ catalog }: { catalog: CatalogData }) {
  const featured = catalog.systems.filter((system) => system.featured);
  const systems = (featured.length > 0 ? featured : catalog.systems).slice(0, 6);

  return (
    <section id="systems" className="bg-white py-20 sm:py-28">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        {/* Section 3: Featured Systems Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">Systems Catalog</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
              Featured Software Systems
            </h2>
            <p className="mt-3 max-w-xl text-base text-[#6B7280]">
              Browse professionally built software packages ready for deployment, customization, or academic submission.
            </p>
          </div>
          <Link
            href="/systems"
            className="inline-flex shrink-0 items-center gap-2 font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
          >
            Browse All Systems
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Featured Systems Cards */}
        {systems.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {systems.map((system) => (
              <FeaturedSystemCard key={system.id} system={system} />
            ))}
          </div>
        ) : (
          <CatalogState status={catalog.status} />
        )}

        {/* Section 4: Browse Categories */}
        <div className="mt-24 border-t border-[#E5E7EB] pt-20">
          <div className="mb-12 text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">Explore Categories</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              Browse Systems by Industry
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-[#6B7280]">
              Find ready-to-use software built for specific business verticals and academic disciplines.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesList.map((cat) => (
              <Link
                key={cat.title}
                href={`/systems?category=${cat.slug}`}
                className="group flex flex-col justify-between rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-[#3B82F6]/50 hover:shadow-md"
              >
                <div>
                  <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white">
                    {cat.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-[#2563EB]">
                  <span>Explore Systems</span>
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSystemCard({ system }: { system: CatalogSystemRecord }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-xl">
      {/* Top Graphic / Preview Area */}
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 border-b border-[#E5E7EB]">
        <div className="w-full max-w-[240px] rounded-xl border border-[#E5E7EB] bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2 text-[0.65rem] font-semibold text-[#6B7280]">
            <span>{system.category?.name ?? "System"}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600 font-medium">Ready Made</span>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="h-2 w-3/4 rounded-full bg-slate-200" />
            <div className="h-2 w-1/2 rounded-full bg-blue-100" />
          </div>
        </div>
        {/* Audience Tag */}
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2563EB] shadow-2xs border border-[#E5E7EB]">
          {audienceLabel(system.audience)}
        </span>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
          {system.category?.name ?? "General System"}
        </span>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-[#111827]">
          {system.title}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-[#6B7280]">
          {system.summary}
        </p>

        {/* Pricing & CTA Action */}
        <div className="mt-auto pt-6 border-t border-[#E5E7EB] flex items-center justify-between gap-4">
          <div>
            <span className="block text-[0.7rem] uppercase tracking-wider text-[#9CA3AF] font-medium">Starting At</span>
            <div className="text-lg font-bold text-[#111827]">
              <LocalizedCatalogPrice system={system} variant="featured" />
            </div>
          </div>

          <Link
            href={`/systems/${system.slug}`}
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#2563EB] px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#1D4ED8]"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function CatalogState({ status }: { status: CatalogData["status"] }) {
  const error = status === "error";
  return (
    <div className="rounded-[20px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-12 text-center sm:px-10 sm:py-16">
      <span className="mx-auto grid size-12 place-items-center rounded-xl border border-[#E5E7EB] bg-white text-base font-bold text-[#2563EB]">
        {error ? "!" : status === "unconfigured" ? "SETUP" : "0"}
      </span>
      <h3 className="mt-6 text-2xl font-bold tracking-tight text-[#111827]">
        {error ? "Published systems could not be loaded." : status === "unconfigured" ? "Catalog database connected." : "No published systems yet."}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-[#6B7280]">
        {error
          ? "No partial listing data is being shown."
          : status === "unconfigured"
          ? "Administrator-managed systems will appear here once published from the Admin Dashboard."
          : "A system appears here only after its content and delivery assets pass publication review."}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/systems"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-xs"
        >
          Open Full Systems Catalog
        </Link>
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 text-sm font-semibold text-[#111827]"
        >
          Manage Systems in Admin
        </Link>
      </div>
    </div>
  );
}

const categoriesList = [
  {
    title: "Business",
    slug: "point-of-sale",
    description: "POS, inventory, billing, & commercial management systems.",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15" />
      </svg>
    ),
  },
  {
    title: "Students",
    slug: "capstone-systems",
    description: "Academic capstones, thesis projects, and source code.",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    title: "Restaurant",
    slug: "point-of-sale",
    description: "Ordering, kitchen display, table reservation, and cashiering.",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.75h-18V21h4.5M10.5 7.5h3m-3 3h3" />
      </svg>
    ),
  },
  {
    title: "Healthcare",
    slug: "custom-system-development",
    description: "Clinic management, patient records, and pharmacy tracking.",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    title: "Retail",
    slug: "inventory-management",
    description: "Store sales, barcode integration, supplier & stock control.",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
    ),
  },
  {
    title: "Inventory",
    slug: "warehouse-management",
    description: "Multi-warehouse tracking, stock alerts, & logistics.",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    title: "Education",
    slug: "thesis-related-systems",
    description: "School portals, grading systems, and student information.",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    ),
  },
  {
    title: "Office",
    slug: "custom-system-development",
    description: "Payroll, attendance, HR, & document management.",
    icon: (
      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

function audienceLabel(audience: CatalogSystemRecord["audience"]) {
  if (audience === "students") return "For Students";
  if (audience === "business") return "For Business";
  return "Students + Business";
}
