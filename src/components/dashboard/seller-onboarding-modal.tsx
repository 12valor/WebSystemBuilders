"use client";

import { useState } from "react";
import { submitSellerApplicationAction } from "@/features/auth/onboarding-actions";

export function SellerOnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await submitSellerApplicationAction(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8 font-sans text-slate-900 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Developer Verification</span>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Become a Seller</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"
          >
            ✕ Close
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-3xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-6">
              Your seller application has been submitted for administrator review. Once approved, seller features (Products, Sales, Payouts) will automatically unlock in your dashboard.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="blue-button mt-4 bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Display Name / Studio Name</label>
                <input
                  type="text"
                  name="displayName"
                  required
                  placeholder="e.g. Acme Code Studio"
                  className="mt-1 block w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Country</label>
                <input
                  type="text"
                  name="country"
                  defaultValue="Philippines"
                  className="mt-1 block w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Developer Bio</label>
              <textarea
                name="bio"
                rows={3}
                placeholder="Describe your tech stack, specialization, or development experience..."
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Portfolio Website (Optional)</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  placeholder="https://..."
                  className="mt-1 block w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">GitHub Profile</label>
                <input
                  type="text"
                  name="githubUrl"
                  placeholder="github.com/username"
                  className="mt-1 block w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">LinkedIn Profile</label>
                <input
                  type="text"
                  name="linkedinUrl"
                  placeholder="linkedin.com/in/username"
                  className="mt-1 block w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">GCash QR Code Image URL</label>
                <input
                  type="url"
                  name="gcashQrUrl"
                  placeholder="Image URL for payout"
                  className="mt-1 block w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">QRPH Image URL</label>
                <input
                  type="url"
                  name="qrphImageUrl"
                  placeholder="Image URL for payout"
                  className="mt-1 block w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-start pt-2">
              <input
                id="sellerAgreement"
                type="checkbox"
                required
                className="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="sellerAgreement" className="ml-2.5 text-xs leading-5 text-slate-600">
                I agree to the Seller Agreement, code quality guidelines, and ethical developer standards.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="blue-button min-h-12 w-full bg-blue-600 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Submitting Application..." : "Submit Seller Application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
