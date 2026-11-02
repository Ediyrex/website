import type { Metadata } from 'next'
import { SITE } from '@/shared/constants'
import { Header, Footer, PageWrapper } from '@/shared/components'

export const metadata: Metadata = {
  title: {
    default: SITE.name,
    template: `%s — ${SITE.name}`,
  },
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <PageWrapper>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </PageWrapper>
      <Footer />
    </>
  )
}
