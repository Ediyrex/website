"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { STUDIO_RETAINERS } from "./services.data";

export function RetainerModels() {
  return (
    <div className="mt-16 border-t border-[#292E35] pt-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h3 className="font-heading text-2xl font-semibold tracking-tight text-[#F5F2EC] sm:text-3xl">
            Ongoing Support &amp; Studio Retainers
          </h3>
          <p className="mt-2 max-w-[680px] text-sm leading-relaxed text-[#858991]">
            Available across all four divisions as separately scoped Annual
            Maintenance Contracts (AMC) and monthly retainers.
          </p>
        </div>

        <Link
          href="/contact"
          className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-[#F07824] transition-colors hover:text-[#F5F2EC]"
        >
          Discuss Support Scope
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STUDIO_RETAINERS.map((retainer, idx) => (
          <motion.div
            key={retainer.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              duration: 0.4,
              delay: idx * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group relative overflow-hidden rounded-lg border border-[#292E35] bg-[#121519] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#F07824]/50 hover:bg-[#161B21] hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
          >
            {/* Top glowing line on hover */}
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#F07824] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <span className="inline-block font-mono text-[11px] font-semibold tracking-[0.16em] text-[#F07824] transition-transform duration-200 group-hover:scale-105">
              {retainer.number}
            </span>
            <h4 className="mt-2 text-base font-medium tracking-tight text-[#F5F2EC] transition-colors group-hover:text-white">
              {retainer.title}
            </h4>
            <ul className="mt-3 space-y-2 border-t border-[#292E35] pt-3">
              {retainer.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs leading-relaxed text-[#B8B9BC] transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  <span className="select-none font-bold text-[#F07824]">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

