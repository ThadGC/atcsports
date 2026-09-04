// Applies schema.sql. Only meaningful for the Postgres driver.
import { config } from '../config.js'
import { getDb } from './index.js'

const db = await getDb()
console.log(
  db.driver === 'postgres'
    ? `Schema applied to ${config.db.url.replace(/:\/\/.*@/, '://***@')}`
    : `Driver is "${db.driver}" has nothing to migrate. Set DATABASE_URL to use Postgres.`,
)
process.exit(0)
