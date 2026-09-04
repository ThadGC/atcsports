import { chromium } from 'playwright'
const OUT='/private/tmp/claude-501/-Users-thadeusgous-Documents-ATCsports/45d853b9-94e3-472d-841a-b97fe9c1df2c/scratchpad/shots'
const BASE=process.env.BASE||'http://localhost:4180'
const b=await chromium.launch()
for (const [n,w,h] of [['tablet',834,1112],['desktop',1440,900]]) {
  const p=await b.newPage({viewport:{width:w,height:h}})
  await p.goto(BASE+'/',{waitUntil:'networkidle'}); await p.waitForTimeout(900)
  await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';const s=[...document.querySelectorAll('h2')].find(x=>/Saturday looks like/i.test(x.textContent))?.closest('section'); s?.scrollIntoView({block:'center'})})
  await p.waitForTimeout(800)
  // open the portrait photo (index 6) to confirm the face is visible in the tile too
  const tiles = p.locator('section button[aria-label^="View photo"]')
  await tiles.nth(6).click()
  await p.waitForTimeout(700)
  const dlg = await p.locator('[role="dialog"]').count()
  await p.screenshot({path:`${OUT}/lb-${n}.png`})
  // backdrop click closes
  await p.mouse.click(12, 12)
  await p.waitForTimeout(600)
  const after = await p.locator('[role="dialog"]').count()
  // escape closes too
  await tiles.nth(0).click(); await p.waitForTimeout(500)
  await p.keyboard.press('Escape'); await p.waitForTimeout(500)
  const afterEsc = await p.locator('[role="dialog"]').count()
  console.log(`  ${n}: opens ${dlg?'✓':'✗'} | backdrop closes ${after===0?'✓':'✗'} | Escape closes ${afterEsc===0?'✓':'✗'}`)
  await p.close()
}
await b.close()
