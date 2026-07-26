"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CustomerPortalShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/account", label: "Overview", exact: true },
    { href: "/account/orders", label: "My Purchases" },
    { href: "/account/downloads", label: "System Downloads" },
    { href: "/account/support", label: "Support Requests" },
  ];

  return (
    <main id="main-content" className="py-10 sm:py-14">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        {/* Header Banner */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Customer Portal</span>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">My Account</h1>
            <p className="mt-2 text-sm leading-6 text-secondary">
              Signed in as <span className="font-semibold text-white">{userEmail}</span>
            </p>
          </div>

          <Link
            href="/auth/sign-out"
            className="inline-flex min-h-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] px-3 text-xs font-semibold text-secondary hover:bg-white/[0.08]"
          >
            Sign Out
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex overflow-x-auto gap-2 border-b border-white/10 pb-3 text-sm">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-secondary hover:bg-white/[0.04] hover:text-white"
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
