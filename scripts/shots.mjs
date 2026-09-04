import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.BASE || 'http://localhost:5173'
const OUT = process.env.OUT || '/private/tmp/claude-501/-Users-thadeusgous-Documents-ATCsports/45d853b9-94e3-472d-841a-b97fe9c1df2c/scratchpad/shots'
mkdirSync(OUT, { recursive: true })

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'desktop', width: 1440, height: 900 },
]
const PAGES = (process.env.PAGES || '/,/flag-football,/7v7,/camps,/schedule,/divisions,/standings,/locations,/contact,/register,/login,/nope-404').split(',')

const browser = await chromium.launch()
const report = []

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  const errors = []
  // A 404 route is *expected* to return 404; that is the page working, not an error.
  page.on('console', (m) => {
    const t = m.text()
    if (m.type() !== 'error') return
    if (t.includes('ERR_CONNECTION_REFUSED')) return
    if (/status of 404/.test(t)) return
    // Our own rate limiter, tripped by running the suites repeatedly. Not a page bug.
    if (/status of 429/.test(t)) return
    errors.push(t.slice(0, 160))
  })
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message.slice(0, 160)))

  for (const path of PAGES) {
    const url = BASE + path
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {})
    // let reveals settle
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto'
      // walk the page so every IntersectionObserver fires, then hard-reset to top
      const h = document.body.scrollHeight
      for (let y = 0; y <= h; y += Math.round(window.innerHeight * 0.8)) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 90))
      }
      window.scrollTo(0, 0)
      await new Promise((r) => setTimeout(r, 900))
    })
    await page.waitForTimeout(700)

    const audit = await page.evaluate(() => {
      const de = document.documentElement
      const overflow = de.scrollWidth - de.clientWidth
      // find elements wider than viewport
      const offenders = []
      if (overflow > 1) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect()
          if (r.width > de.clientWidth + 1 || r.right > de.clientWidth + 1) {
            offenders.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 60)} w=${Math.round(r.width)} right=${Math.round(r.right)}`)
            if (offenders.length > 5) break
          }
        }
      }
      // only count invisible elements that actually occupy layout (ignore the closed mobile menu)
      const hidden = [...document.querySelectorAll('[style*="opacity"]')].filter(
        (e) => getComputedStyle(e).opacity === '0' && e.getClientRects().length > 0 && !e.closest('[aria-hidden="true"]'),
      ).length
      const imgs = [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src'))
      const noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length
      return {
        title: document.title,
        desc: document.querySelector('meta[name="description"]')?.content?.slice(0, 90) || null,
        h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 60)),
        overflow, offenders, hidden, brokenImgs: imgs, noAlt,
      }
    })

    report.push({ vp: vp.name, path, ...audit, errors: [...new Set(errors)] })
    const slug = path === '/' ? 'home' : path.replace(/\//g, '').replace(/^-/, '')
    await page.screenshot({ path: `${OUT}/${vp.name}-${slug}.png`, fullPage: vp.name === 'desktop' && path === '/' })
  }
  await ctx.close()
}
await browser.close()

let bad = 0
for (const r of report) {
  const flags = []
  if (r.overflow > 1) { flags.push(`OVERFLOW ${r.overflow}px :: ${r.offenders.join(' | ')}`); bad++ }
  if (r.hidden > 0) { flags.push(`HIDDEN ${r.hidden}`); bad++ }
  if (r.brokenImgs.length) { flags.push(`BROKEN IMG ${r.brokenImgs.join(',')}`); bad++ }
  if (r.noAlt) { flags.push(`NO ALT ${r.noAlt}`); bad++ }
  if (r.h1.length !== 1) { flags.push(`H1 COUNT ${r.h1.length}`); bad++ }
  if (!r.desc) { flags.push('NO META DESC'); bad++ }
  if (r.errors.length) { flags.push(`JS: ${r.errors.join(' // ')}`); bad++ }
  console.log(`${flags.length ? '✗' : '✓'} ${r.vp.padEnd(8)} ${r.path.padEnd(16)} ${r.title.slice(0, 52)}`)
  flags.forEach((f) => console.log(`    → ${f}`))
}
console.log(`\n${bad === 0 ? 'ALL CLEAN' : bad + ' issue(s)'}`)
