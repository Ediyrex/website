import type { Metadata } from 'next'
import {
  HeroSection,
  SocialProofBar,
  DivisionsSection,
  PhilosophyBanner,
  EditorialCtaSection,
} from '@/features/home/components'

export const metadata: Metadata = {
  title: 'EDIYREX® — Creative Media. Powerful Web. Intelligent Agents.',
  description:
    'We create high-impact content, build modern web experiences, and automate real work with AI agents and intelligent workflows.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <DivisionsSection />
      <PhilosophyBanner />
      <EditorialCtaSection />
    </>
  )
}
