"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  archiveSystem,
  duplicateSystem,
  unpublishSystem,
  type SystemLifecycleState,
} from "@/features/catalog/lifecycle-actions";
import type { SystemLifecycleStatus } from "@/features/catalog/lifecycle-schema";

const initialState: SystemLifecycleState = { status: "idle" };

export function AdminSystemLifecycle({
  systemId,
  status,
}: {
  systemId: string;
  status: SystemLifecycleStatus;
}) {
  return (
    <section aria-labelledby="record-actions-title" className="mt-6 border-t border-slate-200/80 pt-5">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Record actions</p>
      <h2 id="record-actions-title" className="mt-3 text-lg font-bold tracking-tight text-slate-900">Lifecycle controls</h2>
      <p className="mt-2 text-xs leading-5 text-slate-500 font-medium">These actions use the last saved version of this record. Unsaved editor changes are not included.</p>

      <div className="mt-4 grid gap-4">
        <LifecycleForm
          action={duplicateSystem.bind(null, systemId)}
          buttonLabel="Duplicate as draft"
          pendingLabel="Duplicating..."
          copy="Copies product content, features, and external media. Uploaded files, uploaded images, and versions are intentionally excluded."
        />

        {status === "published" && (
          <LifecycleForm
            action={unpublishSystem.bind(null, systemId)}
            buttonLabel="Unpublish system"
            pendingLabel="Unpublishing..."
            copy="Removes the system from the public catalog while preserving its content and publication history."
          />
        )}

        {status !== "archived" && <ArchiveForm systemId={systemId} />}
      </div>
    </section>
  );
}

function LifecycleForm({
  action,
  buttonLabel,
  pendingLabel,
  copy,
}: {
  action: (state: SystemLifecycleState, formData: FormData) => Promise<SystemLifecycleState>;
  buttonLabel: string;
  pendingLabel: string;
  copy: string;
}) {
  const [state, formAction] = useActionState(action, initialState);
  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
      <p className="text-xs leading-5 text-slate-600 font-medium">{copy}</p>
      <LifecycleMessage state={state} />
      <div className="mt-3"><LifecycleButton label={buttonLabel} pendingLabel={pendingLabel} /></div>
    </form>
  );
}

function ArchiveForm({ systemId }: { systemId: string }) {
  const action = archiveSystem.bind(null, systemId);
  const [state, formAction] = useActionState(action, initialState);
  return (
    <form action={formAction} className="rounded-2xl border border-red-200 bg-red-50/60 p-4">
      <p className="text-xs leading-5 text-slate-700 font-medium">Hides this record from public use while preserving its resources and audit history.</p>
      <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-700 font-medium"><input type="checkbox" name="confirmation" value="archive" className="mt-1 size-4 accent-red-600" /><span>I understand this changes the record to Archived.</span></label>
      <LifecycleMessage state={state} />
      <div className="mt-3"><LifecycleButton label="Archive system" pendingLabel="Archiving..." tone="danger" /></div>
    </form>
  );
}

function LifecycleButton({ label, pendingLabel, tone = "neutral" }: { label: string; pendingLabel: string; tone?: "neutral" | "danger" }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={`inline-flex min-h-10 w-full items-center justify-center rounded-xl border px-4 text-xs font-semibold shadow-2xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${tone === "danger" ? "border-red-200 bg-red-100 text-red-800 hover:bg-red-200" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"}`}>{pending ? pendingLabel : label}</button>;
}

function LifecycleMessage({ state }: { state: SystemLifecycleState }) {
  return state.message ? <p role="alert" className={`mt-3 text-xs leading-5 font-semibold ${state.status === "unavailable" ? "text-amber-800" : "text-red-600"}`}>{state.message}</p> : null;
}
