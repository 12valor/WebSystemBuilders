"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AdminCatalogData, AdminSystemRecord } from "@/features/catalog/admin-types";

export function AdminSystemsList({ data, created }: { data: AdminCatalogData; created: boolean }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [audience, setAudience] = useState("all");
  const [category, setCategory] = useState("all");

  const systems = useMemo(() => {
    const search = query.trim().toLowerCase();
    return data.systems.filter((system) => {
      return (
        (!search || `${system.title} ${system.slug}`.toLowerCase().includes(search)) &&
        (status === "all" || system.status === status) &&
        (audience === "all" || system.audience === audience) &&
        (category === "all" || system.categoryName === category)
      );
    });
  }, [audience, category, data.systems, query, status]);

  const published = data.systems.filter((system) => system.status === "published").length;
  const drafts = data.systems.filter((system) => system.status === "draft" || system.status === "unlisted").length;
  const archived = data.systems.filter((system) => system.status === "archived").length;

  return (
    <main id="admin-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        {created && <p className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-2xs" role="status">The private system draft was created. Publishing remains blocked until the remaining product and delivery details are complete.</p>}
        <div className="flex flex-col gap-6 border-b border-slate-200/80 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Catalog management</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Systems</h1>
            <p className="mt-2 max-w-2xl text-slate-600 font-medium">Create private drafts and review the records that may later be published to the public catalog.</p>
          </div>
          <Link href="/admin/systems/new" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">Create system</Link>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/60 sm:grid-cols-3 lg:max-w-2xl shadow-xs mt-8">
          <Metric label="Published" value={published} />
          <Metric label="Drafts and unlisted" value={drafts} />
          <Metric label="Archived" value={archived} />
        </div>

        <section aria-labelledby="systems-table-title" className="mt-8">
          <h2 id="systems-table-title" className="sr-only">System records</h2>
          <div className="grid gap-3 rounded-t-2xl border border-slate-200/80 bg-white p-4 md:grid-cols-[minmax(240px,1fr)_160px_160px_190px]">
            <label className="grid gap-2 text-xs font-bold text-slate-700"><span>Search</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or slug" className="min-h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none transition-all" /></label>
            <Filter label="Status" value={status} onChange={setStatus} options={[["all", "All statuses"], ["draft", "Draft"], ["published", "Published"], ["unlisted", "Unlisted"], ["archived", "Archived"]]} />
            <Filter label="Audience" value={audience} onChange={setAudience} options={[["all", "All audiences"], ["students", "Students"], ["business", "Business"], ["both", "Both"]]} />
            <Filter label="Category" value={category} onChange={setCategory} options={[["all", "All categories"], ...data.categories.map((item) => [item.name, item.name] as [string, string])]} />
          </div>

          <div className="overflow-hidden rounded-b-2xl border-x border-b border-slate-200/80 bg-white shadow-xs">
            <div className="hidden grid-cols-[minmax(240px,1fr)_140px_120px_130px_150px] gap-4 border-b border-slate-200/80 bg-slate-50/60 px-5 py-3 text-xs font-bold text-slate-500 lg:grid">
              <span>System</span><span>Price</span><span>Audience</span><span>Status</span><span>Updated</span>
            </div>
            {systems.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {systems.map((system) => <SystemRow key={system.id} system={system} />)}
              </div>
            ) : (
              <AdminEmptyState status={data.status} filtered={data.systems.length > 0} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function SystemRow({ system }: { system: AdminSystemRecord }) {
  return (
    <article className="grid gap-4 px-5 py-4.5 hover:bg-slate-50/80 transition-colors lg:grid-cols-[minmax(240px,1fr)_140px_120px_130px_150px] lg:items-center">
      <div>
        <Link href={`/admin/systems/${system.id}/edit`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">{system.title}</Link>
        <p className="mt-1 text-xs text-slate-500 font-medium">/{system.slug} - {system.categoryName ?? "Uncategorized"}</p>
      </div>
      <DataCell label="Price">{formatPrice(system)}</DataCell>
      <DataCell label="Audience">{audienceLabel(system.audience)}</DataCell>
      <DataCell label="Status"><span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-bold capitalize text-slate-700">{system.status}</span></DataCell>
      <DataCell label="Updated">{new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(system.updatedAt))}</DataCell>
    </article>
  );
}

function AdminEmptyState({ status, filtered }: { status: AdminCatalogData["status"]; filtered: boolean }) {
  const title = status === "unconfigured" ? "The database is not connected." : status === "error" ? "System records could not be loaded." : filtered ? "No systems match these filters." : "No systems have been added.";
  const copy = status === "unconfigured" ? "Connect Supabase and apply the migrations before creating persistent drafts." : status === "error" ? "The admin list is hiding partial data until the database connection is verified." : filtered ? "Adjust the search or filters to view another record." : "Create the first private draft when the initial product information is ready.";
  return <div className="grid min-h-[360px] place-items-center px-6 py-14 text-center"><div className="max-w-md"><span className="mx-auto grid size-12 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-blue-600 shadow-2xs" aria-hidden="true">{status === "error" ? "!" : "0"}</span><h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 font-medium">{copy}</p>{!filtered && <Link href="/admin/systems/new" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs">Open system editor</Link>}</div></div>;
}

function DataCell({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 text-sm lg:block"><span className="text-xs font-bold text-slate-400 lg:hidden">{label}</span><span className="text-slate-600 font-medium">{children}</span></div>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="bg-white p-5"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">{value}</p></div>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-normal text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}

function audienceLabel(audience: AdminSystemRecord["audience"]) {
  if (audience === "students") return "Students";
  if (audience === "business") return "Business";
  return "Both";
}

function formatPrice(system: AdminSystemRecord) {
  if (system.pricingType === "quotation" || system.priceMinor === null) return "Quote";
  const amount = new Intl.NumberFormat("en-PH", { style: "currency", currency: system.currency, maximumFractionDigits: 2 }).format(system.priceMinor / 100);
  return system.pricingType === "starting" ? `From ${amount}` : amount;
}
