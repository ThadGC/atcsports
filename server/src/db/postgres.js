import { readFile } from 'node:fs/promises'

// Postgres adapter. Identical interface to the JSON adapter. Set DATABASE_URL and
// this takes over with no application code changes.
export async function createPostgresDb(connectionString) {
  const { default: pg } = await import('pg')
  const pool = new pg.Pool({
    connectionString,
    ssl: /localhost|127\.0\.0\.1/.test(connectionString) ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30_000,
  })

  const rowToUser = (r) =>
    r && {
      id: r.id,
      firstName: r.first_name,
      lastName: r.last_name,
      email: r.email,
      phone: r.phone,
      passwordHash: r.password_hash,
      role: r.role,
      createdAt: r.created_at,
    }

  const rowToAthlete = (r) =>
    r && {
      id: r.id,
      userId: r.user_id,
      firstName: r.first_name,
      lastName: r.last_name,
      division: r.division,
      notes: r.notes,
      createdAt: r.created_at,
    }

  return {
    driver: 'postgres',
    pool,

    async init() {
      // CITEXT gives case-insensitive unique emails; fall back to TEXT if unavailable.
      await pool.query('CREATE EXTENSION IF NOT EXISTS citext').catch(() => {})
      const sql = await readFile(new URL('./schema.sql', import.meta.url), 'utf8')
      await pool.query(sql)
    },

    async findUserByEmail(email) {
      const { rows } = await pool.query('SELECT * FROM users WHERE lower(email) = lower($1)', [email])
      return rowToUser(rows[0])
    },

    async findUserById(id) {
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
      return rowToUser(rows[0])
    },

    async createUser({ firstName, lastName, email, phone, passwordHash, role = 'parent' }) {
      const { rows } = await pool.query(
        `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [firstName, lastName, email.toLowerCase(), phone || null, passwordHash, role],
      )
      return rowToUser(rows[0])
    },

    async listAthletes(userId) {
      const { rows } = await pool.query(
        'SELECT * FROM athletes WHERE user_id = $1 ORDER BY created_at ASC',
        [userId],
      )
      return rows.map(rowToAthlete)
    },

    async createAthlete({ userId, firstName, lastName, division, notes }) {
      const { rows } = await pool.query(
        `INSERT INTO athletes (user_id, first_name, last_name, division, notes)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [userId, firstName, lastName, division, notes || null],
      )
      return rowToAthlete(rows[0])
    },

    async deleteAthlete(userId, id) {
      const { rowCount } = await pool.query(
        'DELETE FROM athletes WHERE id = $1 AND user_id = $2',
        [id, userId],
      )
      return rowCount > 0
    },

    async createContactMessage({ name, email, subject, message }) {
      const { rows } = await pool.query(
        `INSERT INTO contact_messages (name, email, subject, message)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, subject || null, message],
      )
      return rows[0]
    },
  }
}
