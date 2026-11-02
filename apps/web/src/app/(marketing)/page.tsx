import type { Metadata } from 'next'
import { SITE } from '@/shared/constants'

export const metadata: Metadata = {
  title: 'Home',
  description: SITE.description,
}

export default function HomePage() {
  return (
    <main>
      {/* Hero section — implemented in Phase 2 */}
      <section
        style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}
        className="bg-canvas"
      >
        <div className="container-main text-center">
          <p className="label-mono mb-6">Phase 1 — Scaffold Complete</p>
          <h1 className="text-gradient-accent mb-6">Ediyrex Studio</h1>
          <p className="text-secondary text-xl max-w-2xl mx-auto">
            {SITE.tagline}
          </p>
        </div>
      </section>
    </main>
  )
}

