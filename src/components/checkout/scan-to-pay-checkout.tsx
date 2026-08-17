"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitScanToPayOrder, type ScanToPayState } from "@/features/orders/checkout-actions";
import { createClient } from "@/lib/supabase/client";

type Props = {
  systemId: string;
  systemTitle: string;
  priceFormatted: string;
  paymentQrUrl: string;
  paymentInstructions: string;
  userId: string;
  verifiedEmail: string;
};

const initialState: ScanToPayState = { status: "idle" };

export function ScanToPayCheckout(props: Props) {
  const [state, formAction, isPending] = useActionState(submitScanToPayOrder, initialState);
  const [proofPath, setProofPath] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function uploadProof(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setUploadError("Use a PNG, JPG, or WEBP image no larger than 10 MB.");
      setProofPath("");
      return;
    }
    setUploading(true);
    setUploadError(null);
    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${props.userId}/${props.systemId}/${crypto.randomUUID()}.${extension}`;
    const result = await createClient().storage.from("payment-proofs").upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });
    setUploading(false);
    if (result.error) {
      setProofPath("");
      setUploadError("The private proof upload failed. Please try again.");
      return;
    }
    setProofPath(result.data.path);
  }

  if (state.status === "submitted") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-300">Pending verification</p>
        <h2 className="mt-3 text-2xl font-semibold">Payment proof received</h2>
        <p className="mt-3 text-sm leading-6 text-secondary">{state.message}</p>
        <p className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 font-mono text-sm">{state.orderNumber}</p>
        <Link href={`/account/orders/${state.orderNumber}`} className="mt-6 inline-flex min-h-11 items-center rounded-[9px] bg-white px-5 text-sm font-semibold text-slate-950">
          View order
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Manual verification</p>
      <h2 className="mt-3 text-2xl font-semibold">Pay with GCash / QRPH</h2>
      <p className="mt-3 text-sm leading-6 text-secondary">
        Pay {props.priceFormatted} for {props.systemTitle}, then submit the reference and proof from your verified account.
      </p>
      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={props.paymentQrUrl} alt={`Administrator-provided payment QR for ${props.systemTitle}`} className="mx-auto size-64 max-w-full rounded-lg bg-white object-contain p-3" />
        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-secondary">{props.paymentInstructions}</p>
      </div>
      <div className="mt-6 grid gap-5">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted">Verified account</span>
          <p className="mt-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm">{props.verifiedEmail}</p>
        </div>
        <label className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Contact number <span className="normal-case text-muted">(optional)</span>
          <input name="contactNumber" defaultValue={state.values?.contactNumber} maxLength={30} className="mt-2 block w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white" />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Transaction reference
          <input name="referenceNumber" required minLength={3} maxLength={100} defaultValue={state.values?.referenceNumber} className="mt-2 block w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white" />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Private proof image
          <input type="file" accept="image/png,image/jpeg,image/webp" required={!proofPath} onChange={uploadProof} className="mt-2 block w-full text-xs normal-case" />
        </label>
        {uploading && <p className="text-xs text-amber-200">Uploading securely…</p>}
        {proofPath && <p className="text-xs text-emerald-300">Proof uploaded to private storage.</p>}
        {uploadError && <p role="alert" className="text-xs text-red-300">{uploadError}</p>}
      </div>
      <input type="hidden" name="systemId" value={props.systemId} />
      <input type="hidden" name="proofStoragePath" value={proofPath} />
      <fieldset className="mt-6 space-y-3 text-xs leading-5 text-secondary">
        <legend className="mb-3 text-sm font-semibold text-white">Confirm before submitting</legend>
        <Consent name="termsAccepted">I accept the <Link href="/legal/terms" target="_blank" className="underline">Terms of Service</Link>.</Consent>
        <Consent name="licenseAccepted">I reviewed the published license.</Consent>
        <Consent name="refundAccepted">I reviewed the <Link href="/legal/refunds" target="_blank" className="underline">Refund Policy</Link>.</Consent>
        <Consent name="deliveryAccepted">I understand payment verification and administrator-prepared delivery are separate steps.</Consent>
      </fieldset>
      {state.status === "error" && <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{state.message}</p>}
      <button type="submit" disabled={isPending || uploading || !proofPath} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-white px-5 text-sm font-semibold text-slate-950 disabled:opacity-50">
        {isPending ? "Submitting…" : "Submit for manual verification"}
      </button>
    </form>
  );
}

function Consent({ name, children }: { name: string; children: React.ReactNode }) {
  return <label className="flex items-start gap-3"><input type="checkbox" name={name} required className="mt-1 size-4" /><span>{children}</span></label>;
}
