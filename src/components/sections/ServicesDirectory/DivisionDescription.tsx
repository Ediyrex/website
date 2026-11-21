interface DivisionDescriptionProps {
  name: string;
  description: string;
}

export function DivisionDescription({
  name,
  description,
}: DivisionDescriptionProps) {
  return (
    <div className="min-w-0 space-y-1 transition-transform duration-300 group-hover:translate-x-1">
      <h3 className="font-heading text-[20px] sm:text-[26px] lg:text-[30px] font-semibold tracking-[-0.02em] leading-[1.15] text-[#F5F2EC] group-hover:text-[#F07824] transition-colors duration-200">
        {name}
      </h3>
      <p className="text-[13.5px] sm:text-[15px] leading-[1.45] text-[#858991] group-hover:text-[#B8B9BC] transition-colors duration-200">
        {description}
      </p>
    </div>
  );
}

