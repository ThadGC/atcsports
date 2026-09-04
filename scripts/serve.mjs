// Static server that resolves clean URLs to directory indexes, the way Netlify,
// Vercel, Cloudflare Pages and nginx all do — plus a real 404.html fallback.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const DIST = process.env.DIST || 'dist'
const PORT = Number(process.env.PORT || 4180)
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain',
  '.xml': 'application/xml', '.ico': 'image/x-icon' }

const resolve = (urlPath) => {
  const p = join(DIST, decodeURIComponent(urlPath.split('?')[0]))
  if (existsSync(p) && statSync(p).isFile()) return p
  const idx = join(p, 'index.html')
  if (existsSync(idx)) return idx
  return null
}

createServer(async (req, res) => {
  const file = resolve(req.url)
  if (file) {
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
    return res.end(await readFile(file))
  }
  const nf = join(DIST, '404.html')
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(existsSync(nf) ? await readFile(nf) : 'Not found')
}).listen(PORT, () => console.log(`serving ${DIST} on http://localhost:${PORT}`))
