import type { Metadata, Viewport } from 'next'
import { Manrope, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { Header, Footer } from '@/shared/components/layout'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'EDIYREX® — Creative Media. Powerful Web. Intelligent Agents.',
  description:
    'We create high-impact content, build modern web experiences, and automate real work with AI agents and intelligent workflows.',
}

export const viewport: Viewport = {
  themeColor: '#08090b',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${manrope.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased bg-[#08090b] text-[#f5f3ee] font-sans selection:bg-[#ff5e1e]/30 selection:text-white">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
