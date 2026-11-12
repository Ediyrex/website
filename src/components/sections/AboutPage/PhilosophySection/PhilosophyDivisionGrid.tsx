import { PHILOSOPHY_DIVISIONS } from "./philosophy.data";
import { PhilosophyDivisionItem } from "./PhilosophyDivisionItem";

export function PhilosophyDivisionGrid() {
  return (
    <div className="mt-14 grid grid-cols-1 border-t border-[#343434] md:grid-cols-2 xl:mt-16 xl:grid-cols-4 xl:border-t-0">
      {PHILOSOPHY_DIVISIONS.map((division, index) => (
        <PhilosophyDivisionItem
          key={division.id}
          division={division}
          index={index}
        />
      ))}
    </div>
  );
}

