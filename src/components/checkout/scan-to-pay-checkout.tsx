"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { submitScanToPayOrder, type ScanToPayState } from "@/features/orders/checkout-actions";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_INSTRUCTIONS = "Please scan the QR code using GCash or any QRPH-supported banking app. After payment, upload your proof of payment together with the transaction reference number. Your order will be verified within 24 hours.";

// Standard GCash / QRPh SVG placeholder if no custom QR image was uploaded by admin yet
const DEFAULT_QR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none"><rect width="300" height="300" rx="20" fill="%23090d16"/><rect x="20" y="20" width="260" height="260" rx="12" fill="%23121927" stroke="%231f293d" stroke-width="2"/><rect x="40" y="40" width="70" height="70" fill="%23ffffff" rx="6"/><rect x="55" y="55" width="40" height="40" fill="%23090d16" rx="3"/><rect x="190" y="40" width="70" height="70" fill="%23ffffff" rx="6"/><rect x="205" y="55" width="40" height="40" fill="%23090d16" rx="3"/><rect x="40" y="190" width="70" height="70" fill="%23ffffff" rx="6"/><rect x="55" y="205" width="40" height="40" fill="%23090d16" rx="3"/><rect x="130" y="40" width="40" height="40" fill="%230066FF" rx="4"/><rect x="130" y="100" width="30" height="30" fill="%23ffffff" rx="3"/><rect x="100" y="140" width="100" height="30" fill="%230066FF" rx="4"/><rect x="190" y="130" width="40" height="40" fill="%23ffffff" rx="4"/><rect x="130" y="190" width="70" height="70" fill="%23ffffff" rx="6"/><path d="M140 145 H160 V165 H140 Z" fill="%23090d16"/><text x="150" y="280" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2388a0c0" text-anchor="middle">SCAN TO PAY WITH GCASH / QRPH</text></svg>`;

type ScanToPayCheckoutProps = {
  systemSlug: string;
  systemTitle: string;
  priceFormatted: string;
  paymentQrUrl?: string | null;
  paymentInstructions?: string | null;
};

const initialState: ScanToPayState = { status: "idle" };

export function ScanToPayCheckout({
  systemSlug,
  systemTitle,
  priceFormatted,
  paymentQrUrl,
  paymentInstructions,
}: ScanToPayCheckoutProps) {
  const [state, formAction, isPending] = useActionState(submitScanToPayOrder, initialState);
  const [step, setStep] = useState<"scan" | "form">("scan");
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState<string>("");
  const [proofFileName, setProofFileName] = useState<string>("");

  const instructions = paymentInstructions?.trim() || DEFAULT_INSTRUCTIONS;
  const qrImageSrc = paymentQrUrl?.trim() || DEFAULT_QR_SVG;

  const handleCopyInstructions = () => {
    navigator.clipboard.writeText(instructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    const link = document.createElement("a");
    link.href = qrImageSrc;
    link.download = `${systemSlug}-payment-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (PNG, JPG, JPEG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image file size must be less than 10MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop() || "png";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const filePath = `${systemSlug}/${fileName}`;

      const { data, error } = await supabase.storage.from("payment-proofs").upload(filePath, file);

      if (error) {
        // Fallback to data URL if storage upload is unconfigured locally
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofUrl(reader.result as string);
          setProofFileName(file.name);
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } else {
        const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(data.path);
        setProofUrl(urlData.publicUrl);
        setProofFileName(file.name);
        setUploading(false);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofUrl(reader.result as string);
        setProofFileName(file.name);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  if (state.status === "submitted") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-6 text-left sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          ✓ Pending Verification
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
          Payment Proof Submitted!
        </h2>
        <p className="mt-3 text-sm leading-6 text-secondary">
          {state.message}
        </p>
        <div className="mt-6 rounded-xl border border-white/10 bg-surface p-4 text-xs font-mono">
          <div><span className="text-muted">Order Ref:</span> <span className="font-semibold text-white">{state.orderNumber}</span></div>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={`/checkout/status/${state.orderNumber}?token=${encodeURIComponent(state.returnToken || "")}`}
            className="inline-flex min-h-11 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Check Order Status
          </Link>
          <Link
            href="/systems"
            className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-secondary hover:bg-white/[0.04]"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8">
      {/* Notice Banner */}
      <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-4 text-xs leading-5 text-amber-200">
        <span className="font-semibold">Verification Notice:</span> Payments are manually verified by our team. Please allow up to 24 hours for verification after submitting your reference.
      </div>

      {step === "scan" ? (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Step 1 of 2</span>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Scan to Pay</h2>
            </div>
            <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-brand">
              {priceFormatted}
            </span>
          </div>

          {/* Large QR Code Display */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-6">
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-white p-3 shadow-2xl transition hover:scale-[1.01]">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={qrImageSrc}
                alt={`Scan to Pay QR Code for ${systemTitle}`}
                className="h-64 w-64 object-contain rounded-lg sm:h-72 sm:w-72"
              />
            </div>
            <p className="mt-4 text-center text-xs font-medium text-muted">
              Scan using GCash, Maya, or any QRPH-supported banking app
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-3 text-xs font-semibold text-secondary hover:bg-white/[0.08]"
              >
                ⬇ Download QR Code
              </button>
              <button
                type="button"
                onClick={handleCopyInstructions}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-3 text-xs font-semibold text-secondary hover:bg-white/[0.08]"
              >
                {copied ? "✓ Copied!" : "📋 Copy Instructions"}
              </button>
            </div>
          </div>

          {/* Payment Instructions Box */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Payment Instructions</h3>
            <p className="mt-2 text-sm leading-6 text-secondary whitespace-pre-line">{instructions}</p>
          </div>

          {/* Button to proceed to Step 2 */}
          <button
            type="button"
            onClick={() => setStep("form")}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-hover"
          >
            I&apos;ve Paid → Enter Payment Details
          </button>
        </div>
      ) : (
        <form action={formAction} className="mt-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Step 2 of 2</span>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Confirm Payment Details</h2>
            </div>
            <button
              type="button"
              onClick={() => setStep("scan")}
              className="text-xs font-semibold text-muted hover:text-white"
            >
              ← Back to QR
            </button>
          </div>

          {state.status === "error" && (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-200">
              {state.message}
            </div>
          )}

          <input type="hidden" name="systemSlug" value={systemSlug} />

          {/* Full Name */}
          <div>
            <label htmlFor="customerName" className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              required
              defaultValue={state.values?.customerName}
              placeholder="e.g. Juan Dela Cruz"
              className="mt-2 block w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-muted focus:border-brand focus:outline-none"
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="customerEmail" className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              required
              defaultValue={state.values?.customerEmail}
              placeholder="e.g. juan@example.com"
              className="mt-2 block w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-muted focus:border-brand focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-muted">Access and delivery will be tied to this email address.</p>
          </div>

          {/* Contact Number (Optional) */}
          <div>
            <label htmlFor="contactNumber" className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              Contact Number <span className="text-muted">(Optional)</span>
            </label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              defaultValue={state.values?.contactNumber}
              placeholder="e.g. 0917 123 4567"
              className="mt-2 block w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-muted focus:border-brand focus:outline-none"
            />
          </div>

          {/* Transaction Reference Number */}
          <div>
            <label htmlFor="referenceNumber" className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              Reference Number / Transaction ID <span className="text-red-400">*</span>
            </label>
            <input
              id="referenceNumber"
              name="referenceNumber"
              type="text"
              required
              defaultValue={state.values?.referenceNumber}
              placeholder="e.g. 10049281745"
              className="mt-2 block w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-muted focus:border-brand focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-muted">Enter the GCash or banking transaction reference number.</p>
          </div>

          {/* Upload Proof of Payment Image */}
          <div>
            <label htmlFor="proofFile" className="block text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              Upload Proof of Payment <span className="text-red-400">*</span>
            </label>
            <input
              id="proofFile"
              type="file"
              accept="image/*"
              required={!proofUrl}
              onChange={handleFileUpload}
              className="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/20"
            />
            <input type="hidden" name="proofOfPaymentUrl" value={proofUrl} />
            {uploading && <p className="mt-2 text-xs text-amber-300">Uploading proof image...</p>}
            {uploadError && <p className="mt-2 text-xs text-red-400">{uploadError}</p>}
            {proofFileName && !uploading && (
              <p className="mt-2 text-xs font-medium text-emerald-400">✓ Uploaded: {proofFileName}</p>
            )}
          </div>

          {/* Acknowledgements */}
          <div className="space-y-3 pt-2 text-xs text-secondary">
            <label className="flex items-start gap-3">
              <input type="checkbox" name="termsAccepted" required className="mt-0.5 rounded border-white/20 bg-surface" />
              <span>I accept the <Link href="/legal/terms" target="_blank" className="underline text-white">Terms of Service</Link>.</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" name="licenseAccepted" required className="mt-0.5 rounded border-white/20 bg-surface" />
              <span>I review the <Link href="/legal/license" target="_blank" className="underline text-white">License Agreement</Link>.</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" name="refundAccepted" required className="mt-0.5 rounded border-white/20 bg-surface" />
              <span>I review the <Link href="/legal/refunds" target="_blank" className="underline text-white">Refund Policy</Link>.</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" name="deliveryAccepted" required className="mt-0.5 rounded border-white/20 bg-surface" />
              <span>I acknowledge that file delivery occurs after manual verification.</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending || uploading || !proofUrl}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-hover disabled:opacity-50"
          >
            {isPending ? "Submitting Payment Proof..." : "Submit Payment for Verification"}
          </button>
        </form>
      )}
    </div>
  );
}
