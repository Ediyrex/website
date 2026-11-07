import { Router } from 'express'
import { sendSuccess, sendError } from '../../shared/http/response.js'

export const authRouter = Router()

// Admin: Login
authRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400, 'VALIDATION_ERROR')
  }

  // Generate secure mock session token for admin
  const user = {
    id: 'USR-01',
    email,
    fullName: 'Studio Administrator',
    role: 'super_admin',
  }

  sendSuccess(res, {
    user,
    token: 'edx_sess_' + Buffer.from(email + ':' + Date.now()).toString('base64'),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  })
})

// Admin: Current user
authRouter.get('/auth/me', (_req, res) => {
  sendSuccess(res, {
    id: 'USR-01',
    email: 'admin@ediyrex.com',
    fullName: 'Studio Administrator',
    role: 'super_admin',
  })
})

// Admin: Logout
authRouter.post('/auth/logout', (_req, res) => {
  sendSuccess(res, { loggedOut: true })
})
