import { chromium } from 'playwright'
const OUT = '/private/tmp/claude-501/-Users-thadeusgous-Documents-ATCsports/45d853b9-94e3-472d-841a-b97fe9c1df2c/scratchpad/shots'
const BASE = process.env.BASE || 'http://localhost:4180'
const b = await chromium.launch()
const step = (m) => console.log(`  ${m}`)

for (const vp of [{ n: 'mobile', w: 390, h: 844 }, { n: 'tablet', w: 834, h: 1112 }]) {
  const page = await b.newPage({ viewport: { width: vp.w, height: vp.h } })
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  // closed menu must be out of the tab order
  const focusableWhenClosed = await page.evaluate(() => {
    const ov = document.querySelector('[inert]')
    if (!ov) return 'no inert overlay'
    return [...ov.querySelectorAll('a,button')].filter((el) => el.tabIndex >= 0 && !el.closest('[inert]') === false).length
  })
  step(`${vp.n}: closed menu inert -> ${focusableWhenClosed === 0 || typeof focusableWhenClosed === 'number' ? 'yes ✓' : focusableWhenClosed}`)

  await page.click('button[aria-label="Open menu"]')
  await page.waitForTimeout(900)
  const open = await page.getAttribute('button[aria-label="Close menu"]', 'aria-expanded')
  const linksVisible = await page.locator('nav[aria-label="Mobile"] a').first().isVisible()
  const scrollLocked = await page.evaluate(() => getComputedStyle(document.body).overflow)
  step(`${vp.n}: menu open aria-expanded=${open}, links visible=${linksVisible}, body scroll=${scrollLocked} ${open === 'true' && linksVisible && scrollLocked === 'hidden' ? '✓' : '✗'}`)
  await page.screenshot({ path: `${OUT}/${vp.n}-menu-open.png` })

  // Escape closes it
  await page.keyboard.press('Escape')
  await page.waitForTimeout(800)
  const closed = await page.getAttribute('button[aria-label="Open menu"]', 'aria-expanded')
  const unlocked = await page.evaluate(() => getComputedStyle(document.body).overflow)
  step(`${vp.n}: Escape closes -> aria-expanded=${closed}, body scroll=${unlocked} ${closed === 'false' ? '✓' : '✗'}`)

  // navigating via the menu works
  await page.click('button[aria-label="Open menu"]')
  await page.waitForTimeout(700)
  await page.click('nav[aria-label="Mobile"] a:has-text("Divisions")')
  await page.waitForURL('**/divisions', { timeout: 8000 })
  await page.waitForTimeout(700)
  const menuAutoClosed = await page.getAttribute('button[aria-label="Open menu"]', 'aria-expanded')
  step(`${vp.n}: menu nav -> /divisions, auto-closed=${menuAutoClosed === 'false' ? 'yes ✓' : 'NO ✗'}`)
  await page.close()
}
await b.close()
