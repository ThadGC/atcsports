import { badRequest } from '../lib/errors.js'
import { fieldErrors } from '../lib/schemas.js'

// Parses req.body against a Zod schema, returning inline field errors on failure.
export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body ?? {})
  if (!result.success) {
    const fields = fieldErrors(result.error)
    const first = Object.values(fields)[0] || 'Please check the form and try again.'
    return next(badRequest(first, fields))
  }
  req.data = result.data
  next()
}
