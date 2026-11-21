"use client";

import { motion } from "motion/react";
import { StudioMetrics } from "./StudioMetrics";

export function DirectoryHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12"
    >
      <div className="space-y-4 lg:col-span-7">
        <h2 className="font-heading text-[clamp(2.25rem,4.1vw,3.8rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-[#F5F2EC]">
          A Complete Suite of
          <br />
          Creative, Digital &amp;
          <br />
          Intelligent{" "}
          <span className="italic text-[#F07824]">Capabilities.</span>
        </h2>
        <p className="max-w-[660px] text-[15.5px] leading-[1.6] text-[#858991] sm:text-[17px]">
          Every service can be commissioned independently or orchestrated
          together under one unified engagement.
        </p>
      </div>

      <div className="space-y-6 lg:col-span-5 lg:border-l lg:border-[#343940] lg:pl-10">
        <p className="text-[15.5px] leading-[1.6] text-[#B8B9BC] sm:text-[17px]">
          From brand strategy and content production to web platforms and AI
          automation, our services cover the entire build–grow–operate
          journey.
        </p>
        <StudioMetrics />
      </div>
    </motion.div>
  );
}

