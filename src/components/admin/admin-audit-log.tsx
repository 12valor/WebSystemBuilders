"use client";

import { useMemo, useState } from "react";
import {
  formatActivityAction,
  formatActivityDetails,
  formatAdminDateTime,
} from "@/features/admin/activity-format";
import type { AdminAuditLogData } from "@/features/admin/types";

export function AdminAuditLog({ data }: { data: AdminAuditLogData }) {
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState("all");
  const activities = useMemo(() => {
    const search = query.trim().toLowerCase();
    return data.activities.filter((activity) => {
      const details = formatActivityDetails(activity.metadata);
      return (
        (target === "all" || activity.targetTable === target) &&
        (!search || `${activity.actorLabel} ${activity.action} ${activity.targetTable} ${details}`.toLowerCase().includes(search))
      );
    });
  }, [data.activities, query, target]);

  const targets = [...new Set(data.activities.map((activity) => activity.targetTable))];

  return (
    <main id="admin-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="border-b border-white/10 pb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Accountability</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Audit log</h1>
          <p className="mt-2 max-w-2xl text-secondary">Read-only history of administrator changes. Sensitive credentials and unrestricted form data are never displayed.</p>
        </div>

        <section aria-labelledby="audit-records-title" className="mt-8">
          <h2 id="audit-records-title" className="sr-only">Audit records</h2>
          <div className="grid gap-3 rounded-t-xl border border-white/10 bg-surface p-4 md:grid-cols-[minmax(240px,1fr)_220px]">
            <label className="grid gap-2 text-xs font-semibold text-secondary"><span>Search activity</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Action, actor, or record" className="min-h-10 rounded-lg border border-white/15 bg-background px-3 text-sm font-normal placeholder:text-muted focus:border-brand focus:outline-none" /></label>
            <label className="grid gap-2 text-xs font-semibold text-secondary"><span>Record type</span><select value={target} onChange={(event) => setTarget(event.target.value)} className="min-h-10 rounded-lg border border-white/15 bg-background px-3 text-sm font-normal focus:border-brand focus:outline-none"><option value="all">All record types</option>{targets.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
          </div>

          <div className="overflow-hidden rounded-b-xl border-x border-b border-white/10 bg-surface-subtle">
            <div className="hidden grid-cols-[minmax(240px,1fr)_160px_180px] gap-5 border-b border-white/10 px-5 py-3 text-xs font-semibold text-muted lg:grid"><span>Activity</span><span>Actor</span><span>Time</span></div>
            {activities.length > 0 ? (
              <div className="divide-y divide-white/10">
                {activities.map((activity) => {
                  const details = formatActivityDetails(activity.metadata);
                  return <article key={activity.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(240px,1fr)_160px_180px] lg:items-start"><div><p className="font-semibold">{formatActivityAction(activity.action)}</p><p className="mt-1 text-xs text-secondary">{activity.targetTable}{activity.targetId ? ` · ${activity.targetId.slice(0, 8)}` : ""}</p>{details && <p className="mt-2 text-xs leading-5 text-muted">{details}</p>}</div><DataCell label="Actor">{activity.actorLabel}</DataCell><DataCell label="Time"><time dateTime={activity.createdAt}>{formatAdminDateTime(activity.createdAt)}</time></DataCell></article>;
                })}
              </div>
            ) : (
              <AuditEmptyState status={data.status} filtered={data.activities.length > 0} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function DataCell({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-start justify-between gap-4 text-sm lg:block"><span className="text-xs font-semibold text-muted lg:hidden">{label}</span><span className="text-secondary">{children}</span></div>;
}

function AuditEmptyState({ status, filtered }: { status: AdminAuditLogData["status"]; filtered: boolean }) {
  const title = status === "unconfigured" ? "The database is not connected." : status === "error" ? "Audit records could not be loaded." : filtered ? "No activity matches these filters." : "No administrator activity has been recorded.";
  const copy = status === "unconfigured" ? "Connect Supabase and apply the migrations to load the audit trail." : status === "error" ? "No partial audit history is displayed when the database response cannot be verified." : filtered ? "Adjust the search or record type to review another event." : "System and category changes will appear after the first administrator mutation.";
  return <div className="grid min-h-72 place-items-center px-6 py-12 text-center"><div className="max-w-md"><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-secondary">{copy}</p></div></div>;
}
