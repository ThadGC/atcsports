import { config } from '../config.js'
import { verifySession } from '../lib/tokens.js'
import { unauthorized, forbidden } from '../lib/errors.js'
import { getDb } from '../db/index.js'

// Attaches req.user when a valid session cookie is present. Never throws.
export async function attachUser(req, _res, next) {
  const token = req.cookies?.[config.jwt.cookieName]
  if (!token) return next()
  const claims = verifySession(token)
  if (!claims) return next()
  try {
    const db = await getDb()
    const user = await db.findUserById(claims.sub)
    if (user) req.user = user
  } catch {
    /* fall through as anonymous */
  }
  next()
}

export function requireAuth(req, _res, next) {
  if (!req.user) return next(unauthorized())
  next()
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(unauthorized())
    if (!roles.includes(req.user.role)) return next(forbidden())
    next()
  }
}
