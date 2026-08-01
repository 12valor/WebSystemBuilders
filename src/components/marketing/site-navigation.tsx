"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/brand/brand-logo";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpRight, User, Menu, X, Sparkles, LayoutDashboard } from "lucide-react";

const navigation = [
  { label: "Systems Catalog", href: "/systems" },
  { label: "Students", href: "/for-students" },
  { label: "Businesses", href: "/for-business" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Process", href: "/process" },
];

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    avatarUrl?: string;
    fullName?: string;
  } | null>(null);
  const pathname = usePathname();

  // Reset hover state and mobile menu whenever pathname changes
  useEffect(() => {
    setHoveredHref(null);
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          let avatarUrl: string | undefined =
            data.user.user_metadata?.avatar_url ||
            data.user.user_metadata?.picture ||
            data.user.user_metadata?.avatar;

          const fullName: string | undefined =
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name;

          // Fetch real profile avatar_url and full_name from database profiles table
          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("avatar_url, full_name")
            .eq("user_id", data.user.id)
            .maybeSingle();

          if (dbProfile?.avatar_url) {
            avatarUrl = dbProfile.avatar_url;
          }

          setUser({
            id: data.user.id,
            email: data.user.email,
            avatarUrl,
            fullName: dbProfile?.full_name || fullName,
          });
        }
      } catch {
        // ignore
      }
    }
    checkAuth();
  }, []);

  return (
    <header
      className={`sticky z-50 mx-auto w-[min(calc(100%-24px),1240px)] transition-all duration-300 ${
        scrolled ? "top-2 md:top-3" : "top-4 md:top-6"
      }`}
    >
      <div
        className={`flex items-center justify-between gap-4 rounded-full bg-white/85 px-6 md:px-8 backdrop-blur-xl border border-slate-200/80 transition-all duration-300 ${
          scrolled
            ? "h-[60px] shadow-[0_16px_45px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] bg-white/92 backdrop-blur-2xl"
            : "h-[68px] shadow-[0_12px_40px_-10px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset]"
        }`}
      >
        {/* Left: Brand Logo */}
        <Link
          href="/"
          aria-label="WebSystemBuilders home"
          className="shrink-0 group flex items-center gap-2 focus-visible:outline-none"
        >
          <BrandLogo
            variant="light"
            priority
            className="size-11 transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Center: Navigation Links with Animated Solid Blue Pill Indicator */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 xl:flex relative"
          onMouseLeave={() => setHoveredHref(null)}
        >
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            const isHovered = hoveredHref === item.href;
            const isHighlighted = isHovered || (isActive && !hoveredHref);

            return (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredHref(item.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full select-none ${
                  isHighlighted
                    ? "text-white font-semibold"
                    : isActive
                    ? "text-[#2563EB] font-semibold"
                    : "text-[#0F172A]"
                }`}
              >
                {/* Solid Blue Animated Pill Background */}
                {isHighlighted && (
                  <motion.span
                    layoutId="nav-blue-pill"
                    className="absolute inset-0 rounded-full bg-[#2563EB] -z-10 shadow-[0_4px_14px_0_rgba(37,99,235,0.35)]"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}

                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Action Controls */}
        <div className="hidden items-center gap-3 xl:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-5 h-10 text-sm font-semibold text-white rounded-full bg-slate-900 shadow-sm hover:bg-slate-800 transition-all duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/account"
                title={user.fullName || "Account Profile"}
                aria-label="View Account Profile"
                className="group relative flex size-10 items-center justify-center rounded-full border border-slate-200/90 bg-slate-100 p-0.5 shadow-xs transition-all duration-200 hover:border-blue-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName || "Account profile"}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xs group-hover:scale-105 transition-transform">
                    {user.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-[#0F172A] hover:text-[#2563EB] transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Sign In</span>
              </Link>

              <Link
                href="/request-a-quote"
                className="inline-flex items-center justify-center gap-2 px-6 h-11 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] shadow-[0_8px_22px_-4px_rgba(37,99,235,0.38)] hover:shadow-[0_12px_28px_-4px_rgba(37,99,235,0.48)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
              >
                <span>Request a Quote</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((open) => !open)}
          className="relative ml-auto grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-xs hover:bg-slate-50 active:scale-95 transition-all xl:hidden"
        >
          {isOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
        </button>
      </div>

      {/* Mobile Animated Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-3 rounded-3xl border border-slate-200/90 bg-white/95 p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] xl:hidden"
          >
            <div className="grid gap-1.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "text-[#0F172A] hover:bg-[#2563EB] hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className={`w-4.5 h-4.5 transition-colors duration-150 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                  </Link>
                );
              })}
              <div className="mt-3 pt-4 border-t border-slate-100 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-6 h-12 text-base font-semibold text-white rounded-2xl bg-slate-900 shadow-sm"
                    >
                      <LayoutDashboard className="w-4.5 h-4.5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-[#0F172A] hover:bg-slate-50 rounded-2xl"
                    >
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName || "Account profile"}
                          className="size-8 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                          {user.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
                        </div>
                      )}
                      <span className="truncate">{user.fullName || user.email || "My Account"}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-in"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-base font-semibold text-[#0F172A] hover:bg-slate-50 rounded-2xl"
                    >
                      <User className="w-4.5 h-4.5 text-slate-500" />
                      <span>Account Login</span>
                    </Link>
                    <Link
                      href="/request-a-quote"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-6 h-12 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] shadow-md"
                    >
                      <span>Request a Quote</span>
                      <Sparkles className="w-4.5 h-4.5" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}


