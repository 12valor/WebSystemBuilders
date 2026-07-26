"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SellerOnboardingModal } from "@/components/dashboard/seller-onboarding-modal";
import { createClient } from "@/lib/supabase/client";

export default function UnifiedDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [profile, setProfile] = useState<{
    full_name?: string;
    email?: string;
    username?: string;
    seller_status?: string;
    seller_enabled?: boolean;
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, username, seller_status, seller_enabled")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          full_name: data.full_name || authData.user.user_metadata?.full_name,
          email: data.email || authData.user.email,
          username: data.username,
          seller_status: data.seller_status || "none",
          seller_enabled: data.seller_enabled || false,
        });
      } else {
        setProfile({
          full_name: authData.user.user_metadata?.full_name,
          email: authData.user.email,
          seller_status: "none",
          seller_enabled: false,
        });
      }
    }

    loadProfile();
  }, []);

  const isSellerApproved = profile?.seller_status === "approved" && profile?.seller_enabled === true;
  const isSellerPending = profile?.seller_status === "pending_review";

  const buyerNav = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "purchases", label: "My Purchases", icon: "📦" },
    { id: "wishlist", label: "Wishlist", icon: "❤️" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const sellerNav = [
    { id: "products", label: "Products", icon: "💻" },
    { id: "sales", label: "Sales", icon: "💰" },
    { id: "orders", label: "Seller Orders", icon: "📋" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "payouts", label: "Payouts", icon: "🏦" },
    { id: "customers", label: "Customers", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-slate-200 bg-white p-6 flex flex-col justify-between shrink-0">
        <div>
          <Link href="/">
            <BrandLogo priority className="h-auto w-40" />
          </Link>

          {/* User badge */}
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
            <div className="size-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{profile?.full_name || "Developer"}</p>
              <p className="text-[0.68rem] text-slate-500 truncate">@{profile?.username || "user"}</p>
            </div>
          </div>

          {/* Buyer Navigation */}
          <nav className="mt-6 space-y-1">
            <span className="px-3 text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">Buyer Workspace</span>
            {buyerNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {/* Dynamic Seller Navigation (Revealed when approved) */}
            {isSellerApproved && (
              <div className="pt-4 space-y-1 border-t border-slate-100 mt-4">
                <span className="px-3 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-600">Seller Workspace</span>
                {sellerNav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                      activeTab === item.id
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Seller Action Button */}
        <div className="pt-6 border-t border-slate-100 mt-6">
          {isSellerApproved ? (
            <span className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200/60 py-2.5 text-xs font-bold text-emerald-700">
              ✓ Verified Seller
            </span>
          ) : isSellerPending ? (
            <span className="inline-flex w-full items-center justify-center rounded-xl bg-amber-50 border border-amber-200/60 py-2.5 text-xs font-bold text-amber-700">
              ⏳ Application Pending
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setIsSellerModalOpen(true)}
              className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-blue-600 transition"
            >
              💻 Become a Seller
            </button>
          )}

          <Link
            href="/auth/sign-out"
            className="mt-3 block text-center text-xs font-semibold text-slate-400 hover:text-red-600 transition"
          >
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl">
        {/* Banner for Pending Sellers */}
        {isSellerPending && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center justify-between">
            <div>
              <span className="font-bold">Seller Application Under Review:</span> Our team is reviewing your developer profile. Once approved, your seller features (Products, Payouts, Sales) will unlock automatically.
            </div>
            <span className="rounded-full bg-amber-200 px-2.5 py-1 font-bold text-[0.68rem]">Pending</span>
          </div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="text-xs text-slate-500 mt-1">Welcome to your WebSystemBuilders command center.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400">Total Purchases</span>
                  <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400">Saved Wishlist</span>
                  <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="text-xs font-semibold text-slate-400">Account Role</span>
                  <p className="mt-2 text-xl font-bold text-blue-600">
                    {isSellerApproved ? "Buyer & Seller" : "Buyer"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "purchases" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Purchases</h1>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                You haven&apos;t purchased any web systems yet. <Link href="/systems" className="font-bold text-blue-600 hover:underline">Browse Marketplace</Link>
              </div>
            </div>
          )}

          {activeTab === "products" && isSellerApproved && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">My Products</h1>
                <button type="button" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-blue-700">
                  + Publish New Product
                </button>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
                No products published yet. Click &quot;Publish New Product&quot; to list your web system.
              </div>
            </div>
          )}

          {activeTab === "sales" && isSellerApproved && (
            <div className="space-y-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Sales & Revenue</h1>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-xs font-semibold text-slate-400">Total Revenue (PHP)</span>
                <p className="mt-2 text-3xl font-bold text-emerald-600">₱0.00</p>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Seller Application Modal */}
      <SellerOnboardingModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />
    </div>
  );
}
