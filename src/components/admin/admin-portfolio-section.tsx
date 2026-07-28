"use client";

import { useActionState, useMemo, useState } from "react";
import {
  createPortfolioItem,
  updatePortfolioItem,
  type PortfolioEditorState,
} from "@/features/content/portfolio-actions";
import type {
  AdminPortfolioData,
  PortfolioItem,
} from "@/features/content/portfolio-types";

const initialState: PortfolioEditorState = { status: "idle" };
const inputClass = "min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all";
const textareaClass = `${inputClass} min-h-32 py-3 leading-6`;
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs disabled:cursor-not-allowed disabled:text-slate-400 transition-all";

export function AdminPortfolioSection({ data }: { data: AdminPortfolioData }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [audience, setAudience] = useState("all");
  const items = useMemo(() => {
    const search = query.trim().toLowerCase();
    return data.items.filter((item) => (
      (!search || `${item.title} ${item.slug} ${item.summary} ${item.technologyStack.join(" ")}`.toLowerCase().includes(search)) &&
      (status === "all" || item.status === status) &&
      (audience === "all" || item.audience === audience)
    ));
  }, [audience, data.items, query, status]);

  const published = data.items.filter((item) => item.status === "published").length;
  const drafts = data.items.filter((item) => item.status === "draft").length;
  const featured = data.items.filter((item) => item.status === "published" && item.isFeatured).length;

  return (
    <section id="portfolio" aria-labelledby="portfolio-management-title" className="mt-12 border-t border-slate-200/80 pt-10 scroll-mt-24">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Available module</p>
          <h2 id="portfolio-management-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Portfolio and case studies</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 font-medium">Publish only work, outcomes, links, and technology details that are accurate and approved for public use.</p>
        </div>
        <p className="text-xs text-slate-500 font-medium">No sample projects or client claims are generated.</p>
      </div>

      <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/60 sm:grid-cols-3 lg:max-w-2xl shadow-xs">
        <Metric label="Published" value={published} />
        <Metric label="Drafts" value={drafts} />
        <Metric label="Featured" value={featured} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <CreatePortfolioForm />

        <div>
          <div className="grid gap-3 rounded-t-2xl border border-slate-200/80 bg-white p-4 md:grid-cols-[minmax(220px,1fr)_160px_170px]">
            <label className="grid gap-2 text-xs font-bold text-slate-700"><span>Search portfolio</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, slug, summary, or technology" className={inputClass} /></label>
            <Filter label="Status" value={status} onChange={setStatus} options={[["all", "All statuses"], ["draft", "Draft"], ["published", "Published"], ["archived", "Archived"]]} />
            <Filter label="Audience" value={audience} onChange={setAudience} options={[["all", "All audiences"], ["students", "Students"], ["business", "Business"], ["both", "Both"]]} />
          </div>
          <div className="overflow-hidden rounded-b-2xl border-x border-b border-slate-200/80 bg-white shadow-xs">
            {items.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {items.map((item) => <PortfolioEditor key={`${item.id}-${item.updatedAt}`} item={item} />)}
              </div>
            ) : (
              <PortfolioEmptyState status={data.status} filtered={data.items.length > 0} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CreatePortfolioForm() {
  const [state, action, pending] = useActionState(createPortfolioItem, initialState);
  return (
    <form action={action} className="self-start rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <h3 className="text-lg font-bold text-slate-900">Create portfolio draft</h3>
      <p className="mt-2 text-xs leading-5 text-slate-500 font-medium">The entry remains private until every public claim is reviewed and it is explicitly published.</p>
      <PortfolioFields state={state} />
      <button type="submit" disabled={pending} className="mt-5 w-full inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">{pending ? "Creating..." : "Create private draft"}</button>
      <StatusNotice state={state} />
    </form>
  );
}

function PortfolioEditor({ item }: { item: PortfolioItem }) {
  const [state, action, pending] = useActionState(updatePortfolioItem.bind(null, item.id), initialState);
  return (
    <details className="group" open={item.status === "draft"}>
      <summary className="grid cursor-pointer list-none gap-3 px-5 py-5 marker:hidden sm:grid-cols-[minmax(0,1fr)_110px_90px] sm:items-center hover:bg-slate-50 transition-colors">
        <div className="min-w-0"><p className="truncate font-bold text-slate-900">{item.title}</p><p className="mt-1 truncate text-xs text-slate-500 font-medium">/{item.slug} · {audienceLabel(item.audience)}{item.isFeatured ? " · featured" : ""}</p></div>
        <span className="text-xs font-bold capitalize text-slate-600">{item.status}</span>
        <span className="text-right text-xs font-bold text-blue-600 group-open:hidden">Edit</span>
      </summary>
      <form action={action} className="border-t border-slate-200/80 bg-slate-50/50 px-5 py-5">
        <input type="hidden" name="updatedAt" value={item.updatedAt} />
        <PortfolioFields state={state} item={item} />
        <div className="mt-5 flex flex-wrap gap-3">
          <button name="intent" value="save" disabled={pending} className={buttonClass}>{pending ? "Saving..." : "Save changes"}</button>
          <button name="intent" value="publish" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors">{item.status === "archived" ? "Restore and publish" : item.status === "published" ? "Keep published" : "Publish entry"}</button>
          {item.status !== "archived" && <button name="intent" value="archive" disabled={pending} className="min-h-11 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors">Archive</button>}
        </div>
        <StatusNotice state={state} />
      </form>
    </details>
  );
}

function PortfolioFields({ state, item }: { state: PortfolioEditorState; item?: PortfolioItem }) {
  return (
    <div className="mt-5 grid gap-4">
      <Field label="Project title" error={state.fieldErrors?.title}><input name="title" defaultValue={item?.title} className={inputClass} placeholder="Verified project title" /></Field>
      <div className="grid gap-4 sm:grid-cols-[minmax(180px,1fr)_150px]">
        <Field label="URL slug" error={state.fieldErrors?.slug}><input name="slug" defaultValue={item?.slug} className={inputClass} placeholder="verified-project" /></Field>
        <Field label="Audience" error={state.fieldErrors?.audience}><select name="audience" defaultValue={item?.audience ?? "both"} className={inputClass}><option value="students">Students</option><option value="business">Business</option><option value="both">Both</option></select></Field>
      </div>
      <Field label="Public summary" error={state.fieldErrors?.summary}><textarea name="summary" defaultValue={item?.summary} className={`${textareaClass} min-h-24`} placeholder="A concise, factual overview." /></Field>
      <Field label="Case-study description" error={state.fieldErrors?.description}><textarea name="description" defaultValue={item?.description} className={`${textareaClass} min-h-40`} placeholder="Explain the work, scope, and implementation without unsupported claims." /></Field>
      <Field label="Verified outcome (optional)" error={state.fieldErrors?.outcome}><textarea name="outcome" defaultValue={item?.outcome ?? ""} className={`${textareaClass} min-h-24`} placeholder="Add only an outcome you can support with evidence." /></Field>
      <Field label="Technology stack" error={state.fieldErrors?.technologyStack}><textarea name="technologyStack" defaultValue={item?.technologyStack.join(", ")} className={`${textareaClass} min-h-20`} placeholder="Next.js, TypeScript, Supabase" /></Field>
      <Field label="Approved project URL (optional)" error={state.fieldErrors?.projectUrl}><input name="projectUrl" type="url" defaultValue={item?.projectUrl ?? ""} className={inputClass} placeholder="https://" /></Field>
      <div className="grid gap-4 sm:grid-cols-[120px_1fr] sm:items-end">
        <Field label="Order" error={state.fieldErrors?.sortOrder}><input name="sortOrder" type="number" min="0" max="10000" defaultValue={item?.sortOrder ?? 0} className={inputClass} /></Field>
        <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs font-bold text-slate-700"><input name="isFeatured" type="checkbox" defaultChecked={item?.isFeatured} className="size-4 accent-blue-600" /><span>Prioritize this entry in the public portfolio</span></label>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string[]; children: React.ReactNode }) {
  return <label className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span>{children}{error?.[0] && <span className="font-semibold text-red-600">{error[0]}</span>}</label>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}

function StatusNotice({ state }: { state: PortfolioEditorState }) {
  if (state.status === "idle" || !state.message) return null;
  return <p role="alert" className={`mt-4 rounded-2xl border p-3 text-xs leading-5 font-semibold ${state.status === "unavailable" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-red-200 bg-red-50 text-red-900"}`}>{state.message}</p>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="bg-white p-5"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">{value}</p></div>;
}

function PortfolioEmptyState({ status, filtered }: { status: AdminPortfolioData["status"]; filtered: boolean }) {
  const title = status === "unconfigured" ? "The database is not connected." : status === "error" ? "Portfolio records could not be loaded." : filtered ? "No entries match these filters." : "No portfolio entries exist.";
  const copy = status === "unconfigured" ? "Connect Supabase and apply the portfolio migration before creating persistent records." : status === "error" ? "No partial content is shown until the database response can be verified." : filtered ? "Adjust the search or filters to review another entry." : "Create a private draft only when real project information is ready.";
  return <div className="grid min-h-72 place-items-center px-6 py-12 text-center"><div className="max-w-md"><h3 className="text-lg font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 font-medium">{copy}</p></div></div>;
}

function audienceLabel(audience: PortfolioItem["audience"]) {
  if (audience === "students") return "Students";
  if (audience === "business") return "Business";
  return "Both";
}
