export function HeroScrollIndicator() {
  return (
    <div className="w-full pt-10 pb-4 flex items-center justify-between text-[#666666] font-mono text-[10px] uppercase tracking-[0.2em] border-t border-white/[0.06] select-none">
      <div>
        <span>EDIYREX // STUDIO SPECIFICATION &copy; 2026</span>
      </div>

      <div className="flex items-center gap-2">
        <span>SCROLL TO EXPLORE</span>
        <div className="w-3 h-3 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF] animate-pulse" />
        </div>
      </div>
    </div>
  )
}

