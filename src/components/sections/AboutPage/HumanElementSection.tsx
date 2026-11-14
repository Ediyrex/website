import React from "react";
import Image from "next/image";
import { MessageSquareCode, ShieldCheck, Zap } from "lucide-react";

export function HumanElementSection() {
  return (
    <section
      id="human-element"
      aria-label="Human Element and Studio Leadership"
      className="py-16 md:py-24 bg-[#08090B] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#FF6900]">
              03 / HUMAN ELEMENT &amp; LEADERSHIP
            </span>
          </div>
          <h2 className="font-heading font-semibold text-[#F5F3EE] text-[clamp(2rem,3.2vw,3rem)] leading-[1.14] tracking-tight">
            Work directly with the builders. No middle layers.
          </h2>
          <p className="text-[#B2B4BA] text-base sm:text-lg leading-relaxed pt-1">
            We believe agency overhead ruins great work. At EDIYREX, you collaborate directly with
            the engineers and designers building your solution.
          </p>
        </div>

        {/* Founder & Ethos Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Portrait Column */}
          <div className="lg:col-span-5 relative rounded-2xl bg-[#0D0F12] border border-[#252A32] overflow-hidden min-h-[380px] lg:min-h-full flex flex-col justify-end">
            <Image
              src="/images/about/founder.jpg"
              alt="Founder of EDIYREX studio in architectural studio lighting"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-top filter contrast-[1.05]"
              priority
            />
            {/* Dark Gradient Overlay for Typography Contrast */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-[#08090B]/40 to-transparent"
            />

            {/* Bottom Caption Overlay */}
            <div className="relative z-10 p-6 sm:p-7 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6900] block">
                LEADERSHIP &amp; DIRECTION
              </span>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#F5F3EE]">
                Abhishek Das
              </h3>
              <p className="text-xs font-mono text-[#D6B77A]">
                Founder &amp; Principal Technologist &middot; EDIYREX
              </p>
            </div>
          </div>

          {/* Bio & Commitments Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 rounded-2xl bg-[#0D0F12] border border-[#252A32] flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-[#12151A] text-[#D6B77A] border border-[#252A32] inline-block">
                FOUNDER&apos;S NOTE
              </span>
              <blockquote className="font-heading italic text-xl sm:text-2xl text-[#F5F3EE] leading-snug border-l-2 border-[#FF6900] pl-5 py-1">
                &ldquo;We built EDIYREX because we got tired of slow, fragmented workflows. We wanted to
                create a studio that brings creativity, technology and automation under one roof&mdash;and
                actually ships great work.&rdquo;
              </blockquote>
              <p className="text-sm sm:text-base text-[#9EA2A8] leading-relaxed">
                Most agencies pad projects with account managers, status updates, and junior
                subcontractors who don&apos;t understand the big picture. When you work with us, you get
                direct access to senior practitioners who obsess over typography, code quality, and
                system uptime equally.
              </p>
            </div>

            {/* 3 Core Working Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1E232B]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#FF6900]">
                  <MessageSquareCode className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-mono font-semibold uppercase">Direct Comms</span>
                </div>
                <p className="text-xs text-[#8A8F99] leading-relaxed">
                  Direct Slack / WhatsApp channel with the creators and engineers building your work.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#D6B77A]">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-mono font-semibold uppercase">Total Clarity</span>
                </div>
                <p className="text-xs text-[#8A8F99] leading-relaxed">
                  Transparent deliverables, weekly testable builds, and zero hidden scope expansion.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#FF6900]">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-mono font-semibold uppercase">Speed &amp; Craft</span>
                </div>
                <p className="text-xs text-[#8A8F99] leading-relaxed">
                  Rapid iteration cycles without compromising on clean engineering or visual nuance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

