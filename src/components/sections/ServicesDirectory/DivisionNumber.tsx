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
        "relative flex h-[68px] sm:h-[82px] w-[88px] sm:w-[116px] shrink-0 items-center pl-4 sm:pl-5 pr-5 transition-all duration-300 overflow-hidden",
        isHighlighted
          ? "bg-[#F07824] text-[#0B0D0F]"
          : "bg-[#F5F2EC] text-[#0B0D0F] group-hover:bg-[#F07824] group-hover:text-[#0B0D0F]"
      )}
      style={{
        clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
      }}
    >
      <span className="font-heading italic font-bold text-[34px] sm:text-[46px] leading-none tracking-[-0.05em] select-none transition-transform duration-300 group-hover:scale-105">
        {number}
      </span>
      {/* Light sweep shimmer overlay on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
    </div>
  );
}

