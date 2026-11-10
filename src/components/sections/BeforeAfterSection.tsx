"use client";

import React, { useState } from "react";
import { MoveHorizontal, AlertTriangle, CheckCircle2 } from "lucide-react";

export function BeforeAfterSection() {
  const [position, setPosition] = useState(52);

  return (
    <section
      id="before-after"
      className="py-16 md:py-28 bg-[#0D0F12] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
              Operational Shift
            </span>
            <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12]">
              From fragmented tools to one connected architecture.
            </h2>
          </div>
          <p className="text-xs font-mono text-[#777D87]">
            Drag slider or use arrow keys to compare
          </p>
        </div>

        {/* Interactive Before / After Frame */}
        <div className="relative rounded-2xl border border-[#252A32] bg-[#12151A] overflow-hidden select-none min-h-[340px] sm:min-h-[360px]">
          {/* Base Layer: WITH EDIYREX (After) */}
          <div
            className="p-7 sm:p-10 h-full min-h-[340px] sm:min-h-[360px] flex flex-col justify-between bg-[#12151A]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 25%, rgba(214, 183, 122, 0.10) 0%, transparent 60%)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#54C99A] px-2.5 py-1 rounded bg-[#54C99A]/10 border border-[#54C99A]/30">
                After &middot; With Ediyrex
              </span>
              <span className="text-[11px] font-mono text-[#777D87] hidden sm:inline">
                INTEGRATED MODEL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto py-6">
              {[
                {
                  title: "Cohesive Media System",
                  detail:
                    "Brand films, reels, and photography share one editorial direction.",
                  accent: "#E58A76",
                },
                {
                  title: "Custom Digital Stack",
                  detail:
                    "Fast Next.js interfaces engineered directly around conversion.",
                  accent: "#7BA9F5",
                },
                {
                  title: "Automated AI Ops",
                  detail:
                    "Voice receptionists, RAG search, and workflow agents connected to your CRM.",
                  accent: "#B5A0F5",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-2"
                >
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: item.accent }}
                  />
                  <h3 className="font-heading font-semibold text-base text-[#F5F3EE]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#B2B4BA] leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Clipped Overlay Layer: BEFORE EDIYREX */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#08090B] p-7 sm:p-10 flex flex-col justify-between"
            style={{
              clipPath: `inset(0 ${100 - position}% 0 0)`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#F07878] px-2.5 py-1 rounded bg-[#F07878]/10 border border-[#F07878]/30">
                Before &middot; Fragmented Setup
              </span>
              <span className="text-[11px] font-mono text-[#777D87] hidden sm:inline">
                SILOED VENDORS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto py-6">
              {[
                {
                  title: "Disconnected Shoots",
                  detail:
                    "Separate video freelancers whose assets never match the website.",
                },
                {
                  title: "Rigid Templates",
                  detail:
                    "Slow page builders with generic layouts and fragile plugins.",
                },
                {
                  title: "Manual Bottlenecks",
                  detail:
                    "Unanswered calls, copy-pasted spreadsheets, and lost follow-ups.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-xl bg-[#12151A] border border-[#252A32] space-y-2"
                >
                  <AlertTriangle className="w-4 h-4 text-[#F07878]" />
                  <h3 className="font-heading font-semibold text-base text-[#F5F3EE]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#777D87] leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Divider Line & Handle */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 w-px bg-[#D6B77A] pointer-events-none z-20"
            style={{ left: `${position}%` }}
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#D6B77A] text-[#17130B] flex items-center justify-center shadow-lg">
              <MoveHorizontal className="w-4 h-4" />
            </div>
          </div>

          {/* Accessible Range Input Overlay */}
          <input
            type="range"
            min={10}
            max={90}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            aria-label="Compare fragmented setup versus integrated Ediyrex Studio setup"
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />
        </div>
      </div>
    </section>
  );
}
