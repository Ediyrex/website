export const SITE_CONFIG = {
  name: "Ediyrex Studio",
  shortName: "Ediyrex",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@ediyrex.com",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
    location: process.env.NEXT_PUBLIC_STUDIO_LOCATION || "India & Global",
    hours: "Mon–Fri · 10:00 AM – 7:00 PM IST",
  },
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
  },
};
