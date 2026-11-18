"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export interface PreloadTapOptions {
  /** Target Next.js route to prefetch */
  href?: string;
  /** Optional custom action to execute immediately on pointer down / press */
  onPressStart?: () => void;
}

/**
 * Fires route prefetching and tactile preparation on pointerdown / touchstart
 * ("Press before the lift" & "preload the next tap"), eliminating the 100-250ms
 * latency penalty of waiting for mouseup/tap release.
 */
export function usePreloadTap(options: PreloadTapOptions = {}) {
  const router = useRouter();
  const prefetchedRef = useRef(false);

  const prefetchTarget = useCallback(() => {
    if (options.href && !prefetchedRef.current) {
      // Only prefetch internal routes
      if (options.href.startsWith("/") && !options.href.startsWith("//")) {
        router.prefetch(options.href);
        prefetchedRef.current = true;
      }
    }
  }, [options.href, router]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Primary button or touch
      if (e.button === 0 || e.pointerType === "touch") {
        prefetchTarget();
        options.onPressStart?.();
      }
    },
    [prefetchTarget, options]
  );

  const handlePointerEnter = useCallback(() => {
    prefetchTarget();
  }, [prefetchTarget]);

  const handleTouchStart = useCallback(() => {
    prefetchTarget();
    options.onPressStart?.();
  }, [prefetchTarget, options]);

  return {
    onPointerDown: handlePointerDown,
    onPointerEnter: handlePointerEnter,
    onTouchStart: handleTouchStart,
  };
}
