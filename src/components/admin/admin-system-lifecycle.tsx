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
    <section aria-labelledby="record-actions-title" className="mt-6 border-t border-white/10 pt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Record actions</p>
      <h2 id="record-actions-title" className="mt-3 text-lg font-semibold tracking-[-0.025em]">Lifecycle controls</h2>
      <p className="mt-2 text-xs leading-5 text-muted">These actions use the last saved version of this record. Unsaved editor changes are not included.</p>

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
    <form action={formAction} className="rounded-lg border border-white/10 bg-background p-4">
      <p className="text-xs leading-5 text-secondary">{copy}</p>
      <LifecycleMessage state={state} />
      <div className="mt-3"><LifecycleButton label={buttonLabel} pendingLabel={pendingLabel} /></div>
    </form>
  );
}

function ArchiveForm({ systemId }: { systemId: string }) {
  const action = archiveSystem.bind(null, systemId);
  const [state, formAction] = useActionState(action, initialState);
  return (
    <form action={formAction} className="rounded-lg border border-red-300/15 bg-red-300/[0.03] p-4">
      <p className="text-xs leading-5 text-secondary">Hides this record from public use while preserving its resources and audit history.</p>
      <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-secondary"><input type="checkbox" name="confirmation" value="archive" className="mt-1 size-4 accent-red-400" /><span>I understand this changes the record to Archived.</span></label>
      <LifecycleMessage state={state} />
      <div className="mt-3"><LifecycleButton label="Archive system" pendingLabel="Archiving..." tone="danger" /></div>
    </form>
  );
}

function LifecycleButton({ label, pendingLabel, tone = "neutral" }: { label: string; pendingLabel: string; tone?: "neutral" | "danger" }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={`inline-flex min-h-10 w-full items-center justify-center rounded-lg border px-4 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${tone === "danger" ? "border-red-300/25 text-red-200 hover:bg-red-300/[0.06]" : "border-white/15 text-foreground hover:bg-white/[0.04]"}`}>{pending ? pendingLabel : label}</button>;
}

function LifecycleMessage({ state }: { state: SystemLifecycleState }) {
  return state.message ? <p role="alert" className={`mt-3 text-xs leading-5 ${state.status === "unavailable" ? "text-amber-200" : "text-red-300"}`}>{state.message}</p> : null;
}
