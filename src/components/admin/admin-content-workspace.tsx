"use client";

import { useActionState, useMemo, useState } from "react";
import { AdminPortfolioSection } from "@/components/admin/admin-portfolio-section";
import { AdminTestimonialSection } from "@/components/admin/admin-testimonial-section";
import { AdminSiteContentSection } from "@/components/admin/admin-site-content-section";
import { AdminCompanyProfileSection } from "@/components/admin/admin-company-profile-section";
import {
  createFaqItem,
  updateFaqItem,
  type FaqEditorState,
} from "@/features/content/faq-actions";
import type { AdminFaqData, FaqItem } from "@/features/content/faq-types";
import type { AdminPortfolioData } from "@/features/content/portfolio-types";
import type { AdminTestimonialData } from "@/features/content/testimonial-types";
import type { AdminSiteContentData } from "@/features/content/site-content-types";
import type { AdminCompanyProfileData } from "@/features/content/company-profile-types";

type ContentResult = "created" | "updated" | "published" | "archived" | "portfolio-created" | "portfolio-updated" | "portfolio-published" | "portfolio-archived" | "testimonial-created" | "testimonial-updated" | "testimonial-published" | "testimonial-archived" | "content-created" | "content-updated" | "content-published" | "content-archived" | "company-updated" | "company-published" | "company-archived";

const initialState: FaqEditorState = { status: "idle" };
const inputClass = "min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all";
const textareaClass = `${inputClass} min-h-32 py-3 leading-6`;
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs disabled:cursor-not-allowed disabled:text-slate-400 transition-all";

export function AdminContentWorkspace({
  data,
  portfolioData,
  testimonialData,
  siteContentData,
  companyProfileData,
  result,
}: {
  data: AdminFaqData;
  portfolioData: AdminPortfolioData;
  testimonialData: AdminTestimonialData;
  siteContentData: AdminSiteContentData;
  companyProfileData: AdminCompanyProfileData;
  result?: ContentResult;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const categories = [...new Set(data.items.map((item) => item.category))].sort();
  const items = useMemo(() => {
    const search = query.trim().toLowerCase();
    return data.items.filter((item) => (
      (!search || `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(search)) &&
      (status === "all" || item.status === status) &&
      (category === "all" || item.category === category)
    ));
  }, [category, data.items, query, status]);

  const published = data.items.filter((item) => item.status === "published").length;
  const drafts = data.items.filter((item) => item.status === "draft").length;
  const archived = data.items.filter((item) => item.status === "archived").length;

  return (
    <main id="admin-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        {result && <ResultNotice result={result} />}
        <div className="border-b border-slate-200/80 pb-7">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Public content</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Content</h1>
          <p className="mt-2 max-w-2xl text-slate-600 font-medium">Manage verified public information without editing application code. Manage FAQs, portfolio entries, testimonials, announcements, homepage features, and the approved company and public contact profile.</p>
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/60 sm:grid-cols-3 lg:max-w-2xl shadow-xs">
          <Metric label="Published FAQs" value={published} />
          <Metric label="Draft FAQs" value={drafts} />
          <Metric label="Archived FAQs" value={archived} />
        </div>

        <section aria-labelledby="faq-management-title" className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Available module</p>
              <h2 id="faq-management-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Frequently asked questions</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">Only published records appear on /faq.</p>
          </div>

          <div className="mt-5 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
            <CreateFaqForm />

            <div>
              <div className="grid gap-3 rounded-t-2xl border border-slate-200/80 bg-white p-4 md:grid-cols-[minmax(220px,1fr)_160px_190px]">
                <label className="grid gap-2 text-xs font-bold text-slate-700"><span>Search FAQs</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Question, answer, or category" className={inputClass} /></label>
                <Filter label="Status" value={status} onChange={setStatus} options={[["all", "All statuses"], ["draft", "Draft"], ["published", "Published"], ["archived", "Archived"]]} />
                <Filter label="Category" value={category} onChange={setCategory} options={[["all", "All categories"], ...categories.map((item) => [item, item] as [string, string])]} />
              </div>

              <div className="overflow-hidden rounded-b-2xl border-x border-b border-slate-200/80 bg-white shadow-xs">
                {items.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => <FaqEditor key={`${item.id}-${item.updatedAt}`} item={item} />)}
                  </div>
                ) : (
                  <FaqEmptyState status={data.status} filtered={data.items.length > 0} />
                )}
              </div>
            </div>
          </div>
        </section>

        <AdminPortfolioSection data={portfolioData} />
        <AdminTestimonialSection data={testimonialData} />
        <AdminSiteContentSection data={siteContentData} />
        <AdminCompanyProfileSection data={companyProfileData} />

      </div>
    </main>
  );
}

function CreateFaqForm() {
  const [state, action, pending] = useActionState(createFaqItem, initialState);
  return (
    <form action={action} className="self-start rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <h3 className="text-lg font-bold text-slate-900">Create FAQ draft</h3>
      <p className="mt-2 text-xs leading-5 text-slate-500">New entries stay private until an administrator publishes them.</p>
      <div className="mt-5 grid gap-4">
        <Field label="Question" error={state.fieldErrors?.question}><input name="question" className={inputClass} placeholder="What should visitors know?" /></Field>
        <Field label="Answer" error={state.fieldErrors?.answer}><textarea name="answer" className={textareaClass} placeholder="Give a complete, verified answer." /></Field>
        <div className="grid gap-4 sm:grid-cols-[1fr_110px] xl:grid-cols-1">
          <Field label="Category" error={state.fieldErrors?.category}><input name="category" defaultValue="General" className={inputClass} /></Field>
          <Field label="Order" error={state.fieldErrors?.sortOrder}><input name="sortOrder" type="number" min="0" max="10000" defaultValue="0" className={inputClass} /></Field>
        </div>
      </div>
      <button type="submit" disabled={pending} className="mt-5 w-full inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">{pending ? "Creating..." : "Create private draft"}</button>
      <StatusNotice state={state} />
    </form>
  );
}

function FaqEditor({ item }: { item: FaqItem }) {
  const [state, action, pending] = useActionState(updateFaqItem.bind(null, item.id), initialState);
  return (
    <details className="group" open={item.status === "draft"}>
      <summary className="grid cursor-pointer list-none gap-3 px-5 py-5 marker:hidden sm:grid-cols-[minmax(0,1fr)_110px_90px] sm:items-center hover:bg-slate-50 transition-colors">
        <div className="min-w-0"><p className="truncate font-bold text-slate-900">{item.question}</p><p className="mt-1 text-xs text-slate-500 font-medium">{item.category} · position {item.sortOrder + 1}</p></div>
        <span className="text-xs font-bold capitalize text-slate-600">{item.status}</span>
        <span className="text-right text-xs font-bold text-blue-600 group-open:hidden">Edit</span>
      </summary>
      <form action={action} className="border-t border-slate-200/80 bg-slate-50/50 px-5 py-5">
        <input type="hidden" name="updatedAt" value={item.updatedAt} />
        <div className="grid gap-4">
          <Field label="Question" error={state.fieldErrors?.question}><input name="question" defaultValue={item.question} className={inputClass} /></Field>
          <Field label="Answer" error={state.fieldErrors?.answer}><textarea name="answer" defaultValue={item.answer} className={textareaClass} /></Field>
          <div className="grid gap-4 sm:grid-cols-[minmax(180px,1fr)_120px]">
            <Field label="Category" error={state.fieldErrors?.category}><input name="category" defaultValue={item.category} className={inputClass} /></Field>
            <Field label="Order" error={state.fieldErrors?.sortOrder}><input name="sortOrder" type="number" min="0" max="10000" defaultValue={item.sortOrder} className={inputClass} /></Field>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button name="intent" value="save" disabled={pending} className={buttonClass}>{pending ? "Saving..." : "Save changes"}</button>
          <button name="intent" value="publish" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors">{item.status === "archived" ? "Restore and publish" : item.status === "published" ? "Keep published" : "Publish FAQ"}</button>
          {item.status !== "archived" && <button name="intent" value="archive" disabled={pending} className="min-h-11 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors">Archive</button>}
        </div>
        <StatusNotice state={state} />
      </form>
    </details>
  );
}

function Field({ label, error, children }: { label: string; error?: string[]; children: React.ReactNode }) {
  return <label className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span>{children}{error?.[0] && <span className="font-semibold text-red-600">{error[0]}</span>}</label>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}

function StatusNotice({ state }: { state: FaqEditorState }) {
  if (state.status === "idle" || !state.message) return null;
  return <p role="alert" className={`mt-4 rounded-2xl border p-3 text-xs leading-5 font-semibold ${state.status === "unavailable" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-red-200 bg-red-50 text-red-900"}`}>{state.message}</p>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="bg-white p-5"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">{value}</p></div>;
}

function ResultNotice({ result }: { result: ContentResult }) {
  const messages: Record<ContentResult, string> = { created: "The FAQ draft was created.", updated: "The FAQ changes were saved.", published: "The FAQ is published on the public page.", archived: "The FAQ was archived and removed from the public page.", "portfolio-created": "The portfolio draft was created.", "portfolio-updated": "The portfolio changes were saved.", "portfolio-published": "The portfolio entry is published.", "portfolio-archived": "The portfolio entry was archived and removed from the public page.", "testimonial-created": "The testimonial draft was created privately.", "testimonial-updated": "The testimonial and verification record were saved.", "testimonial-published": "The verified testimonial is published on the homepage.", "testimonial-archived": "The testimonial was archived and removed from the homepage.", "content-created": "The site-content draft was created.", "content-updated": "The site-content changes were saved.", "content-published": "The site content is published.", "content-archived": "The site content was archived and removed publicly.", "company-updated": "The approved company profile changes were saved.", "company-published": "The company and public contact profile is published.", "company-archived": "The stored profile was archived and public contact channels were removed." };
  return <p className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 shadow-2xs" role="status">{messages[result]}</p>;
}

function FaqEmptyState({ status, filtered }: { status: AdminFaqData["status"]; filtered: boolean }) {
  const title = status === "unconfigured" ? "The database is not connected." : status === "error" ? "FAQ records could not be loaded." : filtered ? "No FAQs match these filters." : "No FAQ records exist.";
  const copy = status === "unconfigured" ? "Connect Supabase and apply the content migration before managing persistent FAQ records." : status === "error" ? "No partial content is shown until the database response can be verified." : filtered ? "Adjust the search or filters to review another entry." : "Create a private FAQ draft when the verified answer is ready.";
  return <div className="grid min-h-72 place-items-center px-6 py-12 text-center"><div className="max-w-md"><h3 className="text-lg font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 font-medium">{copy}</p></div></div>;
}
