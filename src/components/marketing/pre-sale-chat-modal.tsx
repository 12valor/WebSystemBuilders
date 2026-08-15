"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { submitInquiry } from "@/features/inquiries/actions";

export function PreSaleChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [user, setUser] = useState<{ id: string; email?: string; full_name?: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "unavailable">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function checkAuth() {
      if (!isOpen) return;
      setLoadingUser(true);
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.email,
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    checkAuth();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setSubmitting(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      const formData = new FormData();
      formData.append("inquiryType", "general");
      formData.append("name", user.full_name || "Buyer");
      formData.append("email", user.email || "buyer@example.com");
      formData.append("subject", "Pre-Sale Question regarding System Purchase");
      formData.append("message", message);
      formData.append("audience", "business");
      formData.append("consent", "true");
      formData.append("sourcePath", "/");

      const result = await submitInquiry({ status: "idle" }, formData);

      if (result.status === "success") {
        setStatus("success");
        setStatusMessage(result.message || "Your pre-sale message has been sent to the owner!");
        setMessage("");
      } else {
        setStatus(result.status === "unavailable" ? "unavailable" : "error");
        setStatusMessage(result.message || "Could not send message. Please try again.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("An error occurred while sending your pre-sale question.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Pre-Sale Owner Chat</h3>
                <p className="text-xs text-slate-500">Ask questions about systems, scope, or delivery before purchasing.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="mt-6 space-y-4">
            {loadingUser ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Verifying secure authentication...
              </div>
            ) : !user ? (
              /* Unauthenticated Protection Card */
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 text-center space-y-4">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sign in to Chat with the Owner</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    For security and spam prevention, only authenticated buyers can initiate pre-sale chats with the platform owner.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                  <Link
                    href="/auth/sign-in?next=/"
                    onClick={onClose}
                    className="blue-button bg-blue-600 px-5 py-2.5 text-xs font-bold text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={onClose}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            ) : (
              /* Authenticated Chat Interface */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Connected as:</span>
                  <span className="font-bold text-slate-900 font-mono">{user.email}</span>
                </div>

                {statusMessage && (
                  <div
                    className={`rounded-xl border p-4 text-xs font-semibold ${
                      status === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}
                  >
                    {statusMessage}
                  </div>
                )}

                <div>
                  <label htmlFor="preSaleMessage" className="block text-xs font-bold text-slate-700">
                    Your Pre-Sale Question
                  </label>
                  <textarea
                    id="preSaleMessage"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about GCash payment verification, product features, database inclusions, or custom scope requirements..."
                    className="mt-1.5 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[0.68rem] text-slate-400">
                    Owner will reply to your account email directly.
                  </span>

                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className="blue-button bg-blue-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Pre-Sale Question"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
