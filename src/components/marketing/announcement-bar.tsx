"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteContentBlock } from "@/features/content/site-content-types";

export function AnnouncementBar({ announcement }: { announcement: SiteContentBlock | null }) {
  const [visible, setVisible] = useState(true);
  if (!announcement || !visible) return null;
  return (
    <aside aria-label="Announcement" className="relative border-b border-blue-300/15 bg-[#0b1b36] px-5 py-2.5 text-sm">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-3 pr-8 text-center text-blue-50">
        <p>{announcement.title}</p>
        {announcement.actionLabel && announcement.actionHref && <Link href={announcement.actionHref} className="shrink-0 font-semibold text-brand-hover underline decoration-blue-300/30 underline-offset-4">{announcement.actionLabel}</Link>}
      </div>
      <button type="button" aria-label="Dismiss announcement" onClick={() => setVisible(false)} className="absolute right-3 top-1.5 grid size-8 place-items-center rounded-md text-blue-100 hover:bg-white/10">×</button>
    </aside>
  );
}
