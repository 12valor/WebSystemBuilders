"use client";

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
  Utensils,
  Stethoscope,
  Store,
  Boxes,
  School,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const standards = [
  { id: "01", title: "Full Source Code", desc: "Complete clean code & docs included" },
  { id: "02", title: "Authoritative Pricing", desc: "Transparent PHP minor unit calculations" },
  { id: "03", title: "Verified PayMongo", desc: "Encrypted GCash, Maya & Card checkout" },
  { id: "04", title: "30-Day Defect Support", desc: "Technical guidance & installation support" },
];

export function TrustStrip() {
  return (
    <section aria-label="Service standards" className="border-y border-[#E5E7EB] bg-[#FAFAFC] py-6">
      <div className="mx-auto grid w-[min(calc(100%-32px),1280px)] sm:grid-cols-2 md:w-[min(calc(100%-64px),1280px)] xl:grid-cols-4 gap-6">
        {standards.map((standard) => (
          <div key={standard.id} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-xs font-bold text-white shadow-xs">
              {standard.id}
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A]">{standard.title}</h4>
              <p className="text-[11px] text-[#64748B] font-normal">{standard.desc}</p>
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
    <section id="systems" className="bg-[#FAFAFC] py-20 sm:py-28">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        {/* Featured Systems Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catalog Collection</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
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
        <div className="mt-24 border-t border-slate-200/80 pt-20">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-200 mb-3">
              <span>Explore Verticals</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Browse Systems by Industry
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 font-medium">
              Find ready-to-use software tailored to specific business workflows and academic specialization.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesList.map((cat) => (
              <Link key={cat.title} href={`/systems?category=${cat.slug}`}>
                <TactileCard bg="white" className="h-full flex flex-col justify-between p-6 hover:border-blue-500/40">
                  <div>
                    <AppIconBadge icon={cat.icon} color={cat.color as any} size="md" className="mb-4" />
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
  return (
    <article className="flex flex-col overflow-hidden rounded-[24px] border border-slate-900/[0.08] bg-white shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.14)] transition-all duration-300 group hover:-translate-y-1.5">
      {/* Top Preview Card Area */}
      <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-hidden">
        {/* Soft Background Grid Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

        {/* Mac Style Floating Card Graphic */}
        <div className="relative z-10 w-full max-w-[260px] rounded-xl border border-slate-700/80 bg-slate-800/90 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2 text-[0.65rem] font-semibold text-slate-400">
            <span className="truncate max-w-[140px] text-slate-300">{system.category?.name ?? "Software Suite"}</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-400 font-bold border border-emerald-500/30">
              Source Code
            </span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-2 w-4/5 rounded-full bg-slate-600/80" />
            <div className="h-2 w-3/5 rounded-full bg-blue-500/80" />
            <div className="h-2 w-2/5 rounded-full bg-emerald-500/80" />
          </div>
        </div>

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
          <div className="flex items-center gap-1 text-emerald-600 font-semibold">
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
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12 text-center sm:px-10 sm:py-16">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-slate-200 bg-white text-base font-bold text-blue-600 shadow-xs">
        {error ? "!" : status === "unconfigured" ? "SETUP" : "0"}
      </span>
      <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
        {error ? "Published systems could not be loaded." : status === "unconfigured" ? "Catalog database connected." : "No published systems yet."}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 font-medium">
        {error
          ? "No partial listing data is being shown."
          : status === "unconfigured"
          ? "Administrator-managed systems will appear here once published from the Admin Dashboard."
          : "A system appears here only after its content and delivery assets pass publication review."}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
        <Link href="/systems">
          <MagneticButton size="md" variant="primary">
            Open Full Catalog
          </MagneticButton>
        </Link>
        <Link href="/admin">
          <MagneticButton size="md" variant="outline">
            Admin Dashboard
          </MagneticButton>
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
    description: "Academic full-stack systems, schemas, and defense guides.",
    icon: GraduationCap,
    color: "indigo",
  },
  {
    title: "Warehouse & Inventory",
    slug: "inventory-management",
    description: "Stock management, barcode scanning, and multi-location sync.",
    icon: Boxes,
    color: "emerald",
  },
  {
    title: "Clinic & Healthcare",
    slug: "custom-system-development",
    description: "Patient records, appointment booking, and medical billing.",
    icon: Stethoscope,
    color: "rose",
  },
];

function audienceLabel(audience: CatalogSystemRecord["audience"]) {
  if (audience === "students") return "For Students";
  if (audience === "business") return "For Business";
  return "Students + Business";
}
