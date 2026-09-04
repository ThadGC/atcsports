import { chromium } from 'playwright'
const BASE = process.env.BASE || 'http://localhost:5173'
const OUT = '/private/tmp/claude-501/-Users-thadeusgous-Documents-ATCsports/45d853b9-94e3-472d-841a-b97fe9c1df2c/scratchpad/shots'
const b = await chromium.launch()
for (const vp of [{n:'desktop',w:1440,h:900},{n:'mobile',w:390,h:844}]) {
  const p = await b.newPage({ viewport: { width: vp.w, height: vp.h } })
  await p.goto(BASE + '/login', { waitUntil: 'networkidle' })
  await p.fill('#email', 'demo@atcsports.test')
  await p.fill('#password', 'atcdemo2026')
  await p.click('button[type="submit"]')
  await p.waitForURL('**/account', { timeout: 15000 })
  await p.waitForTimeout(1600)
  const who = (await p.locator('h1').first().textContent()).trim()
  const kids = await p.locator('main li').filter({ hasText: 'Reed' }).count()
  console.log(`  ${vp.n}: logged in as "${who}", ${kids} athlete rows visible`)
  await p.screenshot({ path: `${OUT}/demo-account-${vp.n}.png`, fullPage: vp.n === 'mobile' })
  await p.close()
}
await b.close()
