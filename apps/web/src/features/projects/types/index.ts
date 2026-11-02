export type ProjectDivision = 'media' | 'digital' | 'ai' | 'hybrid'

export interface CaseStudy {
  slug: string
  title: string
  client: string
  year: string
  division: ProjectDivision
  divisionLabel: string
  heroTagline: string
  overview: string
  challenge: string
  solution: string
  results: { metric: string; label: string }[]
  technologies: string[]
  deliverables: string[]
  gallery: { title: string; caption: string }[]
  testimonial?: {
    quote: string
    author: string
    role: string
    company: string
  }
}
