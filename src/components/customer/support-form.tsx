"use client";

import { useActionState } from "react";
import { createSupportRequest, type CustomerSupportState } from "@/features/customer/actions";

const initialState: CustomerSupportState = { status: "idle" };

export function SupportForm({ orders }: { orders: { id: string; label: string }[] }) {
  const [state, action, pending] = useActionState(createSupportRequest, initialState);

  return (
    <form action={action} className="mt-6 grid gap-5 rounded-[24px] border border-white/90 bg-white/90 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-7" noValidate>
      {state.message && (
        <p
          role="status"
          className={`rounded-xl border p-4 text-xs font-semibold ${
            state.status === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <label className="grid gap-2 text-xs font-semibold text-slate-700">
        <span>Related order</span>
        <select
          name="orderId"
          defaultValue={state.values?.orderId ?? ""}
          className="min-h-12 rounded-[10px] border border-slate-200 bg-white px-4 font-normal text-slate-900 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
        >
          <option value="">Select an order</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.label}
            </option>
          ))}
        </select>
        {state.fieldErrors?.orderId?.[0] && (
          <span className="text-xs font-medium text-red-600">{state.fieldErrors.orderId[0]}</span>
        )}
      </label>

      <label className="grid gap-2 text-xs font-semibold text-slate-700">
        <span>Subject</span>
        <input
          name="subject"
          defaultValue={state.values?.subject}
          placeholder="Brief description of the issue"
          className="min-h-12 rounded-[10px] border border-slate-200 bg-white px-4 font-normal text-slate-900 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
        />
        {state.fieldErrors?.subject?.[0] && (
          <span className="text-xs font-medium text-red-600">{state.fieldErrors.subject[0]}</span>
        )}
      </label>

      <label className="grid gap-2 text-xs font-semibold text-slate-700">
        <span>Describe the issue</span>
        <textarea
          name="message"
          defaultValue={state.values?.message}
          rows={4}
          placeholder="Include any relevant details or questions about your purchase"
          className="rounded-[10px] border border-slate-200 bg-white p-4 font-normal text-slate-900 text-xs leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
        />
        {state.fieldErrors?.message?.[0] && (
          <span className="text-xs font-medium text-red-600">{state.fieldErrors.message[0]}</span>
        )}
      </label>

      <p className="text-[11px] text-slate-400">
        Security Note: Do not include passwords, API keys, database credentials, or secret tokens.
      </p>

      <button
        type="submit"
        disabled={pending || orders.length === 0}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] px-6 text-xs font-semibold text-white shadow-[0_10px_22px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {pending ? "Submitting request..." : "Submit Support Request"}
      </button>
    </form>
  );
}
