"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Dispatch caught runtime error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F3EE] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#12151A] border border-[#252A32] rounded-2xl p-8 space-y-6 text-center shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-xl bg-[#F06419]/10 border border-[#F06419]/30 flex items-center justify-center text-[#F06419]">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#D6B77A]">
            Application Interruption
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F3EE]">
            Something went wrong
          </h1>
          <p className="text-sm text-[#B2B4BA]">
            Our automated monitoring system has logged this incident with Sentry telemetry.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-[#777D87] pt-1">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium bg-[#D6B77A] text-[#08090B] hover:bg-[#E2C790] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-medium bg-[#1A1F27] text-[#F5F3EE] border border-[#252A32] hover:bg-[#252A32] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
