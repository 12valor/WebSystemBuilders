"use client";

import Link from "next/link";
import { openPortalDownload } from "@/features/customer/actions";
import type { CustomerPortalOrder } from "@/features/customer/repository";

export function CustomerOrdersList({ orders }: { orders: CustomerPortalOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center sm:p-12">
        <h2 className="text-xl font-semibold tracking-[-0.03em]">No purchases found</h2>
        <p className="mt-2 text-sm leading-6 text-secondary max-w-md mx-auto">
          If you submitted a Scan to Pay purchase before signing in, your orders link automatically when signed in with the same email.
        </p>
        <Link
          href="/systems"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-hover"
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
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-muted">{order.order_number}</span>
                <StatusBadge status={order.order_status} />
              </div>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{order.product_name}</h3>
              <p className="mt-1 text-xs text-secondary">
                Version {order.purchased_version} • Submitted on {formatDate(order.created_at)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-0">
              {canDownload ? (
                <form action={openPortalDownload.bind(null, order.order_id)}>
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white transition hover:bg-emerald-500"
                  >
                    ⬇ Download Deliverable
                  </button>
                </form>
              ) : order.order_status === "pending_verification" ? (
                <span className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
                  ⏳ Awaiting Verification
                </span>
              ) : null}

              <Link
                href={`/account/orders/${order.order_number}`}
                className="inline-flex min-h-10 items-center rounded-xl border border-white/15 px-4 text-xs font-semibold text-secondary hover:bg-white/[0.04]"
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
    ? "border-emerald-400/30 text-emerald-200 bg-emerald-400/10"
    : ["pending_verification", "pending"].includes(status)
      ? "border-amber-400/30 text-amber-100 bg-amber-400/10"
      : "border-red-400/30 text-red-200 bg-red-400/10";

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
