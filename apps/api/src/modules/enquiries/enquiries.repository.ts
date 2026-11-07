import { EnquiryResponseDTO, CreateEnquiryDTO, LeadStatus, ServiceDivisionId } from '@ediyrex/contracts'

const INITIAL_ENQUIRIES: EnquiryResponseDTO[] = [
  {
    id: 'ENQ-2026-001',
    name: 'Siddharth Mehta',
    email: 'siddharth@strata-ai.io',
    company: 'Strata AI Systems',
    division: 'agents',
    budget: '$15,000 – $30,000',
    timeline: '1 Month',
    message: 'We require an autonomous n8n workflow pipeline integrated with OpenAI and PostgreSQL to qualify inbound leads.',
    status: 'New',
    internalNotes: 'High-fit enterprise prospect. Follow up with system architecture diagram.',
    createdAt: '2026-11-06T14:30:00.000Z',
    updatedAt: '2026-11-06T14:30:00.000Z',
  },
  {
    id: 'ENQ-2026-002',
    name: 'Elena Rostova',
    email: 'elena@vanguard-holdings.co',
    company: 'Vanguard Brand Group',
    division: 'media',
    budget: '$30,000+',
    timeline: 'Immediate (< 2 weeks)',
    message: 'Looking for a cinematic brand commercial (60s and 30s cuts) plus full editorial photography lookbook for our upcoming luxury brand launch.',
    status: 'Reviewing',
    internalNotes: 'Director reviewing moodboard treatment. Scheduling discovery call.',
    createdAt: '2026-11-05T09:15:00.000Z',
    updatedAt: '2026-11-05T11:20:00.000Z',
  },
  {
    id: 'ENQ-2026-003',
    name: 'Marcus Chen',
    email: 'm.chen@novacore.tech',
    company: 'NovaCore Financial',
    division: 'web',
    budget: '$15,000 – $30,000',
    timeline: '2–3 Months',
    message: 'Need a full Next.js 15 redesign for our institutional fintech platform with strict requirements for sub-second LCP and dark minimalist aesthetic.',
    status: 'Qualified',
    internalNotes: 'Budget confirmed. Sending technical proposal on Monday.',
    createdAt: '2026-11-03T16:45:00.000Z',
    updatedAt: '2026-11-04T10:00:00.000Z',
  },
]

class EnquiriesRepository {
  private data: EnquiryResponseDTO[] = [...INITIAL_ENQUIRIES]

  public async create(dto: CreateEnquiryDTO): Promise<EnquiryResponseDTO> {
    const id = `ENQ-2026-00${this.data.length + 1}`
    const now = new Date().toISOString()
    const record: EnquiryResponseDTO = {
      id,
      name: dto.name,
      email: dto.email,
      company: dto.company,
      division: dto.division,
      budget: dto.budget,
      timeline: dto.timeline,
      message: dto.message,
      status: 'New',
      createdAt: now,
      updatedAt: now,
    }

    this.data.unshift(record)
    return record
  }

  public async findAll(filters?: {
    search?: string
    division?: ServiceDivisionId
    status?: LeadStatus
  }): Promise<EnquiryResponseDTO[]> {
    return this.data.filter((item) => {
      if (filters?.division && filters.division !== item.division) return false
      if (filters?.status && filters.status !== item.status) return false
      if (filters?.search) {
        const query = filters.search.toLowerCase()
        const match =
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          (item.company && item.company.toLowerCase().includes(query))
        if (!match) return false
      }
      return true
    })
  }

  public async findById(id: string): Promise<EnquiryResponseDTO | null> {
    const item = this.data.find((e) => e.id === id)
    return item || null
  }

  public async updateStatus(id: string, status: LeadStatus): Promise<EnquiryResponseDTO | null> {
    const item = this.data.find((e) => e.id === id)
    if (!item) return null
    item.status = status
    item.updatedAt = new Date().toISOString()
    return item
  }

  public async updateNotes(id: string, notes: string): Promise<EnquiryResponseDTO | null> {
    const item = this.data.find((e) => e.id === id)
    if (!item) return null
    item.internalNotes = notes
    item.updatedAt = new Date().toISOString()
    return item
  }
}

export const enquiriesRepository = new EnquiriesRepository()
