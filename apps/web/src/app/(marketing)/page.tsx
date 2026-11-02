import type { Metadata } from 'next'
import { SITE } from '@/shared/constants'
import {
  HeroSection,
  DivisionsSection,
  FeaturedWorkSection,
  ProcessSection,
  CtaSection,
} from '@/features/home/components'

export const metadata: Metadata = {
  title: 'Ediyrex Studio — Media, Digital & AI Creative Technology',
  description: SITE.description,
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DivisionsSection />
      <FeaturedWorkSection />
      <ProcessSection />
      <CtaSection />
    </>
  )
}
