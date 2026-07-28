"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-[#121316] text-[#A1A1AA] opacity-0 animate-in fade-in-0 zoom-in-90 duration-200 hover:border-white/30 hover:bg-[#1C1D22] hover:text-[#F5F5F7] hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090A]"
      aria-label="Back to top"
      title="Back to top"
    >
      <ChevronUp className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5" />
    </button>
  );
}
