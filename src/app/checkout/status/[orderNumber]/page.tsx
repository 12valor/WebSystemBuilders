import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getPublicOrderStatus } from "@/features/orders/status-repository";

export const metadata: Metadata = { title: "Order status", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function OrderStatusPage({ params, searchParams }: { params: Promise<{ orderNumber: string }>; searchParams: Promise<{ token?: string }> }) {
  const [{ orderNumber }, query] = await Promise.all([params, searchParams]);
  const order = query.token ? await getPublicOrderStatus(orderNumber, query.token) : null;
  return <><SiteHeader /><main id="main-content" className="grid min-h-[64vh] place-items-center px-5 py-20"><section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-surface p-7 sm:p-9">{order ? <><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Order {order.order_number}</p><h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{statusTitle(order.status)}</h1><p className="mt-4 leading-7 text-secondary">{statusCopy(order.status)}</p><dl className="mt-7 grid gap-4 border-y border-white/10 py-6 text-sm"><Row term="System" detail={order.product_name} /><Row term="Version" detail={order.version_label} /><Row term="Amount" detail={formatMoney(order.total_minor, order.currency)} /><Row term="Status" detail={order.status} /></dl>{order.status === "pending" && <p className="mt-5 text-sm leading-6 text-muted">If payment just completed, refresh this page after the verified PayMongo notification arrives.</p>}</> : <><h1 className="text-4xl font-semibold tracking-[-0.05em]">Order link unavailable.</h1><p className="mt-4 leading-7 text-secondary">This private status link is missing, invalid, or cannot be verified. No order information is shown.</p></>}<Link href="/systems" className="mt-7 inline-flex min-h-11 items-center rounded-[9px] border border-white/15 px-5 font-semibold">Browse systems</Link></section></main><SiteFooter /></>;
}

function Row({ term, detail }: { term: string; detail: string }) { return <div className="grid grid-cols-[90px_1fr] gap-4"><dt className="font-semibold">{term}</dt><dd className="text-secondary">{detail}</dd></div>; }
function statusTitle(status: string) { if (status === "paid") return "Payment verified."; if (["failed", "expired", "cancelled"].includes(status)) return "Payment was not completed."; if (["refunded", "disputed"].includes(status)) return "Order needs review."; return "Payment confirmation pending."; }
function statusCopy(status: string) { if (status === "paid") return "PayMongo confirmed the payment. Private fulfillment is the next step; do not share this status link."; if (status === "pending") return "Returning from the payment page does not prove payment. This order remains pending until PayMongo's signed webhook is verified."; return "The recorded order status is shown below. Contact support with the order number if you need help."; }
function formatMoney(value: number, currency: string) { return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value / 100); }