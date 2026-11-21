"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface ClientStage {
  number: string;
  badge: string;
  title: string;
  description: string;
  services: readonly string[];
  href: string;
}

const CLIENT_STAGES: readonly ClientStage[] = [
  {
    number: "01",
    badge: "START",
    title: "Founders & Startups",
    description:
      "You have an idea worth building. You need the right identity, digital foundation and launch strategy.",
    services: ["BRAND IDENTITY /", "MVP DEVELOPMENT /", "LAUNCH"],
    href: "/services/branding",
  },
  {
    number: "02",
    badge: "SCALE",
    title: "Growing Brands & Companies",
    description:
      "Your business has outgrown its current presence. You need connected creative, digital and marketing capabilities.",
    services: ["BRAND EVOLUTION /", "DIGITAL PLATFORMS /", "GROWTH"],
    href: "/services/digital",
  },
  {
    number: "03",
    badge: "OPERATE",
    title: "Modern Operators & Teams",
    description:
      "Your operations rely on disconnected tools and manual processes. You need reliable systems and intelligent automation.",
    services: ["CRM & ERP /", "AI SYSTEMS /", "AUTOMATION"],
    href: "/services/ai",
  },
];

export function WhoWeServeSection() {
  return (
    <section
      id="who-we-serve"
      aria-label="02 / Who We Serve — Our Client Landscape"
      className="w-full bg-[#08090B] text-[#F5F2EC] py-16 sm:py-20 lg:py-24 border-b border-[#262A33]"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 lg:space-y-10">
        {/* Display Headline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <h2 className="font-heading font-extrabold text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC]">
            Different stages.
            <br />
            <span className="text-[#FF6900] italic font-heading font-extrabold">
              Shared ambition.
            </span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#898D94] leading-relaxed max-w-4xl">
            We work with people building something new, growing something established and improving
            how their businesses operate.
          </p>
        </motion.div>

        {/* Horizontal Divider */}
        <div className="h-px bg-[#262A33] w-full" />

        {/* 3 Client Stage Rows */}
        <div className="divide-y divide-[#262A33]">
          {CLIENT_STAGES.map((stage, idx) => (
            <motion.div
              key={stage.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={stage.href}
                className="group py-8 sm:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 transition-all duration-200 hover:bg-[#121519]/80 px-4 sm:px-6 rounded-2xl"
              >
                {/* Left Block: Number & Stage Badge */}
                <div className="flex items-center gap-5 sm:gap-6 shrink-0 lg:w-[220px]">
                  <span className="font-heading font-extrabold text-4xl sm:text-5xl text-[#FF6900] leading-none shrink-0 w-16 transition-transform duration-200 group-hover:scale-105 group-hover:text-[#FF762F]">
                    {stage.number}
                  </span>
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-[#C5A869]/70 text-[#E5D7B7] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider shrink-0 transition-colors group-hover:border-[#FF6900]/70 group-hover:text-[#FF6900]">
                    {stage.badge}
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden lg:block w-px h-12 bg-[#262A33] ml-auto"
                  />
                </div>

                {/* Middle Block: Title & Description */}
                <div className="flex-1 space-y-1.5 min-w-0 lg:px-4">
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#F5F2EC] tracking-tight group-hover:text-white transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#898D94] leading-relaxed max-w-xl group-hover:text-[#B8B9BC] transition-colors">
                    {stage.description}
                  </p>
                </div>

                {/* Right Block: Capabilities Tags & Arrow */}
                <div className="flex items-center gap-6 sm:gap-8 shrink-0 lg:w-[320px]">
                  <span
                    aria-hidden="true"
                    className="hidden lg:block w-px h-12 bg-[#262A33] shrink-0"
                  />
                  <div className="space-y-0.5 text-left min-w-0">
                    {stage.services.map((item) => (
                      <span
                        key={item}
                        className="block font-mono text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#FF6900] leading-tight whitespace-nowrap"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF6900] shrink-0 ml-auto transition-transform duration-200 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar: Subline and Redirect Button to Industries */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pt-6 border-t border-[#262A33] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#FF6900]">
            FROM FIRST IDEA TO CONNECTED OPERATIONS.
          </span>

          <Link
            href="/industries"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#FF6900] text-[#FF6900] hover:bg-[#FF6900] hover:text-[#08090B] hover:shadow-[0_4px_20px_rgba(255,105,0,0.35)] hover:scale-[1.02] active:scale-[0.98] font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 self-start sm:self-auto shadow-sm"
          >
            <span>VIEW ALL INDUSTRIES WE SERVE</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
