import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { signOut } from "@/features/auth/actions";
import {
  ShieldCheck,
  Zap,
  Lock,
  MessageSquare,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

type AccountPreviewProps = {
  authState: "unconfigured" | "signed_out" | "signed_in";
  customerEmail?: string;
};

export function AccountPreview({ authState, customerEmail }: AccountPreviewProps) {
  const signedIn = authState === "signed_in";

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex min-h-[74px] w-[min(calc(100%-40px),1240px)] items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="WebSystemBuilders home" className="transition-opacity hover:opacity-80">
              <BrandLogo variant="light" priority className="size-12" />
            </Link>
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <span className="hidden text-xs font-semibold uppercase tracking-wider text-slate-500 sm:block">
              Customer Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            {signedIn ? (
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <Link
                href="/auth/sign-in?next=/account"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Sign In</span>
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main id="main-content" className="flex-1 mx-auto w-[min(calc(100%-40px),1180px)] py-12 sm:py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Welcome Card */}
          <div className="bg-white border border-slate-200/90 shadow-sm rounded-3xl p-8 sm:p-12 text-center space-y-6">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-slate-900 text-white shadow-md">
              <ShieldCheck className="size-8" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-700">
                <span>Customer Portal</span>
              </span>
              <h1 className="mt-4 text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-slate-900">
                Access your system downloads, orders & receipts
              </h1>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 max-w-xl mx-auto">
                Welcome! The Customer Portal provides private access to your software source code ZIP files, GCash / QRPh payment verification, and dedicated developer support.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid gap-4 sm:grid-cols-3 text-left pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <Zap className="size-5 text-slate-900 mb-2" />
                <h3 className="text-xs font-semibold text-slate-900">Instant Deliverables</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Download ready-to-run source code ZIPs & docs anytime.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <Lock className="size-5 text-slate-900 mb-2" />
                <h3 className="text-xs font-semibold text-slate-900">Verified Ownership</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Orders matching your checkout email claim automatically.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <MessageSquare className="size-5 text-slate-900 mb-2" />
                <h3 className="text-xs font-semibold text-slate-900">Direct Dev Support</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Submit technical questions directly to our system builders.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/auth/sign-in?next=/account"
                className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-md"
              >
                <span>Sign In to Access Your Orders</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/systems"
                className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <span>Browse Systems Catalog</span>
                <ExternalLink className="size-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
