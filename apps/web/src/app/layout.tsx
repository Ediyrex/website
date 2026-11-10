import type { Metadata, Viewport } from "next";
import { Manrope, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08090B",
};

export const metadata: Metadata = {
  title: {
    default: "Ediyrex Studio — Creative Technology, Media, Digital & AI",
    template: "%s | Ediyrex Studio",
  },
  description:
    "Independent creative technology studio uniting commercial media production, digital experiences, and intelligent AI systems. Serving clients in India and internationally.",
  keywords: [
    "Ediyrex Studio",
    "Creative Technology Studio",
    "Media Production",
    "Brand Films",
    "Web Design and Development",
    "SaaS Products",
    "AI Agents",
    "Workflow Automation",
    "AI Voice Receptionist",
    "RAG Systems",
  ],
  authors: [{ name: "Ediyrex Studio" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ediyrex Studio",
    title: "Ediyrex Studio — Creative Technology, Media, Digital & AI",
    description:
      "From visual storytelling and digital products to intelligent automation, Ediyrex brings creativity and technology together to build what comes next.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#08090B] text-[#F5F3EE] selection:bg-[#D6B77A]/25 selection:text-[#F5F3EE]">
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
