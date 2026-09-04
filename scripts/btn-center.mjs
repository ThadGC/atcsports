import { chromium } from 'playwright'
const BASE = process.env.BASE || 'http://localhost:4180'
const PAGES = ['/','/flag-football','/7v7','/camps','/schedule','/divisions','/standings','/locations','/contact','/login','/register']
const b = await chromium.launch()
let bad = 0
for (const vp of [{n:'mobile',w:390,h:844},{n:'tablet',w:834,h:1112},{n:'desktop',w:1440,h:900}]) {
  const p = await b.newPage({ viewport: { width: vp.w, height: vp.h } })
  for (const path of PAGES) {
    await p.goto(BASE + path, { waitUntil: 'networkidle' })
    await p.waitForTimeout(400)
    const off = await p.evaluate(() =>
      [...document.querySelectorAll('.btn')]
        .filter((el) => el.getClientRects().length && !el.closest('[inert]'))
        .map((el) => {
          const r = el.getBoundingClientRect()
          const kids = [...el.children]
          if (!kids.length) return null
          const first = kids[0].getBoundingClientRect()
          const last = kids[kids.length - 1].getBoundingClientRect()
          const leftGap = first.left - r.left
          const rightGap = r.right - last.right
          // a centred button has roughly equal gutters either side of its content
          return Math.abs(leftGap - rightGap) > 24
            ? { t: el.textContent.trim().slice(0, 26), l: Math.round(leftGap), r: Math.round(rightGap), w: Math.round(r.width) }
            : null
        })
        .filter(Boolean),
    )
    if (off.length) {
      bad += off.length
      console.log(`  ✗ ${vp.n} ${path}`)
      off.forEach((o) => console.log(`      "${o.t}" w=${o.w} left gutter ${o.l} vs right ${o.r}`))
    }
  }
  await p.close()
}
await b.close()
console.log(bad ? `\n  ${bad} off-centre` : '\n  every button centred ✓')
