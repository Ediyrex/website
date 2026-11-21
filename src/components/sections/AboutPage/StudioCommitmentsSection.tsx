"use client";

import React from "react";
import { motion } from "motion/react";

interface Commitment {
  index: string;
  title: string;
  description: string;
}

const COMMITMENTS: readonly Commitment[] = [
  {
    index: "01",
    title: "HONEST CONCEPT DISTINCTION",
    description:
      "We distinguish clearly between R&D prototypes and client deliverables, so you always know what's experimental and what's production-ready.",
  },
  {
    index: "02",
    title: "FULL OWNERSHIP & MAINTAINABILITY",
    description:
      "Codebases, brand systems and media masters are built cleanly and documented, so your organization retains control and long-term flexibility.",
  },
  {
    index: "03",
    title: "CLEAR SCOPE BEFORE EXECUTION",
    description:
      "Every engagement begins with a well-defined scope, realistic timelines and direct communication, so the project delivers the expected outcomes.",
  },
];

export function StudioCommitmentsSection() {
  return (
    <section
      id="commitments"
      aria-label="Studio Commitments"
      className="w-full bg-[#08090B] text-[#F5F3EE] py-16 md:py-24 lg:py-28 border-b border-[#252A32]"
    >
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-14">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {/* Headline with Orange Italic Accent */}
          <h2 className="font-heading font-extrabold text-[clamp(2.5rem,4.5vw,4.25rem)] leading-[1.05] tracking-[-0.035em] text-[#F5F3EE]">
            Credibility earned through
            <br />
            transparency,{" "}
            <span className="text-[#FF6900] italic font-heading font-extrabold">
              not inflated claims.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#8A8F99] leading-relaxed max-w-2xl pt-1">
            The principles that guide how we work, build and partner with every client.
          </p>
        </motion.div>

        {/* 3 Columns Swiss Grid with Vertical Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#252A32] mt-12 lg:mt-16 pt-2">
          {COMMITMENTS.map((item, idx) => (
            <motion.div
              key={item.index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.45,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group py-8 md:py-4 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between space-y-5 rounded-xl transition-all duration-200 hover:bg-[#121519]/50"
            >
              <div className="space-y-3">
                {/* Orange-bordered pill badge */}
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded border border-[#FF6900] text-[#FF6900] font-mono text-[11px] font-bold tracking-wider group-hover:bg-[#FF6900]/10 transition-colors">
                  {item.index}
                </span>
                <h3 className="font-heading font-extrabold text-[17px] sm:text-[18px] text-[#F5F3EE] tracking-tight uppercase leading-snug group-hover:text-[#FF6900] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-[13.5px] text-[#8A8F99] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Orange Accent Bar */}
              <span
                aria-hidden="true"
                className="block w-8 h-[2px] bg-[#FF6900] transition-all duration-300 group-hover:w-16 group-hover:bg-[#FF762F]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
