"use client";

import { useState, useEffect } from "react";

export interface WaitStage {
  /** Threshold in milliseconds when this message becomes active */
  afterMs: number;
  /** Human-friendly reassurance micro-copy explaining the current operation */
  message: string;
}

const DEFAULT_WAIT_STAGES: WaitStage[] = [
  { afterMs: 1000, message: "Processing secure request..." },
  { afterMs: 2500, message: "Connecting with studio operations desk..." },
  { afterMs: 5000, message: "Still working... finalizing encryption & data verification..." },
];

/**
 * Replaces generic frozen loading states with progressive explanations
 * when an operation takes longer than 1000ms ("explain waits over 1s").
 */
export function useWaitExplanation(
  isLoading: boolean,
  customStages?: WaitStage[]
): { explanation: string | null; elapsedMs: number } {
  const stages = (customStages && customStages.length > 0) ? customStages : DEFAULT_WAIT_STAGES;
  const [explanation, setExplanation] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  useEffect(() => {
    if (!isLoading) {
      setExplanation(null);
      setElapsedMs(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedMs(elapsed);

      // Find the latest stage whose threshold has been reached (ordered descending)
      const matching = [...stages]
        .sort((a, b) => b.afterMs - a.afterMs)
        .find((s) => elapsed >= s.afterMs);

      setExplanation(matching ? matching.message : null);
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, [isLoading, stages]);

  return { explanation, elapsedMs };
}
