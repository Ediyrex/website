import { app } from './app.js'
import { env } from './config/env.js'

const server = app.listen(env.PORT, () => {
  console.log(`
┌───────────────────────────────────────────────────────────────┐
│                    EDIYREX STUDIO API v1.0                    │
│                                                               │
│  Environment:  ${env.NODE_ENV.padEnd(46)}│
│  Port:         ${String(env.PORT).padEnd(46)}│
│  Base URL:     http://localhost:${String(env.PORT)}/api/v1                 │
│  Health Check: http://localhost:${String(env.PORT)}/health                        │
└───────────────────────────────────────────────────────────────┘
  `)
})

const handleShutdown = (signal: string) => {
  console.log(`[API] Received ${signal}. Gracefully closing HTTP server...`)
  server.close(() => {
    console.log('[API] HTTP server closed. Process exiting.')
    process.exit(0)
  })
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'))
process.on('SIGINT', () => handleShutdown('SIGINT'))

