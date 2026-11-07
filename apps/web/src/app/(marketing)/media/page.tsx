import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Film, Camera, Clapperboard, Video, Sparkles, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Media Production & Visual Storytelling — EDIYREX®',
  description:
    'High-impact video production, commercial filmmaking, photography, editing, and motion graphics crafted for brands, creators, and businesses.',
}

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
  return (
    <div className="bg-[#08090B] min-h-screen text-[#F5F3EE] pt-[72px]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-[#292929]/70">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-3xl">
            <p className="font-inter font-medium text-[10.5px] tracking-[2px] uppercase text-[#E58A76] mb-4">
              DIVISION 01 — MEDIA PRODUCTION
            </p>
            <h1 className="font-manrope font-extrabold text-[42px] sm:text-[56px] lg:text-[68px] leading-[0.96] tracking-[-2.5px] uppercase mb-6">
              CINEMATIC STORYTELLING.
              <br />
              <span className="text-[#E58A76]">UNCOMPROMISED</span> QUALITY.
            </h1>
            <p className="font-inter text-[#B2B4BA] text-[15px] sm:text-[16px] leading-relaxed max-w-2xl mb-8">
              We produce high-impact brand films, commercials, documentaries, and social content. 
              From initial narrative concept through cinema-grade shoot and meticulous post-production, 
              we craft visuals that captivate audiences and elevate your brand.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact?division=media"
                className="inline-flex items-center justify-center gap-2 px-6 h-[42px] rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] transition-colors"
              >
                <span>Start a Media Project</span>
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
              <Link
                href="/work?division=media"
                className="inline-flex items-center gap-2 px-5 h-[42px] rounded-[10px] border border-[#3A414B] hover:border-[#F5F3EE] text-[#F5F3EE] font-inter font-medium text-[12px] transition-colors"
              >
                <span>View Media Work</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section className="py-20 border-b border-[#292929]/60">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="font-inter font-medium text-[10px] tracking-[2px] uppercase text-[#777D87] mb-2">
                WHAT WE CREATE
              </p>
              <h2 className="font-manrope font-extrabold text-[32px] sm:text-[42px] leading-tight uppercase">
                PRODUCTION CAPABILITIES
              </h2>
            </div>
            <p className="font-inter text-[#B2B4BA] text-[13.5px] max-w-md leading-relaxed">
              Every production is tailored to the distribution channel — whether high-resolution 4K broadcast or vertical mobile formats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEDIA_SERVICES.map((srv, idx) => {
              const Icon = srv.icon
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#E58A76]/50 transition-all duration-300 p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#141820] border border-[#252A32] flex items-center justify-center text-[#E58A76] mb-5 group-hover:scale-105 transition-transform">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-manrope font-bold text-[18px] uppercase text-[#F5F3EE] mb-2">
                      {srv.title}
                    </h3>
                    <p className="font-inter text-[#B2B4BA] text-[13px] leading-relaxed mb-6">
                      {srv.desc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1C2028]">
                    {srv.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-inter text-[#8C92A4] px-2.5 py-0.5 rounded-full border border-[#252A32]"
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
      <section className="py-20 border-b border-[#292929]/60">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="mb-14">
            <p className="font-inter font-medium text-[10px] tracking-[2px] uppercase text-[#777D87] mb-2">
              METHODOLOGY
            </p>
            <h2 className="font-manrope font-extrabold text-[32px] sm:text-[42px] leading-tight uppercase">
              THE PRODUCTION PROCESS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTION_PROCESS.map((proc) => (
              <div
                key={proc.step}
                className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-6 relative"
              >
                <span className="font-mono text-[#E58A76] text-[13px] font-bold block mb-4">
                  {proc.step}
                </span>
                <h3 className="font-manrope font-bold text-[16px] text-[#F5F3EE] mb-2 uppercase">
                  {proc.name}
                </h3>
                <p className="font-inter text-[#B2B4BA] text-[12.5px] leading-relaxed">
                  {proc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Callout ── */}
      <section className="py-20 bg-[#0A0C0F]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 text-center">
          <h2 className="font-manrope font-extrabold text-[32px] sm:text-[46px] uppercase text-[#F5F3EE] mb-4">
            HAVE A PRODUCTION IN MIND?
          </h2>
          <p className="font-inter text-[#B2B4BA] text-[14px] max-w-lg mx-auto mb-8">
            Tell us about your project, timeline, and vision. We will assemble the creative treatment and plan the production.
          </p>
          <Link
            href="/contact?division=media"
            className="inline-flex items-center gap-2 px-7 h-[44px] rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] uppercase tracking-wide transition-colors"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  )
}
