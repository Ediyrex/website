export const SITE = {
  name: 'Ediyrex Studio',
  tagline: 'One integrated partner for creativity, technology, and intelligence.',
  description:
    'Ediyrex Studio unifies media production, digital experiences, and artificial intelligence under one brand. We help businesses transform ideas into compelling visual content, powerful digital products, and intelligent automated systems.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://ediyrex.com',
  email: 'hello@ediyrex.com',
  location: 'India',
} as const

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Studio', href: '/studio' },
  { label: 'Blog', href: '/blog' },
] as const

export const SERVICE_DIVISIONS = [
  {
    id: 'media',
    label: 'Media',
    description: 'Video production, photography, brand films, social content, motion graphics.',
    color: '#D6B77A',
  },
  {
    id: 'digital',
    label: 'Digital',
    description: 'Websites, applications, SaaS products, dashboards, e-commerce, UI/UX.',
    color: '#7AB4D6',
  },
  {
    id: 'ai',
    label: 'AI',
    description: 'Intelligent agents, automation, chatbots, voice receptionists, AI applications.',
    color: '#A47AD6',
  },
] as const

