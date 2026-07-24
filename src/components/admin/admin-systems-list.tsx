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
        {created && <p className="mb-6 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4 text-sm text-emerald-100" role="status">The private system draft was created. Publishing remains blocked until the remaining product and delivery details are complete.</p>}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Catalog management</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Systems</h1>
            <p className="mt-2 max-w-2xl text-secondary">Create private drafts and review the records that may later be published to the public catalog.</p>
          </div>
          <Link href="/admin/systems/new" className="inline-flex min-h-11 items-center justify-center rounded-[9px] bg-foreground px-5 font-semibold text-background">Create system</Link>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:max-w-2xl">
          <Metric label="Published" value={published} />
          <Metric label="Drafts and unlisted" value={drafts} />
          <Metric label="Archived" value={archived} />
        </div>

        <section aria-labelledby="systems-table-title" className="mt-8">
          <h2 id="systems-table-title" className="sr-only">System records</h2>
          <div className="grid gap-3 rounded-t-xl border border-white/10 bg-surface p-4 md:grid-cols-[minmax(240px,1fr)_160px_160px_190px]">
            <label className="grid gap-2 text-xs font-semibold text-secondary"><span>Search</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or slug" className="min-h-10 rounded-lg border border-white/15 bg-background px-3 text-sm placeholder:text-muted focus:border-brand focus:outline-none" /></label>
            <Filter label="Status" value={status} onChange={setStatus} options={[["all", "All statuses"], ["draft", "Draft"], ["published", "Published"], ["unlisted", "Unlisted"], ["archived", "Archived"]]} />
            <Filter label="Audience" value={audience} onChange={setAudience} options={[["all", "All audiences"], ["students", "Students"], ["business", "Business"], ["both", "Both"]]} />
            <Filter label="Category" value={category} onChange={setCategory} options={[["all", "All categories"], ...data.categories.map((item) => [item.name, item.name] as [string, string])]} />
          </div>

          <div className="overflow-hidden rounded-b-xl border-x border-b border-white/10 bg-surface-subtle">
            <div className="hidden grid-cols-[minmax(240px,1fr)_140px_120px_130px_150px] gap-4 border-b border-white/10 px-5 py-3 text-xs font-semibold text-muted lg:grid">
              <span>System</span><span>Price</span><span>Audience</span><span>Status</span><span>Updated</span>
            </div>
            {systems.length > 0 ? (
              <div className="divide-y divide-white/10">
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
    <article className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(240px,1fr)_140px_120px_130px_150px] lg:items-center">
      <div><h3 className="font-semibold">{system.title}</h3><p className="mt-1 text-xs text-muted">/{system.slug} · {system.categoryName ?? "Uncategorized"}</p></div>
      <DataCell label="Price">{formatPrice(system)}</DataCell>
      <DataCell label="Audience">{audienceLabel(system.audience)}</DataCell>
      <DataCell label="Status"><span className="capitalize">{system.status}</span></DataCell>
      <DataCell label="Updated">{new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(system.updatedAt))}</DataCell>
    </article>
  );
}

function AdminEmptyState({ status, filtered }: { status: AdminCatalogData["status"]; filtered: boolean }) {
  const title = status === "unconfigured" ? "The database is not connected." : status === "error" ? "System records could not be loaded." : filtered ? "No systems match these filters." : "No systems have been added.";
  const copy = status === "unconfigured" ? "Connect Supabase and apply the migrations before creating persistent drafts." : status === "error" ? "The admin list is hiding partial data until the database connection is verified." : filtered ? "Adjust the search or filters to view another record." : "Create the first private draft when the initial product information is ready.";
  return <div className="grid min-h-[360px] place-items-center px-6 py-14 text-center"><div className="max-w-md"><span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 bg-surface text-sm font-semibold text-brand-hover" aria-hidden="true">{status === "error" ? "!" : "0"}</span><h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{title}</h3><p className="mt-2 leading-6 text-secondary">{copy}</p>{!filtered && <Link href="/admin/systems/new" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[9px] border border-white/15 px-5 font-semibold hover:bg-white/[0.04]">Open system editor</Link>}</div></div>;
}

function DataCell({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 text-sm lg:block"><span className="text-xs font-semibold text-muted lg:hidden">{label}</span><span className="text-secondary">{children}</span></div>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="bg-surface p-5"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p></div>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-10 rounded-lg border border-white/15 bg-background px-3 text-sm font-normal focus:border-brand focus:outline-none">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
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
