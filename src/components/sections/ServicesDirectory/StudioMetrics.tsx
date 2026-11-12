import { STUDIO_DIRECTORY_METRICS } from "./services.data";

export function StudioMetrics() {
  return (
    <div className="grid grid-cols-3 divide-x divide-[#343940] pt-1">
      {STUDIO_DIRECTORY_METRICS.map((metric, idx) => (
        <div
          key={metric.label}
          className={
            idx === 0 ? "pr-4" : idx === 1 ? "px-4 sm:px-6" : "pl-4 sm:pl-6"
          }
        >
          <div className="font-heading text-[24px] sm:text-[28px] font-bold leading-none text-[#F5F2EC]">
            {metric.value}
          </div>
          <div className="mt-1.5 text-[11.5px] sm:text-[12.5px] text-[#858991]">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}

