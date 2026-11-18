import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base Dark Editorial Skeleton box with subtle champagne shimmer.
 * Implements "skeletons no spinners".
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-[#12151A] border border-[#252A32]/60 rounded-md animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

/**
 * Skeleton lines for paragraphs or text blocks
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded",
            i === lines - 1 ? "w-3/5" : i === 0 ? "w-full" : "w-4/5"
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Card for portfolios, services, tasks, or insights
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-[#12151A] border border-[#252A32] space-y-4",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-12 rounded" />
      </div>
      <Skeleton className="h-6 w-3/4 rounded" />
      <SkeletonText lines={2} />
      <div className="pt-2 flex items-center justify-between border-t border-[#252A32]/60">
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Skeleton Table for admin outbox, CRM, PMS, and logs
 */
export function SkeletonTable({
  rows = 5,
  columns = 5,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("w-full overflow-hidden border border-[#252A32] rounded-xl bg-[#12151A]", className)}
      aria-hidden="true"
    >
      {/* Table Header Placeholder */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-[#252A32] bg-[#0E1014]">
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton
            key={idx}
            className={cn(
              "h-3.5 rounded",
              idx === 0 ? "w-32" : idx === 1 ? "w-48" : "w-20"
            )}
          />
        ))}
      </div>

      {/* Table Rows Placeholder */}
      <div className="divide-y divide-[#252A32]/70">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center gap-4 px-4 py-3.5">
            {Array.from({ length: columns }).map((_, cIdx) => (
              <Skeleton
                key={cIdx}
                className={cn(
                  "h-4 rounded",
                  cIdx === 0
                    ? "w-28"
                    : cIdx === 1
                    ? "w-44"
                    : cIdx === columns - 1
                    ? "w-16 ml-auto"
                    : "w-20"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton Calendar for Cal.com booking dialog
 */
export function SkeletonCalendar({ className }: { className?: string }) {
  return (
    <div
      className={cn("p-6 space-y-6 max-w-xl mx-auto w-full", className)}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-44 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full rounded" />
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 28 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-10 w-full rounded-lg",
              i % 5 === 0 ? "opacity-40" : "opacity-90"
            )}
          />
        ))}
      </div>

      {/* Available Time Slots Placeholder */}
      <div className="pt-4 border-t border-[#252A32] space-y-3">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Complete editorial page layout skeleton for route transitions (`loading.tsx`)
 */
export function SkeletonPage() {
  return (
    <div
      role="status"
      aria-label="Loading page content"
      className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 py-24 sm:py-32 space-y-12"
    >
      {/* Hero typographical skeleton */}
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-12 sm:h-16 w-11/12 rounded-lg" />
        <Skeleton className="h-12 sm:h-16 w-3/4 rounded-lg" />
        <div className="pt-2 space-y-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>
        <div className="pt-4 flex items-center gap-4">
          <Skeleton className="h-11 w-36 rounded-lg" />
          <Skeleton className="h-11 w-32 rounded-lg" />
        </div>
      </div>

      {/* 3-column card grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
