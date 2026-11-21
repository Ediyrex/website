import { cn } from "@/lib/utils";
import { STUDIO_DIRECTORY_METRICS } from "./services.data";

export function StudioMetrics() {
  return (
    <div className="grid grid-cols-3 divide-x divide-[#343940] pt-1">
      {STUDIO_DIRECTORY_METRICS.map((metric, idx) => (
        <div
          key={metric.label}
          className={cn(
            "group/metric cursor-default transition-transform duration-200 hover:-translate-y-0.5",
            idx === 0 ? "pr-4" : idx === 1 ? "px-4 sm:px-6" : "pl-4 sm:pl-6"
          )}
        >
          <div className="font-heading text-[24px] font-bold leading-none text-[#F5F2EC] transition-colors duration-200 group-hover/metric:text-[#F07824] sm:text-[28px]">
            {metric.value}
          </div>
          <div className="mt-1.5 text-[11.5px] text-[#858991] transition-colors duration-200 group-hover/metric:text-[#B8B9BC] sm:text-[12.5px]">
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}

