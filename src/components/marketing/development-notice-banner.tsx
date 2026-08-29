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
    <aside aria-label="Development Notice">
      <Banner
        variant="border"
        className="relative overflow-hidden border-b border-slate-200/60 bg-transparent px-3.5 py-1 text-slate-900 shadow-none sm:px-6"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between gap-2">
          {/* Main Notice Content */}
          <div className="flex grow items-center gap-2 sm:justify-center">
            <span className="flex size-5 shrink-0 items-center justify-center rounded border border-blue-200/80 bg-blue-50/80 text-blue-600">
              <Construction
                className="size-3 shrink-0"
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </span>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600">
              <p className="leading-normal">
                <strong className="font-semibold text-slate-900">This website is still in development.</strong>{" "}
                <span className="text-slate-600">
                  Some features and content may still be updated as we continue improving the experience.
                </span>
              </p>

              <div className="flex shrink-0 items-center gap-1.5">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-5.5 rounded-full border-slate-200/80 bg-white/70 px-2.5 text-[11px] font-medium text-slate-700 shadow-2xs backdrop-blur-xs transition-colors hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700"
                >
                  <Link href={learnMoreHref}>Learn more</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            aria-label="Close development notice"
            onClick={handleDismiss}
            className="group -mr-1 flex size-6 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X
              className="size-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
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
      className="relative overflow-hidden border-b border-slate-200/60 bg-transparent px-3.5 py-1 text-slate-900 shadow-none"
    >
      <div className="relative z-10 flex w-full gap-2 md:items-center">
        <div className="flex grow gap-2.5 md:items-center md:justify-center">
          <span className="flex size-5 shrink-0 items-center justify-center rounded border border-blue-200/80 bg-blue-50/80 text-blue-600">
            <Construction
              className="size-3 shrink-0"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>

          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center text-xs">
            <p className="text-slate-600 leading-normal">
              <strong className="font-semibold text-slate-900">This website is still in development.</strong>{" "}
              <span>
                Some features and content may still be updated as we continue improving the experience.
              </span>
            </p>

            <div className="flex gap-2 max-md:flex-wrap">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-5.5 rounded-full border-slate-200/80 bg-white/70 px-2.5 text-[11px] text-slate-700 shadow-2xs hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700"
              >
                <Link href="/about">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="group -my-1 -me-1 size-6 shrink-0 p-0 text-slate-400 hover:bg-transparent hover:text-slate-700"
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
    </Banner>
  );
}
