export interface ServiceOffering {
  id: string
  title: string
  description: string
  deliverables: string[]
  tools: string[]
}

export interface ServiceDivision {
  id: 'media' | 'digital' | 'ai'
  title: string
  headline: string
  lead: string
  accentColor: string
  services: ServiceOffering[]
  faq: { question: string; answer: string }[]
}

