export function PhilosophyHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex shrink-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 bg-[#F06419]"
        />
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F5F2EC] sm:text-[13px]">
          OUR APPROACH
        </span>
      </div>
      <div className="h-px flex-1 bg-[#343434]" aria-hidden="true" />
    </div>
  );
}

