import React from "react";
import { Zap, AudioWaveform, Layers } from "lucide-react";
import type { StudioProductItem } from "./architecture.data";

function ProductIcon({ icon }: { icon: StudioProductItem["icon"] }) {
  const className = "w-4 h-4 text-[#111111]/80 shrink-0";
  switch (icon) {
    case "zap":
      return <Zap strokeWidth={1.75} className={className} />;
    case "waveform":
      return <AudioWaveform strokeWidth={1.75} className={className} />;
    case "layers":
      return <Layers strokeWidth={1.75} className={className} />;
  }
}

const STATUS_BADGE_STYLES: Record<StudioProductItem["status"], string> = {
  BETA: "text-[#FF6900] bg-[#FF6900]/[0.09] border border-[#FF6900]/35",
  ALPHA: "text-[#E85D00] bg-[#FF6900]/[0.07] border border-[#FF6900]/25",
  RESEARCH: "text-[#333333] bg-[#E8E1D7]/70 border border-[#C9C0B6]",
};

export function StudioProductRow({ product }: { product: StudioProductItem }) {
  return (
    <div className="group h-10 xl:h-11 rounded-[12px] px-3.5 border border-[#D9D2C8] bg-[#FAF7F2]/75 flex items-center justify-between gap-2.5 transition-colors duration-250 hover:border-[#FF6900]">
      <div className="flex items-center gap-2.5 min-w-0">
        <ProductIcon icon={product.icon} />
        <span className="text-[13px] xl:text-[13.5px] font-medium text-[#111111] truncate">
          {product.name}
        </span>
      </div>

      <span
        style={{ fontFamily: "var(--font-space-mono)" }}
        className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${STATUS_BADGE_STYLES[product.status]}`}
      >
        {product.status}
      </span>
    </div>
  );
}

