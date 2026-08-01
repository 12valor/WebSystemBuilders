import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex min-h-[74px] w-[min(calc(100%-40px),1120px)] items-center justify-between gap-6 md:w-[min(calc(100%-64px),1120px)]">
          <Link href="/" aria-label="WebSystemBuilders home" className="transition-opacity hover:opacity-80">
            <BrandLogo variant="light" priority className="size-12" />
          </Link>
          <Link
            href="/systems"
            className="text-xs font-semibold tracking-wide text-slate-600 transition-colors hover:text-slate-900"
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
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto w-[min(calc(100%-40px),1120px)] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <p>&copy; {new Date().getFullYear()} WebSystemBuilders. Handcrafted software systems.</p>
          <div className="flex gap-4 text-[11px]">
            <Link href="/legal/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
