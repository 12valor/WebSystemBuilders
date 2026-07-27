import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08090A] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      <header className="border-b border-slate-800/60 bg-[#08090A]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex min-h-[74px] w-[min(calc(100%-40px),1120px)] items-center justify-between gap-6 md:w-[min(calc(100%-64px),1120px)]">
          <Link href="/" aria-label="WebSystemBuilders home" className="transition-opacity hover:opacity-90">
            <BrandLogo priority className="h-auto w-[184px] sm:w-[214px]" />
          </Link>
          <Link href="/systems" className="text-xs font-semibold text-slate-400 transition-colors hover:text-white">
            Browse systems →
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} WebSystemBuilders. All rights reserved.
      </footer>
    </div>
  );
}
