"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SupportForm } from "@/components/customer/support-form";
import { openPortalDownload } from "@/features/customer/actions";
import type { CustomerPortalData } from "@/features/customer/repository";
import { createClient } from "@/lib/supabase/client";
import {
  type LucideIcon,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MessageSquare,
  User as UserIcon,
  Settings,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  LogOut,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Package,
  Layers,
  Menu,
  X,
  Download,
  AlertCircle,
  Lock,
} from "lucide-react";

interface UnifiedDashboardClientProps {
  initialEmail: string | null;
  portalData: CustomerPortalData;
  resultParam?: string;
}

export function UnifiedDashboardClient({
  initialEmail,
  portalData,
  resultParam,
}: UnifiedDashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<{
    full_name?: string;
    email?: string;
    username?: string;
    seller_status?: string;
    seller_enabled?: boolean;
    created_at?: string;
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) return;

        const { data } = await supabase
          .from("profiles")
          .select("full_name, email, username, seller_status, seller_enabled, created_at")
          .eq("user_id", authData.user.id)
          .maybeSingle();

        if (data) {
          setProfile({
            full_name: data.full_name || authData.user.user_metadata?.full_name,
            email: data.email || authData.user.email,
            username: data.username,
            seller_status: data.seller_status || "none",
            seller_enabled: data.seller_enabled || false,
            created_at: data.created_at || authData.user.created_at,
          });
        } else {
          setProfile({
            full_name: authData.user.user_metadata?.full_name,
            email: authData.user.email || initialEmail || undefined,
            seller_status: "none",
            seller_enabled: false,
            created_at: authData.user.created_at,
          });
        }
      } catch {
        // ignore
      }
    }

    loadProfile();
  }, [initialEmail]);

  const verifiedOrders = portalData.orders.filter((order) =>
    ["verified", "completed", "paid"].includes(order.order_status)
  );
  const availableDownloads = portalData.orders.filter((order) => order.delivery_available).length;
  const openSupportCount = portalData.supportRequests.filter((request) =>
    ["open", "in_progress"].includes(request.status)
  ).length;

  const isSellerApproved = profile?.seller_status === "approved" && profile?.seller_enabled === true;

  const buyerNav = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "purchases", label: "My Purchases & Downloads", icon: ShoppingBag, badge: verifiedOrders.length },
    { id: "support", label: "Support & Help", icon: MessageSquare, badge: openSupportCount },
    { id: "wishlist", label: "Saved Systems", icon: Heart },
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const sellerNav = [
    { id: "products", label: "Products", icon: Package },
    { id: "sales", label: "Sales & Revenue", icon: Layers },
  ];

  const userEmail = profile?.email || initialEmail;
  const displayName = profile?.full_name || (userEmail ? userEmail.split("@")[0] : "Customer");
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const accountState = userEmail ? "Signed in" : "Preview mode";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#F7F8FC] font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 size-80 rounded-full bg-blue-200/35 blur-3xl" />
        <div className="absolute right-[-8rem] top-[-6rem] size-96 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:22px_22px] opacity-[0.12]" />
      </div>
      <div className="relative flex min-h-screen flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/70 bg-white/85 px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl md:hidden">
        <Link href="/">
          <BrandLogo variant="light" priority className="size-10" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
          aria-label={mobileMenuOpen ? "Close workspace navigation" : "Open workspace navigation"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close workspace navigation"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-20 bg-slate-950/20 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "fixed inset-x-3 top-20 flex max-h-[calc(100vh-6rem)] flex-col justify-between overflow-y-auto rounded-[24px] border border-white/80 shadow-[0_22px_60px_rgba(15,23,42,0.20)]" : "hidden"
        } z-30 shrink-0 border-b border-slate-200/80 bg-white p-5 md:sticky md:top-5 md:ml-5 md:mt-5 md:flex md:h-[calc(100vh-2.5rem)] md:w-72 md:flex-col md:justify-between md:rounded-[28px] md:border md:border-white/80 md:p-5 md:shadow-[0_20px_55px_rgba(15,23,42,0.09)]`}
      >
        <div className="space-y-6">
          <div className="hidden md:block">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <BrandLogo variant="light" priority className="size-12" />
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-blue-100/80 bg-gradient-to-br from-blue-50 to-violet-50/60 p-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-sm font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.24)]">
              {avatarInitial}
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="truncate text-[11px] text-slate-500">{userEmail ?? "Local workspace preview"}</p>
            </div>
          </div>

          {/* Buyer Workspace Navigation */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Customer Workspace
            </div>
            {buyerNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-[0_8px_18px_rgba(37,99,235,0.22)]"
                      : "text-slate-600 hover:bg-blue-50/80 hover:text-blue-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Seller Workspace Navigation (If Approved) */}
            {isSellerApproved && (
              <div className="pt-4 space-y-1 border-t border-slate-100 mt-4">
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Seller Portal
                </div>
                {sellerNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
                      }`}
                    >
                      <Icon className={`size-4 ${isActive ? "text-white" : "text-emerald-600"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
          <Link
            href="/systems"
            className="flex w-full items-center justify-between rounded-xl border border-blue-100 bg-blue-50/70 px-3.5 py-2.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100/70"
          >
            <span>Browse systems</span>
            <ExternalLink className="size-3.5 text-slate-400" />
          </Link>

          <Link
            href="/auth/sign-out"
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="relative w-full flex-1 px-5 pb-12 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pb-16 lg:pt-10">
        <div className="mx-auto w-full max-w-7xl">
        {/* Workspace heading */}
        <section className="relative mb-7 overflow-hidden rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div aria-hidden="true" className="absolute -right-16 -top-20 size-64 rounded-full bg-gradient-to-br from-blue-300/35 to-violet-300/30 blur-3xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                <span>Customer workspace</span>
                <ChevronRight className="size-3 text-slate-300" />
                <span className="capitalize text-blue-600">{activeTab}</span>
                <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] text-emerald-700">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {accountState}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#0F172A] sm:text-4xl lg:text-5xl">
                {activeTab === "overview" ? (
                  <>Good to see you, <span className="bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">{displayName}</span></>
                ) : activeTab === "purchases" ? "Purchases & protected downloads"
                  : activeTab === "support" ? "Support for your systems"
                  : activeTab === "wishlist" ? "Saved systems"
                  : activeTab === "profile" ? "Account profile"
                  : activeTab === "settings" ? "Account settings"
                  : activeTab === "products" ? "Seller products"
                  : "Sales workspace"}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {activeTab === "overview"
                  ? "Track verified purchases, access eligible files, and get help from one focused workspace."
                  : "Everything here is tied to your account and the records available to this workspace."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("support")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                <MessageSquare className="size-4" /> Get support
              </button>
              <Link
                href="/systems"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] px-5 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5"
              >
                Browse systems <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
        {portalData.status === "error" && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs font-medium text-amber-800">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
            <span>Some account records could not be loaded. Try refreshing, or contact support if the issue continues.</span>
          </div>
        )}

        {/* Global Result Banner */}
        {resultParam === "download-unavailable" && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs font-medium text-red-700">
            <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
            <span>Deliverable access could not be generated. Please ensure your GCash/QRPh payment has been verified by an administrator.</span>
          </div>
        )}

        {/* Tab Content Panels */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Verified purchases"
                  value={verifiedOrders.length}
                  detail="Orders confirmed on this account"
                  icon={ShoppingBag}
                  tone="blue"
                />
                <MetricCard
                  label="Available downloads"
                  value={availableDownloads}
                  detail="Eligible protected ZIP packages"
                  icon={Download}
                  tone="violet"
                />
                <MetricCard
                  label="Open support"
                  value={openSupportCount}
                  detail="Requests currently in progress"
                  icon={MessageSquare}
                  tone="amber"
                />
                <MetricCard
                  label="Workspace"
                  value={accountState}
                  detail={userEmail ?? "Provider setup is not connected"}
                  icon={ShieldCheck}
                  tone="emerald"
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <section className="rounded-[24px] border border-white/90 bg-white/90 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-7">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600">Next steps</p>
                      <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0F172A]">Move your project forward</h2>
                    </div>
                    <Sparkles className="size-5 text-violet-500" />
                  </div>
                  <div className="space-y-3">
                    <Link href="/systems" className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/60">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Package className="size-5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">Explore ready-made systems</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">Compare published inclusions, versions, and available licenses.</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600" />
                    </Link>
                    <Link href="/request-a-quote" className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 p-4 text-left transition hover:border-violet-200 hover:bg-violet-50/60">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600"><Sparkles className="size-5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">Plan a custom build</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">Share your workflow and requirements for a tailored proposal.</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-600" />
                    </Link>
                    <button type="button" onClick={() => setActiveTab("support")} className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/60">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><MessageSquare className="size-5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">Get order support</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">Ask about an order, delivery access, or system setup.</span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                    </button>
                  </div>
                </section>

                <section className="rounded-[24px] border border-white/90 bg-white/90 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-7">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Account records</p>
                      <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0F172A]">Recent activity</h2>
                    </div>
                    <Clock className="size-5 text-slate-400" />
                  </div>
                  {portalData.orders.length === 0 && portalData.supportRequests.length === 0 ? (
                    <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center">
                      <span className="grid size-12 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm"><Layers className="size-5" /></span>
                      <p className="mt-4 text-sm font-semibold text-slate-900">No account activity yet</p>
                      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Verified orders and support updates will appear here when records are available.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {portalData.orders.slice(0, 2).map((order) => (
                        <button key={order.order_id} type="button" onClick={() => setActiveTab("purchases")} className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-left transition hover:border-blue-100 hover:bg-blue-50/60">
                          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600"><ShoppingBag className="size-4" /></span>
                          <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-900">{order.product_name}</span><span className="mt-1 block text-[11px] text-slate-500">{order.order_number}</span></span>
                          <StatusBadge status={order.order_status} />
                        </button>
                      ))}
                      {portalData.supportRequests.slice(0, 2).map((request) => (
                        <button key={request.id} type="button" onClick={() => setActiveTab("support")} className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-left transition hover:border-violet-100 hover:bg-violet-50/60">
                          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600"><MessageSquare className="size-4" /></span>
                          <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-900">{request.subject}</span><span className="mt-1 block text-[11px] text-slate-500">Updated {formatDate(request.updated_at)}</span></span>
                          <ChevronRight className="size-4 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <section className="relative overflow-hidden rounded-[24px] border border-blue-400/20 bg-gradient-to-br from-[#1E40AF] via-[#1E1B4B] to-[#0F172A] p-6 text-white shadow-[0_20px_45px_-15px_rgba(37,99,235,0.34)] sm:p-7">
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-blue-200"><Lock className="size-5" /></span>
                    <div><h2 className="text-base font-semibold">Protected delivery by default</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-blue-100/75">Eligible files use expiring access links. Return to Purchases whenever you need to request a fresh link.</p></div>
                  </div>
                  <button type="button" onClick={() => setActiveTab("purchases")} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-slate-900 transition hover:bg-blue-50">View purchases <ArrowUpRight className="size-3.5" /></button>
                </div>
              </section>
            </div>
          )}
          {/* TAB 2: PURCHASES & DOWNLOADS */}
          {activeTab === "purchases" && (
            <div className="space-y-6">
              {portalData.orders.length === 0 ? (
                <div className="rounded-[24px] border border-white/90 bg-white/90 backdrop-blur-sm p-12 text-center shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-500 mb-4">
                    <ShoppingBag className="size-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No system purchases yet</h3>
                  <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Purchases made using <span className="font-semibold text-slate-800">{userEmail ?? "this account"}</span> during checkout will automatically appear here once verified.
                  </p>
                  <Link
                    href="/systems"
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] px-5 text-xs font-semibold text-white shadow-[0_10px_22px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5"
                  >
                    <span>Browse Ready-Made Systems</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-[24px] border border-white/90 bg-white/90 backdrop-blur-sm p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] flex items-start gap-4">
                    <div className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                      <Lock className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-slate-900">Protected Delivery Policy</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        For security, direct deliverable access links expire after 1 hour. Return to this portal anytime to generate a fresh secure link.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5">
                    {portalData.orders.map((order) => (
                      <div key={order.order_id} className="rounded-[24px] border border-white/90 bg-white/90 backdrop-blur-sm p-6 sm:p-7 shadow-[0_14px_40px_rgba(15,23,42,0.06)] space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                              {order.order_number}
                            </span>
                            <h3 className="mt-1.5 text-xl font-semibold text-slate-900">{order.product_name}</h3>
                            <p className="mt-1 text-xs text-slate-500">Purchased version {order.purchased_version}</p>
                          </div>
                          <StatusBadge status={order.order_status} />
                        </div>

                        <div className="grid gap-4 border-t border-slate-100 pt-5 text-xs sm:grid-cols-3">
                          <div>
                            <span className="block font-medium text-slate-400">Total Amount</span>
                            <span className="mt-1 block font-semibold text-slate-900 text-sm">
                              {formatMoney(order.total_minor, order.currency)}
                            </span>
                          </div>
                          <div>
                            <span className="block font-medium text-slate-400">Payment Method</span>
                            <span className="mt-1 block font-semibold text-slate-900">GCash / QRPh Scan to Pay</span>
                          </div>
                          <div>
                            <span className="block font-medium text-slate-400">File Delivery</span>
                            <span className="mt-1 block font-semibold text-slate-900">
                              {order.delivery_available
                                ? "Unlocked ✓"
                                : order.order_status === "pending_verification"
                                ? "Awaiting Verification"
                                : "Locked"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                          <Link
                            href={`/systems/${order.product_slug}`}
                            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[10px] border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                          >
                            <span>View System Details</span>
                            <ExternalLink className="size-3.5 text-slate-400" />
                          </Link>

                          {order.delivery_available && (
                            <form action={openPortalDownload.bind(null, order.order_id)}>
                              <button
                                type="submit"
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-4 text-xs font-semibold text-white shadow-[0_10px_22px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5"
                              >
                                <Download className="size-3.5" />
                                <span>Generate Fresh 1-Hour Download Link</span>
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUPPORT & HELP */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Technical Support & Guidance</h2>
                <p className="text-xs text-slate-500 mt-1">Submit a support ticket for any verified purchase owned by this account.</p>
              </div>

              {portalData.supportRequests.length > 0 && (
                <div className="overflow-hidden rounded-[24px] border border-white/90 bg-white/90 backdrop-blur-sm shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                  {portalData.supportRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col gap-2 border-t border-slate-100 p-4 sm:p-5 first:border-t-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{request.subject}</p>
                        <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="size-3 text-slate-400" />
                          <span>Updated {formatDate(request.updated_at)}</span>
                        </p>
                      </div>
                      <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                        {request.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <SupportForm
                orders={portalData.orders.map((order) => ({
                  id: order.order_id,
                  label: `${order.order_number} - ${order.product_name}`,
                }))}
              />
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <div className="rounded-[24px] border border-white/90 bg-white/90 backdrop-blur-sm p-12 text-center shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-500 mb-4">
                  <Heart className="size-7" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Your wishlist is empty</h3>
                <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Saved-system syncing is not connected yet. You can still browse the catalog and return here when this account feature becomes available.
                </p>
                <Link
                  href="/systems"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] px-5 text-xs font-semibold text-white shadow-[0_10px_22px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5"
                >
                  <span>Explore Catalog</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="rounded-[24px] border border-white/90 bg-white/90 backdrop-blur-sm p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] max-w-2xl">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Personal Details</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={displayName}
                      className="mt-1.5 block w-full min-h-11 rounded-[10px] border border-slate-200 bg-slate-50 px-4 text-xs font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={userEmail ?? ""}
                      className="mt-1.5 block w-full min-h-11 rounded-[10px] border border-slate-200 bg-slate-50 px-4 text-xs font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Username</label>
                    <input
                      type="text"
                      disabled
                      value={profile?.username || "Not set"}
                      className="mt-1.5 block w-full min-h-11 rounded-[10px] border border-slate-200 bg-slate-50 px-4 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="rounded-[24px] border border-white/90 bg-white/90 backdrop-blur-sm p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)] max-w-2xl">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Account & Security Settings</h3>
                <p className="text-xs text-slate-500 mb-6">Manage your security credentials and notification preferences.</p>
                <div className="space-y-4">
                  <Link
                    href="/auth/forgot-password"
                    className="inline-flex min-h-11 items-center justify-center rounded-[10px] border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* SELLER TABS */}
          {activeTab === "products" && isSellerApproved && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Your Seller Catalog</h2>
                <p className="mt-1 text-xs text-slate-500">Published seller records will appear here when catalog management is connected.</p>
              </div>
              <div className="rounded-[24px] border border-white/90 bg-white/90 backdrop-blur-sm p-12 text-center shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                <p className="text-xs text-slate-500">No seller products published yet.</p>
              </div>
            </div>
          )}

          {activeTab === "sales" && isSellerApproved && (
            <div className="space-y-6">
              <div className="rounded-[24px] border border-slate-200/90 bg-white p-7 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                <span className="text-xs font-semibold text-slate-500">Sales reporting</span>
                <p className="mt-2 text-lg font-semibold text-slate-900">No verified sales data available</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Revenue appears after seller orders are connected and verified.</p>
              </div>
            </div>
          )}
        </motion.div>
        </div>
      </main>
      </div>
    </div>
  );
}

type MetricTone = "blue" | "violet" | "amber" | "emerald";

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | string;
  detail: string;
  icon: LucideIcon;
  tone: MetricTone;
}) {
  const tones: Record<MetricTone, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <article className="group rounded-[22px] border border-white/90 bg-white/90 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.055)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(37,99,235,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className={`mt-3 font-bold tracking-[-0.04em] text-[#0F172A] ${typeof value === "string" ? "text-lg" : "text-2xl"}`}>{value}</p>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl border ${tones[tone]}`}>
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-3 truncate text-[11px] text-slate-400">{detail}</p>
    </article>
  );
}
function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(
    new Date(value)
  );
}

function StatusBadge({ status }: { status: string }) {
  const isVerified = ["verified", "completed", "paid"].includes(status);
  const isPending = ["pending_verification", "pending"].includes(status);

  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
        <CheckCircle2 className="size-3.5 text-emerald-600" />
        <span>Verified & Unlocked</span>
      </span>
    );
  }

  if (isPending) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        <Clock className="size-3.5 text-amber-600" />
        <span>Pending Verification</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
      <AlertCircle className="size-3.5 text-red-600" />
      <span className="capitalize">{status}</span>
    </span>
  );
}
