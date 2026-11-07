import { Router } from 'express'
import { SiteSettingsDTO } from '@ediyrex/contracts'
import { sendSuccess } from '../../shared/http/response.js'

let currentSettings: SiteSettingsDTO = {
  siteName: 'EDIYREX®',
  tagline: 'Creative Media. Powerful Web. Intelligent Agents.',
  contactEmail: 'hello@ediyrex.com',
  location: 'Mumbai / Remote Global',
  responseTime: '< 24 hours',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/ediyrex',
    twitter: 'https://x.com/ediyrex',
    instagram: 'https://instagram.com/ediyrex',
  },
  calcomUrl: 'https://cal.com/ediyrex',
}

export const settingsRouter = Router()

// Public: Get site settings
settingsRouter.get('/site/settings', (_req, res) => {
  sendSuccess(res, currentSettings)
})

// Admin: Get admin settings
settingsRouter.get('/admin/settings', (_req, res) => {
  sendSuccess(res, currentSettings)
})

// Admin: Update site settings
settingsRouter.patch('/admin/settings', (req, res) => {
  currentSettings = {
    ...currentSettings,
    ...req.body,
  }
  sendSuccess(res, currentSettings)
})
