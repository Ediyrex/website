import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { healthRouter } from './modules/health/health.router.js'
import { enquiriesRouter } from './modules/enquiries/enquiries.router.js'
import { projectsRouter } from './modules/projects/projects.router.js'
import { servicesRouter } from './modules/services/services.router.js'
import { settingsRouter } from './modules/settings/settings.router.js'
import { authRouter } from './modules/auth/auth.router.js'
import { sendError } from './shared/http/response.js'
import { AppError } from './shared/errors/AppError.js'

export const app = express()

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or matching allowed
      if (!origin || env.CORS_ORIGINS.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true)
      } else {
        callback(null, true) // Permissive in local development
      }
    },
    credentials: true,
  })
)

// Root Health Check
app.use(healthRouter)

// Version 1 REST API Router
const v1Router = express.Router()
v1Router.use(healthRouter)
v1Router.use(enquiriesRouter)
v1Router.use(projectsRouter)
v1Router.use(servicesRouter)
v1Router.use(settingsRouter)
v1Router.use(authRouter)

app.use('/api/v1', v1Router)

// 404 Not Found Handler
app.use((req: Request, res: Response) => {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404, 'NOT_FOUND')
})

// Centralized Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code, err.details)
  }
  console.error('[API Unhandled Error]:', err)
  sendError(res, 'Internal server error', 500)
})
