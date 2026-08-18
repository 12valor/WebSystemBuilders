"use client";

import Image from "next/image";
import Link from "next/link";
import { LocalizedCatalogPrice } from "@/components/catalog/localized-catalog-price";
import { TactileCard } from "@/components/ui/tactile-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { AppIconBadge } from "@/components/ui/app-icon-badge";
import type { CatalogData, CatalogSystemRecord } from "@/features/catalog/types";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Boxes,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  CircleAlert,
  PackageSearch,
} from "lucide-react";

const institutions = [
  {
    name: "Technological University of the Philippines",
    src: "/images/institutions/tup.png",
    width: 1280,
    height: 1280,
    rotation: "xl:-rotate-3",
  },
  {
    name: "Central Philippines State University",
    src: "/images/institutions/cpsu.png",
    width: 727,
    height: 664,
    rotation: "xl:rotate-2",
  },
  {
    name: "Dr. Vicente F. Gustilo Memorial National High School",
    src: "/images/institutions/dr-vicente-f-gustilo-mnhs.png",
    width: 447,
    height: 447,
    rotation: "xl:-rotate-1",
  },
  {
    name: "Negros Occidental High School",
    src: "/images/institutions/negros-occidental-high-school.png",
    width: 736,
    height: 731,
    rotation: "xl:rotate-3",
  },
] as const;

export function TrustStrip() {
  return (
    <section
      id="institutions"
      aria-labelledby="institutions-title"
      className="border-y border-slate-200 bg-white font-sans text-slate-950"
    >
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] py-14 md:w-[min(calc(100%-64px),1280px)] md:py-16 xl:py-20">
        <div className="grid gap-12 xl:grid-cols-[0.72fr_1.28fr] xl:items-center xl:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700">
              Academic community
            </p>
            <h2
              id="institutions-title"
              className="mt-4 max-w-md font-heading text-4xl font-bold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl"
            >
              Institutions represented.
            </h2>
          </div>

          <ul
            aria-label="Educational institutions represented in the WebSystemBuilders community"
            className="grid grid-cols-2 gap-4 sm:gap-5 xl:isolate xl:flex xl:items-center xl:justify-end xl:gap-0"
          >
            {institutions.map((institution, index) => (
              <li
                key={institution.name}
                className={`flex aspect-square items-center justify-center rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 xl:size-40 xl:shrink-0 xl:p-5 xl:shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${
                  index === 0 ? "xl:ml-0" : "xl:-ml-5"
                } ${institution.rotation}`}
              >
                <Image
                  src={institution.src}
                  alt={`${institution.name} logo`}
                  width={institution.width}
                  height={institution.height}
                  sizes="(max-width: 1023px) 42vw, 160px"
                  className="h-full w-full object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function CategorySection({ catalog }: { catalog: CatalogData }) {
  const featured = catalog.systems.filter((system) => system.featured);
  const systems = (featured.length > 0 ? featured : catalog.systems).slice(0, 6);

  return (
    <section id="systems" className="bg-[#FAFAFC] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Featured Systems Heading */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end lg:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catalog Collection</span>
            </div>
            <h2 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold leading-[1.08] tracking-[-0.04em] text-slate-900">
              Featured Software Systems
            </h2>
            <p className="mt-3 max-w-xl text-base text-slate-600 font-medium">
              Browse ready-made systems engineered with production standards for business operations or academic defense.
            </p>
          </div>
          <Link href="/systems">
            <MagneticButton size="md" variant="outline">
              <span>Browse All Systems</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
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

        {/* Browse Categories Grid */}
        <div className="mt-16 border-t border-slate-200/80 pt-14 sm:mt-20 sm:pt-16">
          <div className="mb-9 text-center sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 mb-3">
              <span>Explore Verticals</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Browse Systems by Need
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 font-medium">
              Compare published systems and service paths by the workflow or approved technical need they address.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesList.map((cat) => (
              <Link key={cat.title} href={`/systems?category=${cat.slug}`}>
                <TactileCard bg="white" className="flex h-full flex-col justify-between p-5 hover:border-blue-500/40 sm:p-6">
                  <div>
                    <AppIconBadge icon={cat.icon} color={cat.color} size="md" className="mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                    <span>Explore Category</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </TactileCard>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSystemCard({ system }: { system: CatalogSystemRecord }) {
  const primaryMedia = system.coverImageUrl || system.media?.find((m) => m.mediaType === "image")?.url || system.media?.[0]?.url;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-slate-900/[0.08] bg-white shadow-[0_8px_24px_-20px_rgba(15,23,42,0.28)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_18px_34px_-24px_rgba(37,99,235,0.35)] motion-reduce:transform-none motion-reduce:transition-none">
      {/* Top Preview Card Area */}
      <div className="relative flex h-52 items-center justify-center bg-slate-900 p-4 overflow-hidden border-b border-slate-800">
        {/* Soft Background Grid Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

        {primaryMedia ? (
          <div className="relative z-10 size-full flex items-center justify-center">
            {/* eslint-disable-next-html-element-suppression */}
            <img
              src={primaryMedia}
              alt={system.title}
              className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          /* Mac Style Floating Card Graphic */
          <div className="relative z-10 w-full max-w-[260px] rounded-xl border border-slate-700/80 bg-slate-800/90 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 text-[0.65rem] font-semibold text-slate-400">
              <span className="truncate max-w-[140px] text-slate-300">{system.category?.name ?? "Software Suite"}</span>
              <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-blue-300 font-bold border border-blue-400/25">
                Source Code
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-2 w-4/5 rounded-full bg-slate-600/80" />
              <div className="h-2 w-3/5 rounded-full bg-blue-500/80" />
              <div className="h-2 w-2/5 rounded-full bg-slate-500/80" />
            </div>
          </div>
        )}

        {/* Audience Pill Tag */}
        <span className="absolute top-4 left-4 z-20 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-bold text-blue-700 shadow-sm border border-slate-200">
          {audienceLabel(system.audience)}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
          {system.category?.name ?? "Ready-Made System"}
        </span>
        <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
          {system.title}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-600 font-medium">
          {system.summary}
        </p>

        {/* Feature inclusions */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1 text-blue-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Full Source ZIP</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>30-Day Support</span>
          </div>
        </div>

        {/* Pricing & Detail Trigger */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Starting Price
            </span>
            <div className="text-lg font-extrabold text-slate-900">
              <LocalizedCatalogPrice system={system} variant="featured" />
            </div>
          </div>

          <Link href={`/systems/${system.slug}`}>
            <MagneticButton size="sm" variant="primary">
              <span>View System</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </MagneticButton>
          </Link>
        </div>
      </div>
    </article>
  );
}

function CatalogState({ status }: { status: CatalogData["status"] }) {
  const error = status === "error";
  const unconfigured = status === "unconfigured";
  const StateIcon = error ? CircleAlert : PackageSearch;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-9 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.35)] sm:px-10 sm:py-11">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-5 sm:flex-row sm:items-start">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
            <StateIcon className="size-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
              {error ? "Catalog notice" : unconfigured ? "Catalog in progress" : "New systems coming soon"}
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
              {error
                ? "Systems are temporarily unavailable."
                : unconfigured
                  ? "Our system catalog is being prepared."
                  : "We’re preparing our first catalog releases."}
            </h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
              {error
                ? "We couldn’t load the published catalog right now. You can still tell us what you need, and we’ll help you plan the right solution."
                : unconfigured
                  ? "Ready-made systems will appear here after publication review. In the meantime, tell us about the workflow you need."
                  : "Each system is reviewed for complete product details and delivery assets before it appears here. Need a solution sooner? We can scope a custom build."}
            </p>
          </div>
        </div>

        <Link
          href="/request-a-quote"
          className="blue-button blue-button-static min-h-11 shrink-0 gap-2 px-6 text-sm"
        >
          <span>Request a Custom System</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

const categoriesList = [
  {
    title: "Point-of-Sale (POS)",
    slug: "point-of-sale",
    description: "Retail, cashiering, billing, and receipt printer integration.",
    icon: ShoppingBag,
    color: "blue",
  },
  {
    title: "Capstone & Thesis",
    slug: "capstone-systems",
    description: "Approved academic software foundations and technical support.",
    icon: GraduationCap,
    color: "blue",
  },
  {
    title: "Warehouse & Inventory",
    slug: "inventory-management",
    description: "Stock management, barcode scanning, and multi-location sync.",
    icon: Boxes,
    color: "blue",
  },
  {
    title: "Custom System Development",
    slug: "custom-system-development",
    description: "Requirements-reviewed software for workflows not covered by a published system.",
    icon: Stethoscope,
    color: "blue",
  },
] as const;

function audienceLabel(audience: CatalogSystemRecord["audience"]) {
  if (audience === "students") return "For Students";
  if (audience === "business") return "For Business";
  return "Students + Business";
}
