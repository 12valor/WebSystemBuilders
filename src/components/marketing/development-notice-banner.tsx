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
        className="relative overflow-hidden border-b border-slate-200/80 bg-white px-3.5 py-2 text-slate-900 shadow-2xs sm:px-6 md:py-2"
      >
        {/* Soft moving blue ambient glow and specular highlight (stays behind text and controls) */}
        <div className="development-banner-glow" aria-hidden="true" />
        <div className="development-banner-highlight" aria-hidden="true" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] items-center justify-between gap-2.5">
          {/* Main Notice Content */}
          <div className="flex grow items-start gap-2.5 sm:items-center sm:justify-center">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-600 max-sm:mt-0.5">
              <Construction
                className="size-3.5 shrink-0"
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </span>

            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
              <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                <strong className="font-semibold text-slate-900">This website is still in development.</strong>{" "}
                <span className="text-slate-600">
                  Some features and content may still be updated as we continue improving the experience.
                </span>
              </p>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-6 rounded-full border-slate-200/90 bg-white/90 px-2.5 text-[11px] font-medium text-slate-700 shadow-2xs transition-colors hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700 sm:h-7 sm:px-3 sm:text-xs"
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
            className="group -mr-1 flex size-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
 * Standard BannerCenteredButton export in light mode with distinct moving blue accent.
 */
export function BannerCenteredButton() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Banner
      variant="border"
      className="relative overflow-hidden border-b border-slate-200/80 bg-white px-3.5 py-2 text-slate-900 shadow-2xs md:py-2"
    >
      <div className="development-banner-glow" aria-hidden="true" />
      <div className="development-banner-highlight" aria-hidden="true" />

      <div className="relative z-10 flex w-full gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center md:justify-center">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-600 max-md:mt-0.5">
            <Construction
              className="size-3.5 shrink-0"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>

          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <p className="text-sm text-slate-600">
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
                className="rounded-full border-slate-200/90 bg-white/90 text-slate-700 shadow-2xs hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700"
              >
                <Link href="/about">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          onClick={() => setIsVisible(false)}
          aria-label="Close development notice"
        >
          <X
            size={16}
            strokeWidth={2}
            className="opacity-70 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </Banner>
  );
}
