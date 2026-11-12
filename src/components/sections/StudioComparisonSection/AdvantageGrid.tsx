import { AdvantageCard } from "./AdvantageCard";
import { KEY_ADVANTAGES } from "./comparison.data";

export function AdvantageGrid() {
  return (
    <div className="space-y-7 pt-2">
      {/* Centered editorial divider */}
      <div className="flex items-center gap-5 sm:gap-7">
        <div
          className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D9D0C6]"
          aria-hidden="true"
        />
        <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.22em] text-[#9E6E47] whitespace-nowrap">
          FIVE KEY ADVANTAGES
        </span>
        <div
          className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D9D0C6]"
          aria-hidden="true"
        />
      </div>

      {/* Responsive 5-card grid (1 col mobile -> 2 col sm -> 3+2 tablet -> 5 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5">
        {KEY_ADVANTAGES.map((advantage) => (
          <AdvantageCard key={advantage.id} advantage={advantage} />
        ))}
      </div>
    </div>
  );
}

