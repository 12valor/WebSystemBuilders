import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";

const navigation = [
  ["Overview", "/admin"],
  ["Systems", "/admin/systems"],
  ["Categories", "/admin/categories"],
  ["Media", "/admin/media"],
  ["Content", "/admin/content"],
  ["Inquiries", "/admin/inquiries"],
  ["Orders", "/admin/orders"],
  ["Support", "/admin/support"],
  ["Audit log", "/admin/audit-log"],
  ["Settings", "/admin/settings"],
] as const;

export function AdminShell({ children, active = "Systems" }: { children: React.ReactNode; active?: string }) {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 text-sm">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-slate-200/80 px-5">
          <BrandLogo variant="light" priority className="h-auto w-[190px]" />
        </div>
        <nav aria-label="Admin navigation" className="grid gap-1 p-3">
          {navigation.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              aria-current={active === label ? "page" : undefined}
              className={`flex min-h-10 items-center rounded-xl px-3.5 text-sm font-semibold transition-all duration-150 ${
                active === label
                  ? "bg-blue-50 text-blue-600 border border-blue-100/80 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-200/80 p-4 bg-slate-50/50">
          <p className="text-xs font-bold text-slate-900">Phase 5 operations</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 font-medium">Only implemented, database-backed workspaces are listed.</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-md sm:px-8 shadow-2xs">
          <details className="relative lg:hidden">
            <summary className="grid size-10 cursor-pointer list-none place-items-center rounded-xl border border-slate-200 text-lg text-slate-700 bg-white hover:bg-slate-50" aria-label="Open admin navigation">&#8801;</summary>
            <nav aria-label="Mobile admin navigation" className="absolute left-0 top-12 z-40 grid w-64 gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              {navigation.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className={`min-h-10 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                    active === label
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </details>
          <span className="ml-3 text-xs font-bold uppercase tracking-[0.1em] text-slate-500 lg:ml-0">Admin workspace</span>
          <Link href="/" className="ml-auto text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">View public site</Link>
        </header>
        {children}
      </div>
    </div>
  );
}
