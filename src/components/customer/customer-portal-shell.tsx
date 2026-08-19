"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

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

  // Derive display initials from email
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "C";

  return (
    <main id="main-content" className="min-h-screen bg-[#FBFBFD] text-slate-900">
      {/* Top Architectural Workspace Header */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Main Identity Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8">
            <div className="flex items-center gap-4">
              {/* User Avatar Circle */}
              <div className="flex size-12 items-center justify-center rounded-full bg-slate-900 text-white font-mono text-sm font-bold shadow-xs">
                {initial}
              </div>

              {/* Title & Email Info */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    My Account
                  </h1>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {userEmail ?? "Verified Customer"}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-4 self-start sm:self-center">
              <Link
                href="/systems"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Browse Systems →
              </Link>

              <span className="h-4 w-px bg-slate-200" />

              <Link
                href="/auth/sign-out"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
              >
                <LogOut className="size-3.5" />
                <span>Sign out</span>
              </Link>
            </div>
          </div>

          {/* Clean Underline Tab Navigation (Linear / Vercel style) */}
          <nav aria-label="Customer portal tabs" className="flex gap-6 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-3.5 text-xs tracking-tight transition-colors whitespace-nowrap ${
                    active
                      ? "font-bold text-slate-950"
                      : "font-medium text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-950 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </div>
    </main>
  );
}
