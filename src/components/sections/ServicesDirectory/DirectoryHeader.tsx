import { StudioMetrics } from "./StudioMetrics";

export function DirectoryHeader() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
      <div className="lg:col-span-7 space-y-4">
        <h2 className="font-heading font-semibold tracking-[-0.03em] text-[#F5F2EC] text-[clamp(2.25rem,4.1vw,3.8rem)] leading-[1.03]">
          A Complete Suite of
          <br />
          Creative, Digital &amp;
          <br />
          Intelligent{" "}
          <span className="italic text-[#F07824]">Capabilities.</span>
        </h2>
        <p className="max-w-[660px] text-[15.5px] sm:text-[17px] leading-[1.6] text-[#858991]">
          Every service can be commissioned independently or orchestrated
          together under one unified engagement.
        </p>
      </div>

      <div className="lg:col-span-5 lg:border-l lg:border-[#343940] lg:pl-10 space-y-6">
        <p className="text-[15.5px] sm:text-[17px] leading-[1.6] text-[#B8B9BC]">
          From brand strategy and content production to web platforms and AI
          automation, our services cover the entire build–grow–operate
          journey.
        </p>
        <StudioMetrics />
      </div>
    </div>
  );
}

