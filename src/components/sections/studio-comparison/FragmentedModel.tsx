import { Code2, Cpu, Layers, PenTool, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FRAGMENTED_VENDORS,
  type VendorIconKey,
} from "./comparison.data";

const VENDOR_ICONS: Record<VendorIconKey, typeof Layers> = {
  play: PlayCircle,
  code: Code2,
  cpu: Cpu,
  pen: PenTool,
  layers: Layers,
};

export function FragmentedModel() {
  return (
    <div className="relative space-y-6">
      {/* Header copy */}
      <div className="space-y-2.5">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-[#171513] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#9A938A]">
          THE TRADITIONAL WAY
        </span>
        <h3 className="font-heading text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] text-[#F3EFE9]">
          Fragmented agencies
        </h3>
        <p className="text-[14px] leading-[1.55] text-[#948D84] max-w-[330px]">
          Multiple vendors, more handoffs, and a fragmented outcome.
        </p>
      </div>

      {/* Constellation canvas of five independent vendor tiles */}
      <div className="relative pt-2 pb-4 sm:py-6">
        {/* Subtle elliptical orbital rings & dim disconnected lines */}
        <svg
          aria-hidden="true"
          viewBox="0 0 460 250"
          fill="none"
          className="pointer-events-none absolute inset-0 h-full w-full hidden md:block opacity-75"
        >
          <ellipse
            cx="230"
            cy="132"
            rx="212"
            ry="88"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <ellipse
            cx="230"
            cy="132"
            rx="148"
            ry="60"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          {/* Faint disjoint lines inside constellation */}
          <path
            d="M 92 78 L 222 64 M 256 70 L 368 88 M 148 168 L 294 176 M 216 98 L 154 152 M 340 112 L 302 162"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="1"
          />
        </svg>

        {/* Top row of 3 independent cards */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5 items-center">
          {FRAGMENTED_VENDORS.slice(0, 3).map((vendor) => {
            const Icon = VENDOR_ICONS[vendor.icon];
            return (
              <div
                key={vendor.id}
                data-comp-vendor-card
                style={{ ["--card-rot" as string]: `${vendor.rotationDeg}deg` }}
                className={cn(
                  "flex flex-col items-center justify-center text-center gap-2 rounded-[16px] border border-white/10 bg-gradient-to-b from-[#1D1B1A] to-[#131211] px-3 py-4 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors duration-300",
                  "md:[transform:rotate(var(--card-rot))]",
                  vendor.offsetClass
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-[#ACA49B]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-[12.5px] font-medium leading-[1.25] text-[#D7D0C7]">
                  {vendor.label}
                </span>
              </div>
            );
          })}

          {/* Mobile/tablet slots for items 4 & 5 inside responsive grid */}
          {FRAGMENTED_VENDORS.slice(3).map((vendor, idx) => {
            const Icon = VENDOR_ICONS[vendor.icon];
            return (
              <div
                key={vendor.id}
                data-comp-vendor-card
                style={{ ["--card-rot" as string]: `${vendor.rotationDeg}deg` }}
                className={cn(
                  "md:hidden flex flex-col items-center justify-center text-center gap-2 rounded-[16px] border border-white/10 bg-gradient-to-b from-[#1D1B1A] to-[#131211] px-3 py-4 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.85)]",
                  idx === 1 && "col-span-2 sm:col-span-1"
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-[#ACA49B]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-[12.5px] font-medium leading-[1.25] text-[#D7D0C7]">
                  {vendor.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Desktop offset second row of 2 cards */}
        <div className="relative z-10 hidden md:grid grid-cols-2 gap-4 px-10 mt-4">
          {FRAGMENTED_VENDORS.slice(3).map((vendor) => {
            const Icon = VENDOR_ICONS[vendor.icon];
            return (
              <div
                key={vendor.id}
                data-comp-vendor-card
                style={{ ["--card-rot" as string]: `${vendor.rotationDeg}deg` }}
                className={cn(
                  "flex flex-col items-center justify-center text-center gap-2 rounded-[16px] border border-white/10 bg-gradient-to-b from-[#1D1B1A] to-[#131211] px-3.5 py-4 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] md:[transform:rotate(var(--card-rot))]",
                  vendor.offsetClass
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-[#ACA49B]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-[12.5px] font-medium leading-[1.25] text-[#D7D0C7]">
                  {vendor.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
