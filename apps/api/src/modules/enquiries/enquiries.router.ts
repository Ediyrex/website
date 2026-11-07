import { Router } from 'express'
import { enquiriesService } from './enquiries.service.js'
import { sendSuccess, sendError } from '../../shared/http/response.js'
import { AppError } from '../../shared/errors/AppError.js'
import { LeadStatus, ServiceDivisionId } from '@ediyrex/contracts'

export const enquiriesRouter = Router()

// Public endpoint: Submit an enquiry
enquiriesRouter.post('/enquiries', async (req, res) => {
  try {
    const enquiry = await enquiriesService.submitEnquiry(req.body)
    sendSuccess(res, enquiry, 201)
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.message, error.statusCode, error.code, error.details)
    } else {
      sendError(res, 'Internal server error processing enquiry', 500)
    }
  }
})

// Admin endpoint: List enquiries
enquiriesRouter.get('/admin/enquiries', async (req, res) => {
  try {
    const search = req.query.search as string | undefined
    const division = req.query.division as ServiceDivisionId | undefined
    const status = req.query.status as LeadStatus | undefined

    const enquiries = await enquiriesService.getEnquiries({ search, division, status })
    sendSuccess(res, enquiries)
  } catch (error) {
    sendError(res, 'Failed to fetch enquiries', 500)
  }
})

// Admin endpoint: Get single enquiry
enquiriesRouter.get('/admin/enquiries/:id', async (req, res) => {
  try {
    const enquiry = await enquiriesService.getEnquiryById(req.params.id)
    sendSuccess(res, enquiry)
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.message, error.statusCode, error.code)
    } else {
      sendError(res, 'Failed to fetch enquiry', 500)
    }
  }
})

// Admin endpoint: Update enquiry status
enquiriesRouter.patch('/admin/enquiries/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    if (!status) {
      return sendError(res, 'Status is required', 400, 'VALIDATION_ERROR')
    }
    const updated = await enquiriesService.updateEnquiryStatus(req.params.id, status)
    sendSuccess(res, updated)
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.message, error.statusCode, error.code)
    } else {
      sendError(res, 'Failed to update enquiry status', 500)
    }
  }
})

// Admin endpoint: Update internal notes
enquiriesRouter.post('/admin/enquiries/:id/notes', async (req, res) => {
  try {
    const { notes } = req.body
    const updated = await enquiriesService.updateEnquiryNotes(req.params.id, notes || '')
    sendSuccess(res, updated)
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.message, error.statusCode, error.code)
    } else {
      sendError(res, 'Failed to update enquiry notes', 500)
    }
  }
})

