// Prerenders every public route to static HTML so crawlers and social scrapers get
// complete markup and per-page meta without running JavaScript.
//
// The app mounts with createRoot (not hydrateRoot), so React simply replaces the
// prerendered markup on load. That means no hydration-mismatch class of bug, and the
// static HTML only ever has to be *correct*, never byte-identical to the client render.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'

const DIST = 'dist'
const PORT = 4178
const ROUTES = [
  '/',
  '/flag-football',
  '/7v7',
  '/camps',
  '/divisions',
  '/locations',
  '/contact',
  '/login',
  '/register',
  '/404',
]

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
}

// Minimal static server with SPA fallback.
const server = createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])
  let file = join(DIST, url)
  if (!extname(file) || !existsSync(file)) file = join(DIST, 'index.html')
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})

await new Promise((r) => server.listen(PORT, r))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const failures = []
page.on('pageerror', (e) => failures.push(e.message))

const shell = await readFile(join(DIST, 'index.html'), 'utf8')
let written = 0

for (const route of ROUTES) {
  failures.length = 0
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' })

  // Let Reveal's observers resolve so the saved markup isn't stuck at opacity 0.
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    const h = document.body.scrollHeight
    for (let y = 0; y <= h; y += Math.round(window.innerHeight * 0.8)) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 400))
  })
  await page.waitForTimeout(350)

  const { head, body, title } = await page.evaluate(() => {
    // Strip inline transition styles so the static markup renders fully visible
    // even before React takes over.
    for (const el of document.querySelectorAll('#root [style*="opacity"]')) {
      el.style.removeProperty('opacity')
      el.style.removeProperty('transform')
      el.style.removeProperty('filter')
      el.style.removeProperty('will-change')
    }
    const drop = new Set(['SCRIPT'])
    const head = [...document.head.children]
      .filter((el) => !drop.has(el.tagName) || el.type === 'application/ld+json')
      .map((el) => el.outerHTML)
      .join('\n    ')
    return { head, body: document.getElementById('root').innerHTML, title: document.title }
  })

  if (failures.length) {
    console.error(`  ✗ ${route} — JS error: ${failures[0].slice(0, 120)}`)
    process.exitCode = 1
    continue
  }

  // Rebuild the document: prerendered head + prerendered body + the app's own scripts.
  const scripts = [...shell.matchAll(/<script[^>]*>[\s\S]*?<\/script>/g)].map((m) => m[0]).join('\n    ')
  const html = `<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    ${head}
  </head>
  <body class="bg-ink text-white antialiased">
    <div id="root">${body}</div>
    ${scripts}
  </body>
</html>
`

  const out =
    route === '/'
      ? join(DIST, 'index.html')
      : route === '/404'
        ? join(DIST, '404.html')
        : join(DIST, route.slice(1), 'index.html')

  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, html, 'utf8')
  written++
  console.log(`  ✓ ${route.padEnd(16)} -> ${out.replace(DIST + '/', '')}  ${title.slice(0, 46)}`)
}

await browser.close()
server.close()
console.log(`\n  prerendered ${written}/${ROUTES.length} routes`)
