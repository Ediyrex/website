"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Event names for manual triggering
export const PROGRESS_START_EVENT = "edyrex:progress:start";
export const PROGRESS_FINISH_EVENT = "edyrex:progress:finish";

/**
 * Imperatively launches the fast-accelerating top progress bar
 */
export function startProgressBar() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PROGRESS_START_EVENT));
  }
}

/**
 * Imperatively snaps the progress bar to 100% and fades out
 */
export function finishProgressBar() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PROGRESS_FINISH_EVENT));
  }
}

/**
 * Tracks route and query param changes inside a Suspense boundary
 * to satisfy Next.js static prerendering requirements for useSearchParams.
 */
function NavChangeTracker({
  onNavigate,
  isNavigatingRef,
}: {
  onNavigate: () => void;
  isNavigatingRef: React.MutableRefObject<boolean>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isNavigatingRef.current) {
      onNavigate();
      isNavigatingRef.current = false;
    }
  }, [pathname, searchParams, onNavigate, isNavigatingRef]);

  return null;
}

/**
 * Fast-starting optimistic progress bar ("progress bar speed up").
 * Leaps to 35% in 80ms, reaches 65% within 200ms, and zips to 100% upon completion.
 */
export function OptimisticProgressBar() {
  const [progress, setProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef<boolean>(false);

  const startProgress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    setIsVisible(true);
    setProgress(5);

    // Speed-up Phase 1: Jump to 35% within 80ms
    timerRef.current = setTimeout(() => {
      setProgress(35);

      // Speed-up Phase 2: Advance to 65% by 200ms
      timerRef.current = setTimeout(() => {
        setProgress(65);

        // Speed-up Phase 3: Creep smoothly towards 85%
        timerRef.current = setTimeout(() => {
          setProgress(85);
        }, 350);
      }, 120);
    }, 80);
  };

  const completeProgress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setProgress(100);

    // Fade out and reset after brief flash
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      timerRef.current = setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 200);
  };

  // Listen for custom imperative start/finish events
  useEffect(() => {
    const handleStart = () => {
      isNavigatingRef.current = true;
      startProgress();
    };

    const handleFinish = () => {
      completeProgress();
      isNavigatingRef.current = false;
    };

    window.addEventListener(PROGRESS_START_EVENT, handleStart);
    window.addEventListener(PROGRESS_FINISH_EVENT, handleFinish);

    return () => {
      window.removeEventListener(PROGRESS_START_EVENT, handleStart);
      window.removeEventListener(PROGRESS_FINISH_EVENT, handleFinish);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <NavChangeTracker
          onNavigate={completeProgress}
          isNavigatingRef={isNavigatingRef}
        />
      </Suspense>

      {isVisible || progress > 0 ? (
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] bg-transparent"
        >
          <div
            className="h-full bg-gradient-to-r from-[#F06419] via-[#D6B77A] to-[#F5F3EE] shadow-[0_0_10px_rgba(214,183,122,0.8)] transition-all duration-150 ease-out"
            style={{
              width: `${progress}%`,
              opacity: isVisible ? 1 : 0,
              transitionProperty: "width, opacity",
              transitionDuration: progress === 100 ? "120ms" : "180ms",
            }}
          />
        </div>
      ) : null}
    </>
  );
}
