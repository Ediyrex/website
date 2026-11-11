import React from "react";
import { ARCHITECTURE_DIVISIONS } from "./architecture.data";
import { DivisionItem } from "./DivisionItem";

export function DivisionNavigation() {
  return (
    <div className="mt-4 lg:mt-5 pt-4 lg:pt-5 border-t border-[#D9D2C8]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5 xl:gap-6">
        {ARCHITECTURE_DIVISIONS.map((division, idx) => (
          <DivisionItem
            key={division.number}
            division={division}
            showLeftDivider={idx > 0}
          />
        ))}
      </div>
    </div>
  );
}

