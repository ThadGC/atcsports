// Full-page screenshots of the old TeamLinkt site and the new build, at three widths,
// collected into one PDF per site for client review.
//
//   node scripts/compare-shots.mjs                 both sites
//   node scripts/compare-shots.mjs --only new      just the new build
//   BASE=http://localhost:5173 node scripts/compare-shots.mjs --only new
//
// Output: screenshots/old/, screenshots/new/, a full PDF and a compact PDF per site.
import sharp from 'sharp'
import { chromium } from 'playwright'
import { mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const BASE = process.env.BASE || 'http://localhost:4180'
const OLD = 'https://atcfootball.com'
const OUT = 'screenshots'

const onlyArg = process.argv.indexOf('--only')
const ONLY = onlyArg > -1 ? process.argv[onlyArg + 1] : 'both'

const WIDTHS = [
  ['mobile', 390, 844],
  ['tablet', 834, 1112],
  ['desktop', 1440, 900],
]

const OLD_PAGES = [
  ['home', '/atcsports/Home'],
  ['flag-football', '/atcsports/FlagFootball'],
  ['7on7', '/atcsports/7on7'],
  ['camps-clinics', '/atcsports/CampsClinics'],
  ['schedule', '/atcsports/Schedule'],
  ['scores', '/atcsports/Scores'],
  ['divisions', '/atcsports/Divisions'],
  ['standings', '/atcsports/Standings'],
  ['locations', '/atcsports/Locations'],
  ['contact', '/atcsports/ContactUs'],
]

const NEW_PAGES = [
  ['home', '/'],
  ['flag-football', '/flag-football'],
  ['7v7', '/7v7'],
  ['camps', '/camps'],
  ['divisions', '/divisions'],
  ['schedule', '/schedule'],
  ['standings', '/standings'],
  ['locations', '/locations'],
  ['contact', '/contact'],
  ['register', '/register'],
  ['login', '/login'],
  ['404', '/nope-404'],
]

// A fullPage screenshot paints position:fixed elements wherever the viewport happens to
// sit, so the navbar lands in the middle of the image, the sticky CTA bar ghosts across
// the page, and the fixed backdrop only covers the first screen. Pin the header to the
// top, stretch the backdrop over the whole document, and drop the scroll-triggered
// overlays, which are not page content.
async function flattenFixed(page) {
  await page.evaluate(() => {
    const style = document.createElement('style')
    style.textContent = `body::before{position:absolute!important;top:0!important;height:100%!important;}`
    document.head.appendChild(style)

    const header = document.querySelector('header')
    if (header) {
      header.style.setProperty('position', 'absolute', 'important')
      header.style.setProperty('top', '0', 'important')
    }
    for (const el of document.querySelectorAll('body *')) {
      if (getComputedStyle(el).position !== 'fixed') continue
      if (el.tagName === 'HEADER' || el.closest('header')) continue
      el.style.setProperty('display', 'none', 'important')
    }
  })
}

async function shoot(browser, label, origin, pages, settle, flatten) {
  const shots = []
  for (const [wname, width, height] of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    await mkdir(join(OUT, label, wname), { recursive: true })

    for (const [name, path] of pages) {
      const file = join(OUT, label, wname, `${name}.png`)
      try {
        await page.goto(origin + path, { waitUntil: 'load', timeout: 45000 })
        await page.waitForTimeout(settle)
        // Settle lazy images and entry animations, then return to the top.
        await page.evaluate(async () => {
          window.scrollTo(0, document.body.scrollHeight)
          await new Promise((r) => setTimeout(r, 400))
          window.scrollTo(0, 0)
          await new Promise((r) => setTimeout(r, 300))
        })
        if (flatten) await flattenFixed(page)
        await page.waitForTimeout(500)
        await page.screenshot({ path: file, fullPage: true })
        shots.push({ wname, name, file })
        console.log(`  ✓ ${label.padEnd(3)} ${wname.padEnd(7)} ${name}`)
      } catch (err) {
        console.log(`  ✗ ${label.padEnd(3)} ${wname.padEnd(7)} ${name}  (${err.message.split('\n')[0].slice(0, 60)})`)
      }
    }
    await ctx.close()
  }
  return shots
}

// One image per PDF page. compact re-encodes to JPEG so the file can be emailed.
async function makePdf(browser, shots, title, outFile, compact) {
  const secs = []
  for (const s of shots) {
    let src
    if (compact) {
      const buf = await sharp(s.file)
        .resize({ width: 1100, withoutEnlargement: true })
        .jpeg({ quality: 62, mozjpeg: true })
        .toBuffer()
      src = `data:image/jpeg;base64,${buf.toString('base64')}`
    } else {
      src = `data:image/png;base64,${(await readFile(s.file)).toString('base64')}`
    }
    secs.push(`<section><h2>${title} &middot; ${s.name} &middot; ${s.wname}</h2>
      <img src="${src}"></section>`)
  }
  const html = `<!doctype html><meta charset="utf-8"><style>
    @page{size:A4;margin:10mm}body{margin:0;font:11px system-ui,sans-serif;color:#111}
    section{page-break-after:always;text-align:center}section:last-child{page-break-after:auto}
    h2{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin:0 0 5px;color:#444}
    img{max-width:100%;max-height:252mm;object-fit:contain;border:1px solid #ddd}
  </style>${secs.join('')}`

  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'load' })
  await page.pdf({ path: outFile, format: 'A4', printBackground: true })
  await page.close()
  console.log(`  -> ${outFile}  (${secs.length} pages)`)
}

const browser = await chromium.launch()
await mkdir(OUT, { recursive: true })

if (ONLY === 'old' || ONLY === 'both') {
  console.log(`\nOld site (${OLD})`)
  const oldShots = await shoot(browser, 'old', OLD, OLD_PAGES, 3800, false)
  console.log('Building old PDFs')
  await makePdf(browser, oldShots, 'OLD', join(OUT, 'atc-old-site.pdf'), false)
  await makePdf(browser, oldShots, 'OLD', join(OUT, 'atc-old-site-compact.pdf'), true)
}

if (ONLY === 'new' || ONLY === 'both') {
  console.log(`\nNew site (${BASE})`)
  const newShots = await shoot(browser, 'new', BASE, NEW_PAGES, 1100, true)
  console.log('Building new PDFs')
  await makePdf(browser, newShots, 'NEW', join(OUT, 'atc-new-site.pdf'), false)
  await makePdf(browser, newShots, 'NEW', join(OUT, 'atc-new-site-compact.pdf'), true)
}

await browser.close()
console.log('')
