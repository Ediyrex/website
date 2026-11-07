export type LeadStatus =
  | 'New'
  | 'Reviewing'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Won'
  | 'Lost'
  | 'Archived'

export type ServiceDivisionId = 'media' | 'web' | 'agents' | 'integrated'

export interface EnquiryItem {
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
  statusUpdatedAt: string
}

export interface AdminProjectItem {
  id: string
  slug: string
  title: string
  client: string
  division: 'media' | 'digital' | 'ai' | 'hybrid'
  year: string
  status: 'Published' | 'Draft' | 'Archived'
  featured: boolean
}

export interface MediaAssetItem {
  id: string
  name: string
  path: string
  format: string
  dimensions: string
  size: string
  uploadedAt: string
}

export interface ActivityLogItem {
  id: string
  actor: string
  action: string
  target: string
  timestamp: string
}

