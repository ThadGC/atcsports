import { chromium } from 'playwright'
const OUT='/private/tmp/claude-501/-Users-thadeusgous-Documents-ATCsports/45d853b9-94e3-472d-841a-b97fe9c1df2c/scratchpad/shots'
const BASE=process.env.BASE||'http://localhost:4180'
const b=await chromium.launch()
const p=await b.newPage({viewport:{width:1440,height:900}})
await p.goto(BASE+'/standings',{waitUntil:'networkidle'}); await p.waitForTimeout(900)
const combo=p.locator('[role="combobox"]').first()
const before=await combo.textContent()
await combo.click(); await p.waitForTimeout(500)
const opts=await p.locator('[role="option"]').count()
await p.screenshot({path:`${OUT}/select-open.png`})
// keyboard: arrow down then Enter picks the next option
await p.keyboard.press('ArrowDown'); await p.keyboard.press('Enter'); await p.waitForTimeout(400)
const after=await combo.textContent()
// Escape closes
await combo.click(); await p.waitForTimeout(300)
await p.keyboard.press('Escape'); await p.waitForTimeout(300)
const closed=await combo.getAttribute('aria-expanded')
// click outside closes
await combo.click(); await p.waitForTimeout(300)
await p.mouse.click(10,10); await p.waitForTimeout(300)
const closed2=await combo.getAttribute('aria-expanded')
console.log(`  options listed: ${opts}`)
console.log(`  keyboard select: "${before.trim().slice(0,28)}" -> "${after.trim().slice(0,28)}" ${before!==after?'✓':'✗'}`)
console.log(`  Escape closes: ${closed==='false'?'✓':'✗'} | click outside closes: ${closed2==='false'?'✓':'✗'}`)
await b.close()
