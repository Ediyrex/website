import { PhilosophyHeader } from "./PhilosophyHeader";
import { PhilosophyIntroduction } from "./PhilosophyIntroduction";
import { PhilosophyDivisionGrid } from "./PhilosophyDivisionGrid";

export function PhilosophySection() {
  return (
    <section
      id="philosophy"
      aria-label="Our Approach — Four Connected Disciplines"
      style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
      className="border-b border-[#343434] bg-[#0C0D0F] py-20 text-[#F5F2EC] lg:py-28"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
        <PhilosophyHeader />
        <PhilosophyIntroduction />
        <PhilosophyDivisionGrid />
      </div>
    </section>
  );
}

