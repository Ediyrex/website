export function ComparisonHeader() {
  return (
    <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      {/* Left column */}
      <div className="lg:col-span-7 space-y-5">
        <div data-comp-eyebrow className="flex items-center gap-3.5">
          <span
            className="h-px w-8 bg-[#FF8A24]"
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7B66D]">
            STUDIO COMPARISON
          </span>
        </div>

        <h2
          data-comp-title
          className="font-heading font-bold tracking-[-0.03em] text-[#F7F3ED] text-[clamp(2.35rem,4.5vw,4.1rem)] leading-[1.02]"
        >
          <span className="block">One connected studio.</span>
          <span className="block font-serif italic font-normal text-[#EDE5DB] mt-1">
            Not five disconnected vendors
            <span
              aria-hidden="true"
              className="ml-2.5 inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-[#FF8A24] align-baseline shadow-[0_0_12px_rgba(255,138,36,0.65)]"
            />
          </span>
        </h2>
      </div>

      {/* Right column */}
      <div
        data-comp-subtitle
        className="lg:col-span-5 lg:pt-8"
      >
        <div className="lg:border-l lg:border-white/15 lg:pl-7 space-y-4 max-w-[420px]">
          <p className="text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.55] text-[#D7D0C7]">
            A unified approach to creativity, technology and intelligent
            execution.
          </p>
          <div
            className="h-[2px] w-10 rounded-full bg-gradient-to-r from-[#FF8A24] to-[#FFB347]/40"
            aria-hidden="true"
          />
        </div>
      </div>
    </header>
  );
}
