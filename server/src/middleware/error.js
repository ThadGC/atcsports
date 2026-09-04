import { config } from '../config.js'
import { AppError } from '../lib/errors.js'

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'That endpoint does not exist.' })
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.fields ? { fields: err.fields } : {}),
    })
  }

  // Anything unexpected: log it, but never leak internals to the client.
  console.error('[api] unhandled error:', err)
  res.status(500).json({
    error: 'Something went wrong on our end. Please try again.',
    ...(config.isProd ? {} : { detail: err.message }),
  })
}
