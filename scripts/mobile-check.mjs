import { chromium } from 'playwright'
const BASE = process.env.BASE || 'http://localhost:5173'
const OUT = '/private/tmp/claude-501/-Users-thadeusgous-Documents-ATCsports/45d853b9-94e3-472d-841a-b97fe9c1df2c/scratchpad/shots'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 390, height: 844 } })
await p.goto(BASE + '/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1200)

const barState = async () => p.evaluate(() => {
  const bar = [...document.querySelectorAll('div')].find(d => d.className.includes?.('z-[58]'))
  if (!bar) return 'MISSING'
  const cs = getComputedStyle(bar)
  return { opacity: cs.opacity, inert: bar.hasAttribute('inert'), order: [...bar.querySelectorAll('a')].map(a => a.textContent.trim()) }
})
console.log('  at top of hero      :', JSON.stringify(await barState()))
await p.evaluate(() => { document.documentElement.style.scrollBehavior='auto'; window.scrollTo(0, 1400) })
await p.waitForTimeout(1000)
console.log('  after scrolling past:', JSON.stringify(await barState()))
await p.screenshot({ path: `${OUT}/probe-mobile-bar.png` })

// footer layout
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await p.waitForTimeout(1200)
await p.screenshot({ path: `${OUT}/probe-mobile-footer.png` })
const foot = await p.evaluate(() => {
  const heads = [...document.querySelectorAll('footer h2')].map(h => {
    const r = h.getBoundingClientRect()
    return `${h.textContent.trim()} @x${Math.round(r.left)}`
  })
  return heads
})
console.log('  footer headings     :', foot.join(' | '))
await b.close()
