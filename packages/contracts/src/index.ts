// ── Shared TypeScript Types and API Contracts ──

export type LeadStatus =
  | 'New'
  | 'Reviewing'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Won'
  | 'Lost'
  | 'Archived'

export type ServiceDivisionId = 'media' | 'web' | 'agents' | 'integrated'

export interface CreateEnquiryDTO {
  name: string
  email: string
  company?: string
  division: ServiceDivisionId
  budget: string
  timeline: string
  message: string
  consent: boolean
}

export interface EnquiryResponseDTO {
  id: string
  name: string
  email: string
  company?: string
  division: ServiceDivisionId
  budget: string
  timeline: string
  message: string
  status: LeadStatus
  internalNotes?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectDTO {
  id: string
  slug: string
  title: string
  client: string
  division: 'media' | 'digital' | 'ai' | 'hybrid'
  year: string
  status: 'Published' | 'Draft' | 'Archived'
  featured: boolean
  heroTagline?: string
  overview?: string
  challenge?: string
  solution?: string
  technologies?: string[]
  deliverables?: string[]
}

export interface ServiceDTO {
  id: string
  division: ServiceDivisionId
  title: string
  description: string
  tags: string[]
  orderIndex: number
}

export interface SiteSettingsDTO {
  siteName: string
  tagline: string
  contactEmail: string
  location: string
  responseTime: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    instagram?: string
  }
  calcomUrl?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  timestamp: string
}
