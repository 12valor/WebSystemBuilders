"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";

// Turnstile Window API Declarations
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          action?: string;
          callback?: (token: string) => void;
          "error-callback"?: (errorCode?: string) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

// Cloudflare sitekey default
const CLOUDFLARE_SITE_KEY = "0x4AAAAAAEAePr_u0WZWa_bF";
const CLOUDFLARE_TEST_SITE_KEY = "1x00000000000000000000AA";

export interface TurnstileCaptchaRef {
  reset: () => void;
}

export interface TurnstileCaptchaProps {
  siteKey?: string;
  action?: string;
  onVerify: (token: string) => void;
  onError?: (error?: string) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  className?: string;
}

export const TurnstileCaptcha = forwardRef<TurnstileCaptchaRef, TurnstileCaptchaProps>(
  function TurnstileCaptcha(
    { siteKey, action = "turnstile-spin-v2", onVerify, onError, onExpire, theme = "light", size = "normal", className = "" },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDevFallback, setIsDevFallback] = useState(false);

    // Determine effective site key
    const configuredKey = siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const effectiveSiteKey = configuredKey || CLOUDFLARE_SITE_KEY || CLOUDFLARE_TEST_SITE_KEY;

    useEffect(() => {
      if (!configuredKey && process.env.NODE_ENV !== "production") {
        setIsDevFallback(true);
      }
    }, [configuredKey]);

    // Imperative handle for parent resetting (e.g. after form error)
    useImperativeHandle(ref, () => ({
      reset: () => {
        if (window.turnstile && widgetIdRef.current) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch {
            // Safe fallback if widget was re-rendered
          }
        }
      },
    }));

    useEffect(() => {
      let isMounted = true;

      const renderWidget = () => {
        if (!containerRef.current || !window.turnstile) return;

        // Clean up any existing widget instance before re-rendering
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Ignore removal errors
          }
          widgetIdRef.current = null;
        }

        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: effectiveSiteKey,
            action,
            callback: (token: string) => {
              if (isMounted) onVerify(token);
            },
            "error-callback": (errCode?: string) => {
              if (isMounted && onError) onError(errCode || "CAPTCHA verification failed.");
            },
            "expired-callback": () => {
              if (isMounted && onExpire) onExpire();
            },
            theme,
            size,
          });

          widgetIdRef.current = id;
          if (isMounted) setIsLoaded(true);
        } catch {
          if (isMounted && onError) {
            onError("Unable to initialize CAPTCHA widget.");
          }
        }
      };

      // Check if script is already present or loaded
      if (window.turnstile) {
        renderWidget();
        return () => {
          isMounted = false;
          if (window.turnstile && widgetIdRef.current) {
            try {
              window.turnstile.remove(widgetIdRef.current);
            } catch {
              // Ignore cleanup error
            }
          }
        };
      }

      // Inject Cloudflare Turnstile API script if not already present
      const scriptId = "cf-turnstile-script";
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;

      const handleScriptLoad = () => {
        if (isMounted) renderWidget();
      };

      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = handleScriptLoad;
        document.head.appendChild(script);
      } else {
        script.addEventListener("load", handleScriptLoad);
      }

      return () => {
        isMounted = false;
        if (script) {
          script.removeEventListener("load", handleScriptLoad);
        }
        if (window.turnstile && widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Ignore cleanup error
          }
        }
      };
    }, [effectiveSiteKey, action, theme, size, onVerify, onError, onExpire]);

    return (
      <div className={`flex flex-col items-center justify-center space-y-2 py-2 ${className}`}>
        {isDevFallback && (
          <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-[11px] font-medium text-amber-800">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
              Development CAPTCHA Mode
            </span>
            <span className="text-[10px] text-amber-600 font-mono">Using test sitekey</span>
          </div>
        )}

        <div
          className="min-h-[65px] min-w-[300px] flex items-center justify-center rounded-xl bg-slate-50/50 p-1 border border-slate-100 transition-all"
        >
          <div
            ref={containerRef}
            className="cf-turnstile"
            data-sitekey={effectiveSiteKey}
            data-action={action}
          />
          {!isLoaded && (
            <div className="text-xs text-slate-400 font-medium flex items-center gap-2 py-4">
              <svg className="size-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Loading security check...</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);
