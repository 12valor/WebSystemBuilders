"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SupportForm } from "@/components/customer/support-form";
import { openPortalDownload } from "@/features/customer/actions";
import type { CustomerPortalData, CustomerPortalOrder, CustomerSupportRequest } from "@/features/customer/repository";
import { createClient } from "@/lib/supabase/client";
import {
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

  const userEmail = profile?.email || initialEmail || "customer@example.com";
  const displayName = profile?.full_name || (userEmail ? userEmail.split("@")[0] : "Customer");
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans text-slate-900 flex flex-col md:flex-row antialiased selection:bg-slate-900 selection:text-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between border-b border-slate-200/90 bg-white px-5 py-4 sticky top-0 z-40">
        <Link href="/">
          <BrandLogo variant="light" priority className="h-auto w-36" />
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-72 border-r border-slate-200/90 bg-white p-6 flex flex-col justify-between shrink-0 sticky top-0 h-auto md:h-screen z-30`}
      >
        <div className="space-y-6">
          <div className="hidden md:block">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <BrandLogo variant="light" priority className="h-auto w-44" />
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 shadow-xs">
            <div className="size-10 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center text-sm shadow-sm shrink-0">
              {avatarInitial}
            </div>
            <div className="truncate min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
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
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
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
            className="flex items-center justify-between w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span>Browse Catalog</span>
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
      <main className="flex-1 p-6 sm:p-10 max-w-6xl w-full">
        {/* Workspace Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200/80 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
              <span>Workspace</span>
              <ChevronRight className="size-3 text-slate-300" />
              <span className="capitalize text-slate-800 font-semibold">{activeTab}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-slate-900">
              {activeTab === "overview" && `Welcome back, ${displayName}`}
              {activeTab === "purchases" && "My Purchases & ZIP Downloads"}
              {activeTab === "support" && "Order Support & Help"}
              {activeTab === "wishlist" && "Saved Systems"}
              {activeTab === "profile" && "Account Profile"}
              {activeTab === "settings" && "Account Settings"}
              {activeTab === "products" && "Seller Products"}
              {activeTab === "sales" && "Sales & Revenue Analytics"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/systems"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              <span>Explore Systems Catalog</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>

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
            <div className="space-y-8">
              {/* Metric Stat Cards */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Verified Purchases</span>
                    <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
                      <ShoppingBag className="size-4.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{verifiedOrders.length}</p>
                  <p className="mt-1 text-[11px] text-slate-400 font-medium">Active software licenses</p>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Available Downloads</span>
                    <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <Download className="size-4.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{availableDownloads}</p>
                  <p className="mt-1 text-[11px] text-slate-400 font-medium">Protected ZIP packages</p>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Support Requests</span>
                    <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
                      <MessageSquare className="size-4.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{openSupportCount}</p>
                  <p className="mt-1 text-[11px] text-slate-400 font-medium">Active tickets</p>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Account Status</span>
                    <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      <ShieldCheck className="size-4.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-slate-900 flex items-center gap-1.5">
                    <span>Verified</span>
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400 font-medium">Standard Customer</p>
                </div>
              </div>

              {/* Quick Action Service Cards */}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Quick Actions & Services
                </h2>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="size-10 rounded-xl bg-slate-900 text-white grid place-items-center mb-4 shadow-xs">
                        <Package className="size-5" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">Ready-Made Systems</h3>
                      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                        Explore complete student projects, admin dashboards, and business systems ready for instant delivery.
                      </p>
                    </div>
                    <Link
                      href="/systems"
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors"
                    >
                      <span>Browse Systems Catalog</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>

                  <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="size-10 rounded-xl bg-slate-900 text-white grid place-items-center mb-4 shadow-xs">
                        <Sparkles className="size-5" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">Custom Development</h3>
                      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                        Need a tailored software system or custom website built from scratch? Submit your specs for a fast quote.
                      </p>
                    </div>
                    <Link
                      href="/request-a-quote"
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors"
                    >
                      <span>Request Custom System</span>
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>

                  <div className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div>
                      <div className="size-10 rounded-xl bg-slate-900 text-white grid place-items-center mb-4 shadow-xs">
                        <MessageSquare className="size-5" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-900">Support & Guidance</h3>
                      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                        Have questions about system setup, installation, or licensing? Our engineering team is here to help.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("support")}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-left"
                    >
                      <span>Open Support Request</span>
                      <ArrowUpRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="size-4 text-slate-400" />
                  <span>Recent Account Activity</span>
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
                    <div className="size-8 rounded-full bg-emerald-50 text-emerald-700 grid place-items-center shrink-0 border border-emerald-200/60 mt-0.5">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Account Workspace Active</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Signed in as {userEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PURCHASES & DOWNLOADS */}
          {activeTab === "purchases" && (
            <div className="space-y-6">
              {portalData.orders.length === 0 ? (
                <div className="rounded-2xl border border-slate-200/90 bg-white p-12 text-center shadow-xs">
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-500 mb-4">
                    <ShoppingBag className="size-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No system purchases yet</h3>
                  <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Purchases made using <span className="font-semibold text-slate-800">{userEmail}</span> during checkout will automatically appear here once verified.
                  </p>
                  <Link
                    href="/systems"
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-slate-900 px-5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    <span>Browse Ready-Made Systems</span>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex items-start gap-4">
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
                      <div key={order.order_id} className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
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
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
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
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
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
              <div className="rounded-2xl border border-slate-200/90 bg-white p-12 text-center shadow-xs">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-500 mb-4">
                  <Heart className="size-7" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Your wishlist is empty</h3>
                <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Save systems you are interested in while browsing our catalog to compare features and review later.
                </p>
                <Link
                  href="/systems"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-slate-900 px-5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
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
              <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xs max-w-2xl">
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
                      value={userEmail}
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
              <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xs max-w-2xl">
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
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Your Seller Catalog</h2>
                <button type="button" className="rounded-[10px] bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors">
                  + Publish New Product
                </button>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-12 text-center shadow-xs">
                <p className="text-xs text-slate-500">No seller products published yet.</p>
              </div>
            </div>
          )}

          {activeTab === "sales" && isSellerApproved && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
                <span className="text-xs font-semibold text-slate-500">Total Revenue</span>
                <p className="mt-2 text-3xl font-semibold text-emerald-700">₱0.00</p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
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
