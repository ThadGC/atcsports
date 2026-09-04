import 'dotenv/config'

const required = (key, fallback) => {
  const v = process.env[key] ?? fallback
  if (v === undefined) throw new Error(`Missing required env var: ${key}`)
  return v
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  // Comma-separated list of origins allowed to send credentialed requests.
  origins: (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:4173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  jwt: {
    secret: required('JWT_SECRET', 'dev-only-secret-change-me'),
    // Access token lives in an httpOnly cookie.
    ttl: process.env.JWT_TTL || '7d',
    cookieName: process.env.COOKIE_NAME || 'atc_session',
  },
  db: {
    // 'json' runs off a local file so the API works with no database attached.
    // Set DATABASE_URL and the Postgres adapter takes over automatically.
    driver: process.env.DATABASE_URL ? 'postgres' : process.env.DB_DRIVER || 'json',
    url: process.env.DATABASE_URL || null,
    file: process.env.DB_FILE || new URL('../data/db.json', import.meta.url).pathname,
  },
  isProd: (process.env.NODE_ENV || 'development') === 'production',
}

if (config.isProd && config.jwt.secret === 'dev-only-secret-change-me') {
  throw new Error('JWT_SECRET must be set to a real secret in production.')
}
