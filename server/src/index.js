import { createApp } from './app.js'
import { config } from './config.js'
import { getDb } from './db/index.js'

const db = await getDb()
const app = createApp()

app.listen(config.port, () => {
  console.log(`[api] listening on http://localhost:${config.port}`)
  console.log(`[api] database driver: ${db.driver}`)
  console.log(`[api] allowed origins: ${config.origins.join(', ')}`)
})
