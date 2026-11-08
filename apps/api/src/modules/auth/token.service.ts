import crypto from 'crypto'
import { env } from '../../config/env.js'

export interface JWTPayload {
  sub: string
  email: string
  role: string
  fullName: string
  type: 'access' | 'refresh'
  iat?: number
  exp?: number
}

const ACCESS_SECRET = env.SESSION_SECRET + '_access'
const REFRESH_SECRET = env.SESSION_SECRET + '_refresh'

// Active refresh token store (in-memory with revocation support)
const ACTIVE_REFRESH_TOKENS = new Set<string>()

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  return Buffer.from(base64, 'base64').toString('utf-8')
}

function signJwt(payload: JWTPayload, secret: string, expiresInSeconds: number): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload))

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

function verifyJwt(token: string, secret: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerB64, payloadB64, signature] = parts
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null
    }

    const payload: JWTPayload = JSON.parse(base64UrlDecode(payloadB64))
    const now = Math.floor(Date.now() / 1000)

    if (payload.exp && payload.exp < now) {
      return null // Token expired
    }

    return payload
  } catch {
    return null
  }
}

export const TokenService = {
  // Generate 15-minute access token
  generateAccessToken(user: { id: string; email: string; role: string; fullName: string }): string {
    return signJwt(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        type: 'access',
      },
      ACCESS_SECRET,
      15 * 60 // 15 minutes
    )
  },

  // Generate 7-day refresh token & store for rotation/revocation
  generateRefreshToken(user: { id: string; email: string; role: string; fullName: string }): string {
    const token = signJwt(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        type: 'refresh',
      },
      REFRESH_SECRET,
      7 * 24 * 60 * 60 // 7 days
    )
    ACTIVE_REFRESH_TOKENS.add(token)
    return token
  },

  // Verify access token
  verifyAccessToken(token: string): JWTPayload | null {
    const payload = verifyJwt(token, ACCESS_SECRET)
    if (!payload || payload.type !== 'access') return null
    return payload
  },

  // Verify refresh token with rotation check
  verifyRefreshToken(token: string): JWTPayload | null {
    if (!ACTIVE_REFRESH_TOKENS.has(token)) {
      return null // Revoked or not active
    }
    const payload = verifyJwt(token, REFRESH_SECRET)
    if (!payload || payload.type !== 'refresh') return null
    return payload
  },

  // Revoke refresh token
  revokeRefreshToken(token: string): void {
    ACTIVE_REFRESH_TOKENS.delete(token)
  },
}
