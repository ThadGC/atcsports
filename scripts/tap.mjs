import { chromium } from 'playwright'
const BASE = process.env.BASE || 'http://localhost:5173'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 390, height: 844 } })
const agg = new Map()
for (const path of ['/', '/flag-football', '/login', '/register', '/contact']) {
  await p.goto(BASE + path, { waitUntil: 'networkidle' })
  await p.waitForTimeout(700)
  const out = await p.evaluate(() =>
    [...document.querySelectorAll('a,button,input,select,textarea')]
      .filter((el) => el.getClientRects().length && !el.closest('[inert]'))
      .filter((el) => !el.className.toString().includes('sr-only'))
      .filter((el) => !(el.tagName === 'A' && el.parentElement && /^(P|SPAN|LI|LABEL|H1|H2|H3|H4)$/.test(el.parentElement.tagName) && el.parentElement.textContent.trim().length > el.textContent.trim().length + 8))
      .map((el) => {
        const r = el.getBoundingClientRect()
        return { tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 46),
          txt: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 26), h: Math.round(r.height) }
      })
      .filter((x) => x.h > 0 && x.h < 44))
  for (const o of out) {
    const k = `${o.tag} | ${o.txt} | h=${o.h} | ${o.cls}`
    agg.set(k, (agg.get(k) || 0) + 1)
  }
}
;[...agg.entries()].sort((a, z) => z[1] - a[1]).forEach(([k, n]) => console.log(`  x${n}  ${k}`))
await b.close()
