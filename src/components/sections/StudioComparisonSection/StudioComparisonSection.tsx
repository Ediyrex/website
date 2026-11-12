"use client";

import { useEffect, useRef, useState } from "react";
import { AdvantageGrid } from "./AdvantageGrid";
import { initStudioComparisonAnimations } from "./animations";
import { ComparisonHeader } from "./ComparisonHeader";
import { EdiyrexModel } from "./EdiyrexModel";
import { TraditionalModel } from "./TraditionalModel";
import { TransitionArrow } from "./TransitionArrow";

export function StudioComparisonSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ediyrexPanelRef = useRef<HTMLDivElement>(null);
  const [mobileHighlighted, setMobileHighlighted] = useState(false);

  useEffect(() => {
    return initStudioComparisonAnimations(sectionRef.current);
  }, []);

  const handleToggleMobileHighlight = () => {
    setMobileHighlighted((prev) => !prev);
    ediyrexPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  return (
    <section
      id="comparison"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FAF6F0] border-t border-[#E5DED5] py-20 sm:py-24 lg:py-[112px]"
    >
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-[5.5vw] space-y-12 lg:space-y-14">
        {/* Area 1: Editorial Heading */}
        <ComparisonHeader />

        {/* Area 2: Side-by-Side Comparison Panels + Transition Arrow */}
        <div className="grid grid-cols-1 lg:grid-cols-[48fr_auto_52fr] gap-5 sm:gap-6 lg:gap-5 items-stretch">
          <TraditionalModel />
          <TransitionArrow
            onToggleMobileHighlight={handleToggleMobileHighlight}
          />
          <EdiyrexModel
            ref={ediyrexPanelRef}
            mobileHighlighted={mobileHighlighted}
          />
        </div>

        {/* Area 3: Five Key Advantages */}
        <AdvantageGrid />
      </div>
    </section>
  );
}

