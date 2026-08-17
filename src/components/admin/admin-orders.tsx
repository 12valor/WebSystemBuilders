"use client";

import { useState } from "react";
import { prepareDelivery, resendDelivery, revokeDelivery } from "@/features/delivery/admin-actions";
import { updateOrderStatusAction } from "@/features/orders/admin-actions";
import type { AdminOrder, AdminOrdersData } from "@/features/orders/admin-repository";

export function AdminOrders({ data, result }: { data: AdminOrdersData; result?: string }) {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  return (
    <main id="main-content" className="px-5 py-8 sm:px-8 font-sans">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Commerce & Verification</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Purchases & Payment Status</h1>
            <p className="mt-2 max-w-2xl leading-6 text-slate-600 font-medium">
              PayPal payments are verified automatically. GCash / QRPH proofs remain reviewable, and every paid order requires an explicit delivery action.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">Latest 100 records</span>
        </div>

        {result && (
          <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 shadow-2xs">
            {resultMessage(result)}
          </div>
        )}

        {data.status !== "ready" ? (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-600 font-medium shadow-xs">
            {data.status === "unconfigured"
              ? "Connect Supabase and apply the database migrations to view purchases."
              : "Order data could not be verified."}
          </div>
        ) : data.orders.length === 0 ? (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-600 font-medium shadow-xs">
            No customer purchases submitted yet.
          </div>
        ) : (
          <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <table className="min-w-[1280px] w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-xs font-bold uppercase tracking-[0.08em] text-slate-500 border-b border-slate-200/80">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Fulfillment</th>
                  <th className="p-4">Payment date</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.orders.map((order) => (
                  <tr key={order.id} className="align-top hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold font-mono text-xs text-slate-900">{order.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900">{order.productName}</span>
                      <span className="mt-1 block text-xs text-slate-500 font-medium">v{order.versionLabel}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-900">{order.customerName}</span>
                      <span className="mt-1 block text-xs text-slate-500 font-medium">{order.customerEmail}</span>
                      {order.contactNumber && <span className="block text-xs text-slate-500 font-medium">{order.contactNumber}</span>}
                    </td>
                    <td className="p-4 font-bold text-slate-900">{formatMoney(order.totalMinor, order.currency)}</td>
                    <td className="p-4 text-xs font-semibold text-slate-700">
                      {providerLabel(order.paymentProvider)}
                      {order.paymentProvider === "paypal" && (
                        <span className="mt-2 block font-mono text-[0.7rem] text-slate-500">
                          Order: {order.providerOrderId ?? "Pending"}<br />Capture: {order.providerPaymentId ?? "Pending"}
                        </span>
                      )}
                      {order.paymentProvider === "manual" && order.referenceNumber && (
                        <span className="mt-2 block font-mono text-[0.7rem] text-slate-500">Ref: {order.referenceNumber}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Status value={order.paymentStatus ?? order.status} />
                      {order.paymentProvider === "paypal" && order.paymentStatus === "paid" && (
                        <span className="mt-2 block text-[0.65rem] font-extrabold tracking-[0.08em] text-emerald-700">PAYMENT VERIFIED</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Status value={order.delivery?.status ?? "awaiting delivery"} />
                      {order.delivery && <span className="mt-2 block text-xs text-slate-500">{order.delivery.downloadCount}/{order.delivery.maxDownloads} downloads</span>}
                    </td>
                    <td className="p-4 text-xs text-slate-600 font-medium">{order.paidAt ? formatDate(order.paidAt) : "Not paid"}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {order.paymentProvider === "manual" && (
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="min-h-9 rounded-xl bg-[#2563EB] px-3.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-2xs transition-colors"
                          >
                            Review proof
                          </button>
                        )}
                        {order.paymentStatus === "paid" && !order.delivery && (
                          <form action={prepareDelivery.bind(null, order.id)}>
                            <button className="min-h-9 rounded-xl bg-emerald-600 px-3.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors">
                              Prepare &amp; send delivery
                            </button>
                          </form>
                        )}
                        {order.delivery && order.delivery.status !== "revoked" && (
                          <form action={resendDelivery.bind(null, order.id)}>
                            <button className="min-h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors">
                              Resend Link
                            </button>
                          </form>
                        )}
                        {order.delivery && order.delivery.status !== "revoked" && (
                          <form action={revokeDelivery.bind(null, order.id)}>
                            <button className="min-h-9 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors">
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

        {/* Modal Backdrop & Dialog */}
        {selectedOrder?.paymentProvider === "manual" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Verify Purchase</span>
                  <h2 className="mt-1 text-xl font-bold font-mono text-slate-900">{selectedOrder.orderNumber}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 space-y-6">
                {/* Proof Image */}
                {selectedOrder.proofOfPaymentUrl ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.08em] text-slate-500 mb-2">
                      Proof of Payment Screenshot
                    </label>
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2 max-h-80 flex justify-center">
                      {/* eslint-disable-next-html-element-suppression */}
                      <img
                        src={selectedOrder.proofOfPaymentUrl}
                        alt="Customer Proof of Payment"
                        className="max-h-72 object-contain rounded-lg shadow-sm"
                      />
                    </div>
                    <a
                      href={selectedOrder.proofOfPaymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Open Full Size Image
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 font-medium">No proof of payment image was uploaded.</p>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Product</span>
                    <span className="font-bold text-slate-900">{selectedOrder.productName} (v{selectedOrder.versionLabel})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Amount Paid</span>
                    <span className="font-bold text-emerald-700">{formatMoney(selectedOrder.totalMinor, selectedOrder.currency)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Customer Name</span>
                    <span className="font-bold text-slate-900">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Customer Email</span>
                    <span className="font-bold text-slate-900">{selectedOrder.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Contact Number</span>
                    <span className="font-bold text-slate-900">{selectedOrder.contactNumber || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Reference / Transaction ID</span>
                    <span className="font-bold font-mono text-amber-800">{selectedOrder.referenceNumber || "N/A"}</span>
                  </div>
                </div>

                {/* Update Action Form */}
                <form action={updateOrderStatusAction} className="space-y-4 pt-2">
                  <input type="hidden" name="orderId" value={selectedOrder.id} />

                  <div>
                    <label htmlFor="adminNotes" className="block text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      id="adminNotes"
                      name="adminNotes"
                      defaultValue={selectedOrder.adminNotes || ""}
                      placeholder="Add any internal verification notes or rejection reasons..."
                      className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      name="newStatus"
                      value="verified"
                      onClick={() => setSelectedOrder(null)}
                      className="min-h-10 flex-1 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition-colors"
                    >
                      Verify payment
                    </button>
                    <button
                      type="submit"
                      name="newStatus"
                      value="completed"
                      onClick={() => setSelectedOrder(null)}
                      className="min-h-10 flex-1 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors"
                    >
                      Mark Completed
                    </button>
                    <button
                      type="submit"
                      name="newStatus"
                      value="rejected"
                      onClick={() => setSelectedOrder(null)}
                      className="min-h-10 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
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
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : ["pending_verification", "pending", "processing", "awaiting delivery"].includes(value)
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-red-200 bg-red-50 text-red-800";

  const label = value === "pending_verification" ? "Pending Verification" : value;

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${tone}`}>
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
  if (result === "verified") return "Manual payment verified. Delivery still requires explicit preparation.";
  if (result === "completed") return "Order status updated to Completed.";
  if (result === "rejected") return "Payment status updated to Rejected.";
  if (result === "sent") return "A new private delivery link was emailed.";
  if (result === "email_unavailable") return "Delivery was prepared, but email is not configured. Configure Resend, then resend the link.";
  if (result === "unchanged") return "No delivery change was made. The order may already have a fulfillment record.";
  if (result === "error") return "The delivery operation could not be completed.";
  if (result === "revoked") return "Delivery access was revoked.";
  return "The order operation was updated.";
}

function providerLabel(provider: AdminOrder["paymentProvider"]) {
  if (provider === "paypal") return "PayPal — Automatically Verified";
  if (provider === "manual") return "GCash / QRPH — Manual Verification";
  if (provider === "paymongo") return "PayMongo (historical)";
  return "Unrecorded";
}
