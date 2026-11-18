"use client";

import React, { useState } from "react";
import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  const [hasError, setHasError] = useState(false);

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
            Click the button below to test client-side error telemetry and capture in Sentry.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setHasError(true);
              // Trigger client test error
              Sentry.captureMessage("Sentry test message from /sentry-example-page");
              try {
                // @ts-expect-error Intentionally calling an undefined function to test error capture
                myUndefinedFunction();
              } catch (error) {
                Sentry.captureException(error);
                throw error;
              }
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#E85D04] hover:bg-[#F97316] text-[#07090D] font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#E85D04]/20"
          >
            Trigger Sentry Error
          </button>

          {hasError && (
            <p className="text-xs text-[#E85D04] font-mono">
              Test error dispatched! Check your Sentry Dashboard issues stream.
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-[#1C2028] text-xs text-[#78716C]">
          Ediyrex Studio · Error & Performance Telemetry
        </div>
      </div>
    </main>
  );
}
