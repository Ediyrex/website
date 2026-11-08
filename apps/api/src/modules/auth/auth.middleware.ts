import { Request, Response, NextFunction } from 'express'
import { TokenService, JWTPayload } from './token.service.js'
import { sendError } from '../../shared/http/response.js'

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. Missing Bearer token.', 401, 'UNAUTHORIZED')
  }

  const token = authHeader.split(' ')[1]
  const payload = TokenService.verifyAccessToken(token)

  if (!payload) {
    return sendError(res, 'Access token is invalid or expired. Please refresh.', 401, 'TOKEN_EXPIRED')
  }

  req.user = payload
  next()
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
      return sendError(res, 'Forbidden. Admin privileges required.', 403, 'FORBIDDEN')
    }
    next()
  })
}

