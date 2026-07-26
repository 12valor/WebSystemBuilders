"use client";

import { useState } from "react";
import { resendDelivery, revokeDelivery } from "@/features/delivery/admin-actions";
import { updateOrderStatusAction } from "@/features/orders/admin-actions";
import type { AdminOrder, AdminOrdersData } from "@/features/orders/admin-repository";

export function AdminOrders({ data, result }: { data: AdminOrdersData; result?: string }) {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  return (
    <main id="main-content" className="px-5 py-8 sm:px-8 font-sans">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Commerce & Verification</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Purchases & Proof Verification</h1>
            <p className="mt-2 max-w-2xl leading-6 text-secondary">
              Review customer GCash/QRPh reference numbers and proof of payment screenshots. Verifying an order unlocks private product file delivery.
            </p>
          </div>
          <span className="text-xs text-muted">Latest 100 records</span>
        </div>

        {result && (
          <div role="status" className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-secondary">
            {resultMessage(result)}
          </div>
        )}

        {data.status !== "ready" ? (
          <div className="mt-7 rounded-xl border border-dashed border-white/15 p-6 text-secondary">
            {data.status === "unconfigured"
              ? "Connect Supabase and apply the database migrations to view purchases."
              : "Order data could not be verified."}
          </div>
        ) : data.orders.length === 0 ? (
          <div className="mt-7 rounded-xl border border-dashed border-white/15 p-6 text-secondary">
            No customer purchases submitted yet.
          </div>
        ) : (
          <div className="mt-7 overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-[1280px] w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.08em] text-muted">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Reference No.</th>
                  <th className="p-4">Proof of Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order) => (
                  <tr key={order.id} className="border-t border-white/10 align-top">
                    <td className="p-4 font-semibold font-mono text-xs">{order.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-semibold">{order.productName}</span>
                      <span className="mt-1 block text-xs text-muted">v{order.versionLabel}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">{order.customerName}</span>
                      <span className="mt-1 block text-xs text-muted">{order.customerEmail}</span>
                      {order.contactNumber && <span className="block text-xs text-muted">{order.contactNumber}</span>}
                    </td>
                    <td className="p-4 font-medium">{formatMoney(order.totalMinor, order.currency)}</td>
                    <td className="p-4">
                      {order.referenceNumber ? (
                        <span className="font-mono text-xs font-semibold text-white bg-white/5 px-2 py-1 rounded">
                          {order.referenceNumber}
                        </span>
                      ) : (
                        <span className="text-muted text-xs">N/A</span>
                      )}
                    </td>
                    <td className="p-4">
                      {order.proofOfPaymentUrl ? (
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-hover hover:underline"
                        >
                          View Proof
                        </button>
                      ) : (
                        <span className="text-xs text-muted">None</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Status value={order.status} />
                      {order.delivery && (
                        <span className="mt-2 block text-xs leading-5 text-muted">
                          Delivery: {order.delivery.status} ({order.delivery.downloadCount}/{order.delivery.maxDownloads} downloads)
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-secondary">{formatDate(order.createdAt)}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="min-h-9 rounded-lg bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/20"
                        >
                          Review & Verify
                        </button>
                        {order.delivery && order.delivery.status !== "revoked" && (
                          <form action={resendDelivery.bind(null, order.id)}>
                            <button className="min-h-9 rounded-lg border border-white/15 px-3 text-xs font-semibold hover:bg-white/[0.04]">
                              Resend Link
                            </button>
                          </form>
                        )}
                        {order.delivery && order.delivery.status !== "revoked" && (
                          <form action={revokeDelivery.bind(null, order.id)}>
                            <button className="min-h-9 rounded-lg border border-red-400/25 px-3 text-xs font-semibold text-red-200 hover:bg-red-400/[0.06]">
                              Revoke
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Verification Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-surface p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Verify Purchase</span>
                  <h2 className="mt-1 text-xl font-semibold font-mono">{selectedOrder.orderNumber}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-muted hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {/* Proof Image */}
                {selectedOrder.proofOfPaymentUrl ? (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted mb-2">
                      Proof of Payment Screenshot
                    </label>
                    <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black p-2 max-h-80 flex justify-center">
                      {/* eslint-disable-next-html-element-suppression */}
                      <img
                        src={selectedOrder.proofOfPaymentUrl}
                        alt="Customer Proof of Payment"
                        className="max-h-72 object-contain rounded-lg"
                      />
                    </div>
                    <a
                      href={selectedOrder.proofOfPaymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs text-brand-hover hover:underline"
                    >
                      Open Full Size Image
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-muted">No proof of payment image was uploaded.</p>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs">
                  <div>
                    <span className="text-muted block">Product</span>
                    <span className="font-semibold text-white">{selectedOrder.productName} (v{selectedOrder.versionLabel})</span>
                  </div>
                  <div>
                    <span className="text-muted block">Amount Paid</span>
                    <span className="font-semibold text-emerald-400">{formatMoney(selectedOrder.totalMinor, selectedOrder.currency)}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Customer Name</span>
                    <span className="font-semibold text-white">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Customer Email</span>
                    <span className="font-semibold text-white">{selectedOrder.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Contact Number</span>
                    <span className="font-semibold text-white">{selectedOrder.contactNumber || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted block">Reference / Transaction ID</span>
                    <span className="font-semibold font-mono text-amber-300">{selectedOrder.referenceNumber || "N/A"}</span>
                  </div>
                </div>

                {/* Update Action Form */}
                <form action={updateOrderStatusAction} className="space-y-4 pt-2">
                  <input type="hidden" name="orderId" value={selectedOrder.id} />

                  <div>
                    <label htmlFor="adminNotes" className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      id="adminNotes"
                      name="adminNotes"
                      defaultValue={selectedOrder.adminNotes || ""}
                      placeholder="Add any internal verification notes or rejection reasons..."
                      className="mt-2 block w-full rounded-xl border border-white/15 bg-background p-3 text-xs text-white placeholder-muted focus:border-brand focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      name="newStatus"
                      value="verified"
                      onClick={() => setSelectedOrder(null)}
                      className="min-h-10 flex-1 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      Verify & Unlock Delivery
                    </button>
                    <button
                      type="submit"
                      name="newStatus"
                      value="completed"
                      onClick={() => setSelectedOrder(null)}
                      className="min-h-10 flex-1 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      Mark Completed
                    </button>
                    <button
                      type="submit"
                      name="newStatus"
                      value="rejected"
                      onClick={() => setSelectedOrder(null)}
                      className="min-h-10 rounded-xl border border-red-500/40 bg-red-500/10 px-4 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                    >
                      Reject Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Status({ value }: { value: string }) {
  const tone = ["verified", "completed", "paid", "delivered"].includes(value)
    ? "border-emerald-400/30 text-emerald-200 bg-emerald-400/10"
    : ["pending_verification", "pending", "processing"].includes(value)
      ? "border-amber-400/30 text-amber-100 bg-amber-400/10"
      : "border-red-400/30 text-red-200 bg-red-400/10";

  const label = value === "pending_verification" ? "Pending Verification" : value;

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>
      {label}
    </span>
  );
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(value));
}

function resultMessage(result: string) {
  if (result === "verified") return "Payment verified successfully! Delivery file access has been initialized.";
  if (result === "completed") return "Order status updated to Completed.";
  if (result === "rejected") return "Payment status updated to Rejected.";
  if (result === "sent") return "A new private delivery link was emailed.";
  if (result === "revoked") return "Delivery access was revoked.";
  return "The order operation was updated.";
}