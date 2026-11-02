import type { Metadata, Viewport } from 'next'
import { Manrope, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Header } from '@/shared/components/layout'

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

export const metadata: Metadata = {
  title: 'EDIYREX® — Creative Media. Powerful Web. Intelligent Agents.',
  description:
    'We create high-impact content, build modern web experiences, and automate real work with AI agents and intelligent workflows.',
}

export const viewport: Viewport = {
  themeColor: '#08090B',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${manrope.variable} ${inter.variable}`}
    >
      <body className="antialiased bg-[#08090B] text-[#F5F3EE] font-sans selection:bg-[#E87520]/30 selection:text-white min-h-screen">
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
