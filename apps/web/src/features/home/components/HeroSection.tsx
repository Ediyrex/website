import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Play } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-[72px] overflow-hidden bg-[#08090B]">
      {/* Background artwork layer */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/images/hero-camera-original.jpg"
          alt="Cinematic production camera and software interface"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-[78%_center] lg:object-[82%_center]"
        />

        {/* Seamless dark gradient to guarantee headline contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#08090B] via-[#08090B]/92 to-transparent w-full lg:w-[58%]"
        />
        {/* Soft bottom blend */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#08090B] to-transparent"
        />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 relative z-10 pt-10 pb-16 lg:pb-24">
        {/* Thin Open Corner Brackets (1px stroke, subdued gray) */}
        <div className="border-t border-l border-[#3A414B] w-4 h-4 absolute top-2 left-6 sm:left-10 pointer-events-none" />
        <div className="border-t border-r border-[#3A414B] w-4 h-4 absolute top-2 right-6 sm:right-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px] lg:min-h-[500px]">
          {/* Left Column: Eyebrow, Stacked Headline, Supporting Text, CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start pt-4">
            {/* Eyebrow text: Inter Medium, 10-11px, letter-spacing 1.5px, uppercase, off-white */}
            <p className="font-inter font-medium text-[10.5px] tracking-[1.5px] uppercase text-[#F5F3EE]/80 mb-5">
              A CREATIVE × TECHNOLOGY STUDIO
            </p>

            {/* Headline: Manrope 800, 49-53px, line-height 0.94-1.0, tracking -2px to -2.5px */}
            <h1 className="font-manrope font-[800] text-[40px] sm:text-[48px] lg:text-[51px] leading-[0.96] tracking-[-2px] text-[#F5F3EE] uppercase max-w-[570px] mb-6">
              CREATIVE <br />
              MEDIA. <br />
              POWERFUL WEB. <br />
              <span className="whitespace-nowrap">INTELLIGENT AGENTS.</span>
            </h1>

            {/* Supporting paragraph: Inter Regular 13-14px, line-height 1.4, max-width ~440px, color #D0CFCC */}
            <p className="font-inter font-normal text-[13.5px] leading-[1.4] text-[#D0CFCC] max-w-[445px] mb-8">
              We create high-impact content, build modern web experiences, and automate real work with AI agents and intelligent workflows.
            </p>

            {/* CTAs: 140x37px primary ivory button + secondary link with 26px separation */}
            <div className="flex items-center gap-[26px]">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-1.5 w-[140px] h-[37px] rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[11.5px] transition-colors duration-200"
              >
                <span>Start a Project</span>
                <ArrowUpRight size={13} className="stroke-[2.5]" />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 font-inter font-medium text-[11.5px] text-[#F5F3EE] hover:text-[#D0CFCC] transition-colors duration-200"
              >
                <span>Explore Our Work</span>
                <Play size={10} className="fill-[#F5F3EE] stroke-[#F5F3EE]" />
              </Link>
            </div>
          </div>

          {/* Right Area: Spacer allowing the camera & terminals to shine through, plus vertical label */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[440px] flex items-end justify-end pointer-events-none">
            {/* Vertical label: Inter Medium, 9-10px, thin vertical divider */}
            <div className="absolute right-0 bottom-4 z-20 flex flex-col items-end text-[9.5px] font-inter font-medium tracking-widest text-[#777D87] leading-tight select-none">
              <span className="text-[#F5F3EE] font-semibold">MEDIA</span>
              <span className="text-[#D0CFCC]">WEB</span>
              <span>AGENTS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
