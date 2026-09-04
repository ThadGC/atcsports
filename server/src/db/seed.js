// Seeds a demo parent account so the logged-in area can be demonstrated without
// signing up first. Development only: it refuses to run against production.
import { config } from '../config.js'
import { getDb } from './index.js'
import { hashPassword } from '../lib/password.js'

if (config.isProd) {
  console.error('Refusing to seed demo data in production.')
  process.exit(1)
}

const DEMO = {
  firstName: 'Jordan',
  lastName: 'Reed',
  email: 'demo@atcsports.test',
  phone: '(209) 555-0134',
  password: 'atcdemo2026',
}

const ATHLETES = [
  {
    firstName: 'Riley',
    lastName: 'Reed',
    division: 'Co-Ed · 3rd / 4th Grade',
    notes: 'Would like to play with Sam Carter',
  },
  {
    firstName: 'Avery',
    lastName: 'Reed',
    division: 'Girls · 1st / 2nd Grade',
    notes: 'First season',
  },
]

const db = await getDb()

let user = await db.findUserByEmail(DEMO.email)
if (user) {
  console.log(`Demo account already exists (${DEMO.email}).`)
} else {
  const { password, ...rest } = DEMO
  user = await db.createUser({ ...rest, passwordHash: await hashPassword(password) })
  console.log(`Created demo account: ${DEMO.email}`)
}

const existing = await db.listAthletes(user.id)
for (const a of ATHLETES) {
  if (existing.some((e) => e.firstName === a.firstName && e.lastName === a.lastName)) continue
  await db.createAthlete({ userId: user.id, ...a })
  console.log(`  + athlete: ${a.firstName} ${a.lastName} (${a.division})`)
}

console.log(`\nLog in at /login with:\n  email:    ${DEMO.email}\n  password: ${DEMO.password}\n`)
process.exit(0)
