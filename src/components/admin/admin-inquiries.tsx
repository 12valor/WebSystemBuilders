"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  updateAdminInquiry,
  type AdminInquiryState,
} from "@/features/inquiries/admin-actions";
import type {
  AdminInquiriesData,
  AdminInquiryEvent,
  AdminInquiryRecord,
  InquiryStatus,
} from "@/features/inquiries/admin-types";

const initialState: AdminInquiryState = { status: "idle" };

export function AdminInquiries({
  data,
  selectedId,
  result,
}: {
  data: AdminInquiriesData;
  selectedId?: string;
  result?: string;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [audience, setAudience] = useState("all");
  const [type, setType] = useState("all");

  const inquiries = useMemo(() => {
    const search = query.trim().toLowerCase();
    return data.inquiries.filter((inquiry) => (
      (!search || `${inquiry.name} ${inquiry.email} ${inquiry.subject} ${inquiry.organization ?? ""}`.toLowerCase().includes(search))
      && (status === "all" || inquiry.status === status)
      && (audience === "all" || inquiry.audience === audience)
      && (type === "all" || inquiry.inquiryType === type)
    ));
  }, [audience, data.inquiries, query, status, type]);

  const newCount = data.inquiries.filter((inquiry) => inquiry.status === "new").length;
  const reviewCount = data.inquiries.filter((inquiry) => inquiry.status === "in_review").length;
  const unassignedCount = data.inquiries.filter((inquiry) => !inquiry.assignedTo).length;

  return (
    <main id="admin-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="border-b border-slate-200/80 pb-7">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Service operations</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Inquiries</h1>
          <p className="mt-2 max-w-2xl text-slate-600 font-medium">Review contact and quotation requests, assign ownership, and keep a durable status history.</p>
        </div>

        {data.status !== "ready" && <InquiryDataState status={data.status} />}

        <section aria-labelledby="inquiry-summary-title" className="mt-8">
          <h2 id="inquiry-summary-title" className="sr-only">Loaded inquiry summary</h2>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/60 sm:grid-cols-2 xl:grid-cols-4 shadow-xs">
            <Metric label="Loaded inquiries" value={data.status === "ready" ? data.inquiries.length : null} />
            <Metric label="New" value={data.status === "ready" ? newCount : null} />
            <Metric label="In review" value={data.status === "ready" ? reviewCount : null} />
            <Metric label="Unassigned" value={data.status === "ready" ? unassignedCount : null} />
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Summary covers the latest 200 inquiry records loaded into this workspace.</p>
        </section>

        {data.status === "ready" && (
          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
            <section aria-labelledby="inquiry-queue-title" className="min-w-0">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 id="inquiry-queue-title" className="text-lg font-bold text-slate-900">Inquiry queue</h2>
                  <p className="mt-1 text-sm text-slate-600 font-medium">Showing {inquiries.length} of {data.inquiries.length} loaded records.</p>
                </div>
              </div>

              <div className="grid gap-3 rounded-t-2xl border border-slate-200/80 bg-white p-4 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-bold text-slate-700 sm:col-span-2"><span>Search</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, email, subject, or organization" className="min-h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none transition-all" /></label>
                <Filter label="Status" value={status} onChange={setStatus} options={[["all", "All statuses"], ["new", "New"], ["in_review", "In review"], ["responded", "Responded"], ["closed", "Closed"], ["spam", "Spam"]]} />
                <Filter label="Audience" value={audience} onChange={setAudience} options={[["all", "All audiences"], ["student", "Student"], ["business", "Business"], ["general", "General"]]} />
                <Filter label="Type" value={type} onChange={setType} options={[["all", "All types"], ["contact", "Contact"], ["quote", "Quotation"]]} />
              </div>

              <div className="max-h-[760px] overflow-y-auto rounded-b-2xl border-x border-b border-slate-200/80 bg-white shadow-xs">
                {inquiries.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {inquiries.map((inquiry) => <InquiryQueueItem key={inquiry.id} inquiry={inquiry} selected={inquiry.id === data.selectedInquiry?.id} />)}
                  </div>
                ) : (
                  <div className="grid min-h-64 place-items-center p-8 text-center"><div><h3 className="font-bold text-slate-900">No inquiries match these filters.</h3><p className="mt-2 text-sm text-slate-500 font-medium">Adjust the search or filters to view another request.</p></div></div>
                )}
              </div>
            </section>

            <section aria-labelledby="inquiry-detail-title" className="min-w-0 xl:sticky xl:top-24 xl:self-start">
              <h2 id="inquiry-detail-title" className="sr-only">Inquiry details</h2>
              {data.selectedInquiry ? (
                <InquiryDetail inquiry={data.selectedInquiry} history={data.history} result={result} />
              ) : selectedId ? (
                <EmptyDetail title="Inquiry not found." copy="The selected record may no longer exist or may not be accessible." />
              ) : (
                <EmptyDetail title="Select an inquiry." copy="Choose a record from the queue to review its complete request and operational history." />
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function InquiryQueueItem({ inquiry, selected }: { inquiry: AdminInquiryRecord; selected: boolean }) {
  return (
    <Link href={`/admin/inquiries?id=${inquiry.id}`} aria-current={selected ? "true" : undefined} className={`block px-5 py-4 transition-colors ${selected ? "bg-blue-50/70 border-l-4 border-l-blue-600" : "hover:bg-slate-50"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-bold text-slate-900">{inquiry.subject}</p>
          <p className="mt-1 truncate text-xs text-slate-600 font-medium">{inquiry.name} · {inquiry.email}</p>
        </div>
        <StatusBadge status={inquiry.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
        <span className="capitalize">{inquiry.inquiryType === "quote" ? "Quotation" : "Contact"}</span>
        <span className="capitalize">{inquiry.audience}</span>
        <span>{inquiry.assignedLabel ?? "Unassigned"}</span>
        <time dateTime={inquiry.createdAt}>{formatDateTime(inquiry.createdAt)}</time>
      </div>
    </Link>
  );
}

function InquiryDetail({ inquiry, history, result }: { inquiry: AdminInquiryRecord; history: AdminInquiryEvent[]; result?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      {result && <p className="border-b border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-900" role="status">{result === "unchanged" ? "No operational changes were needed." : "The inquiry was updated and its changes were recorded."}</p>}
      <div className="border-b border-slate-200/80 p-5 bg-slate-50/50">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{inquiry.inquiryType === "quote" ? "Quotation request" : "Contact inquiry"}</p>
            <h3 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">{inquiry.subject}</h3>
            <p className="mt-2 text-sm text-slate-600 font-medium">Submitted by {inquiry.name}{inquiry.organization ? ` · ${inquiry.organization}` : ""}</p>
          </div>
          <StatusBadge status={inquiry.status} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={`mailto:${inquiry.email}`} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs">Open email client</a>
          <span className="self-center text-xs text-slate-500 font-medium">No message is sent automatically.</span>
        </div>
      </div>

      <div className="border-b border-slate-200/80 p-5">
        <h4 className="font-bold text-slate-900">Operational controls</h4>
        <p className="mt-1 text-xs leading-5 text-slate-500 font-medium">“Responded” records an external response state; it does not send an email.</p>
        <InquiryOperationsForm inquiry={inquiry} />
      </div>

      <div className="grid gap-5 border-b border-slate-200/80 p-5 sm:grid-cols-2">
        <Detail label="Email"><a href={`mailto:${inquiry.email}`} className="break-all text-blue-600 hover:text-blue-700 font-medium">{inquiry.email}</a></Detail>
        <Detail label="Audience"><span className="capitalize">{inquiry.audience}</span></Detail>
        <Detail label="Assigned to">{inquiry.assignedLabel ?? "Unassigned"}</Detail>
        <Detail label="Submitted">{formatDateTime(inquiry.createdAt)}</Detail>
        {inquiry.timeline && <Detail label="Timeline">{inquiry.timeline}</Detail>}
        {inquiry.projectType && <Detail label="Project type">{formatSlug(inquiry.projectType)}</Detail>}
        <Detail label="Source path">{inquiry.sourcePath}</Detail>
        {inquiry.respondedAt && <Detail label="First marked responded">{formatDateTime(inquiry.respondedAt)}</Detail>}
        {inquiry.closedAt && <Detail label="Closed">{formatDateTime(inquiry.closedAt)}</Detail>}
      </div>

      <div className="border-b border-slate-200/80 p-5">
        <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Message</h4>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700 font-normal">{inquiry.message}</p>
      </div>

      {inquiry.requirements && (
        <div className="border-b border-slate-200/80 p-5">
          <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Requirements</h4>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700 font-normal">{inquiry.requirements}</p>
        </div>
      )}

      <div className="p-5">
        <h4 className="font-bold text-slate-900">Operational history</h4>
        {history.length > 0 ? (
          <ol className="mt-4 grid gap-3">
            {history.map((event) => <HistoryItem key={event.id} event={event} />)}
          </ol>
        ) : (
          <p className="mt-3 text-sm leading-6 text-slate-500 font-medium">No history exists yet. Older inquiries receive history after their first Phase 5 update.</p>
        )}
      </div>
    </div>
  );
}

function InquiryOperationsForm({ inquiry }: { inquiry: AdminInquiryRecord }) {
  const action = updateAdminInquiry.bind(null, inquiry.id);
  const [state, formAction] = useActionState(action, initialState);
  return (
    <form action={formAction} className="mt-4 grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-xs font-bold text-slate-700"><span>Status</span><select name="status" defaultValue={inquiry.status} className="min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-normal text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all"><option value="new">New</option><option value="in_review">In review</option><option value="responded">Responded</option><option value="closed">Closed</option><option value="spam">Spam</option></select><FieldError errors={state.fieldErrors?.status} /></label>
      <label className="grid gap-2 text-xs font-bold text-slate-700"><span>Assignment</span><select name="assignment" defaultValue="keep" className="min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-normal text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all"><option value="keep">Keep {inquiry.assignedLabel ?? "unassigned"}</option><option value="assign_to_me">Assign to me</option><option value="unassign">Unassign</option></select><FieldError errors={state.fieldErrors?.assignment} /></label>
      {state.message && <p className={`text-sm leading-6 font-semibold sm:col-span-2 ${state.status === "unavailable" ? "text-amber-800" : "text-red-600"}`} role="alert">{state.message}</p>}
      <div className="sm:col-span-2 sm:justify-self-end"><SubmitButton /></div>
    </form>
  );
}

function HistoryItem({ event }: { event: AdminInquiryEvent }) {
  const description = event.eventType === "created"
    ? "Inquiry received"
    : event.eventType === "assigned"
      ? `Assigned to ${event.assignedLabel ?? "Administrator"}`
      : event.eventType === "unassigned"
        ? "Assignment removed"
        : `Status changed from ${statusLabel(event.fromStatus)} to ${statusLabel(event.toStatus)}`;

  return <li className="rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3"><p className="text-sm font-semibold text-slate-900">{description}</p><p className="mt-1 text-xs text-slate-500 font-medium">{event.actorLabel} · {formatDateTime(event.createdAt)}</p></li>;
}

function Metric({ label, value }: { label: string; value: number | null }) {
  return <div className="bg-white p-5"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold text-slate-900 tabular-nums">{value ?? "—"}</p></div>;
}

function StatusBadge({ status }: { status: InquiryStatus }) {
  const tone = status === "new" ? "border-blue-200 bg-blue-50 text-blue-800" : status === "in_review" ? "border-amber-200 bg-amber-50 text-amber-800" : status === "responded" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : status === "spam" ? "border-red-200 bg-red-50 text-red-800" : "border-slate-200 bg-slate-100 text-slate-600";
  return <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${tone}`}>{statusLabel(status)}</span>;
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="text-xs font-bold text-slate-500">{label}</p><div className="mt-1 text-sm text-slate-700 font-medium">{children}</div></div>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<[string, string]> }) {
  return <label className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-normal text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all">{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">{pending ? "Saving..." : "Save operations"}</button>;
}

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? <span className="font-semibold text-red-600">{errors[0]}</span> : null;
}

function EmptyDetail({ title, copy }: { title: string; copy: string }) {
  return <div className="grid min-h-[420px] place-items-center rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs"><div className="max-w-md"><h3 className="text-lg font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 font-medium">{copy}</p></div></div>;
}

function InquiryDataState({ status }: { status: AdminInquiriesData["status"] }) {
  const unconfigured = status === "unconfigured";
  return <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-2xs" role="status"><p className="font-bold">{unconfigured ? "Inquiry operations are not connected." : "Inquiry records could not be loaded."}</p><p className="mt-1 leading-6 text-amber-800 font-medium">{unconfigured ? "Connect Supabase and apply the inquiry migrations before managing requests." : "No partial inquiry data is displayed. Verify the database connection and applied migrations."}</p></div>;
}

function statusLabel(status: InquiryStatus | null) {
  if (!status) return "unknown";
  return status === "in_review" ? "In review" : status.charAt(0).toUpperCase() + status.slice(1);
}

function formatSlug(value: string) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(value));
}
