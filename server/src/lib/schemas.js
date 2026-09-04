import { z } from 'zod'

const email = z.string().trim().toLowerCase().email('That email address does not look right.')
const name = (label) =>
  z.string().trim().min(2, `Enter your ${label}.`).max(60, `That ${label} is too long.`)

export const registerSchema = z.object({
  firstName: name('first name'),
  lastName: name('last name'),
  email,
  phone: z.string().trim().max(32).optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Use at least 8 characters.')
    .max(200, 'That password is too long.'),
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.'),
})

export const athleteSchema = z.object({
  firstName: name('athlete first name'),
  lastName: name('athlete last name'),
  division: z.string().trim().min(1, 'Choose a division.').max(80),
  notes: z.string().trim().max(300).optional().or(z.literal('')),
})

export const contactSchema = z.object({
  name: name('name'),
  email,
  subject: z.string().trim().max(160).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, 'Add a little more detail so we can answer properly.')
    .max(4000, 'That message is too long.'),
})

// Turns a Zod error into { fields: { name: 'message' } } for inline form display.
export function fieldErrors(err) {
  const out = {}
  for (const issue of err.issues || []) {
    const key = issue.path?.[0]
    if (key && !out[key]) out[key] = issue.message
  }
  return out
}
