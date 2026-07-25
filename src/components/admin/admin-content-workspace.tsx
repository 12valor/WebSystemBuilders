"use client";

import { useActionState, useMemo, useState } from "react";
import {
  createFaqItem,
  updateFaqItem,
  type FaqEditorState,
} from "@/features/content/faq-actions";
import type { AdminFaqData, FaqItem } from "@/features/content/faq-types";

const initialState: FaqEditorState = { status: "idle" };
const inputClass = "min-h-11 w-full rounded-lg border border-white/15 bg-background px-3 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none";
const textareaClass = `${inputClass} min-h-32 py-3 leading-6`;
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 text-xs font-semibold text-foreground hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:text-muted";

export function AdminContentWorkspace({
  data,
  result,
}: {
  data: AdminFaqData;
  result?: "created" | "updated" | "published" | "archived";
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
        <div className="border-b border-white/10 pb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Public content</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Content</h1>
          <p className="mt-2 max-w-2xl text-secondary">Manage verified public information without editing application code. FAQ publishing is available first; portfolio and site settings remain visibly planned.</p>
        </div>

        <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:max-w-2xl">
          <Metric label="Published FAQs" value={published} />
          <Metric label="Draft FAQs" value={drafts} />
          <Metric label="Archived FAQs" value={archived} />
        </div>

        <section aria-labelledby="faq-management-title" className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Available module</p>
              <h2 id="faq-management-title" className="mt-2 text-2xl font-semibold tracking-[-0.035em]">Frequently asked questions</h2>
            </div>
            <p className="text-xs text-muted">Only published records appear on /faq.</p>
          </div>

          <div className="mt-5 grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
            <CreateFaqForm />

            <div>
              <div className="grid gap-3 rounded-t-xl border border-white/10 bg-surface p-4 md:grid-cols-[minmax(220px,1fr)_160px_190px]">
                <label className="grid gap-2 text-xs font-semibold text-secondary"><span>Search FAQs</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Question, answer, or category" className={inputClass} /></label>
                <Filter label="Status" value={status} onChange={setStatus} options={[["all", "All statuses"], ["draft", "Draft"], ["published", "Published"], ["archived", "Archived"]]} />
                <Filter label="Category" value={category} onChange={setCategory} options={[["all", "All categories"], ...categories.map((item) => [item, item] as [string, string])]} />
              </div>

              <div className="overflow-hidden rounded-b-xl border-x border-b border-white/10 bg-surface-subtle">
                {items.length > 0 ? (
                  <div className="divide-y divide-white/10">
                    {items.map((item) => <FaqEditor key={`${item.id}-${item.updatedAt}`} item={item} />)}
                  </div>
                ) : (
                  <FaqEmptyState status={data.status} filtered={data.items.length > 0} />
                )}
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="planned-content-title" className="mt-10 border-t border-white/10 pt-8">
          <h2 id="planned-content-title" className="text-lg font-semibold">Remaining content modules</h2>
          <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
            {["Portfolio and case studies", "Authentic testimonials", "Announcements and homepage content", "Company and contact settings"].map((item) => <div key={item} className="bg-surface p-5"><p className="font-semibold">{item}</p><p className="mt-2 text-xs leading-5 text-muted">Planned in the remaining Phase 5 content work.</p></div>)}
          </div>
        </section>
      </div>
    </main>
  );
}

function CreateFaqForm() {
  const [state, action, pending] = useActionState(createFaqItem, initialState);
  return (
    <form action={action} className="self-start rounded-xl border border-white/10 bg-surface p-5">
      <h3 className="text-lg font-semibold">Create FAQ draft</h3>
      <p className="mt-2 text-xs leading-5 text-muted">New entries stay private until an administrator publishes them.</p>
      <div className="mt-5 grid gap-4">
        <Field label="Question" error={state.fieldErrors?.question}><input name="question" className={inputClass} placeholder="What should visitors know?" /></Field>
        <Field label="Answer" error={state.fieldErrors?.answer}><textarea name="answer" className={textareaClass} placeholder="Give a complete, verified answer." /></Field>
        <div className="grid gap-4 sm:grid-cols-[1fr_110px] xl:grid-cols-1">
          <Field label="Category" error={state.fieldErrors?.category}><input name="category" defaultValue="General" className={inputClass} /></Field>
          <Field label="Order" error={state.fieldErrors?.sortOrder}><input name="sortOrder" type="number" min="0" max="10000" defaultValue="0" className={inputClass} /></Field>
        </div>
      </div>
      <button type="submit" disabled={pending} className={`${buttonClass} mt-5 w-full bg-foreground text-background hover:bg-white disabled:text-background/50`}>{pending ? "Creating..." : "Create private draft"}</button>
      <StatusNotice state={state} />
    </form>
  );
}

function FaqEditor({ item }: { item: FaqItem }) {
  const [state, action, pending] = useActionState(updateFaqItem.bind(null, item.id), initialState);
  return (
    <details className="group" open={item.status === "draft"}>
      <summary className="grid cursor-pointer list-none gap-3 px-5 py-5 marker:hidden sm:grid-cols-[minmax(0,1fr)_110px_90px] sm:items-center">
        <div className="min-w-0"><p className="truncate font-semibold">{item.question}</p><p className="mt-1 text-xs text-muted">{item.category} · position {item.sortOrder + 1}</p></div>
        <span className="text-xs capitalize text-secondary">{item.status}</span>
        <span className="text-right text-xs font-semibold text-brand-hover group-open:hidden">Edit</span>
      </summary>
      <form action={action} className="border-t border-white/10 bg-background/40 px-5 py-5">
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
          <button name="intent" value="publish" disabled={pending} className={`${buttonClass} bg-foreground text-background hover:bg-white`}>{item.status === "archived" ? "Restore and publish" : item.status === "published" ? "Keep published" : "Publish FAQ"}</button>
          {item.status !== "archived" && <button name="intent" value="archive" disabled={pending} className={`${buttonClass} text-red-300 hover:text-red-200`}>Archive</button>}
        </div>
        <StatusNotice state={state} />
      </form>
    </details>
  );
}

function Field({ label, error, children }: { label: string; error?: string[]; children: React.ReactNode }) {
  return <label className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span>{children}{error?.[0] && <span className="font-normal text-red-300">{error[0]}</span>}</label>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}

function StatusNotice({ state }: { state: FaqEditorState }) {
  if (state.status === "idle" || !state.message) return null;
  return <p role="alert" className={`mt-4 rounded-lg border p-3 text-xs leading-5 ${state.status === "unavailable" ? "border-amber-300/20 bg-amber-300/[0.06] text-amber-100" : "border-red-300/20 bg-red-300/[0.06] text-red-100"}`}>{state.message}</p>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="bg-surface p-5"><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p></div>;
}

function ResultNotice({ result }: { result: "created" | "updated" | "published" | "archived" }) {
  const messages = { created: "The FAQ draft was created.", updated: "The FAQ changes were saved.", published: "The FAQ is published on the public page.", archived: "The FAQ was archived and removed from the public page." };
  return <p className="mb-6 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4 text-sm text-emerald-100" role="status">{messages[result]}</p>;
}

function FaqEmptyState({ status, filtered }: { status: AdminFaqData["status"]; filtered: boolean }) {
  const title = status === "unconfigured" ? "The database is not connected." : status === "error" ? "FAQ records could not be loaded." : filtered ? "No FAQs match these filters." : "No FAQ records exist.";
  const copy = status === "unconfigured" ? "Connect Supabase and apply the content migration before managing persistent FAQ records." : status === "error" ? "No partial content is shown until the database response can be verified." : filtered ? "Adjust the search or filters to review another entry." : "Create a private FAQ draft when the verified answer is ready.";
  return <div className="grid min-h-72 place-items-center px-6 py-12 text-center"><div className="max-w-md"><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-secondary">{copy}</p></div></div>;
}
