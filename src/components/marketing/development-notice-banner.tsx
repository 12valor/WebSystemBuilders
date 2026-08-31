"use client";

import Link from "next/link";
import { useState } from "react";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Construction, X } from "lucide-react";

export interface DevelopmentNoticeBannerProps {
  learnMoreHref?: string;
  onClose?: () => void;
}

export function DevelopmentNoticeBanner({
  learnMoreHref = "/about",
  onClose,
}: DevelopmentNoticeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <aside aria-label="Development Notice" className="w-full">
      <Banner
        variant="border"
        className="relative overflow-hidden border-b border-slate-200/60 bg-transparent px-3 py-1 sm:px-6 sm:py-1 text-slate-900 shadow-none"
      >
        <div className="relative z-10 mx-auto flex w-full items-center justify-center">
          {/* Main Notice Content + Close Button together */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex size-5 shrink-0 items-center justify-center rounded border border-blue-200/80 bg-blue-50/80 text-blue-600">
              <Construction
                className="size-3 shrink-0"
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </span>

            <div className="flex items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-slate-600 min-w-0 flex-wrap sm:flex-nowrap">
              <p className="leading-snug truncate sm:truncate-none">
                <strong className="font-semibold text-slate-900">This website is in development.</strong>{" "}
                <span className="hidden sm:inline text-slate-600">
                  Some features and content may still be updated.
                </span>
              </p>

              <div className="flex shrink-0 items-center">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-5 rounded-full border-slate-200/80 bg-white/80 px-2 text-[10.5px] font-medium text-slate-700 shadow-2xs backdrop-blur-xs transition-colors hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700"
                >
                  <Link href={learnMoreHref}>Learn more</Link>
                </Button>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              aria-label="Close development notice"
              onClick={handleDismiss}
              className="group ml-0.5 flex size-5 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X
                className="size-3.5 opacity-70 transition-opacity group-hover:opacity-100"
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </Banner>
    </aside>
  );
}

/**
 * Standard BannerCenteredButton export in clean compact transparent mode.
 */
export function BannerCenteredButton() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Banner
      variant="border"
      className="relative overflow-hidden border-b border-slate-200/60 bg-transparent px-3 py-1 sm:px-6 sm:py-1 text-slate-900 shadow-none"
    >
      <div className="relative z-10 flex w-full items-center justify-center">
        <div className="flex gap-2 items-center min-w-0">
          <span className="flex size-5 shrink-0 items-center justify-center rounded border border-blue-200/80 bg-blue-50/80 text-blue-600">
            <Construction
              className="size-3 shrink-0"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs min-w-0">
            <p className="text-slate-600 leading-snug truncate sm:truncate-none">
              <strong className="font-semibold text-slate-900">This website is in development.</strong>{" "}
              <span className="hidden sm:inline">
                Some features and content may still be updated.
              </span>
            </p>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-5 rounded-full border-slate-200/80 bg-white/80 px-2 text-[10.5px] text-slate-700 shadow-2xs hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700 shrink-0"
            >
              <Link href="/about">Learn more</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            className="group ml-0.5 size-5 shrink-0 p-0 text-slate-400 hover:bg-transparent hover:text-slate-700"
            onClick={() => setIsVisible(false)}
            aria-label="Close development notice"
          >
            <X
              className="size-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </Banner>
  );
}
