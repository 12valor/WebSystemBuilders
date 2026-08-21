"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { LocalizedCatalogPrice } from "@/components/catalog/localized-catalog-price";
import { CatalogCardIllustration } from "@/components/catalog/catalog-card-illustration";
import { TactileCard } from "@/components/ui/tactile-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { AppIconBadge } from "@/components/ui/app-icon-badge";
import type { CatalogData, CatalogSystemRecord } from "@/features/catalog/types";
import {
  ArrowRight,
  Store,
  GraduationCap,
  Code2,
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
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="institutions"
      aria-labelledby="institutions-title"
      className="border-b border-slate-200/80 bg-white py-10 sm:py-14"
    >
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md will-change-transform"
          >
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
              Tested Against Real Technical Scrutiny
            </p>
            <h2
              id="institutions-title"
              className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl md:text-3xl"
            >
              Proven Across Universities and Academic Institutions
            </h2>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
              Our systems are architected to pass technical defenses, rigorous code reviews, and live production deployments.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-6">
            {institutions.map((institution, index) => (
              <motion.div
                key={institution.name}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: reduceMotion ? 0 : index * 0.08,
                }}
                className={`group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-[#FAFAFC] p-3 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/80 hover:bg-white hover:shadow-md sm:p-4 will-change-transform ${institution.rotation}`}
              >
                <div className="relative mb-2.5 flex size-12 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xs transition-transform duration-300 group-hover:scale-105 sm:mb-3 sm:size-16 sm:p-2">
                  <Image
                    src={institution.src}
                    alt={institution.name}
                    width={institution.width}
                    height={institution.height}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold leading-snug text-slate-700 transition-colors group-hover:text-blue-700 sm:text-[11px]">
                  {institution.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategorySection({ catalog }: { catalog: CatalogData }) {
  const featured = catalog.systems.filter((system) => system.featured);
  const systems = (featured.length > 0 ? featured : catalog.systems).slice(0, 6);

  return (
    <section id="systems" className="bg-[#FAFAFC] py-12 sm:py-16 lg:py-24">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Featured Systems Heading */}
        <div className="mb-7 max-w-2xl sm:mb-9 lg:mb-10">
          <h2 className="font-heading text-2xl font-bold leading-[1.12] tracking-[-0.035em] text-slate-900 sm:text-3xl md:text-4xl">
            Featured Software Systems
          </h2>
          <p className="mt-2 text-sm font-normal leading-relaxed text-slate-600 sm:mt-2.5 sm:text-base">
            Browse ready-made systems engineered with production standards for business operations or academic defense.
          </p>
        </div>

        {/* Featured Systems Cards */}
        {systems.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              {systems.map((system) => (
                <FeaturedSystemCard key={system.id} system={system} />
              ))}
            </div>

            <div className="mt-8 flex justify-center sm:mt-12">
              <Link href="/systems">
                <MagneticButton size="md" variant="outline">
                  <span>Browse All Systems</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </Link>
            </div>
          </>
        ) : (
          <CatalogState status={catalog.status} />
        )}

        {/* Browse Categories Grid */}
        <div className="mt-12 border-t border-slate-200/80 pt-12 sm:mt-16 sm:pt-16 lg:mt-20">
          <div className="mb-7 text-center sm:mb-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Browse Systems by Need
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm font-medium text-slate-600 sm:mt-3 sm:text-base">
              Compare published systems and service paths by the workflow or approved technical need they address.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {categoriesList.map((cat) => (
              <Link key={cat.title} href={`/systems?category=${cat.slug}`}>
                <TactileCard
                  bg="white"
                  glassHighlight={false}
                  className="flex h-full flex-col justify-between p-4.5 hover:border-blue-500/40 sm:p-6"
                >
                  <div>
                    <AppIconBadge icon={cat.icon} color={cat.color} size="md" className="mb-3.5 sm:mb-4" />
                    <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600 sm:text-lg">
                      {cat.title}
                    </h3>
                    <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-600 sm:mt-2">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-blue-600 sm:mt-6">
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
  const primaryMedia =
    system.coverImageUrl ||
    system.media?.find((m) => m.mediaType === "image")?.url ||
    system.media?.[0]?.url;
  const isStarting = system.pricingType === "starting";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none">
      {/* 1. Clean Media Preview */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        {primaryMedia ? (
          // eslint-disable-next-html-element-suppression
          <img
            src={primaryMedia}
            alt={system.title}
            className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
          />
        ) : (
          <div className="size-full flex items-center justify-center bg-slate-50">
            <CatalogCardIllustration categorySlug={system.category?.slug} title={system.title} />
          </div>
        )}
      </div>

      {/* 2. Content Area */}
      <div className="flex flex-1 flex-col p-4.5 sm:p-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
          {system.category?.name ?? "Custom System Development"}
        </span>

        <h3 className="mt-1.5 font-heading text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 sm:mt-2 sm:text-lg">
          <Link href={`/systems/${system.slug}`} className="focus:outline-none">
            {system.title}
          </Link>
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2">
          {system.summary}
        </p>

        {/* Inclusions Row */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-medium sm:mt-4 sm:gap-3">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" aria-hidden="true" />
            Full Source ZIP
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-blue-600 shrink-0" aria-hidden="true" />
            30-Day Support
          </span>
        </div>

        {/* 3. Price & Action Footer */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 mt-auto sm:mt-5 sm:pt-4">
          <div className="min-w-0">
            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
              {isStarting ? "Starting at" : "Price"}
            </span>
            <div className="mt-0.5 text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              <LocalizedCatalogPrice system={system} variant="featured" />
            </div>
          </div>

          <Link
            href={`/systems/${system.slug}`}
            className="group/btn inline-flex shrink-0 min-h-[40px] items-center justify-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <span>View System</span>
            <ArrowRight className="size-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5" aria-hidden="true" />
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
    icon: Store,
    color: "slate",
  },
  {
    title: "Capstone & Thesis",
    slug: "capstone-systems",
    description: "Approved academic software foundations and technical support.",
    icon: GraduationCap,
    color: "slate",
  },
  {
    title: "Warehouse & Inventory",
    slug: "inventory-management",
    description: "Stock management, barcode scanning, and multi-location sync.",
    icon: Boxes,
    color: "slate",
  },
  {
    title: "Custom System Development",
    slug: "custom-system-development",
    description: "Requirements-reviewed software for workflows not covered by a published system.",
    icon: Code2,
    color: "slate",
  },
] as const;

function audienceLabel(audience: CatalogSystemRecord["audience"]) {
  if (audience === "students") return "For Students";
  if (audience === "business") return "For Business";
  return "Students + Business";
}
