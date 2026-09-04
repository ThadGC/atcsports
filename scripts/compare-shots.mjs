// Full-page screenshots of the old TeamLinkt site and the new build, at three widths,
// collected into one PDF per site for client review.
//
//   node scripts/compare-shots.mjs            (new site from http://localhost:4180)
//   BASE=http://localhost:5173 node scripts/compare-shots.mjs
//
// Output: screenshots/old/, screenshots/new/, and two PDFs in screenshots/.
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const BASE = process.env.BASE || 'http://localhost:4180'
const OLD = 'https://atcfootball.com'
const OUT = 'screenshots'

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

async function shoot(browser, label, origin, pages, settle) {
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
        // Force every lazy image and reveal animation to finish before capturing.
        await page.evaluate(async () => {
          window.scrollTo(0, document.body.scrollHeight)
          await new Promise((r) => setTimeout(r, 350))
          window.scrollTo(0, 0)
          await new Promise((r) => setTimeout(r, 250))
        })
        await page.waitForTimeout(400)
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

// One image per PDF page, scaled to fit, with a caption naming the page and width.
async function makePdf(browser, shots, title, outFile) {
  const { readFile } = await import('node:fs/promises')
  const pages = []
  for (const s of shots) {
    const b64 = (await readFile(s.file)).toString('base64')
    pages.push(`
      <section>
        <h2>${title} &middot; ${s.name} &middot; ${s.wname}</h2>
        <img src="data:image/png;base64,${b64}">
      </section>`)
  }
  const html = `<!doctype html><meta charset="utf-8">
    <style>
      @page { size: A4; margin: 10mm; }
      body { margin: 0; font: 11px -apple-system, system-ui, sans-serif; color: #111; }
      section { page-break-after: always; text-align: center; }
      section:last-child { page-break-after: auto; }
      h2 { font-size: 11px; font-weight: 700; text-transform: uppercase;
           letter-spacing: .08em; margin: 0 0 6px; color: #444; }
      img { max-width: 100%; max-height: 250mm; object-fit: contain;
            border: 1px solid #ddd; }
    </style>${pages.join('')}`

  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'load' })
  await page.pdf({ path: outFile, format: 'A4', printBackground: true })
  await page.close()
  console.log(`  -> ${outFile}  (${shots.length} pages)`)
}

const browser = await chromium.launch()
await mkdir(OUT, { recursive: true })

console.log(`\nOld site (${OLD})`)
const oldShots = await shoot(browser, 'old', OLD, OLD_PAGES, 3800)

console.log(`\nNew site (${BASE})`)
const newShots = await shoot(browser, 'new', BASE, NEW_PAGES, 1100)

console.log('\nBuilding PDFs')
await makePdf(browser, oldShots, 'OLD', join(OUT, 'atc-old-site.pdf'))
await makePdf(browser, newShots, 'NEW', join(OUT, 'atc-new-site.pdf'))

await browser.close()
console.log(`\n${oldShots.length} old + ${newShots.length} new screenshots in ${OUT}/\n`)
