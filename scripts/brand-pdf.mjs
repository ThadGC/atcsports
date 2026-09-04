// Builds both shipping forms of the brand guidelines from one source file:
//   1. public/brand-guidelines/index.html, a standalone page that deploys with the site
//      so it can be shared as an ordinary link.
//   2. docs/ATC-Sports-Brand-Guidelines.pdf.
//
// Separate from pdf.mjs because this document is dark and full bleed: it needs a zero
// page margin so the ink ground reaches the paper edge, with the page's own wrap
// padding standing in for the margin.
import { chromium } from 'playwright'
import { resolve } from 'node:path'
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const SRC = resolve(process.argv[2] || 'docs/atc-brand-guidelines.html')
const OUT = resolve(process.argv[3] || 'docs/ATC-Sports-Brand-Guidelines.pdf')
const PAGE_DIR = resolve('public/brand-guidelines')

// The source is authored as a fragment so it can also be published as an artifact,
// which supplies its own skeleton. A standalone page needs the head written out,
// above all the viewport tag, or phones render it zoomed out.
const source = await readFile(SRC, 'utf8')
const split = source.indexOf('<div class="wrap">')
if (split === -1) throw new Error('Expected <div class="wrap"> to separate head from body')
const head = source.slice(0, split).trim()
const markup = source.slice(split).trim()

await mkdir(PAGE_DIR, { recursive: true })
await writeFile(
  resolve(PAGE_DIR, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Brand guidelines for ATC Sports: colour, typography, photography, uniform and voice. Prepared by Apex Growth.">
${head}
</head>
<body>
${markup}
</body>
</html>
`,
)
console.log(`page written: ${PAGE_DIR}/index.html`)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1100, height: 1400 } })

await page.emulateMedia({ media: 'print', colorScheme: 'dark' })
await page.goto(`file://${SRC}`, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts?.ready)
await page.waitForTimeout(600)

// Confirm the dark ground actually applied before committing it to paper. A white
// body here would mean the tokens never resolved and every value would be unreadable.
const ground = await page.evaluate(() => {
  const cs = getComputedStyle(document.body)
  const h = document.querySelector('.d-h2')
  return { body: cs.backgroundColor, heading: h ? getComputedStyle(h).color : null }
})
console.log('ground:', JSON.stringify(ground))

await page.pdf({
  path: OUT,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
})

await browser.close()
console.log(`PDF written: ${OUT}`)
