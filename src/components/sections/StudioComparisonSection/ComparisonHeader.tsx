export function ComparisonHeader() {
  return (
    <header>
      {/* Two-column editorial heading & description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
        <div className="lg:col-span-8">
          <h2 className="tracking-[-0.03em] text-[#111111] text-[clamp(2.375rem,4.1vw,4.15rem)] leading-[1.03]">
            <span
              data-sc-headline-line
              className="block font-heading font-bold"
            >
              One connected studio
              <span className="text-[#FF7900]" aria-hidden="true">
                .
              </span>
            </span>
            <span
              data-sc-headline-line
              className="block font-serif italic font-normal mt-1"
            >
              Not five disconnected vendors
              <span
                aria-hidden="true"
                className="ml-2 inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-[#FF7900] align-baseline"
              />
            </span>
          </h2>
        </div>

        <div className="lg:col-span-4">
          <div className="lg:border-l lg:border-[#D9D0C6] lg:pl-7 space-y-3.5 max-w-[400px]">
            <p
              data-sc-subtext
              className="text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.55] text-[#48433F]"
            >
              A unified approach to creativity, technology and intelligent
              execution.
            </p>
            <div
              data-sc-accent-rule
              className="h-[2px] w-10 bg-[#FF7900]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

