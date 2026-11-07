import { Router } from 'express'
import { sendSuccess } from '../../shared/http/response.js'

export const healthRouter = Router()

healthRouter.get('/health', (_req, res) => {
  sendSuccess(res, {
    service: 'Ediyrex Studio API',
    status: 'healthy',
    version: '1.0.0',
    uptime: process.uptime(),
  })
})

