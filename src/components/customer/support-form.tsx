"use client";

import { useActionState } from "react";
import { createSupportRequest, type CustomerSupportState } from "@/features/customer/actions";

const initialState: CustomerSupportState = { status: "idle" };

export function SupportForm({
  orders,
  appearance = "default",
}: {
  orders: { id: string; label: string }[];
  appearance?: "default" | "dashboard";
}) {
  const [state, action, pending] = useActionState(createSupportRequest, initialState);
  const dashboard = appearance === "dashboard";
  const fieldClass = dashboard
    ? "min-h-11 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
    : "min-h-12 rounded-lg border border-slate-200 bg-white px-4 text-xs font-normal text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10";
  const labelClass = "grid gap-1.5 text-xs font-semibold text-slate-700";

  return (
    <form
      action={action}
      className={
        dashboard
          ? "mt-4 grid gap-4 rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs"
          : "mt-6 grid gap-5 rounded-2xl border border-white/90 bg-white/90 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-7"
      }
      noValidate
    >
      {state.message && (
        <p
          role="status"
          className={`rounded-lg border p-3.5 text-xs font-semibold ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <label className={labelClass}>
        <span>Related order</span>
        <select
          name="orderId"
          defaultValue={state.values?.orderId ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.orderId?.[0])}
          className={fieldClass}
        >
          <option value="">Select an order</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.label}
            </option>
          ))}
        </select>
        {state.fieldErrors?.orderId?.[0] && (
          <span className="text-xs font-semibold text-red-600">
            {state.fieldErrors.orderId[0]}
          </span>
        )}
      </label>

      <label className={labelClass}>
        <span>Subject</span>
        <input
          name="subject"
          defaultValue={state.values?.subject}
          placeholder="Brief description of the issue"
          aria-invalid={Boolean(state.fieldErrors?.subject?.[0])}
          className={fieldClass}
        />
        {state.fieldErrors?.subject?.[0] && (
          <span className="text-xs font-semibold text-red-600">
            {state.fieldErrors.subject[0]}
          </span>
        )}
      </label>

      <label className={labelClass}>
        <span>Describe the issue</span>
        <textarea
          name="message"
          defaultValue={state.values?.message}
          rows={5}
          placeholder="Include any relevant details or questions about your purchase"
          aria-invalid={Boolean(state.fieldErrors?.message?.[0])}
          className={`${fieldClass} min-h-32 py-3 leading-6`}
        />
        {state.fieldErrors?.message?.[0] && (
          <span className="text-xs font-semibold text-red-600">
            {state.fieldErrors.message[0]}
          </span>
        )}
      </label>

      <p className={dashboard ? "text-xs leading-5 text-slate-500 font-medium" : "text-[11px] text-slate-400"}>
        Security note: Do not include passwords, API keys, database credentials, or secret tokens.
      </p>

      <button
        type="submit"
        disabled={pending || orders.length === 0}
        className={
          dashboard
            ? "blue-button min-h-11 w-full bg-[#2563EB] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:w-auto"
            : "blue-button min-h-12 w-full bg-[#2563EB] px-6 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        }
      >
        {pending ? "Submitting request..." : orders.length === 0 ? "No eligible order" : "Submit support request"}
      </button>
    </form>
  );
}
