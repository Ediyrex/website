"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  TurnstileWidgetProps,
  TurnstileWidgetRef,
} from "../types/turnstile.types";
import {
  loadTurnstileScript,
  getTurnstileSiteKey,
} from "../services/turnstile.client";
import { ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  function TurnstileWidget(
    {
      action,
      onSuccess,
      onError,
      onExpire,
      theme = "dark",
      size = "normal",
      className = "",
      siteKey: propSiteKey,
      disabled = false,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [renderError, setRenderError] = useState<string | null>(null);

    const siteKey = propSiteKey || getTurnstileSiteKey();

    // Expose reset and getToken via imperative handle
    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
          }
        },
        getToken: () => {
          if (widgetIdRef.current && window.turnstile) {
            return window.turnstile.getResponse(widgetIdRef.current);
          }
          return "";
        },
      }),
      []
    );

    useEffect(() => {
      let isMounted = true;

      async function initTurnstile() {
        if (!containerRef.current || disabled) return;

        try {
          await loadTurnstileScript();

          if (!isMounted || !containerRef.current || !window.turnstile) return;

          // Remove any existing widget before re-rendering
          if (widgetIdRef.current) {
            try {
              window.turnstile.remove(widgetIdRef.current);
            } catch {
              // Ignore cleanup error
            }
            widgetIdRef.current = null;
          }

          const widgetId = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            action,
            theme,
            size,
            callback: (token: string) => {
              setTimeout(() => {
                if (isMounted) {
                  setRenderError(null);
                  onSuccess(token);
                }
              }, 0);
            },
            "error-callback": (err: any) => {
              setTimeout(() => {
                if (isMounted) {
                  setRenderError("Security challenge verification failed. Please retry.");
                  onError?.(err);
                }
              }, 0);
            },
            "expired-callback": () => {
              setTimeout(() => {
                if (isMounted) {
                  setRenderError("Challenge expired. Please verify again.");
                  onExpire?.();
                }
              }, 0);
            },
          });

          widgetIdRef.current = widgetId;
          setIsLoaded(true);
        } catch (err) {
          if (isMounted) {
            setRenderError("Unable to load security verification. Please refresh.");
            onError?.(err);
          }
        }
      }

      initTurnstile();

      return () => {
        isMounted = false;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Ignore removal errors on unmount
          }
          widgetIdRef.current = null;
        }
      };
    }, [action, disabled, onError, onExpire, onSuccess, siteKey, size, theme]);

    const handleRetry = () => {
      setRenderError(null);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    };

    return (
      <div className={`space-y-2 ${className}`}>
        {/* Turnstile Container */}
        <div
          ref={containerRef}
          className="min-h-[65px] flex items-center justify-start rounded-lg overflow-hidden"
          data-testid="turnstile-container"
        />

        {/* Loading state before widget scripts ready */}
        {!isLoaded && !renderError && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#777D87] p-2">
            <ShieldCheck className="w-4 h-4 text-[#D6B77A] animate-pulse" />
            <span>Initializing Cloudflare Turnstile protection...</span>
          </div>
        )}

        {/* Friendly Error / Expiry Message */}
        {renderError && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/25 text-xs text-[#FCA5A5]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
              <span>{renderError}</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-[#F5F3EE] hover:text-[#D6B77A] transition-colors ml-2 shrink-0 underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>
    );
  }
);
