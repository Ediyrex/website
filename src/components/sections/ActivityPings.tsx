"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, Activity } from "lucide-react";

const DEMO_PINGS = [
  {
    division: "AI",
    accent: "#B5A0F5",
    title: "Voice Receptionist Demo",
    detail: "Discovery call workflow triggered",
  },
  {
    division: "MEDIA",
    accent: "#E58A76",
    title: "Motion Pipeline Demo",
    detail: "16:9 + 9:16 brand cuts packaged",
  },
  {
    division: "DIGITAL",
    accent: "#7BA9F5",
    title: "Next.js App Blueprint",
    detail: "Typed schema & UI tokens active",
  },
];

export function ActivityPings() {
  const shouldReduceMotion = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dismissed || shouldReduceMotion) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % DEMO_PINGS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [dismissed, shouldReduceMotion]);

  if (dismissed) return null;

  const current = DEMO_PINGS[index];

  return (
    <aside
      aria-label="Studio Workflow Demo Feed"
      className="fixed bottom-5 left-5 z-30 hidden md:block max-w-xs"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-xl bg-[#12151A]/95 backdrop-blur-md border border-[#252A32] p-3.5 shadow-xl flex items-start gap-3"
        >
          <div
            className="w-8 h-8 rounded-lg bg-[#0D0F12] border border-[#252A32] flex items-center justify-center shrink-0 mt-0.5"
            style={{ color: current.accent }}
          >
            <Activity className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono uppercase tracking-wider"
                style={{ color: current.accent }}
              >
                {current.division}
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#0D0F12] text-[#777D87] border border-[#252A32]">
                Demo Pulse
              </span>
            </div>
            <p className="text-xs font-medium text-[#F5F3EE] truncate">
              {current.title}
            </p>
            <p className="text-[11px] text-[#B2B4BA] truncate">
              {current.detail}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss workflow preview"
            className="text-[#777D87] hover:text-[#F5F3EE] p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
