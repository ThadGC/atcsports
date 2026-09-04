// Renders the brand guidelines to PDF. Separate from pdf.mjs because this document is
// dark and full bleed: it needs a zero page margin so the ink ground reaches the paper
// edge, with the page's own wrap padding standing in for the margin.
import { chromium } from 'playwright'
import { resolve } from 'node:path'

const SRC = resolve(process.argv[2] || 'docs/atc-brand-guidelines.html')
const OUT = resolve(process.argv[3] || 'docs/ATC-Sports-Brand-Guidelines.pdf')

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
