export function PhilosophyIntroduction() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[54%_1px_1fr] lg:items-center lg:gap-10">
      <h2
        style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
        className="text-[clamp(2.25rem,4.2vw,3.9rem)] font-bold leading-[0.98] tracking-[-0.03em] text-[#F5F2EC]"
      >
        Why four disciplines
        <br />
        work better{" "}
        <span className="italic text-[#F06419]">together.</span>
      </h2>

      <div
        className="hidden h-full min-h-[84px] w-px bg-[#343434] lg:block"
        aria-hidden="true"
      />

      <p className="max-w-[580px] text-[17px] leading-[1.6] text-[#B8B9BC] sm:text-[18.5px]">
        Strategy, storytelling, technology and intelligence operate as a
        connected system — giving us greater context, faster execution and
        stronger outcomes.
      </p>
    </div>
  );
}

