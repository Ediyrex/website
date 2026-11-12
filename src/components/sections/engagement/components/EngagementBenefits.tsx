import { Check } from "lucide-react";

interface EngagementBenefitsProps {
  benefits: readonly string[];
}

export function EngagementBenefits({ benefits }: EngagementBenefitsProps) {
  return (
    <ul className="space-y-3.5 py-1">
      {benefits.map((benefit) => (
        <li key={benefit} className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#FF6900]/65 bg-[#FFF4E8] text-[#E65100]"
            aria-hidden="true"
          >
            <Check className="h-3 w-3 stroke-[2.5]" />
          </span>
          <span className="text-[14px] leading-[1.45] text-[#2B2825]">
            {benefit}
          </span>
        </li>
      ))}
    </ul>
  );
}

