import type { Metadata, Viewport } from "next";
import {
  Manrope,
  Inter,
  IBM_Plex_Mono,
  Space_Grotesk,
  Instrument_Serif,
  Space_Mono,
  Playfair_Display,
  Archivo_Narrow,
  Archivo_Black,
} from "next/font/google";
import "./globals.css";
import { PublicShell } from "@/components/layout/PublicShell";
import { SITE_CONFIG } from "@/config/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08090B",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "EDYREX Studio — Creative Technology, Media, Digital & AI",
    template: "%s | EDYREX Studio",
  },
  description:
    "Independent creative technology studio uniting commercial media production, digital experiences, and intelligent AI systems. Serving clients in India and internationally.",
  keywords: [
    "EDYREX Studio",
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
  authors: [{ name: "EDYREX Studio" }],
  verification: SITE_CONFIG.verification.google
    ? { google: SITE_CONFIG.verification.google }
    : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "EDYREX Studio",
    title: "EDYREX Studio — Creative Technology, Media, Digital & AI",
    description:
      "From visual storytelling and digital products to intelligent automation, EDYREX brings creativity and technology together to build what comes next.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "EDYREX Studio — Creative Technology, Media, Digital & AI",
    description:
      "One integrated partner for visual storytelling, full-stack digital products, and intelligent AI systems.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.contact.email,
    telephone: SITE_CONFIG.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressLocality: "Mumbai & Bangalore",
    },
    areaServed: "Global",
    description:
      "Independent creative technology studio uniting branding & marketing, media production, web dev & DADV, and AI agents & n8n automation.",
    knowsAbout: [
      "Branding & Marketing",
      "Media & Video Editing",
      "Web Dev & DADV Dashboards",
      "AI Agents & n8n Automation",
    ],
  };

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable} ${spaceMono.variable} ${playfairDisplay.variable} ${archivoNarrow.variable} ${archivoBlack.variable} h-full antialiased dark scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#08090B] text-[#F5F3EE] selection:bg-[#D6B77A]/25 selection:text-[#F5F3EE]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
