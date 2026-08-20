"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteContentBlock } from "@/features/content/site-content-types";
import { Sparkles, ArrowRight, X } from "lucide-react";

export function AnnouncementBar({ announcement }: { announcement: SiteContentBlock | null }) {
  const [visible, setVisible] = useState(true);
  if (!announcement || !visible) return null;
  return (
    <aside aria-label="Announcement" className="relative bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white border-b border-slate-800">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-2 pr-8 text-center text-slate-200 sm:pr-0">
        <span className="flex h-2 w-2 shrink-0 rounded-full bg-blue-500 animate-pulse" />
        <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="leading-snug">{announcement.title}</span>
        {announcement.actionLabel && announcement.actionHref && (
          <Link
            href={announcement.actionHref}
            className="inline-flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300 transition-colors ml-1"
          >
            <span>{announcement.actionLabel}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => setVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
