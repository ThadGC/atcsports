// Renders a document to a print-ready PDF. Chromium applies the file's @media print
// rules, so the PDF and the web version stay one source.
import { chromium } from 'playwright'
import { resolve } from 'node:path'

const SRC = resolve(process.argv[2] || 'docs/parent-accounts.html')
const OUT = resolve(process.argv[3] || 'docs/ATC-Sports-Parent-Accounts.pdf')

const browser = await chromium.launch()
const page = await browser.newPage()

// Force the light palette regardless of the machine's OS theme.
await page.emulateMedia({ media: 'print', colorScheme: 'light' })
await page.goto(`file://${SRC}`, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts?.ready)
await page.waitForTimeout(400)

await page.pdf({
  path: OUT,
  format: 'Letter',
  printBackground: true,
  margin: { top: '16mm', bottom: '14mm', left: '15mm', right: '15mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: `
    <div style="width:100%;padding:0 15mm;font-family:Archivo,Arial,sans-serif;font-size:7.5pt;color:#6E6754;display:flex;justify-content:space-between;">
      <span>ATC Sports &middot; Parent accounts</span>
      <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
    </div>`,
})

await browser.close()
console.log(`PDF written: ${OUT}`)
