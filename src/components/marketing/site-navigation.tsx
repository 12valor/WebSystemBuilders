"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/brand/brand-logo";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpRight, User, Menu, X, LayoutDashboard } from "lucide-react";

const navigation = [
  { label: "Systems Catalog", href: "/systems" },
  { label: "Students", href: "/for-students" },
  { label: "Businesses", href: "/for-business" },
  { label: "Process", href: "/process" },
];

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    avatarUrl?: string;
    fullName?: string;
  } | null>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

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
      className="sticky top-3 z-50 mx-auto w-[min(calc(100%-24px),1240px)] md:top-4"
    >
      <div
        className={`relative flex h-16 items-center justify-between gap-4 rounded-full border border-slate-200/80 px-5 backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-200 md:px-7 ${
          scrolled
            ? "bg-white/95 shadow-[0_14px_36px_-14px_rgba(15,23,42,0.16)]"
            : "bg-white/88 shadow-[0_10px_30px_-16px_rgba(15,23,42,0.14)]"
        }`}
      >
        {/* Left: Brand Logo */}
        <Link
          href="/"
          aria-label="WebSystemBuilders home"
          onClick={() => setIsOpen(false)}
          className="shrink-0 group flex items-center gap-2 focus-visible:outline-none"
        >
          <BrandLogo
            priority
            className="size-10 transition-opacity duration-200 group-hover:opacity-85 motion-reduce:transition-none"
          />
        </Link>

        {/* Center: Navigation links use fixed metrics so active state never shifts neighbors. */}
        <nav
          aria-label="Primary navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 xl:flex"
        >
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 select-none motion-reduce:transition-none ${
                  isActive
                    ? "bg-[#2563EB] text-white"
                    : "text-[#0F172A] hover:bg-blue-50 hover:text-[#1D4ED8]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Action Controls */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-slate-800 motion-reduce:transition-none"
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
                  <div className="flex size-full items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs group-hover:scale-105 transition-transform">
                    {user.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="flex shrink-0 items-center gap-2 whitespace-nowrap px-3.5 py-2 text-sm font-semibold text-[#0F172A] transition-colors hover:text-[#2563EB] motion-reduce:transition-none"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Sign In</span>
              </Link>

              <Link
                href="/request-a-quote"
                className="blue-button inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-[#2563EB] px-5 text-sm font-semibold text-white motion-reduce:transition-none"
              >
                <span>Request a Quote</span>
                <ArrowUpRight className="w-4 h-4" />
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
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
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
                        <div className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
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
                      className="blue-button flex h-12 w-full items-center justify-center gap-2 bg-[#2563EB] px-6 text-base font-semibold text-white"
                    >
                      <span>Request a Quote</span>
                      <ArrowUpRight className="w-4.5 h-4.5" />
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


