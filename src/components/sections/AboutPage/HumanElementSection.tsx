import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface LeadershipCommitment {
  number: string;
  title: string;
  description: string;
}

const LEADERSHIP_COMMITMENTS: readonly LeadershipCommitment[] = [
  {
    number: "01",
    title: "DIRECT COLLABORATION",
    description: "Work with the people actually building your solution.",
  },
  {
    number: "02",
    title: "SHARED CONTEXT",
    description: "Keep priorities, feedback and decisions connected throughout the engagement.",
  },
  {
    number: "03",
    title: "CRAFT & ACCOUNTABILITY",
    description: "Maintain clear ownership of deliverables and consistent attention to execution.",
  },
];

export function HumanElementSection() {
  return (
    <section
      id="human-element"
      aria-label="03 / Human Element & Leadership"
      className="w-full bg-[#FAF8F5] text-[#0B0D10] py-16 sm:py-20 lg:py-24 border-b border-[#EAE5DC]"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 lg:space-y-10">
        {/* Display Headline */}
        <div className="space-y-3">
          <h2 className="font-heading font-extrabold text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[0.98] tracking-[-0.035em] text-[#0B0D10]">
            The people you meet.
            <br />
            <span className="text-[#FF6900] italic font-heading font-extrabold">
              The people who build.
            </span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#555962] leading-relaxed max-w-4xl">
            At EDYREX, you work directly with the people shaping your ideas, making decisions and
            delivering the work. No unnecessary layers between thinking and execution.
          </p>
        </div>

        {/* Horizontal Divider */}
        <div className="h-px bg-[#EAE5DC] w-full" />

        {/* Main Content: 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-start">
          {/* Left Column: Founder Portrait & Identity */}
          <div className="lg:col-span-5 lg:pr-10 xl:pr-12 lg:border-r lg:border-[#EAE5DC] space-y-5">
            {/* Portrait Frame */}
            <div className="relative aspect-square sm:aspect-[4/4.2] rounded-[16px] overflow-hidden bg-[#FFFFFF] border border-[#EAE5DC] shadow-md">
              <Image
                src="/images/about/founder.jpg"
                alt="Founder of EDYREX studio in dramatic studio lighting"
                fill
                sizes="(min-width: 1024px) 35vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover object-top"
                priority
              />
            </div>

            {/* Founder Caption */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#FF6900] block">
                FOUNDER / STUDIO LEADERSHIP
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#0B0D10] tracking-tight">
                Abhishek Das
              </h3>
              <p className="text-xs sm:text-[13px] font-mono text-[#777D87]">
                Founder &amp; Principal Technologist &middot; EDYREX
              </p>
            </div>
          </div>

          {/* Right Column: Founder Note & 3 Core Commitments */}
          <div className="lg:col-span-7 lg:pl-10 xl:pl-14 space-y-7">
            {/* Top Subheader */}
            <div>
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#9E7B35] block">
                A NOTE FROM THE FOUNDER
              </span>

              {/* Big Editorial Quote with Signal Orange Left Border */}
              <blockquote className="border-l-[4px] border-[#FF6900] pl-5 sm:pl-6 my-4 py-1">
                <p className="font-heading font-black italic text-[clamp(1.75rem,3.2vw,2.75rem)] text-[#0B0D10] leading-[1.08] tracking-tight">
                  &ldquo;The people shaping the idea should stay close to the people building it.&rdquo;
                </p>
              </blockquote>

              <p className="text-xs sm:text-sm text-[#555962] leading-relaxed max-w-xl">
                A studio built around direct collaboration, thoughtful decisions and accountability
                throughout execution.
              </p>
            </div>

            {/* Three Numbered Rows */}
            <div className="divide-y divide-[#EAE5DC] border-t border-b border-[#EAE5DC]">
              {LEADERSHIP_COMMITMENTS.map((item) => (
                <div
                  key={item.number}
                  className="py-5 sm:py-6 flex items-center justify-between gap-4 group transition-colors hover:bg-[#FFFFFF] px-2 rounded-lg"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                    <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#FF6900] leading-none shrink-0 w-12 sm:w-14">
                      {item.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-px h-10 bg-[#EAE5DC] shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h4 className="font-heading font-extrabold text-base sm:text-lg text-[#0B0D10] uppercase tracking-tight leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-[#555962] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight className="w-6 h-6 text-[#FF6900] shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Subline Bar */}
        <div className="pt-6 border-t border-[#EAE5DC]">
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#FF6900] block">
            SMALL TEAMS. DIRECT COMMUNICATION. REAL OWNERSHIP.
          </span>
        </div>
      </div>
    </section>
  );
}
