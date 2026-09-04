import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export function signSession(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.ttl,
  })
}

export function verifySession(token) {
  try {
    return jwt.verify(token, config.jwt.secret)
  } catch {
    return null
  }
}

// httpOnly so client JS can never read it; sameSite=lax survives normal navigation.
export function setSessionCookie(res, token) {
  res.cookie(config.jwt.cookieName, token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export function clearSessionCookie(res) {
  res.clearCookie(config.jwt.cookieName, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? 'none' : 'lax',
    path: '/',
  })
}
