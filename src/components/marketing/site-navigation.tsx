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
      setScrolled(window.scrollY > 10);
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
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 flex w-full justify-center pointer-events-none"
    >
      <div className="relative w-[min(calc(100%-16px),1180px)] flex justify-center">
        {/* TOP MACBOOK NOTCH / TAB CONTAINER (BLACK THEME) */}
        <div
          className={`pointer-events-auto relative flex h-14 md:h-15 w-full items-center justify-between gap-4 rounded-b-2xl md:rounded-b-[22px] border-b border-x border-white/[0.12] px-4 sm:px-6 md:px-7 backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-200 ${
            scrolled
              ? "bg-[#07080A]/96 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
              : "bg-[#0B0C0E]/94 shadow-[0_12px_32px_-14px_rgba(0,0,0,0.5)]"
          }`}
        >
          {/* LEFT INVERTED FILLET (Concave ear transition to top edge) */}
          <svg
            viewBox="0 0 20 20"
            className="absolute -left-[20px] top-0 size-5 text-[#0B0C0E] transition-colors pointer-events-none"
            aria-hidden="true"
          >
            <path
              d="M 0 0 A 20 20 0 0 1 20 20 V 0 H 0 Z"
              fill="currentColor"
              className={scrolled ? "fill-[#07080A]/96" : "fill-[#0B0C0E]/94"}
            />
            <path
              d="M 0 0 A 20 20 0 0 1 20 20"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          </svg>

          {/* RIGHT INVERTED FILLET (Concave ear transition to top edge) */}
          <svg
            viewBox="0 0 20 20"
            className="absolute -right-[20px] top-0 size-5 text-[#0B0C0E] transition-colors pointer-events-none"
            aria-hidden="true"
          >
            <path
              d="M 0 20 A 20 20 0 0 1 20 0 H 0 V 20 Z"
              fill="currentColor"
              className={scrolled ? "fill-[#07080A]/96" : "fill-[#0B0C0E]/94"}
            />
            <path
              d="M 0 20 A 20 20 0 0 1 20 0"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          </svg>

          {/* Left: Brand Logo */}
          <Link
            href="/"
            aria-label="WebSystemBuilders home"
            onClick={() => setIsOpen(false)}
            className="shrink-0 group flex items-center gap-2.5 focus-visible:outline-none"
          >
            <BrandLogo
              onDark
              priority
              className="size-8 transition-opacity duration-200 group-hover:opacity-85 motion-reduce:transition-none"
            />
          </Link>

          {/* Center: Navigation links */}
          <nav
            aria-label="Primary navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 xl:flex"
          >
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs sm:text-[13px] font-semibold transition-colors duration-200 select-none motion-reduce:transition-none ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-[#94A3B8] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Action Controls */}
          <div className="hidden shrink-0 items-center gap-2.5 xl:flex">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-4 text-xs sm:text-[13px] font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-white/20 motion-reduce:transition-none"
                >
                  <LayoutDashboard className="size-3.5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/account"
                  title={user.fullName || "Account Profile"}
                  aria-label="View Account Profile"
                  className="group relative flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 p-0.5 shadow-2xs transition-all duration-200 hover:border-blue-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || "Account profile"}
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-2xs group-hover:scale-105 transition-transform">
                      {user.email ? (
                        user.email.charAt(0).toUpperCase()
                      ) : (
                        <User className="size-3.5 text-white" />
                      )}
                    </div>
                  )}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs sm:text-[13px] font-semibold text-[#CBD5E1] transition-colors hover:text-white motion-reduce:transition-none"
                >
                  <User className="size-3.5 text-[#94A3B8]" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/request-a-quote"
                  className="blue-button inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap bg-[#2563EB] px-4 text-xs sm:text-[13px] font-semibold text-white transition-all hover:bg-[#1D4ED8] motion-reduce:transition-none"
                >
                  <span>Request a Quote</span>
                  <ArrowUpRight className="size-3.5" />
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
            className="relative ml-auto grid size-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-2xs hover:bg-white/20 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 xl:hidden"
          >
            {isOpen ? (
              <X className="size-4.5 text-white" />
            ) : (
              <Menu className="size-4.5 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Animated Dropdown (Black Theme) */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile navigation"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{
                duration: reduceMotion ? 0 : 0.22,
                ease: "easeOut",
              }}
              className="pointer-events-auto absolute top-full left-0 right-0 mt-2 max-h-[calc(100dvh-96px)] overflow-y-auto overscroll-contain rounded-3xl border border-white/[0.12] bg-[#0B0C0E]/98 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.7)] xl:hidden"
            >
              <div className="grid gap-1.5">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`group flex min-h-[48px] items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-[#2563EB] text-white shadow-sm"
                          : "text-[#CBD5E1] hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight
                        className={`size-4.5 transition-colors duration-150 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-white"
                        }`}
                      />
                    </Link>
                  );
                })}
                <div className="mt-3 pt-4 border-t border-white/10 flex flex-col gap-3">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-[48px] items-center justify-center gap-2 w-full px-6 text-base font-semibold text-white rounded-2xl bg-white/10 border border-white/15 shadow-sm hover:bg-white/20 transition-colors"
                      >
                        <LayoutDashboard className="size-4.5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-[48px] items-center gap-3 px-4 py-2.5 text-base font-semibold text-[#CBD5E1] hover:bg-white/10 rounded-2xl transition-colors"
                      >
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName || "Account profile"}
                            className="size-8 rounded-full object-cover border border-white/20"
                          />
                        ) : (
                          <div className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-2xs">
                            {user.email ? (
                              user.email.charAt(0).toUpperCase()
                            ) : (
                              <User className="size-4 text-white" />
                            )}
                          </div>
                        )}
                        <span className="truncate text-white">
                          {user.fullName || user.email || "My Account"}
                        </span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/sign-in"
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-[48px] items-center gap-2.5 px-4 py-2.5 text-base font-semibold text-[#CBD5E1] hover:bg-white/10 rounded-2xl transition-colors"
                      >
                        <User className="size-4.5 text-[#94A3B8]" />
                        <span>Account Login</span>
                      </Link>
                      <Link
                        href="/request-a-quote"
                        onClick={() => setIsOpen(false)}
                        className="blue-button flex min-h-[48px] w-full items-center justify-center gap-2 bg-[#2563EB] px-6 text-base font-semibold text-white"
                      >
                        <span>Request a Quote</span>
                        <ArrowUpRight className="size-4.5" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
