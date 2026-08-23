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
        className="bg-slate-950 text-slate-200 border-b border-slate-800/80 px-3.5 py-2.5 sm:px-6 md:py-2 shadow-xs"
      >
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-2.5">
          {/* Main Notice Content */}
          <div className="flex grow items-start gap-2.5 sm:items-center sm:justify-center">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 max-sm:mt-0.5">
              <Construction
                className="size-3.5 shrink-0"
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </span>

            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
              <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                <strong className="font-semibold text-white">This website is still in development.</strong>{" "}
                <span className="text-slate-300">
                  Some features and content may still be updated as we continue improving the experience.
                </span>
              </p>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-6 rounded-full border-slate-700 bg-slate-900/90 px-2.5 text-[11px] font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 hover:text-white sm:h-7 sm:px-3 sm:text-xs"
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
            className="group -mr-1 flex size-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X
              className="size-4 opacity-70 transition-opacity group-hover:opacity-100"
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
 * Standard BannerCenteredButton export as requested in the specification.
 */
export function BannerCenteredButton() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Banner variant="muted" className="dark text-foreground md:py-2">
      <div className="flex w-full gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center md:justify-center">
          <Construction
            className="shrink-0 opacity-60 max-md:mt-0.5"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />

          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <p className="text-sm">
              <strong>This website is still in development.</strong>{" "}
              Some features and content may still be updated as we continue improving the experience.
            </p>

            <div className="flex gap-2 max-md:flex-wrap">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-full"
              >
                <Link href="/about">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => setIsVisible(false)}
          aria-label="Close development notice"
        >
          <X
            size={16}
            strokeWidth={2}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </Banner>
  );
}
