import { Router } from 'express'
import { getDb } from '../db/index.js'
import { athleteSchema } from '../lib/schemas.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { notFound } from '../lib/errors.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    const db = await getDb()
    res.json({ athletes: await db.listAthletes(req.user.id) })
  } catch (err) {
    next(err)
  }
})

router.post('/', validate(athleteSchema), async (req, res, next) => {
  try {
    const db = await getDb()
    const athlete = await db.createAthlete({ userId: req.user.id, ...req.data })
    res.status(201).json({ athlete })
  } catch (err) {
    next(err)
  }
})

// Scoped to the signed-in parent, so one account can never delete another's athlete.
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await getDb()
    const removed = await db.deleteAthlete(req.user.id, req.params.id)
    if (!removed) throw notFound('That athlete is not on your account.')
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
