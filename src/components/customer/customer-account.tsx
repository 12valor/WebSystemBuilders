import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SupportForm } from "@/components/customer/support-form";
import { openPortalDownload } from "@/features/customer/actions";
import type { CustomerPortalData } from "@/features/customer/repository";
import { signOut } from "@/features/auth/actions";

export function CustomerAccount({ email, data, result }: { email: string | null; data: CustomerPortalData; result?: string }) {
  const verifiedOrders = data.orders.filter((order) => ["verified", "completed", "paid"].includes(order.order_status));
  const available = data.orders.filter((order) => order.delivery_available).length;
  const openSupport = data.supportRequests.filter((request) => ["open", "in_progress"].includes(request.status)).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-[74px] w-[min(calc(100%-40px),1280px)] items-center gap-5 md:w-[min(calc(100%-64px),1280px)]">
          <Link href="/"><BrandLogo priority className="h-auto w-[190px]" /></Link>
          <span className="hidden h-5 w-px bg-white/15 sm:block" />
          <span className="hidden text-xs font-semibold uppercase tracking-[0.1em] text-muted sm:block">Customer Portal</span>
          <span className="ml-auto hidden max-w-60 truncate text-xs text-muted sm:block">{email}</span>
          <form action={signOut}>
            <button className="min-h-9 rounded-lg border border-white/15 px-3 text-xs font-semibold hover:bg-white/[0.04]">Sign out</button>
          </form>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-[min(calc(100%-40px),1180px)] py-10 md:w-[min(calc(100%-64px),1180px)] lg:py-14">
        <section id="overview" className="border-b border-white/10 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-hover">Verified Customer Portal</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[.98] tracking-[-0.06em]">Your purchases & downloads.</h1>
          <p className="mt-5 max-w-2xl leading-7 text-secondary">
            Signed in as <strong className="text-foreground">{email ?? "a verified customer"}</strong>. Guest Scan to Pay orders matching your email are claimed automatically.
          </p>
          {result === "download-unavailable" && (
            <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4 text-sm text-red-200">
              Deliverable access could not be generated. Please ensure your order has been verified by an admin.
            </p>
          )}
          {data.status === "error" && (
            <p role="alert" className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4 text-sm text-amber-100">
              Customer records could not be verified. No partial order data is shown.
            </p>
          )}
          <dl className="mt-8 grid overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
            <Metric label="Verified Purchases" value={verifiedOrders.length} />
            <Metric label="Available Downloads" value={available} />
            <Metric label="Open Support Tickets" value={openSupport} />
          </dl>
        </section>

        <section id="orders" className="border-b border-white/10 py-10">
          <Heading eyebrow="Purchase History" title="Orders & Verification" copy="Track GCash/QRPh verification status and download unlocked deliverables." />
          {data.orders.length === 0 ? (
            <Empty title="No claimed orders" copy="Use the same verified email address entered during Scan to Pay checkout." />
          ) : (
            <div className="mt-6 grid gap-4">
              {data.orders.map((order) => (
                <article key={order.order_id} className="rounded-xl border border-white/10 bg-surface p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted font-mono">{order.order_number}</p>
                      <h3 className="mt-2 text-xl font-semibold">{order.product_name}</h3>
                      <p className="mt-2 text-sm text-secondary">Purchased version {order.purchased_version}</p>
                    </div>
                    <StatusBadge status={order.order_status} />
                  </div>
                  <dl className="mt-5 grid gap-3 border-t border-white/10 pt-5 text-sm sm:grid-cols-3">
                    <Detail term="Amount" value={formatMoney(order.total_minor, order.currency)} />
                    <Detail term="Payment Method" value="GCash / QRPh Scan to Pay" />
                    <Detail term="File Delivery" value={order.delivery_available ? "Unlocked" : order.order_status === "pending_verification" ? "Awaiting Verification" : "Locked"} />
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href={`/systems/${order.product_slug}`} className="inline-flex min-h-10 items-center rounded-lg border border-white/15 px-4 text-xs font-semibold hover:bg-white/[0.04]">
                      View System
                    </Link>
                    {order.delivery_available && (
                      <form action={openPortalDownload.bind(null, order.order_id)}>
                        <button className="min-h-10 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-500">
                          ⬇ Generate Fresh 1-Hour Download Link
                        </button>
                      </form>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="downloads" className="border-b border-white/10 py-10">
          <Heading eyebrow="Protected Delivery" title="Downloads Policy" copy="Protected download links expire after 1 hour and are download-limited for security." />
          <div className="mt-6 rounded-xl border border-blue-400/20 bg-blue-500/[0.05] p-5 text-sm leading-6 text-secondary">
            Creating fresh portal access generates a 1-hour secure link to your deliverable ZIP file.
          </div>
        </section>

        <section id="support" className="py-10">
          <Heading eyebrow="Technical Guidance" title="Order Support" copy="Open a support ticket for any verified purchase owned by this account." />
          {data.supportRequests.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              {data.supportRequests.map((request) => (
                <div key={request.id} className="flex flex-col gap-2 border-t border-white/10 p-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{request.subject}</p>
                    <p className="mt-1 text-xs text-muted">Updated {formatDate(request.updated_at)}</p>
                  </div>
                  <span className="w-fit rounded-full border border-white/15 px-3 py-1 text-xs font-semibold capitalize">{request.status.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          )}
          <SupportForm orders={data.orders.map((order) => ({ id: order.order_id, label: `${order.order_number} - ${order.product_name}` }))} />
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="bg-surface p-5"><dt className="text-xs font-semibold text-muted">{label}</dt><dd className="mt-3 text-3xl font-semibold">{value}</dd></div>; }
function Heading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{eyebrow}</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{title}</h2><p className="mt-3 leading-7 text-secondary">{copy}</p></div>; }
function Empty({ title, copy }: { title: string; copy: string }) { return <div className="mt-6 rounded-xl border border-dashed border-white/15 p-7 text-center"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-secondary">{copy}</p><Link href="/systems" className="mt-5 inline-flex min-h-10 items-center rounded-lg border border-white/15 px-4 text-xs font-semibold">Browse systems</Link></div>; }
function Detail({ term, value }: { term: string; value: string }) { return <div><dt className="text-xs font-semibold text-muted">{term}</dt><dd className="mt-1 capitalize text-secondary">{value}</dd></div>; }
function formatMoney(value: number, currency: string) { return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value / 100); }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(new Date(value)); }

function StatusBadge({ status }: { status: string }) {
  const tone = ["verified", "completed", "paid"].includes(status)
    ? "border-emerald-400/30 text-emerald-200 bg-emerald-400/10"
    : ["pending_verification", "pending"].includes(status)
      ? "border-amber-400/30 text-amber-100 bg-amber-400/10"
      : "border-red-400/30 text-red-200 bg-red-400/10";
  const label = status === "pending_verification" ? "Pending Verification" : status;
  return <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${tone}`}>{label}</span>;
}