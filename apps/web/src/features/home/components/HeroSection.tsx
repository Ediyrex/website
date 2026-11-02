import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center pt-24 pb-16 overflow-hidden bg-[#08090b]">
      {/* High-Resolution Background Composition */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/hero-camera-original.jpg"
          alt="Cinematic production camera and modern software terminal interface"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-right lg:object-[82%_center]"
        />

        {/* Cinematic gradient mask - perfectly calibrated to leave the orange anamorphic streak and camera bright and punchy */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#08090b] via-[#08090b]/85 to-transparent w-full lg:w-[58%]"
        />
        {/* Soft bottom edge blend */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#08090b] to-transparent"
        />
        {/* Soft top edge blend under header */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#08090b] to-transparent"
        />
      </div>

      <div className="container-main relative z-10 w-full">
        {/* Decorative Corner Brackets */}
        <div className="border-t border-l border-[#2a2f3a] w-5 h-5 absolute -top-10 left-0 pointer-events-none" />
        <div className="border-t border-r border-[#2a2f3a] w-5 h-5 absolute -top-10 right-0 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-6">
            {/* Eyebrow Label */}
            <p className="text-[11px] font-mono tracking-[0.24em] text-[#8c92a4] uppercase mb-6">
              A CREATIVE × TECHNOLOGY STUDIO
            </p>

            {/* Main Headline */}
            <h1 className="font-sans font-extrabold text-[44px] sm:text-[60px] lg:text-[66px] leading-[0.98] tracking-[-0.03em] text-[#f5f3ee] uppercase mb-6">
              CREATIVE <br />
              MEDIA. <br />
              POWERFUL WEB. <br />
              INTELLIGENT{' '}
              <span className="font-editorial-italic font-normal tracking-normal lowercase text-[#f5f3ee]">
                agents.
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-[13px] sm:text-[14px] text-[#8c92a4] max-w-[460px] leading-relaxed mb-9">
              We create high-impact content, build modern web experiences, and automate real work with AI agents and intelligent workflows.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[6px] bg-[#f5f3ee] text-[#17130b] font-semibold text-[12px] tracking-wide uppercase hover:bg-white transition-colors duration-200"
              >
                <span>Start a Project</span>
                <ArrowUpRight size={13} className="stroke-[2.5]" />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-4 py-3 text-[12px] font-medium tracking-wide text-[#f5f3ee] hover:text-[#8c92a4] transition-colors duration-200"
              >
                <span>Explore Our Work</span>
                <Play size={11} className="fill-[#f5f3ee] stroke-none ml-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Spacer & Metadata */}
          <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-[460px] flex items-end justify-end pointer-events-none">
            {/* Vertical Division Indicator on right edge */}
            <div className="absolute right-0 bottom-4 z-20 flex flex-col items-end text-[9px] font-mono tracking-widest text-[#777d87] leading-tight select-none">
              <span className="text-[#f5f3ee] font-bold">MEDIA</span>
              <span className="text-[#8c92a4]">WEB</span>
              <span>AGENTS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
