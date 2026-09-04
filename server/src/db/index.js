import { config } from '../config.js'
import { createJsonDb } from './json.js'

let instance = null

export async function getDb() {
  if (instance) return instance

  if (config.db.driver === 'postgres') {
    const { createPostgresDb } = await import('./postgres.js')
    instance = await createPostgresDb(config.db.url)
  } else {
    instance = createJsonDb(config.db.file)
  }

  await instance.init()
  return instance
}
