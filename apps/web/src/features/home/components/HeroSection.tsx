import { HeroIntroduction } from './hero/HeroIntroduction'
import { HeroVisual } from './hero/HeroVisual'
import { ServiceIndex } from './hero/ServiceIndex'
import { HeroScrollIndicator } from './hero/HeroScrollIndicator'

export function HeroSection() {
  return (
    <section className="relative bg-[#0B0C10] min-h-[88vh] lg:min-h-[95vh] flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-6 overflow-hidden">
      {/* ── Main Hero Content Container ── */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex-1 flex flex-col justify-between">
        
        {/* Layer 2: Editorial Introduction & Asymmetric Abstract Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-8 pt-4 lg:pt-8">
          {/* Left: Headline & Introduction (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <HeroIntroduction />
          </div>

          {/* Right: Abstract Generative Sculpture (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <HeroVisual />
          </div>
        </div>

        {/* Layer 3: Editorial Service Index (Three Horizontal Rows) */}
        <ServiceIndex />

        {/* Layer 4: Minimal Footer-Style Scroll Indicator */}
        <HeroScrollIndicator />

      </div>
    </section>
  )
}
