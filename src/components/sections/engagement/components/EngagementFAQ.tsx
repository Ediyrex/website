"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENGAGEMENT_FAQS } from "../data/engagementModels";

interface EngagementFAQProps {
  onBackToWays: () => void;
}

export function EngagementFAQ({ onBackToWays }: EngagementFAQProps) {
  const [openId, setOpenId] = useState<string>(ENGAGEMENT_FAQS[0].id);

  return (
    <motion.div
      id="faq"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
    >
      {/* Left summary card */}
      <div className="lg:col-span-5 rounded-[26px] border border-[#E5DBD1] bg-[#FFFDFC]/90 p-6 sm:p-8 shadow-[0_24px_60px_-28px_rgba(17,17,17,0.12)] space-y-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#FF6900] block">
          COLLABORATION FAQ
        </span>
        <h3 className="font-heading text-[24px] sm:text-[28px] font-bold tracking-[-0.025em] leading-[1.15] text-[#111111]">
          Clarity before we start building.
        </h3>
        <p className="text-[14.5px] leading-[1.6] text-[#4B4742]">
          Every engagement is structured around transparent milestones, clear IP
          ownership, and direct collaboration with our studio engineering and
          creative leads.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBackToWays}
            className="inline-flex items-center gap-2 rounded-full border border-[#DED4CA] bg-[#FAF4EC] px-4 py-2 text-[13px] font-medium text-[#111111] transition-colors hover:border-[#111111] cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to models</span>
          </button>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2 text-[13px] font-medium text-[#FFFDFC] transition-colors hover:bg-[#FF6900]"
          >
            <span>Ask directly</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Right interactive accordion */}
      <div className="lg:col-span-7 divide-y divide-[#E4DAD0] rounded-[26px] border border-[#E5DBD1] bg-[#FFFDFC]/90 px-6 sm:px-8 shadow-[0_24px_60px_-28px_rgba(17,17,17,0.1)]">
        {ENGAGEMENT_FAQS.map((item, idx) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="py-5">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? "" : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-4 text-left cursor-pointer group"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] font-medium text-[#FF6900] shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="font-heading text-[16px] sm:text-[17px] font-semibold tracking-[-0.015em] text-[#111111] group-hover:text-[#FF6900] transition-colors">
                    {item.question}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                    isOpen
                      ? "rotate-45 border-[#FF6900] bg-[#FF6900]/10 text-[#FF6900]"
                      : "border-[#DED4CA] bg-transparent text-[#4B4742] group-hover:border-[#FF6900]"
                  )}
                >
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pl-7 pt-3 pr-8 text-[14px] leading-[1.6] text-[#4B4742]">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
