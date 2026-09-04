import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config.js'
import { forbidden } from './lib/errors.js'
import { getDb } from './db/index.js'
import { attachUser } from './middleware/auth.js'
import { apiLimiter } from './middleware/rateLimit.js'
import { errorHandler, notFoundHandler } from './middleware/error.js'
import authRoutes from './routes/auth.js'
import athleteRoutes from './routes/athletes.js'
import contactRoutes from './routes/contact.js'

export function createApp() {
  const app = express()

  // Behind a proxy (Render/Fly/Heroku) so secure cookies and rate limits see real IPs.
  app.set('trust proxy', 1)

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(
    cors({
      origin(origin, cb) {
        // Same-origin/server-to-server requests send no Origin header.
        if (!origin || config.origins.includes(origin)) return cb(null, true)
        cb(forbidden(`Origin not allowed: ${origin}`))
      },
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '64kb' }))
  app.use(cookieParser())
  app.use(apiLimiter)
  app.use(attachUser)

  app.get('/api/health', async (_req, res) => {
    const db = await getDb()
    res.json({ ok: true, driver: db.driver, env: config.env })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/athletes', athleteRoutes)
  app.use('/api/contact', contactRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
