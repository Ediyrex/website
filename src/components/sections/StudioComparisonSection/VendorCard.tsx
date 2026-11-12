"use client";

import { motion } from "motion/react";
import { Code2, Cpu, Layers, PenTool, PlayCircle } from "lucide-react";
import type { TraditionalVendor, VendorIconKey } from "./comparison.data";

interface VendorCardProps {
  vendor: TraditionalVendor;
}

const VENDOR_ICONS: Record<VendorIconKey, typeof Layers> = {
  play: PlayCircle,
  code: Code2,
  cpu: Cpu,
  pen: PenTool,
  layers: Layers,
};

export function VendorCard({ vendor }: VendorCardProps) {
  const Icon = VENDOR_ICONS[vendor.icon];

  return (
    <div data-sc-vendor-card>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="group relative flex h-full flex-col items-center justify-center gap-2.5 rounded-[18px] border border-[#E5DED5] bg-[#FFFCF8] px-2.5 py-5 text-center shadow-[0_6px_16px_-12px_rgba(17,17,17,0.12)] transition-[border-color] duration-200 hover:border-[#BDB4A9]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DED5] bg-[#FAF6F0] text-[#48433F] opacity-85 transition-opacity duration-200 group-hover:opacity-100">
          <Icon className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
        </span>

        <span className="text-[12.5px] font-medium leading-[1.25] text-[#111111]">
          {vendor.labelLine1}
          <br />
          {vendor.labelLine2}
        </span>
      </motion.div>
    </div>
  );
}

