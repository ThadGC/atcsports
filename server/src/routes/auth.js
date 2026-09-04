import { Router } from 'express'
import { getDb } from '../db/index.js'
import { hashPassword, verifyPassword } from '../lib/password.js'
import { signSession, setSessionCookie, clearSessionCookie } from '../lib/tokens.js'
import { conflict, unauthorized } from '../lib/errors.js'
import { registerSchema, loginSchema } from '../lib/schemas.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimit.js'

const router = Router()

// Never send the hash to the client.
const publicUser = (u) => ({
  id: u.id,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  phone: u.phone,
  role: u.role,
})

router.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const db = await getDb()
    const { firstName, lastName, email, phone, password } = req.data

    if (await db.findUserByEmail(email)) {
      throw conflict('An account with that email already exists. Try logging in instead.', {
        email: 'That email is already registered.',
      })
    }

    const user = await db.createUser({
      firstName,
      lastName,
      email,
      phone,
      passwordHash: await hashPassword(password),
    })

    setSessionCookie(res, signSession(user))
    res.status(201).json({ user: publicUser(user) })
  } catch (err) {
    next(err)
  }
})

router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const db = await getDb()
    const { email, password } = req.data
    const user = await db.findUserByEmail(email)

    // Same message either way so the endpoint cannot be used to enumerate accounts.
    const generic = unauthorized('That email or password is not right.')
    if (!user) {
      await hashPassword(password) // constant-ish time
      throw generic
    }
    if (!(await verifyPassword(password, user.passwordHash))) throw generic

    setSessionCookie(res, signSession(user))
    res.json({ user: publicUser(user) })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', (_req, res) => {
  clearSessionCookie(res)
  res.json({ ok: true })
})

router.get('/me', (req, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null })
})

router.get('/session', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) })
})

export default router
