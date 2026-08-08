"use client";

import Link from "next/link";
import { openPortalDownload } from "@/features/customer/actions";
import type { CustomerPortalOrder } from "@/features/customer/repository";

export function CustomerOrdersList({ orders }: { orders: CustomerPortalOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white p-8 text-center sm:p-12 shadow-2xs">
        <h2 className="text-xl font-bold tracking-[-0.03em] text-slate-900">No purchases found</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 max-w-md mx-auto font-medium">
          If you submitted a Scan to Pay purchase before signing in, your orders link automatically when signed in with the same email.
        </p>
        <Link
          href="/systems"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm"
        >
          Browse Systems Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const canDownload = ["verified", "completed", "paid"].includes(order.order_status) && order.delivery_available;

        return (
          <div
            key={order.order_id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 sm:flex-row sm:items-center sm:justify-between shadow-2xs"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-500">{order.order_number}</span>
                <StatusBadge status={order.order_status} />
              </div>
              <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-slate-900">{order.product_name}</h3>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                Version {order.purchased_version} • Submitted on {formatDate(order.created_at)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-0">
              {canDownload ? (
                <form action={openPortalDownload.bind(null, order.order_id)}>
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-semibold text-white transition hover:bg-blue-700 shadow-xs"
                  >
                    ⬇ Download Deliverable
                  </button>
                </form>
              ) : order.order_status === "pending_verification" ? (
                <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                  ⏳ Awaiting Verification
                </span>
              ) : null}

              <Link
                href={`/account/orders/${order.order_number}`}
                className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
              >
                View Details →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone = ["verified", "completed", "paid"].includes(status)
    ? "border-emerald-200 text-emerald-700 bg-emerald-50"
    : ["pending_verification", "pending"].includes(status)
      ? "border-amber-200 text-amber-800 bg-amber-50"
      : "border-rose-200 text-rose-700 bg-rose-50";

  const label = status === "pending_verification" ? "Pending Verification" : status;

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold capitalize ${tone}`}>
      {label}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(new Date(value));
}
