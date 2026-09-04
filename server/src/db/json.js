import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { randomUUID } from 'node:crypto'

// File-backed store so the API is fully functional before a real database exists.
// Same interface as the Postgres adapter, so swapping is a config change, not a rewrite.
export function createJsonDb(file) {
  let cache = null
  let writing = Promise.resolve()

  async function load() {
    if (cache) return cache
    try {
      cache = JSON.parse(await readFile(file, 'utf8'))
    } catch {
      cache = { users: [], athletes: [], contact_messages: [] }
    }
    cache.users ||= []
    cache.athletes ||= []
    cache.contact_messages ||= []
    return cache
  }

  // Serialize writes so concurrent requests cannot clobber the file.
  async function persist() {
    writing = writing.then(async () => {
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, JSON.stringify(cache, null, 2), 'utf8')
    })
    return writing
  }

  return {
    driver: 'json',

    async init() {
      await load()
      await persist()
    },

    async findUserByEmail(email) {
      const db = await load()
      return db.users.find((u) => u.email === email.toLowerCase()) || null
    },

    async findUserById(id) {
      const db = await load()
      return db.users.find((u) => u.id === id) || null
    },

    async createUser({ firstName, lastName, email, phone, passwordHash, role = 'parent' }) {
      const db = await load()
      const user = {
        id: randomUUID(),
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone: phone || null,
        passwordHash,
        role,
        createdAt: new Date().toISOString(),
      }
      db.users.push(user)
      await persist()
      return user
    },

    async listAthletes(userId) {
      const db = await load()
      return db.athletes.filter((a) => a.userId === userId)
    },

    async createAthlete({ userId, firstName, lastName, division, notes }) {
      const db = await load()
      const athlete = {
        id: randomUUID(),
        userId,
        firstName,
        lastName,
        division,
        notes: notes || null,
        createdAt: new Date().toISOString(),
      }
      db.athletes.push(athlete)
      await persist()
      return athlete
    },

    async deleteAthlete(userId, id) {
      const db = await load()
      const i = db.athletes.findIndex((a) => a.id === id && a.userId === userId)
      if (i === -1) return false
      db.athletes.splice(i, 1)
      await persist()
      return true
    },

    async createContactMessage({ name, email, subject, message }) {
      const db = await load()
      const row = {
        id: randomUUID(),
        name,
        email,
        subject: subject || null,
        message,
        handled: false,
        createdAt: new Date().toISOString(),
      }
      db.contact_messages.push(row)
      await persist()
      return row
    },
  }
}
