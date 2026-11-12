import React from "react";
import { IN_HOUSE_PRODUCTS } from "../data/studioProducts";
import { ProductCard } from "./ProductCard";

export function InHouseProducts() {
  return (
    <div className="space-y-6">
      {/* Header Row: Left Heading + Right Supporting Description */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-[28px] sm:text-[32px] font-bold text-[#111111] leading-[1.1] tracking-[-0.03em]">
            Our in-house products
          </h3>
        </div>

        <p className="text-[14px] sm:text-[15px] text-[#44403D] leading-[1.45] sm:text-right max-w-[260px]">
          Studio-built systems born from real client challenges.
        </p>
      </div>

      {/* Three Equal-Sized Clickable Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
        {IN_HOUSE_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

