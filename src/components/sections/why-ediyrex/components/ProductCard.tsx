import React from "react";
import Link from "next/link";
import { ArrowRight, Zap, Mic, Layers } from "lucide-react";
import type {
  InHouseProductItem,
  InHouseProductVisual,
} from "../data/studioProducts";

function ProductIcon({ visual }: { visual: InHouseProductVisual }) {
  const className = "w-4 h-4 text-[#FF6500] shrink-0";
  switch (visual) {
    case "energy":
      return <Zap strokeWidth={1.75} className={className} />;
    case "waveform":
      return <Mic strokeWidth={1.75} className={className} />;
    case "layers":
      return <Layers strokeWidth={1.75} className={className} />;
  }
}

function ProductArt({ visual }: { visual: InHouseProductVisual }) {
  if (visual === "energy") {
    return (
      <div className="relative w-full h-24 rounded-[14px] bg-[#FFE2C5]/55 overflow-hidden p-3.5 transition-transform duration-350 ease-out group-hover:scale-[1.03]">
        <svg
          aria-hidden="true"
          viewBox="0 0 220 90"
          fill="none"
          className="absolute inset-0 w-full h-full"
        >
          <path
            d="M 40 88 C 85 52, 130 62, 225 14"
            stroke="#FF6500"
            strokeOpacity="0.45"
            strokeWidth="1.25"
          />
          <path
            d="M 70 88 C 115 60, 155 68, 225 32"
            stroke="#D94B00"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          <circle cx="154" cy="48" r="26" fill="#FF6500" fillOpacity="0.12" />
        </svg>
        <div className="relative z-10 w-10 h-10 rounded-xl bg-white/75 border border-[#FF6500]/25 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <ProductIcon visual={visual} />
        </div>
      </div>
    );
  }

  if (visual === "waveform") {
    return (
      <div className="relative w-full h-24 rounded-[14px] bg-[#F7F1EA] border border-[#D8CEC3]/50 overflow-hidden p-3.5 transition-transform duration-350 ease-out group-hover:scale-[1.03]">
        <svg
          aria-hidden="true"
          viewBox="0 0 220 90"
          fill="none"
          className="absolute inset-0 w-full h-full"
        >
          <path
            d="M 10 64 Q 65 20, 125 56 T 225 38"
            stroke="#FF6500"
            strokeOpacity="0.42"
            strokeWidth="1.35"
          />
          <path
            d="M 10 74 Q 80 42, 145 68 T 225 54"
            stroke="#D94B00"
            strokeOpacity="0.28"
            strokeWidth="1"
          />
          <ellipse
            cx="175"
            cy="50"
            rx="38"
            ry="28"
            fill="#FFE2C5"
            fillOpacity="0.55"
          />
        </svg>
        <div className="relative z-10 w-10 h-10 rounded-xl bg-[#FFE2C5]/65 border border-[#FF6500]/25 flex items-center justify-center shadow-sm">
          <ProductIcon visual={visual} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-24 rounded-[14px] bg-[#F1E9DF] overflow-hidden p-3.5 transition-transform duration-350 ease-out group-hover:scale-[1.03]">
      <svg
        aria-hidden="true"
        viewBox="0 0 220 90"
        fill="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M 30 85 C 90 35, 155 45, 225 18"
          stroke="#FF6500"
          strokeOpacity="0.38"
          strokeWidth="1.2"
        />
        <rect
          x="132"
          y="18"
          width="56"
          height="42"
          rx="8"
          stroke="#D94B00"
          strokeOpacity="0.25"
          strokeWidth="1"
          fill="#FFE2C5"
          fillOpacity="0.3"
        />
        <rect
          x="146"
          y="28"
          width="56"
          height="42"
          rx="8"
          stroke="#FF6500"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      </svg>
      <div className="relative z-10 w-10 h-10 rounded-xl bg-white/80 border border-[#D8CEC3] flex items-center justify-center shadow-sm">
        <ProductIcon visual={visual} />
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<InHouseProductItem["status"], string> = {
  BETA: "border-[#FF6500]/45 bg-[#FFE2C5]/45 text-[#D94B00]",
  ALPHA: "border-[#FF6500]/30 bg-[#FFF3E6] text-[#D94B00]",
  RESEARCH: "border-[#D8CEC3] bg-[#F1E9DF] text-[#44403D]",
};

export function ProductCard({ product }: { product: InHouseProductItem }) {
  return (
    <Link
      href={product.href}
      data-we-product-card
      aria-label={`${product.name} (${product.status}) — ${product.description}`}
      className="group flex flex-col justify-between h-full rounded-[22px] bg-white/85 backdrop-blur-sm border border-[#D8CEC3] p-4 sm:p-5 shadow-[0_10px_28px_-16px_rgba(17,17,17,0.12)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#FF6500]/60 hover:shadow-[0_20px_42px_-16px_rgba(255,101,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6500]"
    >
      <div>
        <ProductArt visual={product.visual} />

        <div className="mt-4 flex items-center justify-between gap-2">
          <h4 className="text-[20px] sm:text-[22px] font-bold text-[#111111] tracking-[-0.02em] leading-tight">
            {product.name}
          </h4>

          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${STATUS_STYLES[product.status]}`}
          >
            {product.status}
          </span>
        </div>

        <p className="mt-2 text-[13.5px] sm:text-[14.5px] text-[#44403D] leading-[1.48]">
          {product.description}
        </p>
      </div>

      <div className="mt-5 flex justify-end">
        <span
          aria-hidden="true"
          className="w-8 h-8 rounded-full border border-[#D8CEC3] flex items-center justify-center text-[#111111] transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:border-[#FF6500] group-hover:text-[#FF6500]"
        >
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
        </span>
      </div>
    </Link>
  );
}

