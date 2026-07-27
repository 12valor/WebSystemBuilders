import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08090A] text-[#FAFAFC] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#08090A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex min-h-[74px] w-[min(calc(100%-40px),1120px)] items-center justify-between gap-6 md:w-[min(calc(100%-64px),1120px)]">
          <Link href="/" aria-label="WebSystemBuilders home" className="transition-opacity hover:opacity-80">
            <BrandLogo priority className="h-auto w-[184px] sm:w-[214px]" />
          </Link>
          <Link
            href="/systems"
            className="text-xs font-semibold tracking-wide text-slate-400 transition-colors hover:text-white"
          >
            Browse systems &rarr;
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto w-[min(calc(100%-40px),1120px)] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <p>&copy; {new Date().getFullYear()} WebSystemBuilders. Handcrafted software systems.</p>
          <div className="flex gap-4 text-[11px]">
            <Link href="/legal/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
