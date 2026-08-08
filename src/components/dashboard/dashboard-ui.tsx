"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";

export type DashboardTab =
  | "overview"
  | "purchases"
  | "support"
  | "wishlist"
  | "profile"
  | "settings"
  | "products"
  | "sales";

export type DashboardNavigationItem = {
  id: DashboardTab;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

export function DashboardMobileHeader({
  menuOpen,
  onToggle,
  menuButtonRef,
  controlsId,
}: {
  menuOpen: boolean;
  onToggle: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  controlsId: string;
}) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white px-5 md:hidden">
      <Link href="/" aria-label="WebSystemBuilders home">
        <BrandLogo priority className="size-9" />
      </Link>
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onToggle}
        className="grid size-11 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-800 transition-colors hover:bg-slate-100"
        aria-label={menuOpen ? "Close workspace navigation" : "Open workspace navigation"}
        aria-controls={controlsId}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
    </header>
  );
}

export function DashboardSidebar({
  id,
  open,
  navigationRef,
  displayName,
  userEmail,
  avatarInitial,
  buyerNavigation,
  sellerNavigation,
  activeTab,
  isSellerApproved,
  onSelect,
}: {
  id: string;
  open: boolean;
  navigationRef: React.RefObject<HTMLElement | null>;
  displayName: string;
  userEmail: string | null | undefined;
  avatarInitial: string;
  buyerNavigation: DashboardNavigationItem[];
  sellerNavigation: DashboardNavigationItem[];
  activeTab: DashboardTab;
  isSellerApproved: boolean;
  onSelect: (tab: DashboardTab) => void;
}) {
  return (
    <aside
      id={id}
      ref={navigationRef}
      aria-label="Customer workspace navigation"
      className={`${
        open ? "fixed inset-y-0 left-0 flex" : "hidden"
      } z-50 w-[min(19rem,calc(100vw-3rem))] shrink-0 flex-col border-r border-slate-200/80 bg-white p-4 md:sticky md:top-0 md:flex md:h-screen md:w-64 lg:w-72`}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <Link
          href="/"
          aria-label="WebSystemBuilders home"
          className="hidden h-14 items-center px-2 transition-opacity hover:opacity-80 md:flex"
        >
          <BrandLogo priority className="size-10" />
        </Link>

        <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#2563EB] text-sm font-semibold text-white shadow-2xs">
            {avatarInitial}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-slate-900">{displayName}</span>
            <span className="mt-0.5 block truncate text-xs text-slate-500 font-medium">
              {userEmail ?? "Local workspace preview"}
            </span>
          </span>
        </div>

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
          <DashboardNavigation
            label="Customer workspace"
            items={buyerNavigation}
            activeTab={activeTab}
            onSelect={onSelect}
          />

          {isSellerApproved && (
            <div className="mt-6 border-t border-slate-200/80 pt-5">
              <div className="mb-3 flex items-center justify-between px-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Seller workspace
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Approved
                </span>
              </div>
              <DashboardNavigation
                label="Seller workspace"
                hideLabel
                items={sellerNavigation}
                activeTab={activeTab}
                onSelect={onSelect}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-2 border-t border-slate-200/80 pt-4">
        <Link
          href="/systems"
          className="flex min-h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
        >
          <span>Browse systems</span>
          <ExternalLink className="size-4 text-slate-400" />
        </Link>
        <Link
          href="/auth/sign-out"
          className="flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="size-4" />
          <span>Sign out</span>
        </Link>
      </div>
    </aside>
  );
}

function DashboardNavigation({
  label,
  hideLabel = false,
  items,
  activeTab,
  onSelect,
}: {
  label: string;
  hideLabel?: boolean;
  items: DashboardNavigationItem[];
  activeTab: DashboardTab;
  onSelect: (tab: DashboardTab) => void;
}) {
  return (
    <nav aria-label={label} className="grid gap-1">
      {!hideLabel && (
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            data-dashboard-nav
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm font-semibold transition-all duration-150 ${
              isActive
                ? "bg-blue-50 text-blue-600 border border-blue-100/80 shadow-2xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon className={`size-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
            <span className="min-w-0 flex-1">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="min-w-6 rounded-full border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-center text-[10px] font-bold tabular-nums text-slate-700">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export function DashboardHeader({
  activeLabel,
  title,
  description,
  accountState,
  onSupport,
}: {
  activeLabel: string;
  title: string;
  description: string;
  accountState: string;
  onSupport: () => void;
}) {
  const signedIn = accountState === "Signed in";

  return (
    <header className="border-b border-slate-200/80 pb-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Customer workspace</span>
            <ChevronRight className="size-3.5" />
            <span className="text-slate-800">{activeLabel}</span>
            <span
              className={`ml-1 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                signedIn
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-100 text-slate-600"
              }`}
            >
              <span className={`size-1.5 rounded-full ${signedIn ? "bg-emerald-500" : "bg-slate-400"}`} />
              {accountState}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-slate-900 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 font-medium">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSupport}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 shadow-2xs"
          >
            Get support
          </button>
          <Link
            href="/systems"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm"
          >
            Browse systems
            <ExternalLink className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function DashboardPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-2xl border border-slate-200/80 bg-white shadow-2xs ${className}`}>{children}</section>;
}

export function DashboardMetric({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className={`${typeof value === "number" ? "text-3xl" : "text-lg"} mt-3 font-extrabold tracking-[-0.03em] text-slate-900 tabular-nums`}>
            {value}
          </p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 truncate text-xs text-slate-500 font-medium">{detail}</p>
    </article>
  );
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
        <Icon className="size-5" />
      </span>
      <h2 className="mt-5 text-lg font-extrabold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 font-medium">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function DashboardStatusBadge({ status }: { status: string }) {
  const isVerified = ["verified", "completed", "paid"].includes(status);
  const isPending = ["pending_verification", "pending"].includes(status);

  if (isVerified) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="size-3.5" />
        Verified and unlocked
      </span>
    );
  }

  if (isPending) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
        <AlertCircle className="size-3.5" />
        Pending verification
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
      <AlertCircle className="size-3.5" />
      <span className="capitalize">{status.replaceAll("_", " ")}</span>
    </span>
  );
}
