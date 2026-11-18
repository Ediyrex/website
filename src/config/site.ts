export const SITE_CONFIG = {
  name: "EDYREX Studio",
  shortName: "EDYREX",
  logo: "/images/logo/ediyrex-logo.png",
  emblem: "/images/logo/ediyrex-emblem.png",
  wordmark: "/images/logo/ediyrex-wordmark.png",
  tagline: "Creative Technology, Commercial Media, Digital & AI Systems",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ediyrex.com",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ediyrex@gmail.com",
    secondaryEmail: "hello@ediyrex.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91 98765 43210",
    location: process.env.NEXT_PUBLIC_STUDIO_LOCATION || "Mumbai & Bangalore, India · Global Clients",
    hours: "Mon–Fri · 10:00 AM – 7:00 PM IST",
    responseTime: "Within 24 business hours",
  },
  socials: {
    linkedin: "https://linkedin.com/company/ediyrex",
    twitter: "https://x.com/ediyrex",
    instagram: "https://instagram.com/ediyrex",
    github: "https://github.com/ediyrex",
  },
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};
