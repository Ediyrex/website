"use client";

import { useState, useEffect, useRef } from "react";

export interface DebouncedLoadingOptions {
  /**
   * Delay in milliseconds before showing the loader.
   * If the async task finishes before this delay, the loader is NEVER shown.
   * Default: 300ms ("no loader under 300ms").
   */
  delayMs?: number;
  /**
   * Minimum duration in milliseconds to keep the loader visible once shown.
   * Prevents a jarring flash if the task finishes right after the delay threshold.
   * Default: 350ms.
   */
  minDurationMs?: number;
}

/**
 * Suppresses loader flickering for fast operations (< 300ms).
 * Only displays a loading state if the operation genuinely takes longer than 300ms.
 */
export function useDebouncedLoading(
  isLoading: boolean,
  options: DebouncedLoadingOptions = {}
): boolean {
  const { delayMs = 300, minDurationMs = 350 } = options;
  const [showLoader, setShowLoader] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const minDurationTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Clear any pending dismissal timer
      if (minDurationTimerRef.current) {
        clearTimeout(minDurationTimerRef.current);
        minDurationTimerRef.current = null;
      }

      // Schedule loader appearance only if loading exceeds delayMs (e.g. 300ms)
      delayTimerRef.current = setTimeout(() => {
        shownAtRef.current = Date.now();
        setShowLoader(true);
      }, delayMs);
    } else {
      // Task finished. Clear the pending appearance timer if it hasn't fired yet
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }

      // If the loader was already displayed, ensure it stays visible for at least minDurationMs
      if (shownAtRef.current) {
        const elapsed = Date.now() - shownAtRef.current;
        const remaining = Math.max(0, minDurationMs - elapsed);

        if (remaining > 0) {
          minDurationTimerRef.current = setTimeout(() => {
            setShowLoader(false);
            shownAtRef.current = null;
          }, remaining);
        } else {
          setShowLoader(false);
          shownAtRef.current = null;
        }
      } else {
        setShowLoader(false);
      }
    }

    return () => {
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (minDurationTimerRef.current) clearTimeout(minDurationTimerRef.current);
    };
  }, [isLoading, delayMs, minDurationMs]);

  return showLoader;
}
