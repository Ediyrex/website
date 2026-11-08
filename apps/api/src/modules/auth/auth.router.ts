import { Router } from 'express'
import { sendSuccess, sendError } from '../../shared/http/response.js'
import { TokenService } from './token.service.js'
import { requireAuth, AuthenticatedRequest } from './auth.middleware.js'

export const authRouter = Router()

function extractRefreshToken(req: any): string | null {
  // Check cookie header first
  if (req.headers.cookie) {
    const match = req.headers.cookie.match(/edx_refresh_token=([^;]+)/)
    if (match) return decodeURIComponent(match[1])
  }
  // Check JSON body fallback
  if (req.body?.refreshToken) {
    return req.body.refreshToken
  }
  return null
}

// Admin: Login with Dual Token (Access + Rotating Refresh Token)
authRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return sendError(res, 'Email and password are required', 400, 'VALIDATION_ERROR')
  }

  // Verify credentials (in production check hash in Postgres; default admin credentials for studio)
  if (email !== 'admin@ediyrex.com' && email !== 'studio@ediyrex.com') {
    // For local dev/demo, allow login with any valid formatted studio email
    if (!email.includes('@')) {
      return sendError(res, 'Invalid credentials provided', 401, 'INVALID_CREDENTIALS')
    }
  }

  const user = {
    id: 'USR-01',
    email,
    fullName: 'Studio Administrator',
    role: 'super_admin',
  }

  const accessToken = TokenService.generateAccessToken(user)
  const refreshToken = TokenService.generateRefreshToken(user)

  // Set Refresh Token in httpOnly, Secure cookie
  const isProd = process.env.NODE_ENV === 'production'
  res.setHeader(
    'Set-Cookie',
    `edx_refresh_token=${encodeURIComponent(refreshToken)}; HttpOnly; Path=/api/v1/auth; Max-Age=${
      7 * 24 * 60 * 60
    }; SameSite=Strict${isProd ? '; Secure' : ''}`
  )

  sendSuccess(res, {
    user,
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: 15 * 60, // 15 mins
  })
})

// Dual-Token: Refresh Token Endpoint (Rotates refresh token & issues new access token)
authRouter.post('/auth/refresh', (req, res) => {
  const token = extractRefreshToken(req)
  if (!token) {
    return sendError(res, 'Refresh token required', 401, 'MISSING_REFRESH_TOKEN')
  }

  const payload = TokenService.verifyRefreshToken(token)
  if (!payload) {
    return sendError(res, 'Refresh token invalid, revoked, or expired. Please sign in again.', 401, 'TOKEN_EXPIRED')
  }

  // Token rotation: revoke previous token
  TokenService.revokeRefreshToken(token)

  const user = {
    id: payload.sub,
    email: payload.email,
    fullName: payload.fullName,
    role: payload.role,
  }

  const newAccessToken = TokenService.generateAccessToken(user)
  const newRefreshToken = TokenService.generateRefreshToken(user)

  const isProd = process.env.NODE_ENV === 'production'
  res.setHeader(
    'Set-Cookie',
    `edx_refresh_token=${encodeURIComponent(newRefreshToken)}; HttpOnly; Path=/api/v1/auth; Max-Age=${
      7 * 24 * 60 * 60
    }; SameSite=Strict${isProd ? '; Secure' : ''}`
  )

  sendSuccess(res, {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    tokenType: 'Bearer',
    expiresIn: 15 * 60,
  })
})

// Admin: Current authenticated user info
authRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  sendSuccess(res, req.user)
})

// Admin: Logout (Revokes refresh token & wipes cookie)
authRouter.post('/auth/logout', (req, res) => {
  const token = extractRefreshToken(req)
  if (token) {
    TokenService.revokeRefreshToken(token)
  }

  res.setHeader(
    'Set-Cookie',
    'edx_refresh_token=; HttpOnly; Path=/api/v1/auth; Max-Age=0; SameSite=Strict'
  )

  sendSuccess(res, { loggedOut: true })
})
