"use client";

import { useState } from "react";
import type { ServiceDivision } from "@/types";
import { DIRECTORY_DIVISIONS } from "./services.data";
import { DivisionAccordion } from "./DivisionAccordion";

export function DivisionList() {
  const [activeDivision, setActiveDivision] = useState<ServiceDivision | null>(
    null,
  );

  const handleToggle = (divisionId: ServiceDivision) => {
    setActiveDivision((current) =>
      current === divisionId ? null : divisionId,
    );
  };

  return (
    <div className="mt-12 flex flex-col gap-4 sm:mt-14">
      {DIRECTORY_DIVISIONS.map((division, index) => {
        const isExpanded = activeDivision === division.id;
        const isHighlighted =
          activeDivision === null ? index === 0 : isExpanded;

        return (
          <DivisionAccordion
            key={division.id}
            division={division}
            isExpanded={isExpanded}
            isHighlighted={isHighlighted}
            onToggle={() => handleToggle(division.id)}
          />
        );
      })}
    </div>
  );
}

