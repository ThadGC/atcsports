// Builds the fixed field backdrop: a stadium seen from field level, drawn in true
// perspective so the yard lines converge toward a lit horizon.
//
// This is generated rather than photographed so it tiles no seams, weighs little, and
// carries no focal point to compete with the copy that scrolls over it.
import sharp from 'sharp'

const W = 2000
const H = 1125
const HORIZON = 430

// Pinhole camera looking down the field from behind the near end zone.
const F = 900          // focal length
const EYE = 250        // camera height above the turf
const CX = W / 2
const YARD = 30        // world units per yard
const HALF_W = 800     // half the field width in world units (53.3 yards)
const NEAR = 300       // depth of the nearest visible turf
const LEN = 120 * YARD // 100 yards plus two end zones

const sy = (z) => HORIZON + (F * EYE) / z
const sx = (x, z) => CX + (F * x) / z
const n = (v) => Math.round(v * 10) / 10

// A strip of turf between two depths, as a screen-space quad.
const quad = (z1, z2, x1, x2, fill, op = 1) =>
  `<polygon points="${n(sx(-x1, z1))},${n(sy(z1))} ${n(sx(x1, z1))},${n(sy(z1))} ${n(sx(x2, z2))},${n(sy(z2))} ${n(sx(-x2, z2))},${n(sy(z2))}" fill="${fill}" fill-opacity="${op}"/>`

const parts = []

// ---- sky, lights, stands ----
parts.push(`<rect width="${W}" height="${HORIZON + 40}" fill="url(#sky)"/>`)
for (const [lx, ly, r] of [[300, 150, 200], [700, 95, 230], [1300, 95, 230], [1700, 150, 200], [1000, 60, 260]]) {
  parts.push(`<circle cx="${lx}" cy="${ly}" r="${r}" fill="url(#bloom)"/>`)
  // the fixture itself: a small bank of lamps
  for (let i = 0; i < 6; i++) {
    parts.push(`<circle cx="${lx - 34 + (i % 3) * 34}" cy="${ly - 10 + Math.floor(i / 3) * 26}" r="9" fill="#fbf6e4" fill-opacity="0.9"/>`)
  }
}
// stands flanking the field, dark with a faint warm crowd haze
parts.push(`<polygon points="0,${HORIZON - 190} 640,${HORIZON + 10} 640,${H} 0,${H}" fill="#0a0d0b"/>`)
parts.push(`<polygon points="${W},${HORIZON - 190} ${W - 640},${HORIZON + 10} ${W - 640},${H} ${W},${H}" fill="#0a0d0b"/>`)
parts.push(`<rect x="0" y="${HORIZON - 130}" width="${W}" height="120" fill="url(#crowd)" opacity="0.5"/>`)

// ---- turf ----
parts.push(quad(NEAR, NEAR + LEN, HALF_W, HALF_W, 'url(#turf)'))

// mown stripes every 5 yards
for (let y = 0; y < 120; y += 5) {
  if ((y / 5) % 2) continue
  parts.push(quad(NEAR + y * YARD, NEAR + (y + 5) * YARD, HALF_W, HALF_W, '#0f2b17', 0.45))
}

// end zones, slightly darker
parts.push(quad(NEAR, NEAR + 10 * YARD, HALF_W, HALF_W, '#0b2412', 0.55))
parts.push(quad(NEAR + 110 * YARD, NEAR + LEN, HALF_W, HALF_W, '#0b2412', 0.55))

// ---- markings ----
const line = (z, half, w, op) => {
  const a = sx(-half, z), b = sx(half, z), yy = sy(z)
  const t = Math.max(1, (F / z) * w)
  return `<rect x="${n(a)}" y="${n(yy - t / 2)}" width="${n(b - a)}" height="${n(t)}" fill="#ffffff" fill-opacity="${op}"/>`
}

// yard lines across the field
for (let y = 0; y <= 120; y += 5) {
  const z = NEAR + y * YARD
  const major = y % 10 === 0
  parts.push(line(z, HALF_W, major ? 5 : 3.5, major ? 0.62 : 0.42))
}
// sidelines running away from camera
for (const s of [-1, 1]) {
  parts.push(
    `<polygon points="${n(sx(s * HALF_W, NEAR))},${n(sy(NEAR))} ${n(sx(s * (HALF_W - 22), NEAR))},${n(sy(NEAR))} ${n(sx(s * (HALF_W - 22), NEAR + LEN))},${n(sy(NEAR + LEN))} ${n(sx(s * HALF_W, NEAR + LEN))},${n(sy(NEAR + LEN))}" fill="#fff" fill-opacity="0.55"/>`,
  )
}
// hash marks, one per yard on both interior rows
for (let y = 1; y < 120; y++) {
  if (y % 5 === 0) continue
  const z = NEAR + y * YARD
  for (const hx of [-200, 200]) {
    const a = sx(hx - 26, z), b = sx(hx + 26, z), yy = sy(z)
    const t = Math.max(1, (F / z) * 3)
    parts.push(`<rect x="${n(a)}" y="${n(yy - t / 2)}" width="${n(b - a)}" height="${n(t)}" fill="#fff" fill-opacity="0.3"/>`)
  }
}

// yard numbers, scaled by depth so they sit flat on the turf
const NUMS = [10, 20, 30, 40, 50, 40, 30, 20, 10]
NUMS.forEach((num, i) => {
  const yard = 10 + (i + 1) * 10
  const z = NEAR + yard * YARD
  const k = F / z
  const size = 90 * k
  if (size < 26) return
  for (const side of [-1, 1]) {
    const px = sx(side * 520, z)
    const py = sy(z)
    parts.push(
      `<text x="${n(px)}" y="${n(py)}" font-family="Impact, Haettenschweiler, sans-serif" font-size="${n(size)}" fill="#ffffff" fill-opacity="0.4" text-anchor="middle" transform="scale(1,0.62) translate(0,${n(py / 0.62 - py)})">${num}</text>`,
    )
  }
})

// goalpost at the far end
const gz = NEAR + 118 * YARD
const gk = F / gz
parts.push(
  `<g stroke="#d8b23c" stroke-opacity="0.65" stroke-width="${n(Math.max(1, 8 * gk))}" fill="none">` +
    `<line x1="${n(sx(0, gz))}" y1="${n(sy(gz))}" x2="${n(sx(0, gz))}" y2="${n(sy(gz) - 150 * gk)}"/>` +
    `<line x1="${n(sx(-93, gz))}" y1="${n(sy(gz) - 150 * gk)}" x2="${n(sx(93, gz))}" y2="${n(sy(gz) - 150 * gk)}"/>` +
    `<line x1="${n(sx(-93, gz))}" y1="${n(sy(gz) - 150 * gk)}" x2="${n(sx(-93, gz))}" y2="${n(sy(gz) - 330 * gk)}"/>` +
    `<line x1="${n(sx(93, gz))}" y1="${n(sy(gz) - 150 * gk)}" x2="${n(sx(93, gz))}" y2="${n(sy(gz) - 330 * gk)}"/>` +
  `</g>`,
)

// light spill washing down the turf from the banks
parts.push(`<rect y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#spill)"/>`)

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#05070a"/>
    <stop offset="0.55" stop-color="#0b1119"/>
    <stop offset="1" stop-color="#16202a"/>
  </linearGradient>
  <radialGradient id="bloom">
    <stop offset="0" stop-color="#fdf8e8" stop-opacity="0.55"/>
    <stop offset="0.35" stop-color="#e8e2c8" stop-opacity="0.14"/>
    <stop offset="1" stop-color="#e8e2c8" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="crowd" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#2a2118"/><stop offset="0.5" stop-color="#3a2c1e"/><stop offset="1" stop-color="#2a2118"/>
  </linearGradient>
  <linearGradient id="turf" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#1f6b30"/>
    <stop offset="0.55" stop-color="#175427"/>
    <stop offset="1" stop-color="#0e3319"/>
  </linearGradient>
  <radialGradient id="spill" cx="0.5" cy="0" r="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>
    <stop offset="0.6" stop-color="#ffffff" stop-opacity="0.04"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="#05070a"/>
${parts.join('\n')}
</svg>`

await sharp(Buffer.from(svg)).jpeg({ quality: 78 }).toFile('public/img/stadium.jpg')
const m = await sharp('public/img/stadium.jpg').metadata()
console.log(`public/img/stadium.jpg  ${m.width}x${m.height}`)
