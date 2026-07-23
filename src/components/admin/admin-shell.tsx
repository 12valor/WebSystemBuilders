import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

const navigation = [
  ["Overview", "/admin"],
  ["Systems", "/admin/systems"],
  ["Categories", "/admin/categories"],
  ["Orders", "/admin/orders"],
  ["Customers", "/admin/customers"],
  ["Inquiries", "/admin/inquiries"],
  ["Content", "/admin/content"],
  ["Media", "/admin/media"],
  ["Audit log", "/admin/audit-log"],
  ["Settings", "/admin/settings"],
] as const;

export function AdminShell({ children, active = "Systems" }: { children: React.ReactNode; active?: string }) {
  return (
    <div className="min-h-screen bg-[#090a0b] text-sm">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-[#0b0c0e] lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <BrandLogo className="h-auto w-[190px]" />
        </div>
        <nav aria-label="Admin navigation" className="grid gap-1 p-3">
          {navigation.map(([label, href]) => (
            <Link key={label} href={href} aria-current={active === label ? "page" : undefined} className={`flex min-h-10 items-center rounded-lg px-3 text-sm transition-colors ${active === label ? "bg-white/[0.07] font-semibold text-foreground" : "text-secondary hover:bg-white/[0.035] hover:text-foreground"}`}>{label}</Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 p-4">
          <p className="text-xs font-semibold text-foreground">Phase 1 preview</p>
          <p className="mt-1 text-xs leading-5 text-muted">Authentication and persistence are not connected.</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-white/10 bg-[#090a0b]/95 px-5 backdrop-blur-md sm:px-8">
          <details className="relative lg:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-white/10 text-lg" aria-label="Open admin navigation">&#8801;</summary>
            <nav aria-label="Mobile admin navigation" className="absolute left-0 top-12 z-40 grid w-64 gap-1 rounded-xl border border-white/10 bg-surface-raised p-3 shadow-xl">
              {navigation.map(([label, href]) => <Link key={label} href={href} className="min-h-10 rounded-lg px-3 py-2.5 text-secondary hover:bg-white/[0.05] hover:text-foreground">{label}</Link>)}
            </nav>
          </details>
          <span className="ml-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted lg:ml-0">Admin workspace</span>
          <Link href="/" className="ml-auto text-xs font-semibold text-secondary hover:text-foreground">View public site</Link>
        </header>
        {children}
      </div>
    </div>
  );
}
