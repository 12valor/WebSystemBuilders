"use client";

import Link from "next/link";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Download,
  ExternalLink,
  FileText,
  Heart,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  TrendingUp,
  User as UserIcon,
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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-xl px-5 md:hidden">
      <Link href="/" aria-label="WebSystemBuilders home" className="flex items-center gap-2.5">
        <BrandLogo priority className="size-8" />
        <span className="font-extrabold text-sm tracking-tight text-slate-900">WebSystemBuilders</span>
      </Link>
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onToggle}
        className="grid size-10 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 transition-colors hover:bg-slate-100 cursor-pointer"
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
  avatarUrl,
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
  avatarUrl?: string | null;
  buyerNavigation: DashboardNavigationItem[];
  sellerNavigation: DashboardNavigationItem[];
  activeTab: DashboardTab;
  isSellerApproved: boolean;
  onSelect: (tab: DashboardTab) => void;
}) {
  // Group buyer navigation into Sequence-style sections
  const generalItems = buyerNavigation.filter((item) =>
    ["overview", "purchases", "wishlist"].includes(item.id)
  );
  const supportItems = buyerNavigation.filter((item) =>
    ["support", "profile", "settings"].includes(item.id)
  );

  return (
    <aside
      id={id}
      ref={navigationRef}
      aria-label="Customer workspace navigation"
      className={`${
        open ? "fixed inset-y-0 left-0 flex" : "hidden"
      } z-50 w-[min(19rem,calc(100vw-3rem))] shrink-0 flex-col border-r border-slate-200/80 bg-[#FAFAFC] p-4.5 md:sticky md:top-0 md:flex md:h-screen md:w-68 lg:w-72`}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Brand Header */}
        <div className="hidden h-12 items-center px-2 md:flex">
          <Link href="/" aria-label="WebSystemBuilders home" className="flex items-center gap-2.5">
            <BrandLogo priority className="size-8" />
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              WebSystem<span className="text-blue-600">Builders</span>
            </span>
          </Link>
        </div>

        {/* Grouped Navigation */}
        <div className="mt-5 min-h-0 flex-1 overflow-y-auto space-y-6 pr-0.5 scrollbar-none">
          {/* GENERAL SECTION */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              General
            </p>
            <nav className="grid gap-1">
              {generalItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-dashboard-nav
                    onClick={() => onSelect(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-white text-slate-900 border border-slate-200/90 shadow-xs font-bold"
                        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isActive ? "bg-slate-900 ring-2 ring-slate-200" : "bg-transparent"
                      }`}
                    />
                    <Icon className={`size-4 shrink-0 ${isActive ? "text-slate-900" : "text-slate-500"}`} />
                    <span className="min-w-0 flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="min-w-5 rounded-full bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-center text-[10px] font-bold text-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* SUPPORT & ACCOUNT SECTION */}
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Support & Workspace
            </p>
            <nav className="grid gap-1">
              {supportItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-dashboard-nav
                    onClick={() => onSelect(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? "bg-white text-slate-900 border border-slate-200/90 shadow-xs font-bold"
                        : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        isActive ? "bg-slate-900 ring-2 ring-slate-200" : "bg-transparent"
                      }`}
                    />
                    <Icon className={`size-4 shrink-0 ${isActive ? "text-slate-900" : "text-slate-500"}`} />
                    <span className="min-w-0 flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="min-w-5 rounded-full bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-center text-[10px] font-bold text-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* SELLER WORKSPACE (IF APPLICABLE) */}
          {isSellerApproved && (
            <div>
              <div className="mb-2 flex items-center justify-between px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Seller Portal
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700">
                  Approved
                </span>
              </div>
              <nav className="grid gap-1">
                {sellerNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-slate-900 border border-slate-200/90 shadow-xs font-bold"
                          : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                      }`}
                    >
                      <Icon className={`size-4 shrink-0 ${isActive ? "text-slate-900" : "text-slate-500"}`} />
                      <span className="min-w-0 flex-1">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* User Card at Bottom */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="size-9 shrink-0 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-2xs">
                {avatarInitial}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-slate-900">{displayName}</span>
              <span className="block truncate text-[11px] text-slate-400 font-medium">
                {userEmail ?? "Signed in"}
              </span>
            </div>
          </div>
          <Link
            href="/auth/sign-out"
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
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
    <header className="border-b border-slate-200/70 pb-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Customer workspace</span>
            <ChevronRight className="size-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">{activeLabel}</span>
            <span
              className={`ml-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                signedIn
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-100 text-slate-600"
              }`}
            >
              <span className={`size-1.5 rounded-full ${signedIn ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              {accountState}
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
            {description}
          </p>
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
  return (
    <section className={`rounded-xl border border-slate-200/80 bg-white shadow-2xs ${className}`}>
      {children}
    </section>
  );
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
  variant?: "blue" | "emerald" | "indigo" | "sky" | "amber";
}) {
  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p
            className={`${
              typeof value === "number" ? "text-2xl sm:text-3xl" : "text-base sm:text-lg"
            } mt-2 font-extrabold tracking-tight text-slate-900 tabular-nums`}
          >
            {value}
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-200/80 bg-slate-100 text-slate-700">
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-2.5 truncate text-xs text-slate-500 font-medium">{detail}</p>
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
      <span className="grid size-12 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-5 text-lg font-extrabold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 font-medium">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function DashboardStatusBadge({ status }: { status: string }) {
  const isVerified = ["verified", "completed", "paid"].includes(status);
  const isPending = ["pending_verification", "pending"].includes(status);

  if (isVerified) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="size-3.5" />
        Success
      </span>
    );
  }

  if (isPending) {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
        <AlertCircle className="size-3.5" />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
      <AlertCircle className="size-3.5" />
      <span className="capitalize">{status.replaceAll("_", " ")}</span>
    </span>
  );
}
