import type { Metadata, Viewport } from 'next'
import { Manrope, Inter, IBM_Plex_Mono, Newsreader } from 'next/font/google'
import '@/styles/globals.css'
import { Header, Footer } from '@/shared/components/layout'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'EDIYREX® — Creative Media. Powerful Web. Intelligent Agents.',
  description:
    'We create high-impact content, build modern web experiences, and automate real work with AI agents and intelligent workflows.',
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${manrope.variable} ${inter.variable} ${ibmPlexMono.variable} ${newsreader.variable}`}
    >
      <body className="antialiased bg-[#000000] text-[#FFFFFF] font-sans selection:bg-[#2C3480] selection:text-[#FFFFFF] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
