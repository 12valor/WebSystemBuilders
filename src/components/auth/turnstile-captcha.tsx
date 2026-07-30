"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const CLOUDFLARE_TEST_SITE_KEY = "1x00000000000000000000AA";
const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";
const TURNSTILE_SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const DEV_PASS_TOKEN = "DEV_PASS_TOKEN";

type WidgetStatus = "loading" | "ready" | "verified" | "error" | "development";

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
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

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
    {
      siteKey,
      action = "turnstile-spin-v2",
      onVerify,
      onError,
      onExpire,
      theme = "light",
      size = "flexible",
      className = "",
    },
    ref,
  ) {
    const configuredKey = siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const isDevelopment = process.env.NODE_ENV !== "production";
    const effectiveSiteKey = configuredKey || CLOUDFLARE_TEST_SITE_KEY;
    const initialStatus: WidgetStatus = isDevelopment
      ? "development"
      : configuredKey
        ? "loading"
        : "error";

    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const onVerifyRef = useRef(onVerify);
    const onErrorRef = useRef(onError);
    const onExpireRef = useRef(onExpire);
    const [status, setStatus] = useState<WidgetStatus>(initialStatus);
    const [errorMessage, setErrorMessage] = useState<string | null>(
      configuredKey ? null : "Security verification is not configured on this environment.",
    );
    const [retryKey, setRetryKey] = useState(0);

    onVerifyRef.current = onVerify;
    onErrorRef.current = onError;
    onExpireRef.current = onExpire;

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (isDevelopment) {
          onVerifyRef.current(DEV_PASS_TOKEN);
          return;
        }

        if (window.turnstile && widgetIdRef.current) {
          try {
            window.turnstile.reset(widgetIdRef.current);
            setStatus("ready");
            setErrorMessage(null);
          } catch {
            setStatus("error");
            setErrorMessage("The security check could not be reset. Please retry it.");
          }
        }
      },
    }));

    const renderWidget = useCallback(() => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) {
        return false;
      }

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: effectiveSiteKey,
          action,
          callback: (token: string) => {
            setStatus("verified");
            setErrorMessage(null);
            onVerifyRef.current(token);
          },
          "error-callback": (errorCode?: string) => {
            const message = errorCode
              ? `Security verification failed (${errorCode}). Please retry.`
              : "Security verification failed. Please retry.";
            setStatus("error");
            setErrorMessage(message);
            onErrorRef.current?.(message);
          },
          "expired-callback": () => {
            onExpireRef.current?.();
          },
          theme,
          size,
        });
        setStatus("ready");
        return true;
      } catch {
        const message = "Unable to initialize the security check. Please retry.";
        setStatus("error");
        setErrorMessage(message);
        onErrorRef.current?.(message);
        return false;
      }
    }, [action, effectiveSiteKey, size, theme]);

    useEffect(() => {
      if (isDevelopment) {
        onVerifyRef.current(DEV_PASS_TOKEN);
        return;
      }

      if (!configuredKey) {
        onErrorRef.current?.("Security verification is not configured on this environment.");
        return;
      }

      let active = true;
      const timers: {
        poll?: ReturnType<typeof setInterval>;
        timeout?: ReturnType<typeof setTimeout>;
      } = {};
      const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
      const script = existingScript ?? document.createElement("script");

      const tryRender = () => {
        if (active && window.turnstile && renderWidget()) {
          if (timers.poll) clearInterval(timers.poll);
          if (timers.timeout) clearTimeout(timers.timeout);
        }
      };

      const handleScriptError = () => {
        if (!active) return;
        const message = "The security check could not load. Check your connection and retry.";
        setStatus("error");
        setErrorMessage(message);
        onErrorRef.current?.(message);
      };

      if (!existingScript) {
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener("load", tryRender);
      script.addEventListener("error", handleScriptError);

      if (window.turnstile) {
        tryRender();
      } else {
        timers.poll = setInterval(tryRender, 100);
      }

      timers.timeout = setTimeout(() => {
        if (!active || widgetIdRef.current) return;
        const message = "The security check took too long to load. Please retry.";
        setStatus("error");
        setErrorMessage(message);
        onErrorRef.current?.(message);
        if (timers.poll) clearInterval(timers.poll);
      }, 8000);

      return () => {
        active = false;
        if (timers.poll) clearInterval(timers.poll);
        if (timers.timeout) clearTimeout(timers.timeout);
        script.removeEventListener("load", tryRender);
        script.removeEventListener("error", handleScriptError);
        if (window.turnstile && widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // The provider may already have removed an expired widget.
          }
        }
        widgetIdRef.current = null;
      };
    }, [configuredKey, isDevelopment, renderWidget, retryKey]);

    const retry = () => {
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Retry will create a clean widget instance.
        }
      }
      widgetIdRef.current = null;

      if (!window.turnstile) {
        document.getElementById(TURNSTILE_SCRIPT_ID)?.remove();
      }

      setErrorMessage(null);
      setStatus("loading");
      setRetryKey((value) => value + 1);
    };

    if (status === "development") {
      return (
        <div className={`py-2 ${className}`}>
          <div className="flex min-h-16 w-full items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 px-4 text-left">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-blue-600 shadow-sm" aria-hidden="true">
              ✓
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-800">Development security check active</p>
              <p className="mt-0.5 text-[11px] leading-4 text-slate-500">Turnstile verification remains enforced in production.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`py-2 ${className}`}>
        <div
          className="flex min-h-[70px] w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-2"
          aria-live="polite"
        >
          <div
            ref={containerRef}
            className={`cf-turnstile flex w-full justify-center ${status === "error" || status === "verified" ? "hidden" : ""}`}
            data-sitekey={effectiveSiteKey}
            data-action={action}
          />

          {status === "verified" && (
            <div className="flex w-full items-center gap-3 px-3 py-2 text-left">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-700" aria-hidden="true">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-800">Security verification complete</p>
                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">You can continue signing in securely.</p>
              </div>
            </div>
          )}
          {status === "loading" && (
            <div className="flex items-center gap-2 py-3 text-xs font-medium text-slate-500">
              <svg className="size-4 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Loading security check...</span>
            </div>
          )}

          {status === "error" && (
            <div className="w-full px-3 py-2 text-center">
              <p className="text-xs font-semibold text-red-700">{errorMessage}</p>
              {configuredKey && (
                <button
                  type="button"
                  onClick={retry}
                  className="mt-2 inline-flex min-h-9 items-center justify-center rounded-full border border-red-200 bg-white px-4 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                >
                  Retry security check
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);