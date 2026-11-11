import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { STUDIO_PRODUCTS } from "./architecture.data";
import { StudioProductRow } from "./StudioProductRow";

export function HybridStudioModel() {
  return (
    <aside
      data-arch-hybrid
      className="relative lg:pl-7 xl:pl-8 lg:border-l border-[#C9C0B6]/80 flex flex-col justify-between space-y-4 pt-1"
    >
      <div className="space-y-2.5">
        <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#111111]">
          HYBRID STUDIO MODEL
        </span>

        <h3 className="text-[26px] sm:text-[30px] lg:text-[27px] xl:text-[33px] font-extrabold text-[#111111] leading-[0.98] tracking-[-1.2px]">
          Client Craft &times;
          <br />
          Studio Products
        </h3>

        <p className="text-[13.5px] sm:text-[14.5px] xl:text-[15px] text-[#333333] leading-[1.42]">
          Client engagements directly fund and pressure-test our internal
          tools&mdash;from multi-agent orchestrators to low-latency voice
          runtimes.
        </p>
      </div>

      <div className="space-y-2">
        {STUDIO_PRODUCTS.map((product) => (
          <StudioProductRow key={product.id} product={product} />
        ))}
      </div>

      <div>
        <Link
          href="/about"
          className="group inline-flex items-center gap-1.5 text-[13px] xl:text-[13.5px] font-semibold text-[#E85D00] hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900] rounded-sm"
        >
          <span>Read about the studio model</span>
          <ArrowUpRight className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </aside>
  );
}

