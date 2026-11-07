import { CreateEnquiryDTO, EnquiryResponseDTO, LeadStatus, ServiceDivisionId } from '@ediyrex/contracts'
import { enquiriesRepository } from './enquiries.repository.js'
import { AppError } from '../../shared/errors/AppError.js'

export class EnquiriesService {
  public async submitEnquiry(input: CreateEnquiryDTO): Promise<EnquiryResponseDTO> {
    if (!input.name || input.name.trim().length === 0) {
      throw new AppError('Full name is required', 400, 'VALIDATION_ERROR')
    }
    if (!input.email || !input.email.includes('@')) {
      throw new AppError('A valid email address is required', 400, 'VALIDATION_ERROR')
    }
    if (!input.message || input.message.trim().length === 0) {
      throw new AppError('Project message brief is required', 400, 'VALIDATION_ERROR')
    }
    if (!input.consent) {
      throw new AppError('Consent to privacy policy is required', 400, 'VALIDATION_ERROR')
    }

    return enquiriesRepository.create(input)
  }

  public async getEnquiries(filters?: {
    search?: string
    division?: ServiceDivisionId
    status?: LeadStatus
  }): Promise<EnquiryResponseDTO[]> {
    return enquiriesRepository.findAll(filters)
  }

  public async getEnquiryById(id: string): Promise<EnquiryResponseDTO> {
    const enquiry = await enquiriesRepository.findById(id)
    if (!enquiry) {
      throw new AppError(`Enquiry with ID ${id} not found`, 404, 'NOT_FOUND')
    }
    return enquiry
  }

  public async updateEnquiryStatus(id: string, status: LeadStatus): Promise<EnquiryResponseDTO> {
    const enquiry = await enquiriesRepository.updateStatus(id, status)
    if (!enquiry) {
      throw new AppError(`Enquiry with ID ${id} not found`, 404, 'NOT_FOUND')
    }
    return enquiry
  }

  public async updateEnquiryNotes(id: string, notes: string): Promise<EnquiryResponseDTO> {
    const enquiry = await enquiriesRepository.updateNotes(id, notes)
    if (!enquiry) {
      throw new AppError(`Enquiry with ID ${id} not found`, 404, 'NOT_FOUND')
    }
    return enquiry
  }
}

export const enquiriesService = new EnquiriesService()
