"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { initEngagementAnimations } from "./animations/engagementAnimations";
import { EngagementCardList } from "./components/EngagementCardList";
import { EngagementDetailsPanel } from "./components/EngagementDetailsPanel";
import { EngagementFAQ } from "./components/EngagementFAQ";
import { EngagementHeader } from "./components/EngagementHeader";
import { EngagementNavigation } from "./components/EngagementNavigation";
import { useEngagementSelection } from "./hooks/useEngagementSelection";

export function EngagementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    selectedId,
    selectedModel,
    selectModel,
    activeTab,
    setActiveTab,
  } = useEngagementSelection("project-based");

  useEffect(() => {
    return initEngagementAnimations(sectionRef.current);
  }, []);

  return (
    <section
      id="engagement"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F7F1E9] py-14 sm:py-20 lg:py-24 border-t border-[#E6DDD3]"
    >
      {/* Subtle warm radial light wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_45%,rgba(255,140,66,0.12),transparent_48%),radial-gradient(circle_at_85%_20%,rgba(255,190,130,0.14),transparent_42%)]"
      />

      {/* Delicate bottom wave contour decoration */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-32 w-full opacity-75"
      >
        <path
          d="M 0 120 C 240 64, 520 150, 820 112 C 1080 78, 1260 44, 1440 84"
          stroke="#E5CFC0"
          strokeWidth="1.25"
        />
        <path
          d="M 0 134 C 280 86, 560 158, 860 118 C 1100 88, 1280 56, 1440 94"
          stroke="#EBD9CC"
          strokeWidth="1"
        />
        <path
          d="M 0 148 C 320 106, 620 164, 900 126 C 1140 96, 1300 68, 1440 106"
          stroke="#EFE0D4"
          strokeWidth="0.9"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-16">
        {/* Part A: Header & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-10 sm:mb-12">
          <div className="lg:col-span-7">
            <EngagementHeader />
          </div>

          <div className="lg:col-span-5 lg:pt-1 space-y-5">
            <p
              data-engagement-header
              className="border-l border-[#D5CBC0] pl-5 text-[15px] sm:text-[16px] leading-[1.55] text-[#45413C] max-w-[420px]"
            >
              Choose the engagement model that fits your goals, timeline and
              level of involvement.
            </p>
            <EngagementNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Part B: Interactive Cards + Dynamic Info Panel OR FAQ */}
        <AnimatePresence mode="wait">
          {activeTab === "ways" ? (
            <motion.div
              key="ways-panel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center"
            >
              <div className="lg:col-span-7">
                <EngagementCardList
                  selectedId={selectedId}
                  onSelect={selectModel}
                />
              </div>

              <div className="lg:col-span-5">
                <EngagementDetailsPanel model={selectedModel} />
              </div>
            </motion.div>
          ) : (
            <EngagementFAQ
              key="faq-panel"
              onBackToWays={() => setActiveTab("ways")}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
