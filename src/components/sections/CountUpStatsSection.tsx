"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

interface StatItem {
  target: number;
  suffix: string;
  label: string;
  sublabel: string;
}

const STUDIO_METRICS: StatItem[] = [
  {
    target: 21,
    suffix: "",
    label: "Core Capabilities",
    sublabel: "Across Media, Digital & AI",
  },
  {
    target: 3,
    suffix: "",
    label: "Integrated Divisions",
    sublabel: "Unified under one team",
  },
  {
    target: 4,
    suffix: "",
    label: "Delivery Stages",
    sublabel: "Discover, Define, Create, Deliver",
  },
  {
    target: 24,
    suffix: "h",
    label: "Response Window",
    sublabel: "Business-day enquiry review",
  },
];

function AnimatedCounter({
  target,
  suffix,
  active,
  reducedMotion,
}: {
  target: number;
  suffix: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  // Initial state equals target so SSR and first client hydration always match
  const [value, setValue] = useState(target);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion || !active || hasAnimatedRef.current) {
      return;
    }

    hasAnimatedRef.current = true;
    let rafId = 0;
    const duration = 850;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, active, reducedMotion]);

  return (
    <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F3EE] tabular-nums">
      {value}
      <span className="text-[#D6B77A]">{suffix}</span>
    </span>
  );
}

export function CountUpStatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      ref={ref}
      aria-label="Studio Architecture Metrics"
      className="bg-[#0D0F12] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STUDIO_METRICS.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <AnimatedCounter
                target={item.target}
                suffix={item.suffix}
                active={inView}
                reducedMotion={shouldReduceMotion}
              />
              <div className="text-sm font-medium text-[#F5F3EE]">
                {item.label}
              </div>
              <p className="text-xs text-[#777D87]">{item.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
