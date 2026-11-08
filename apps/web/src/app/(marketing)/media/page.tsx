'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Film, Camera, Clapperboard, Video, Sparkles, Play, CheckCircle2 } from 'lucide-react'

const MEDIA_SERVICES = [
  {
    icon: Film,
    title: 'Commercials & Brand Films',
    desc: 'Cinematic visual narratives crafted with cinema-grade cameras, lighting, and sound to position your brand at the highest standard.',
    tags: ['Brand Campaigns', 'Product Commercials', 'Founder Stories'],
  },
  {
    icon: Video,
    title: 'Short-Form & Social Content',
    desc: 'Scroll-stopping Reels, TikToks, and YouTube Shorts designed with precise pacing and visual hooks to maximize engagement.',
    tags: ['Instagram Reels', 'YouTube Shorts', 'Social Storytelling'],
  },
  {
    icon: Camera,
    title: 'Commercial Photography',
    desc: 'Editorial product, lifestyle, and architectural photography with meticulous composition, mood, and color grading.',
    tags: ['Studio Photography', 'Lookbooks', 'Executive Portraits'],
  },
  {
    icon: Clapperboard,
    title: 'Post-Production & Editing',
    desc: 'Rhythmic editing, fine color grading, audio restoration, sound design, and master finishing for delivery across all platforms.',
    tags: ['Color Grading', 'Sound Design', 'Master Delivery'],
  },
  {
    icon: Sparkles,
    title: 'Motion Graphics & VFX',
    desc: 'Dynamic 2D/3D typography, animated brand assets, UI screen simulations, and visual effects that elevate production value.',
    tags: ['Title Sequences', 'UI Animation', '3D Graphics'],
  },
  {
    icon: Film,
    title: 'Podcast & Studio Production',
    desc: 'Multi-camera studio setups, high-fidelity audio engineering, and episodic content atomization for podcast shows.',
    tags: ['Multi-Cam Recording', 'Audio Mastering', 'Video Podcasts'],
  },
]

const PRODUCTION_PROCESS = [
  {
    step: '01',
    name: 'Discovery & Creative Direction',
    desc: 'We define the narrative arc, moodboards, visual treatment, and key messaging aligned with your brand identity.',
  },
  {
    step: '02',
    name: 'Pre-Production & Storyboarding',
    desc: 'Detailed scripting, shot lists, location scouting, crew assembly, and scheduling to ensure zero friction on shoot day.',
  },
  {
    step: '03',
    name: 'Principal Photography',
    desc: 'Direction and capture using professional cinema rigs, anamorphic lenses, controlled lighting, and high-fidelity sound.',
  },
  {
    step: '04',
    name: 'Post-Production & Color Finishing',
    desc: 'Offline edit, sound design, DaVinci Resolve color grading, motion graphics pass, and multi-format delivery.',
  },
]

export default function MediaPage() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="bg-[#0B0C10] min-h-screen text-[#EAEAEA] pt-[82px]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
              <p className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#00E5FF]">
                DIVISION 01 // MEDIA PRODUCTION
              </p>
            </div>
            <h1 className="font-manrope font-semibold text-[42px] sm:text-[56px] lg:text-[68px] leading-[0.98] tracking-[-0.035em] text-[#00E5FF] mb-6 drop-shadow-[0_0_35px_rgba(0,229,255,0.15)]">
              Cinematic storytelling.
              <br />
              <span className="text-[#EAEAEA]">Engineered to move.</span>
            </h1>
            <p className="font-inter text-[#999999] text-[15px] sm:text-[16px] leading-relaxed max-w-2xl mb-8">
              We produce high-impact brand films, commercials, documentaries, and social content. 
              From initial narrative concept through cinema-grade shoot and meticulous DaVinci color grading, 
              we craft visuals that captivate audiences.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {/* Button in Neon Lime strictly */}
              <Link
                href="/contact?division=media"
                className="inline-flex items-center justify-center gap-2 px-6 h-[44px] rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-semibold text-[12px] uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(57,255,20,0.25)] group"
              >
                <span>Start a Media Project</span>
                <ArrowUpRight size={14} className="text-[#0B0C10] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                href="/work?division=media"
                className="inline-flex items-center gap-2 px-5 h-[44px] rounded-md border border-white/[0.15] hover:border-[#00E5FF] text-[#EAEAEA] hover:text-[#00E5FF] font-mono text-[12px] uppercase tracking-wider transition-colors"
              >
                <span>View Media Work</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Cinema Reel Showcase with Neon Lime Play Trigger ── */}
      <section className="py-20 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E5FF]">
              SHOWCASE // 2026 REEL
            </span>
            <span className="font-mono text-[11px] text-[#666666] uppercase">
              4K CINEMA MASTER &middot; 24FPS
            </span>
          </div>

          <div className="relative aspect-[21/9] w-full rounded-xl bg-[#12141A] border border-white/[0.08] overflow-hidden flex items-center justify-center group shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            {/* Subtle background architectural graphic lines */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.15) 0%, transparent 60%)',
              }}
            />

            {/* Video overlay info */}
            <div className="absolute top-6 left-6 z-20 font-mono text-[11px] text-[#00E5FF] tracking-wider">
              <span>EDIYREX // CINEMATIC REEL VOL.01</span>
            </div>

            {/* Neon Lime Play Trigger strictly */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative z-30 w-20 h-20 rounded-full bg-[#39FF14] text-[#0B0C10] flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_0_30px_rgba(57,255,20,0.45)] group-hover:shadow-[0_0_45px_rgba(57,255,20,0.65)]"
              aria-label="Play Video Reel"
            >
              <Play size={26} className="fill-[#0B0C10] stroke-[#0B0C10] ml-1" />
            </button>

            {/* Ambient status indicator */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between font-mono text-[10px] text-[#666666] uppercase tracking-wider">
              <span>SOUND DESIGN: DOLBY MASTER</span>
              <span>RUN TIME: 01:42</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section className="py-20 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#00E5FF] mb-2">
                WHAT WE CREATE
              </p>
              <h2 className="font-manrope font-semibold text-[32px] sm:text-[42px] leading-tight text-[#00E5FF]">
                PRODUCTION CAPABILITIES
              </h2>
            </div>
            <p className="font-inter text-[#999999] text-[13.5px] max-w-md leading-relaxed">
              Every production is tailored to the distribution channel — whether high-resolution 4K broadcast or vertical mobile formats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEDIA_SERVICES.map((srv, idx) => {
              const Icon = srv.icon
              return (
                <div
                  key={idx}
                  className="rounded-lg bg-[#12141A] border border-white/[0.08] hover:border-[#00E5FF]/40 transition-all duration-300 p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-md bg-[#0B0C10] border border-white/[0.08] flex items-center justify-center text-[#00E5FF] mb-5 group-hover:scale-105 transition-transform">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-manrope font-semibold text-[18px] text-[#EAEAEA] group-hover:text-[#00E5FF] transition-colors mb-2">
                      {srv.title}
                    </h3>
                    <p className="font-inter text-[#999999] text-[13px] leading-relaxed mb-6">
                      {srv.desc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                    {srv.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-[#00E5FF] opacity-80 px-2.5 py-0.5 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Production Process ── */}
      <section className="py-20 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="mb-14">
            <p className="font-mono text-[10px] tracking-[2px] uppercase text-[#00E5FF] mb-2">
              METHODOLOGY
            </p>
            <h2 className="font-manrope font-semibold text-[32px] sm:text-[42px] leading-tight text-[#00E5FF]">
              THE PRODUCTION PROCESS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTION_PROCESS.map((proc) => (
              <div
                key={proc.step}
                className="rounded-lg bg-[#12141A] border border-white/[0.08] p-6 relative hover:border-[#00E5FF]/40 transition-colors"
              >
                <span className="font-mono text-[#00E5FF] text-[13px] font-bold block mb-4">
                  {proc.step}
                </span>
                <h3 className="font-manrope font-semibold text-[16px] text-[#EAEAEA] mb-2">
                  {proc.name}
                </h3>
                <p className="font-inter text-[#999999] text-[12.5px] leading-relaxed">
                  {proc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Callout ── */}
      <section className="py-20 bg-[#0B0C10]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 text-center">
          <h2 className="font-manrope font-semibold text-[32px] sm:text-[46px] text-[#00E5FF] mb-4">
            HAVE A PRODUCTION IN MIND?
          </h2>
          <p className="font-inter text-[#999999] text-[14px] max-w-lg mx-auto mb-8">
            Tell us about your project, timeline, and vision. We will assemble the creative treatment and plan the production.
          </p>
          <Link
            href="/contact?division=media"
            className="inline-flex items-center gap-2 px-7 h-[44px] rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-semibold text-[12px] uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(57,255,20,0.25)] group"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={14} className="text-[#0B0C10] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
