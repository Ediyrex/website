"use client";

import React, { useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export default function SentryExamplePage() {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCaptureError = () => {
    try {
      Sentry.captureMessage("Sentry test message from /sentry-example-page");
      // Intentionally trigger a reference error to test Sentry exception capture
      // @ts-expect-error Intentionally calling an undefined function for testing
      myUndefinedFunction();
    } catch (error) {
      // Capture the error in Sentry telemetry
      Sentry.captureException(error);
      setHasError(true);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ReferenceError: myUndefinedFunction is not defined"
      );
    }
  };

  const handleTriggerCrash = () => {
    // Deliberately triggers an unhandled error to verify ErrorBoundary recovery
    // Do NOT call setHasError before throwing to avoid unmounted component state updates
    // @ts-expect-error Intentionally calling an undefined function for crash testing
    myUndefinedFunction();
  };

  return (
    <main className="min-h-screen bg-[#07090D] text-[#F5F3EE] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0D1016] border border-[#252A32] rounded-2xl p-8 space-y-6 text-center shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-xl bg-[#E85D04]/10 border border-[#E85D04]/30 flex items-center justify-center">
          <span className="text-[#E85D04] font-bold text-lg">S</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-[#FAF9F5]">
            Sentry Test Bench
          </h1>
          <p className="text-sm text-[#A8A29E]">
            Test client-side error telemetry, breadcrumbs, and Sentry issue capture.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleCaptureError}
            className="w-full py-3 px-4 rounded-xl bg-[#E85D04] hover:bg-[#F97316] text-[#07090D] font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#E85D04]/20 flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Capture Handled Exception</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerCrash}
            className="w-full py-2.5 px-4 rounded-xl bg-[#12151A] hover:bg-[#1A1F27] text-[#B2B4BA] hover:text-[#F5F3EE] border border-[#252A32] font-mono text-xs transition-colors"
          >
            Trigger Unhandled ErrorBoundary Crash
          </button>

          {hasError && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono space-y-1 text-left">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Exception captured &amp; sent to Sentry</span>
              </div>
              {errorMessage && (
                <p className="text-[#B2B4BA] text-[11px] font-mono break-all">
                  {errorMessage}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[#1C2028] text-xs text-[#78716C]">
          Ediyrex Studio &middot; Error &amp; Performance Telemetry
        </div>
      </div>
    </main>
  );
}
