import rateLimit from 'express-rate-limit'

const make = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: message },
  })

// Tight on credential endpoints, looser everywhere else.
export const authLimiter = make(
  15 * 60 * 1000,
  20,
  'Too many attempts. Wait a few minutes and try again.',
)

export const contactLimiter = make(
  60 * 60 * 1000,
  10,
  'You have sent several messages already. Please call us instead.',
)

export const apiLimiter = make(15 * 60 * 1000, 300, 'Too many requests. Slow down a moment.')
