"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Clock,
  Download,
  ExternalLink,
  Heart,
  Layers,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
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

  const verifiedOrders = portalData.orders.filter((order) => ["verified", "completed", "paid"].includes(order.order_status));
  const availableDownloads = portalData.orders.filter((order) => order.delivery_available).length;
  const openSupportCount = portalData.supportRequests.filter((request) => ["open", "in_progress"].includes(request.status)).length;
  const isSellerApproved = profile?.seller_status === "approved" && profile?.seller_enabled === true;
  const userEmail = profile?.email || initialEmail;
  const displayName = profile?.full_name || (userEmail ? userEmail.split("@")[0] : "Customer");
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarUrl = profile?.avatar_url;
  const accountState = userEmail ? "Signed in" : "Preview mode";
  const buyerNavigation: DashboardNavigationItem[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "purchases", label: "Purchases and downloads", icon: ShoppingBag, badge: verifiedOrders.length },
    { id: "support", label: "Support", icon: MessageSquare, badge: openSupportCount },
    { id: "wishlist", label: "Saved systems", icon: Heart },
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  const sellerNavigation: DashboardNavigationItem[] = [
    { id: "products", label: "Products", icon: Package },
    { id: "sales", label: "Sales and revenue", icon: Layers },
  ];
  const header = getHeaderCopy(activeTab, displayName);

  function selectTab(tab: DashboardTab) {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      <DashboardMobileHeader menuOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen((current) => !current)} menuButtonRef={menuButtonRef} controlsId={navigationId} />
      {mobileMenuOpen && <button type="button" aria-label="Close workspace navigation" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden" />}

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

        <main id="main-content" className="min-w-0 flex-1 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 xl:px-12">
          <div className="mx-auto w-full max-w-[1280px]">
            <DashboardHeader activeLabel={header.label} title={header.title} description={header.description} accountState={accountState} onSupport={() => selectTab("support")} />

            <div className="mt-6 grid gap-3" aria-live="polite">
              {portalData.status === "error" && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  <span>Some account records could not be loaded. Refresh the page or contact support if the issue continues.</span>
                </div>
              )}
              {resultParam === "download-unavailable" && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-900">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
                  <span>Deliverable access could not be generated. Confirm that an administrator has verified the GCash or QRPh payment.</span>
                </div>
              )}
            </div>

            <div className="mt-7">
              {activeTab === "overview" && (
                <OverviewPanel portalData={portalData} verifiedOrders={verifiedOrders.length} availableDownloads={availableDownloads} openSupportCount={openSupportCount} accountState={accountState} userEmail={userEmail} onSelect={selectTab} />
              )}
              {activeTab === "purchases" && <PurchasesPanel orders={portalData.orders} userEmail={userEmail} />}
              {activeTab === "support" && <SupportPanel portalData={portalData} />}
              {activeTab === "wishlist" && <SavedSystemsPanel />}
              {activeTab === "profile" && <ProfilePanel displayName={displayName} userEmail={userEmail} avatarUrl={avatarUrl} username={profile?.username} />}
              {activeTab === "settings" && <SettingsPanel />}
              {activeTab === "products" && isSellerApproved && <SellerProductsPanel />}
              {activeTab === "sales" && isSellerApproved && <SellerSalesPanel />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function OverviewPanel({ portalData, verifiedOrders, availableDownloads, openSupportCount, accountState, userEmail, onSelect }: {
  portalData: CustomerPortalData;
  verifiedOrders: number;
  availableDownloads: number;
  openSupportCount: number;
  accountState: string;
  userEmail: string | null | undefined;
  onSelect: (tab: DashboardTab) => void;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric label="Verified purchases" value={verifiedOrders} detail="Orders confirmed on this account" icon={ShoppingBag} />
        <DashboardMetric label="Available downloads" value={availableDownloads} detail="Eligible protected ZIP packages" icon={Download} />
        <DashboardMetric label="Open support" value={openSupportCount} detail="Requests currently in progress" icon={MessageSquare} />
        <DashboardMetric label="Workspace" value={accountState} detail={userEmail ?? "Provider setup is not connected"} icon={ShieldCheck} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardPanel className="p-5 sm:p-6">
          <SectionHeading eyebrow="Next actions" title="Continue your work" />
          <div className="mt-5 grid gap-2">
            <ActionRow href="/systems" icon={Package} title="Explore ready-made systems" description="Review published features, versions, and licensing details." />
            <ActionRow href="/request-a-quote" icon={ArrowUpRight} title="Plan a custom build" description="Share the workflow and requirements for your project." />
            <ActionRow icon={MessageSquare} title="Request order support" description="Get help with an order, delivery, or system setup." onClick={() => onSelect("support")} />
          </div>
        </DashboardPanel>

        <DashboardPanel className="p-5 sm:p-6">
          <SectionHeading eyebrow="Account records" title="Recent activity" />
          {portalData.orders.length === 0 && portalData.supportRequests.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 px-5 py-10 text-center">
              <p className="text-sm font-semibold text-slate-900">No account activity yet</p>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500 font-medium">Verified orders and support updates will appear here when records are available.</p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-100 border-y border-slate-100">
              {portalData.orders.slice(0, 2).map((order) => (
                <button key={order.order_id} type="button" onClick={() => onSelect("purchases")} className="flex w-full items-center gap-3 py-4 text-left hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <ShoppingBag className="size-4 shrink-0 text-blue-600" />
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900">{order.product_name}</span><span className="mt-1 block text-xs text-slate-500 font-medium">{order.order_number}</span></span>
                  <DashboardStatusBadge status={order.order_status} />
                </button>
              ))}
              {portalData.supportRequests.slice(0, 2).map((request) => (
                <button key={request.id} type="button" onClick={() => onSelect("support")} className="flex w-full items-center gap-3 py-4 text-left hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <MessageSquare className="size-4 shrink-0 text-blue-600" />
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900">{request.subject}</span><span className="mt-1 block text-xs text-slate-500 font-medium">Updated {formatDate(request.updated_at)}</span></span>
                  <ArrowUpRight className="size-4 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </DashboardPanel>
      </div>

      <DashboardPanel className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600"><Lock className="size-4" /></span>
          <div><h2 className="text-sm font-bold text-slate-900">Protected delivery by default</h2><p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600 font-medium">Eligible files use expiring access links. Return to Purchases whenever you need to generate a fresh link.</p></div>
        </div>
        <button type="button" onClick={() => onSelect("purchases")} className="min-h-10 shrink-0 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-2xs">View purchases</button>
      </DashboardPanel>
    </div>
  );
}

function PurchasesPanel({ orders, userEmail }: { orders: CustomerPortalData["orders"]; userEmail: string | null | undefined }) {
  if (orders.length === 0) {
    return <DashboardPanel><DashboardEmptyState icon={ShoppingBag} title="No system purchases yet" description={`Purchases made using ${userEmail ?? "this account"} will appear here after payment verification.`} action={<PrimaryLink href="/systems">Browse ready-made systems</PrimaryLink>} /></DashboardPanel>;
  }

  return (
    <div className="grid gap-5">
      <DashboardPanel className="flex items-start gap-4 p-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600"><Lock className="size-4" /></span>
        <div><h2 className="text-sm font-bold text-slate-900">Protected delivery policy</h2><p className="mt-1 text-xs leading-5 text-slate-600 font-medium">Direct deliverable links expire after one hour. Return here at any time to generate a fresh secure link.</p></div>
      </DashboardPanel>

      {orders.map((order) => (
        <DashboardPanel key={order.order_id} className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div><p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{order.order_number}</p><h2 className="mt-2 text-xl font-bold text-slate-900">{order.product_name}</h2><p className="mt-1 text-xs text-slate-500 font-medium">Purchased version {order.purchased_version}</p></div>
            <DashboardStatusBadge status={order.order_status} />
          </div>
          <dl className="mt-6 grid gap-4 border-y border-slate-100 py-5 text-sm sm:grid-cols-3">
            <OrderDetail label="Total amount" value={formatMoney(order.total_minor, order.currency)} />
            <OrderDetail label="Payment method" value="GCash / QRPh Scan to Pay" />
            <OrderDetail label="File delivery" value={order.delivery_available ? "Unlocked" : order.order_status === "pending_verification" ? "Awaiting verification" : "Locked"} />
          </dl>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/systems/${order.product_slug}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-2xs">View system details <ExternalLink className="size-3.5" /></Link>
            {order.delivery_available && (
              <form action={openPortalDownload.bind(null, order.order_id)}>
                <button type="submit" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white hover:bg-blue-700 shadow-xs"><Download className="size-4" /> Generate one-hour download link</button>
              </form>
            )}
          </div>
        </DashboardPanel>
      ))}
    </div>
  );
}

function SupportPanel({ portalData }: { portalData: CustomerPortalData }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr] xl:items-start">
      <div className="grid gap-5">
        <div><SectionHeading eyebrow="Request history" title="Support activity" /><p className="mt-2 text-sm leading-6 text-slate-600 font-medium">Track requests linked to verified purchases on this account.</p></div>
        <DashboardPanel className="overflow-hidden">
          {portalData.supportRequests.length === 0 ? (
            <DashboardEmptyState icon={MessageSquare} title="No support requests yet" description="Requests you submit for verified purchases will be listed here." />
          ) : (
            <div className="divide-y divide-slate-100">
              {portalData.supportRequests.map((request) => (
                <div key={request.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div><p className="text-sm font-semibold text-slate-900">{request.subject}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-medium"><Clock className="size-3.5" /> Updated {formatDate(request.updated_at)}</p></div>
                  <span className="w-fit rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">{request.status.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          )}
        </DashboardPanel>
      </div>
      <div>
        <SectionHeading eyebrow="New request" title="Contact support" />
        <p className="mt-2 text-sm leading-6 text-slate-600 font-medium">Choose an order and describe the issue without sharing credentials or secret keys.</p>
        <SupportForm appearance="dashboard" orders={portalData.orders.map((order) => ({ id: order.order_id, label: `${order.order_number} - ${order.product_name}` }))} />
      </div>
    </div>
  );
}

function SavedSystemsPanel() {
  return <DashboardPanel><DashboardEmptyState icon={Heart} title="Saved systems are not connected yet" description="This workspace does not claim to sync saved catalog items until the account feature is available. You can continue browsing the published catalog." action={<PrimaryLink href="/systems">Explore the catalog</PrimaryLink>} /></DashboardPanel>;
}

function ProfilePanel({ displayName, userEmail, avatarUrl, username }: { displayName: string; userEmail: string | null | undefined; avatarUrl?: string | null; username?: string }) {
  return (
    <DashboardPanel className="max-w-3xl p-5 sm:p-6">
      <SectionHeading eyebrow="Account record" title="Personal details" />
      <p className="mt-2 text-sm leading-6 text-slate-600 font-medium">These verified profile values are read-only in this workspace.</p>
      
      <div className="mt-6 flex items-center gap-4 border-b border-slate-100 pb-6">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="size-16 rounded-2xl object-cover border border-slate-200/80 shadow-2xs" />
        ) : (
          <span className="grid size-16 place-items-center rounded-2xl bg-[#2563EB] text-xl font-bold text-white shadow-2xs">
            {displayName.charAt(0).toUpperCase()}
          </span>
        )}
        <div>
          <p className="text-base font-bold text-slate-900">{displayName}</p>
          <p className="text-xs font-medium text-slate-500">{userEmail ?? "No email set"}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <ReadOnlyField label="Full name" value={displayName} />
        <ReadOnlyField label="Email address" value={userEmail ?? "Not available"} />
        <ReadOnlyField label="Username" value={username || "Not set"} />
      </div>
    </DashboardPanel>
  );
}

function SettingsPanel() {
  return (
    <DashboardPanel className="max-w-3xl p-5 sm:p-6">
      <SectionHeading eyebrow="Account security" title="Security settings" />
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 font-medium">Use the secure password recovery flow to change your sign-in credentials.</p>
      <div className="mt-6 border-t border-slate-100 pt-5"><Link href="/auth/forgot-password" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm">Change password</Link></div>
    </DashboardPanel>
  );
}

function SellerProductsPanel() {
  return <DashboardPanel><DashboardEmptyState icon={Package} title="No seller products published" description="Published seller records will appear here after seller catalog management is connected." /></DashboardPanel>;
}

function SellerSalesPanel() {
  return <DashboardPanel><DashboardEmptyState icon={Layers} title="No verified sales data available" description="Revenue reporting will appear only after seller orders are connected and verified." /></DashboardPanel>;
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-600">{eyebrow}</p><h2 className="mt-2 text-lg font-bold tracking-[-0.02em] text-slate-900">{title}</h2></div>;
}

function ActionRow({ href, icon: Icon, title, description, onClick }: { href?: string; icon: typeof Package; title: string; description: string; onClick?: () => void }) {
  const content = <><span className="grid size-9 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-900">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-500 font-medium">{description}</span></span><ArrowUpRight className="size-4 shrink-0 text-slate-400" /></>;
  const classes = "flex w-full items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-left transition-colors hover:border-slate-300 hover:bg-slate-100/80";
  return href ? <Link href={href} className={classes}>{content}</Link> : <button type="button" onClick={onClick} className={classes}>{content}</button>;
}

function OrderDetail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold text-slate-500">{label}</dt><dd className="mt-1.5 font-bold text-slate-900">{value}</dd></div>;
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return <label className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span><input disabled value={value} className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-900 disabled:cursor-not-allowed disabled:opacity-100" /></label>;
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm">{children}<ArrowUpRight className="size-4" /></Link>;
}

function getHeaderCopy(tab: DashboardTab, displayName: string) {
  const copy: Record<DashboardTab, { label: string; title: string; description: string }> = {
    overview: { label: "Overview", title: `${displayName}'s workspace`, description: "Track verified purchases, access eligible files, and get help from one focused workspace." },
    purchases: { label: "Purchases", title: "Purchases and protected downloads", description: "Review payment verification, order details, and eligible deliverable access." },
    support: { label: "Support", title: "Support for your systems", description: "Review existing requests or create a new order-linked support ticket." },
    wishlist: { label: "Saved systems", title: "Saved systems", description: "A truthful view of saved-system availability for this account." },
    profile: { label: "Profile", title: "Account profile", description: "Review the identity information currently connected to this workspace." },
    settings: { label: "Settings", title: "Account settings", description: "Manage the security options currently available for this account." },
    products: { label: "Products", title: "Seller products", description: "Review seller catalog availability without showing unverified product activity." },
    sales: { label: "Sales", title: "Sales workspace", description: "Verified seller revenue will appear only after order reporting is connected." },
  };
  return copy[tab];
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(new Date(value));
}
