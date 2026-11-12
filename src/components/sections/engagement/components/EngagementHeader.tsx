export function EngagementHeader() {
  return (
    <div data-engagement-header className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-[#252525]/70 shrink-0" aria-hidden="true" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#4B4742]">
          ENGAGEMENT MODEL
        </span>
      </div>

      <h2 className="font-heading font-bold tracking-[-0.03em] text-[#111111] text-[clamp(2.25rem,4.4vw,3.85rem)] leading-[1.03]">
        Flexible ways to begin
        <br />
        working{" "}
        <span className="font-serif italic font-normal text-[#111111]">
          together
        </span>
        <span className="text-[#FF6900]" aria-hidden="true">
          .
        </span>
      </h2>
    </div>
  );
}

