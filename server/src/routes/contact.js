import { Router } from 'express'
import { getDb } from '../db/index.js'
import { contactSchema } from '../lib/schemas.js'
import { validate } from '../middleware/validate.js'
import { contactLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.post('/', contactLimiter, validate(contactSchema), async (req, res, next) => {
  try {
    const db = await getDb()
    const row = await db.createContactMessage(req.data)
    // Messages are stored for the league to action. Wire an email/SMS notifier here
    // when ATC picks a provider. The record is already persisted either way.
    res.status(201).json({ ok: true, id: row.id })
  } catch (err) {
    next(err)
  }
})

export default router
