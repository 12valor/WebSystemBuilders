import Link from "next/link";
import {
  formatActivityAction,
  formatActivityDetails,
  formatAdminDateTime,
} from "@/features/admin/activity-format";
import type { AdminDashboardData } from "@/features/admin/types";

export function AdminOverview({ data }: { data: AdminDashboardData }) {
  const unavailable = data.status !== "ready";

  return (
    <main id="admin-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Operations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Overview</h1>
            <p className="mt-2 max-w-2xl text-secondary">Live catalog, inquiry, and administrator activity from the configured project.</p>
          </div>
          <Link href="/admin/systems/new" className="inline-flex min-h-11 items-center justify-center rounded-[9px] bg-foreground px-5 font-semibold text-background">Create system</Link>
        </div>

        {unavailable && <DataState status={data.status} />}

        <section aria-labelledby="admin-metrics-title" className="mt-8">
          <h2 id="admin-metrics-title" className="sr-only">Operational metrics</h2>
          <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Published systems" value={data.metrics.publishedSystems} href="/admin/systems" />
            <Metric label="Drafts and unlisted" value={data.metrics.draftSystems} href="/admin/systems" />
            <Metric label="Active categories" value={data.metrics.activeCategories} href="/admin/categories" />
            <Metric label="New inquiries" value={data.metrics.newInquiries} />
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
          <section aria-labelledby="recent-activity-title" className="overflow-hidden rounded-xl border border-white/10 bg-surface-subtle">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 id="recent-activity-title" className="font-semibold">Recent administrator activity</h2>
                <p className="mt-1 text-xs text-muted">Database-recorded system and category changes.</p>
              </div>
              <Link href="/admin/audit-log" className="text-xs font-semibold text-brand-hover hover:text-foreground">View audit log</Link>
            </div>
            {data.recentActivity.length > 0 ? (
              <div className="divide-y divide-white/10">
                {data.recentActivity.map((activity) => {
                  const details = formatActivityDetails(activity.metadata);
                  return (
                    <article key={activity.id} className="px-5 py-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                        <p className="font-medium">{formatActivityAction(activity.action)}</p>
                        <time className="shrink-0 text-xs text-muted" dateTime={activity.createdAt}>{formatAdminDateTime(activity.createdAt)}</time>
                      </div>
                      <p className="mt-1 text-xs text-secondary">{activity.actorLabel} · {activity.targetTable}</p>
                      {details && <p className="mt-2 text-xs text-muted">{details}</p>}
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyPanel title="No administrator activity yet." copy={emptyCopy(data.status, "Changes to systems and categories will appear here.")} />
            )}
          </section>

          <section aria-labelledby="recent-inquiries-title" className="overflow-hidden rounded-xl border border-white/10 bg-surface-subtle">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div>
                <h2 id="recent-inquiries-title" className="font-semibold">Recent inquiries</h2>
                <p className="mt-1 text-xs text-muted">Latest contact and quotation requests.</p>
              </div>
              <Link href="/admin/inquiries" className="text-xs font-semibold text-brand-hover hover:text-foreground">View queue</Link>
            </div>
            {data.recentInquiries.length > 0 ? (
              <div className="divide-y divide-white/10">
                {data.recentInquiries.map((inquiry) => (
                  <article key={inquiry.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-medium leading-5"><Link href={`/admin/inquiries?id=${inquiry.id}`} className="hover:text-brand-hover">{inquiry.subject}</Link></h3>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] capitalize text-secondary">{inquiry.status.replace("_", " ")}</span>
                    </div>
                    <p className="mt-2 text-xs capitalize text-muted">{inquiry.audience} · {formatAdminDateTime(inquiry.createdAt)}</p>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyPanel title="No inquiries yet." copy={emptyCopy(data.status, "New contact and quotation requests will appear here.")} />
            )}
          </section>
        </div>

        <section aria-labelledby="dependencies-title" className="mt-8">
          <div className="mb-4">
            <h2 id="dependencies-title" className="text-lg font-semibold">Commerce dependencies</h2>
            <p className="mt-1 text-sm text-secondary">These controls stay unavailable until their durable workflows are implemented.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Dependency title="Orders and payments" phase="Phase 6" copy="Pending orders, hosted checkout, verified webhooks, and payment records." />
            <Dependency title="Delivery operations" phase="Phase 7" copy="Fulfillment, secure download access, resend, revocation, and event history." />
            <Dependency title="Customer history" phase="Phase 8" copy="Verified account linking, orders, downloads, receipts, and support records." />
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, href }: { label: string; value: number | null; href?: string }) {
  const content = <><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-3 text-3xl font-semibold tabular-nums">{value ?? "—"}</p></>;
  return href ? <Link href={href} className="bg-surface p-5 transition-colors hover:bg-surface-raised">{content}</Link> : <div className="bg-surface p-5">{content}</div>;
}

function DataState({ status }: { status: AdminDashboardData["status"] }) {
  const unconfigured = status === "unconfigured";
  return <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-sm text-amber-100" role="status"><p className="font-semibold">{unconfigured ? "Project data is not connected." : "Operational data could not be loaded."}</p><p className="mt-1 leading-6 text-amber-100/75">{unconfigured ? "Connect Supabase and apply the migrations to populate this overview." : "No partial totals are shown. Verify the database connection and applied migrations."}</p></div>;
}

function EmptyPanel({ title, copy }: { title: string; copy: string }) {
  return <div className="grid min-h-48 place-items-center px-6 py-10 text-center"><div><p className="font-medium">{title}</p><p className="mt-2 max-w-sm text-sm leading-6 text-secondary">{copy}</p></div></div>;
}

function Dependency({ title, phase, copy }: { title: string; phase: string; copy: string }) {
  return <article className="rounded-xl border border-white/10 bg-surface p-5"><div className="flex items-center justify-between gap-4"><h3 className="font-semibold">{title}</h3><span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-muted">{phase}</span></div><p className="mt-3 text-sm leading-6 text-secondary">{copy}</p></article>;
}

function emptyCopy(status: AdminDashboardData["status"], readyCopy: string) {
  if (status === "unconfigured") return "Connect Supabase and apply the migrations to load records.";
  if (status === "error") return "Records remain hidden until the database response can be verified.";
  return readyCopy;
}
