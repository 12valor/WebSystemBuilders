"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteContentBlock } from "@/features/content/site-content-types";
import { Sparkles, ArrowRight, X } from "lucide-react";

export function AnnouncementBar({ announcement }: { announcement: SiteContentBlock | null }) {
  const [visible, setVisible] = useState(true);
  if (!announcement || !visible) return null;
  return (
    <aside aria-label="Announcement" className="relative bg-slate-900 px-4 py-2 text-xs font-semibold text-white border-b border-slate-800">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-2 text-center text-slate-200">
        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span>{announcement.title}</span>
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
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
