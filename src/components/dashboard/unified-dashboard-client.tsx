"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  Filter,
  Heart,
  Layers,
  LayoutDashboard,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import {
  DashboardEmptyState,
  DashboardHeader,
  DashboardMetric,
  DashboardMobileHeader,
  DashboardPanel,
  DashboardSidebar,
  DashboardStatusBadge,
  type DashboardNavigationItem,
  type DashboardTab,
} from "@/components/dashboard/dashboard-ui";
import { SupportForm } from "@/components/customer/support-form";
import { openPortalDownload } from "@/features/customer/actions";
import type { CustomerPortalData } from "@/features/customer/repository";
import { createClient } from "@/lib/supabase/client";

interface UnifiedDashboardClientProps {
  initialEmail: string | null;
  portalData: CustomerPortalData;
  resultParam?: string;
}

type Profile = {
  full_name?: string;
  email?: string;
  avatar_url?: string;
  username?: string;
  seller_status?: string;
  seller_enabled?: boolean;
  created_at?: string;
};

const navigationId = "customer-workspace-navigation";

export function UnifiedDashboardClient({ initialEmail, portalData, resultParam }: UnifiedDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) return;

        const userMetaAvatar =
          authData.user.user_metadata?.avatar_url ||
          authData.user.user_metadata?.avatar;

        const { data } = await supabase
          .from("profiles")
          .select("full_name, email, avatar_url, username, seller_status, seller_enabled, created_at")
          .eq("user_id", authData.user.id)
          .maybeSingle();

        const avatarUrl = data?.avatar_url || userMetaAvatar;

        if (data) {
          setProfile({
            full_name: data.full_name || authData.user.user_metadata?.full_name,
            email: data.email || authData.user.email,
            avatar_url: avatarUrl,
            username: data.username,
            seller_status: data.seller_status || "none",
            seller_enabled: data.seller_enabled || false,
            created_at: data.created_at || authData.user.created_at,
          });
        } else {
          setProfile({
            full_name: authData.user.user_metadata?.full_name,
            email: authData.user.email || initialEmail || undefined,
            avatar_url: avatarUrl,
            seller_status: "none",
            seller_enabled: false,
            created_at: authData.user.created_at,
          });
        }
      } catch {
        // The server-provided email remains the safe display fallback.
      }
    }
    loadProfile();
  }, [initialEmail]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    navigationRef.current?.querySelector<HTMLElement>("[data-dashboard-nav]")?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMobileMenuOpen(false);
      window.setTimeout(() => menuButtonRef.current?.focus(), 0);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const verifiedOrders = portalData.orders.filter((order) => order.payment_status === "paid");
  const availableDownloads = portalData.orders.filter((order) => order.delivery_available).length;
  const openSupportCount = portalData.supportRequests.filter((request) => ["open", "in_progress"].includes(request.status)).length;
  const totalSpentMinor = verifiedOrders.reduce((sum, order) => sum + (order.total_minor || 0), 0);
  const isSellerApproved = profile?.seller_status === "approved" && profile?.seller_enabled === true;
  const userEmail = profile?.email || initialEmail;
  const displayName = profile?.full_name || (userEmail ? userEmail.split("@")[0] : "Customer");
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarUrl = profile?.avatar_url;
  const accountState = userEmail ? "Signed in" : "Preview mode";

  const buyerNavigation: DashboardNavigationItem[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "purchases", label: "Purchases & Orders", icon: ShoppingBag, badge: verifiedOrders.length },
    { id: "wishlist", label: "Saved Systems", icon: Heart },
    { id: "support", label: "Support & Inquiries", icon: MessageSquare, badge: openSupportCount },
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const sellerNavigation: DashboardNavigationItem[] = [
    { id: "products", label: "Products", icon: Package },
    { id: "sales", label: "Sales & Revenue", icon: Layers },
  ];

  const header = getHeaderCopy(activeTab, displayName);

  function selectTab(tab: DashboardTab) {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F6F8FA] font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      <DashboardMobileHeader
        menuOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen((current) => !current)}
        menuButtonRef={menuButtonRef}
        controlsId={navigationId}
      />
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close workspace navigation"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <div className="flex min-h-screen">
        <DashboardSidebar
          id={navigationId}
          open={mobileMenuOpen}
          navigationRef={navigationRef}
          displayName={displayName}
          userEmail={userEmail}
          avatarInitial={avatarInitial}
          avatarUrl={avatarUrl}
          buyerNavigation={buyerNavigation}
          sellerNavigation={sellerNavigation}
          activeTab={activeTab}
          isSellerApproved={isSellerApproved}
          onSelect={selectTab}
        />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-[1240px] space-y-6">
            {/* Error / Result Alerts */}
            <div className="grid gap-3" aria-live="polite">
              {portalData.status === "error" && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-900"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  <span>Some account records could not be loaded. Refresh the page or contact support if the issue continues.</span>
                </div>
              )}
              {resultParam === "download-unavailable" && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-900"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
                  <span>Deliverable access could not be generated. Confirm that PayPal payment is verified and an administrator has prepared delivery.</span>
                </div>
              )}
            </div>

            {/* Tab Views */}
            {activeTab === "overview" && (
              <SequenceOverviewPanel
                portalData={portalData}
                verifiedOrders={verifiedOrders}
                availableDownloads={availableDownloads}
                openSupportCount={openSupportCount}
                totalSpentMinor={totalSpentMinor}
                displayName={displayName}
                userEmail={userEmail}
                onSelect={selectTab}
              />
            )}
            {activeTab === "purchases" && <PurchasesPanel orders={portalData.orders} userEmail={userEmail} />}
            {activeTab === "support" && <SupportPanel portalData={portalData} />}
            {activeTab === "wishlist" && <SavedSystemsPanel />}
            {activeTab === "profile" && (
              <ProfilePanel
                displayName={displayName}
                userEmail={userEmail}
                avatarUrl={avatarUrl}
                username={profile?.username}
              />
            )}
            {activeTab === "settings" && <SettingsPanel />}
            {activeTab === "products" && isSellerApproved && <SellerProductsPanel />}
            {activeTab === "sales" && isSellerApproved && <SellerSalesPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SequenceOverviewPanel({
  portalData,
  verifiedOrders,
  availableDownloads,
  openSupportCount,
  totalSpentMinor,
  displayName,
  userEmail,
  onSelect,
}: {
  portalData: CustomerPortalData;
  verifiedOrders: CustomerPortalData["orders"];
  availableDownloads: number;
  openSupportCount: number;
  totalSpentMinor: number;
  displayName: string;
  userEmail: string | null | undefined;
  onSelect: (tab: DashboardTab) => void;
}) {
  const latestOrder = verifiedOrders[0];

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER - Solid Dark Sapphire / Slate */}
      <div className="relative overflow-hidden rounded-xl bg-slate-900 p-6 sm:p-7 text-white shadow-sm border border-slate-800">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Workspace Value & Systems
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {totalSpentMinor > 0 ? formatMoney(totalSpentMinor, "PHP") : "₱ 500.00"}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {verifiedOrders.length} {verifiedOrders.length === 1 ? "System" : "Systems"} Unlocked
              </span>
            </div>
            <p className="text-xs text-slate-300/90 font-medium">
              Lifetime verified source access • Private database schemas • Instant signed downloads
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/systems"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-500 active:scale-[0.98] transition cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Browse Systems</span>
            </Link>
            <Link
              href="/request-a-quote"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 px-4 py-2.5 text-xs font-bold text-white border border-white/15 backdrop-blur-md active:scale-[0.98] transition cursor-pointer"
            >
              <ArrowUpRight className="size-4" />
              <span>Request Quote</span>
            </Link>
            <button
              type="button"
              onClick={() => onSelect("support")}
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 px-3.5 py-2.5 text-xs font-bold text-white border border-white/15 backdrop-blur-md active:scale-[0.98] transition cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ESSENTIAL 3-METRIC ROW */}
      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardMetric
          label="Verified Purchases"
          value={verifiedOrders.length}
          detail="Orders confirmed on this account"
          icon={ShoppingBag}
        />
        <DashboardMetric
          label="Available Downloads"
          value={availableDownloads}
          detail="Eligible protected ZIP packages"
          icon={Download}
        />
        <DashboardMetric
          label="Open Support Tickets"
          value={openSupportCount}
          detail="Active requests in progress"
          icon={MessageSquare}
        />
      </div>

      {/* 3. PRIMARY 2-COLUMN CONTENT SECTION */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: Recent Activity Table Card */}
        <DashboardPanel className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Recent Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelect("purchases")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <Filter className="size-3 text-slate-400" />
                <span>Filter</span>
              </button>
              <button
                type="button"
                onClick={() => onSelect("purchases")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <SlidersHorizontal className="size-3 text-slate-400" />
                <span>Sort</span>
              </button>
            </div>
          </div>

          {portalData.orders.length === 0 && portalData.supportRequests.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 px-5 py-10 text-center">
              <p className="text-sm font-bold text-slate-900">No account activity yet</p>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500 font-medium">
                Verified orders and deliverable updates will appear in this ledger.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {portalData.orders.map((order) => (
                <div
                  key={order.order_id}
                  className="flex items-center justify-between py-3.5 hover:bg-slate-50/80 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80">
                      <ShoppingBag className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{order.product_name}</p>
                      <p className="text-[11px] font-mono text-slate-400">{order.order_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">
                      {formatMoney(order.total_minor, order.currency)}
                    </p>
                    <div className="mt-0.5">
                      <DashboardStatusBadge status={order.payment_status ?? order.order_status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardPanel>

        {/* Right: 'My Systems & Deliverables' License Card + Protected Notice */}
        <div className="space-y-5">
          <DashboardPanel className="p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">My Systems</h3>
              <button
                type="button"
                onClick={() => onSelect("purchases")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>See All</span>
                <ArrowUpRight className="size-3.5" />
              </button>
            </div>

            {/* Stylized Sequence License Card */}
            <div className="my-4 relative overflow-hidden rounded-xl bg-slate-900 p-5 text-white shadow-xs border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">
                  WSB LICENSE
                </span>
                <span className="text-[11px] font-bold text-emerald-400">
                  {latestOrder?.payment_status === "paid" ? "VERIFIED" : "ACTIVE"}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-extrabold text-white truncate">
                  {latestOrder ? latestOrder.product_name : "Gym Management System"}
                </p>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                  {latestOrder ? latestOrder.order_number : "WSB-20260819-DCAB2861D7"}
                </p>
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400">Single License</span>
                  <p className="text-xs font-bold text-slate-200">v1.0.0 • Full Source</p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect("purchases")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-white border border-white/15 backdrop-blur-md transition cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Files</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/systems"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition shadow-2xs"
              >
                <span>Explore More Systems</span>
                <ExternalLink className="size-3.5 text-slate-400" />
              </Link>
            </div>
          </DashboardPanel>

          {/* Protected Delivery Notice */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs flex items-start gap-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200/80 bg-slate-100 text-slate-700 shadow-2xs">
              <Lock className="size-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Protected delivery policy</h4>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 font-medium">
                Deliverable access links expire after one hour for security. Return to Purchases to generate a fresh link anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PurchasesPanel({ orders, userEmail }: { orders: CustomerPortalData["orders"]; userEmail: string | null | undefined }) {
  const [filter, setFilter] = useState<"all" | "paid" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <DashboardPanel>
        <DashboardEmptyState
          icon={ShoppingBag}
          title="No purchases on this account"
          description={`Verified orders placed with ${userEmail ?? "this account"} will appear here.`}
          action={<PrimaryLink href="/systems">Browse ready-made systems</PrimaryLink>}
        />
      </DashboardPanel>
    );
  }

  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const otherOrders = orders.filter((o) => o.payment_status !== "paid");
  const totalSpentMinor = paidOrders.reduce((sum, o) => sum + (o.total_minor || 0), 0);
  const activeDownloadsCount = orders.filter((o) => o.delivery_available).length;

  const filteredOrders = orders.filter((order) => {
    if (filter === "paid" && order.payment_status !== "paid") return false;
    if (filter === "cancelled" && order.payment_status === "paid") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = order.product_name.toLowerCase().includes(q);
      const matchNumber = order.order_number.toLowerCase().includes(q);
      return matchName || matchNumber;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardMetric
          label="Total Orders"
          value={orders.length}
          detail="Orders placed on this account"
          icon={ShoppingBag}
        />
        <DashboardMetric
          label="Active Deliveries"
          value={activeDownloadsCount}
          detail="Eligible protected source packages"
          icon={Download}
        />
        <DashboardMetric
          label="Total Invested"
          value={totalSpentMinor > 0 ? formatMoney(totalSpentMinor, "PHP") : "₱0.00"}
          detail="Lifetime verified spend"
          icon={CreditCard}
        />
      </div>

      {/* 2. Protected Delivery Policy Callout */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 shadow-2xs flex items-center gap-3.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200/80 bg-slate-100 text-slate-700 shadow-2xs">
          <Lock className="size-4" />
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-900">Protected delivery policy</h4>
          <p className="mt-0.5 text-xs text-slate-600 font-medium">
            Direct download links expire after 1 hour for security. Return here anytime to generate a fresh link.
          </p>
        </div>
      </div>

      {/* 3. Interactive Orders Table Ledger */}
      <DashboardPanel className="p-6">
        {/* Controls Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                filter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("paid")}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                filter === "paid" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Completed ({paidOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("cancelled")}
              className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                filter === "cancelled" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Cancelled / Other ({otherOrders.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search order # or system..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-9 rounded-lg border border-slate-200 bg-slate-50/50 pl-8.5 pr-8 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Table / Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-slate-900">No matching orders found</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Try clearing your search query or selecting a different filter tab.</p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {/* Desktop Table Header */}
            <div className="hidden sm:grid sm:grid-cols-[1.5fr_1.8fr_1fr_1fr_1.2fr] gap-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Order & Date</span>
              <span>System</span>
              <span>Amount</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.order_id;
              return (
                <div key={order.order_id} className="transition-colors hover:bg-slate-50/70 rounded-lg">
                  {/* Main Row */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.order_id)}
                    className="grid grid-cols-1 sm:grid-cols-[1.5fr_1.8fr_1fr_1fr_1.2fr] items-center gap-3 p-3.5 cursor-pointer"
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-900">{order.order_number}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{order.product_name}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 rounded">
                        v{order.purchased_version}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{formatMoney(order.total_minor, order.currency)}</p>
                    </div>
                    <div>
                      <DashboardStatusBadge status={order.payment_status ?? order.order_status} />
                    </div>
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {order.delivery_available && (
                        <form action={openPortalDownload.bind(null, order.order_id)}>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
                          >
                            <Download className="size-3.5" />
                            <span>Download</span>
                          </button>
                        </form>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.order_id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        aria-label={isExpanded ? "Collapse order details" : "Expand order details"}
                      >
                        <ChevronDown className={`size-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details Drawer */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 py-3 text-xs">
                        <div>
                          <span className="font-semibold text-slate-400">License Scope</span>
                          <p className="font-bold text-slate-900 mt-1">Single Site License • Full Source</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-400">Payment Provider</span>
                          <p className="font-bold text-slate-900 mt-1">{providerLabel(order.payment_provider)}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-400">Payment Status</span>
                          <p className="font-bold text-slate-900 mt-1 capitalize">{order.payment_status === "paid" ? "Payment Confirmed" : order.payment_status ?? "Pending"}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-400">Fulfillment</span>
                          <p className="font-bold text-slate-900 mt-1 capitalize">{order.delivery_available ? "Delivered & Ready" : order.fulfillment_status ?? "Not started"}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2.5 pt-3 border-t border-slate-200/60">
                        <Link
                          href={`/systems/${order.product_slug}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
                        >
                          <span>View system catalog page</span>
                          <ExternalLink className="size-3 text-slate-400" />
                        </Link>
                        {order.delivery_available && (
                          <form action={openPortalDownload.bind(null, order.order_id)}>
                            <button
                              type="submit"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
                            >
                              <Download className="size-3.5" />
                              <span>Generate 1-hour signed ZIP link</span>
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DashboardPanel>
    </div>
  );
}

function SupportPanel({ portalData }: { portalData: CustomerPortalData }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr] xl:items-start">
      {/* Left: Support History */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">Support History</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track inquiries and requests linked to your verified purchases.
          </p>
        </div>

        <DashboardPanel className="overflow-hidden">
          {portalData.supportRequests.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <MessageSquare className="size-4.5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">No support requests yet</h3>
              <p className="mt-1 text-xs text-slate-500 font-medium max-w-xs mx-auto">
                Need help with installation, schemas, or source files? Use the form to reach our engineering team.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {portalData.supportRequests.map((request) => (
                <div key={request.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{request.subject}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <Clock className="size-3 text-slate-400" />
                        <span>Updated {formatDate(request.updated_at)}</span>
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      {request.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardPanel>
      </div>

      {/* Right: Submit New Request */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">New Request</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Select an order and describe your technical question or request.
          </p>
        </div>
        <SupportForm
          appearance="dashboard"
          orders={portalData.orders.map((order) => ({ id: order.order_id, label: `${order.order_number} - ${order.product_name}` }))}
        />
      </div>
    </div>
  );
}

type SavedSystemItem = {
  slug: string;
  name: string;
  category?: string;
  priceMinor?: number;
  currency?: string;
  version?: string;
  savedAt?: string;
};

function SavedSystemsPanel() {
  const [savedSystems, setSavedSystems] = useState<SavedSystemItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wsb_saved_systems");
      if (stored) {
        setSavedSystems(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleRemove = (slug: string) => {
    const next = savedSystems.filter((item) => item.slug !== slug);
    setSavedSystems(next);
    try {
      localStorage.setItem("wsb_saved_systems", JSON.stringify(next));
    } catch {
      // Ignore localStorage errors
    }
  };

  const clearAll = () => {
    setSavedSystems([]);
    try {
      localStorage.removeItem("wsb_saved_systems");
    } catch {
      // Ignore localStorage errors
    }
  };

  const popularCategories = [
    {
      title: "Business & POS Systems",
      desc: "Point of sale, inventory tracking, and sales reporting",
      href: "/systems?category=business",
    },
    {
      title: "Academic & School Portals",
      desc: "Student enrollment, grading, and document portals",
      href: "/systems?category=education",
    },
    {
      title: "Booking & Scheduling",
      desc: "Appointment reservations, client calendars, and notifications",
      href: "/systems?category=booking",
    },
    {
      title: "Management & CRM",
      desc: "Client records, billing automation, and operations",
      href: "/systems?category=management",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">Saved Systems</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Systems you bookmark from the catalog appear here for quick access.
          </p>
        </div>
        {savedSystems.length > 0 && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer shadow-2xs"
            >
              <Trash2 className="size-3.5" />
              <span>Clear list</span>
            </button>
            <Link
              href="/systems"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer shadow-xs"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </div>

      {savedSystems.length === 0 ? (
        <div className="space-y-6">
          <DashboardPanel className="p-8 sm:p-10 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-600 shadow-2xs">
              <Bookmark className="size-5 text-slate-500" />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-slate-900 tracking-tight">No saved systems yet</h3>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-slate-600 font-medium">
              Bookmark systems in the catalog to compare features, review database schemas, and save them for later.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/systems"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition cursor-pointer"
              >
                <span>Browse Ready-Made Systems</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </DashboardPanel>

          {/* Quick Category Jump */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Explore by Category
            </h4>
            <div className="grid gap-3.5 sm:grid-cols-2">
              {popularCategories.map((cat) => (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cat.title}
                    </p>
                    <ArrowRight className="size-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 font-medium">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedSystems.map((item) => (
            <DashboardPanel key={item.slug} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-block rounded-md bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {item.category || "System"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.slug)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <h3 className="mt-3 text-sm font-extrabold text-slate-900 tracking-tight">{item.name}</h3>
                {item.version && (
                  <p className="mt-0.5 text-[11px] font-mono text-slate-400">v{item.version}</p>
                )}
                {item.priceMinor !== undefined && (
                  <p className="mt-3 text-base font-extrabold text-slate-900">
                    {formatMoney(item.priceMinor, item.currency || "PHP")}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/systems/${item.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <Link
                  href={`/checkout/${item.slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                >
                  <span>Buy</span>
                </Link>
              </div>
            </DashboardPanel>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfilePanel({
  displayName,
  userEmail,
  avatarUrl,
  username,
}: {
  displayName: string;
  userEmail: string | null | undefined;
  avatarUrl?: string | null;
  username?: string;
}) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-base font-extrabold tracking-tight text-slate-900">Account Profile</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Your verified identity and workspace credentials.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: User Card */}
        <DashboardPanel className="p-6 text-center flex flex-col items-center justify-center md:col-span-1">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="size-20 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
          ) : (
            <span className="grid size-20 place-items-center rounded-xl bg-slate-900 text-2xl font-bold text-white shadow-2xs">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <h3 className="mt-4 text-sm font-extrabold text-slate-900">{displayName}</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{userEmail ?? "No email set"}</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-200/80">
            <ShieldCheck className="size-3 text-blue-600" />
            Verified Buyer
          </span>
        </DashboardPanel>

        {/* Right: Account Details */}
        <DashboardPanel className="p-6 md:col-span-2 space-y-5">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Account details associated with your verified purchases.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField label="Full Name" value={displayName} />
            <ReadOnlyField label="Email Address" value={userEmail ?? "Not available"} />
            <ReadOnlyField label="Username" value={username || "Not configured"} />
            <ReadOnlyField label="Account Type" value="Buyer Workspace" />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Authentication: Supabase Auth</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="size-3.5" />
              Active & Protected
            </span>
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-base font-extrabold tracking-tight text-slate-900">Account Settings</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage your sign-in security and workspace preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Security & Authentication */}
        <DashboardPanel className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Password & Authentication</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Update your account password or request a reset link.
              </p>
            </div>
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer shadow-xs"
            >
              <span>Change password</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 text-xs">
            <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-4">
              <span className="font-bold text-slate-900">Session Security</span>
              <p className="mt-1 text-slate-600 font-medium leading-relaxed">
                Protected via encrypted HTTP-only session cookies with automatic token refresh.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-4">
              <span className="font-bold text-slate-900">Deliverable Links</span>
              <p className="mt-1 text-slate-600 font-medium leading-relaxed">
                Signed source file URLs expire after 1 hour to prevent link sharing.
              </p>
            </div>
          </div>
        </DashboardPanel>

        {/* Account Actions */}
        <DashboardPanel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Session</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Sign out of your active dashboard session on this device.
              </p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition cursor-pointer shadow-2xs"
            >
              <span>Sign out</span>
            </Link>
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
}

function SellerProductsPanel() {
  return (
    <DashboardPanel>
      <DashboardEmptyState
        icon={Package}
        title="No seller products published"
        description="Published seller records will appear here after seller catalog management is connected."
      />
    </DashboardPanel>
  );
}

function SellerSalesPanel() {
  return (
    <DashboardPanel>
      <DashboardEmptyState
        icon={Layers}
        title="No verified sales data available"
        description="Revenue reporting will appear only after seller orders are connected and verified."
      />
    </DashboardPanel>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">{eyebrow}</p>
      <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">{title}</h2>
    </div>
  );
}

function OrderDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1.5 font-bold text-slate-900">{value}</dd>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="grid gap-1.5 text-xs font-bold text-slate-700">
      <span>{label}</span>
      <input
        disabled
        value={value}
        className="min-h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-100"
      />
    </label>
  );
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:bg-blue-700 hover:shadow-[0_6px_22px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
    >
      <span>{children}</span>
      <ArrowUpRight className="size-4 text-blue-100 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
    </Link>
  );
}

function getHeaderCopy(tab: DashboardTab, displayName: string) {
  const copy: Record<DashboardTab, { label: string; title: string; description: string }> = {
    overview: {
      label: "Dashboard",
      title: `${displayName}'s workspace`,
      description: "Track verified purchases, access eligible files, and get help from one focused workspace.",
    },
    purchases: {
      label: "Purchases",
      title: "Purchases and protected downloads",
      description: "Review payment verification, order details, and eligible deliverable access.",
    },
    support: {
      label: "Support",
      title: "Support for your systems",
      description: "Review existing requests or create a new order-linked support ticket.",
    },
    wishlist: {
      label: "Saved systems",
      title: "Saved systems",
      description: "Review and manage systems you have saved from the catalog.",
    },
    profile: {
      label: "Profile",
      title: "Account profile",
      description: "Review the identity information currently connected to this workspace.",
    },
    settings: {
      label: "Settings",
      title: "Account settings",
      description: "Manage the security options currently available for this account.",
    },
    products: {
      label: "Products",
      title: "Seller products",
      description: "Review seller catalog availability without showing unverified product activity.",
    },
    sales: {
      label: "Sales",
      title: "Sales workspace",
      description: "Verified seller revenue will appear only after order reporting is connected.",
    },
  };
  return copy[tab];
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(new Date(value));
}

function providerLabel(provider: string | null) {
  if (provider === "paypal") return "PayPal — Automatically Verified";
  if (provider === "manual") return "Legacy manual payment (historical)";
  if (provider === "paymongo") return "PayMongo (historical)";
  return "Unrecorded";
}
