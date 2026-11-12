import { cn } from "@/lib/utils";

interface DivisionNumberProps {
  number: string;
  isHighlighted: boolean;
}

export function DivisionNumber({
  number,
  isHighlighted,
}: DivisionNumberProps) {
  return (
    <div
      className={cn(
        "flex h-[68px] sm:h-[82px] w-[88px] sm:w-[116px] shrink-0 items-center pl-4 sm:pl-5 pr-5 transition-colors duration-300",
        isHighlighted
          ? "bg-[#F07824] text-[#0B0D0F]"
          : "bg-[#F5F2EC] text-[#0B0D0F] group-hover:bg-[#FFF9F2]"
      )}
      style={{
        clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
      }}
    >
      <span className="font-heading italic font-bold text-[34px] sm:text-[46px] leading-none tracking-[-0.05em] select-none">
        {number}
      </span>
    </div>
  );
}

