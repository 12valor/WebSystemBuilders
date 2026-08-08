"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CustomerPortalShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string | null;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/account", label: "Overview", exact: true },
    { href: "/account/orders", label: "My Purchases" },
    { href: "/account/downloads", label: "System Downloads" },
    { href: "/account/support", label: "Support Requests" },
  ];

  return (
    <main id="main-content" className="py-10 sm:py-14 bg-[#FAFAFC] text-slate-900 min-h-screen">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Header Banner */}
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Customer Portal</span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-900 sm:text-4xl">My Account</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 font-medium">
              Signed in as <span className="font-semibold text-slate-900">{userEmail ?? "Customer"}</span>
            </p>
          </div>

          <Link
            href="/auth/sign-out"
            className="inline-flex min-h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            Sign Out
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex overflow-x-auto gap-2 border-b border-slate-200/80 pb-3 text-sm">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-blue-50 text-blue-600 border border-blue-100/80 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
