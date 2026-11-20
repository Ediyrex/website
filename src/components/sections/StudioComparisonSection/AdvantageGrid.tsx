"use client";

import { useEffect, useState } from "react";
import { AdvantageCard } from "./AdvantageCard";
import { KEY_ADVANTAGES } from "./comparison.data";

const CYCLE_INTERVAL_MS = 3200;

export function AdvantageGrid() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % KEY_ADVANTAGES.length);
    }, CYCLE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="space-y-7 pt-2">
      {/* Centered editorial divider */}
      <div className="flex items-center gap-5 sm:gap-7">
        <div
          className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D9D0C6]"
          aria-hidden="true"
        />
        <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.22em] text-[#9E6E47] whitespace-nowrap">
          FIVE KEY ADVANTAGES
        </span>
        <div
          className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D9D0C6]"
          aria-hidden="true"
        />
      </div>

      {/* Responsive 5-card grid with timed cycling spotlight effect */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {KEY_ADVANTAGES.map((advantage, index) => (
          <AdvantageCard
            key={advantage.id}
            advantage={advantage}
            index={index}
            isActive={activeIndex === index}
            onSelect={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
