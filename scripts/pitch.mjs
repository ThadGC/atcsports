// Generates the field backdrop: a full gridiron drawn once as SVG, used as a fixed
// page background under a heavy dark wash so it reads as texture, not decoration.
import { writeFileSync } from 'fs'

const W = 1600, H = 900
const M = 70                       // sideline inset
const EZ = 130                      // end zone depth
const fieldL = M + EZ, fieldR = W - M - EZ
const yardW = (fieldR - fieldL) / 100
const line = (x1, y1, x2, y2, o, w = 2) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-opacity="${o}" stroke-width="${w}"/>`

const parts = []

// turf mow stripes
for (let i = 0; i < 10; i++) {
  const x = M + ((W - 2 * M) / 10) * i
  parts.push(`<rect x="${x}" y="${M}" width="${(W - 2 * M) / 10}" height="${H - 2 * M}" fill="#0d1a10" fill-opacity="${i % 2 ? 0.55 : 0.3}"/>`)
}

// sidelines + end lines
parts.push(`<rect x="${M}" y="${M}" width="${W - 2 * M}" height="${H - 2 * M}" fill="none" stroke="#fff" stroke-opacity="0.30" stroke-width="3"/>`)
// end zones
parts.push(line(fieldL, M, fieldL, H - M, 0.3, 3))
parts.push(line(fieldR, M, fieldR, H - M, 0.3, 3))

// yard lines every 5, heavier every 10
for (let y = 5; y < 100; y += 5) {
  const x = fieldL + y * yardW
  parts.push(line(x, M, x, H - M, y % 10 === 0 ? 0.26 : 0.14, y % 10 === 0 ? 2.5 : 1.6))
}

// hash marks: two interior rows, one tick per yard
const hashA = M + (H - 2 * M) * 0.36, hashB = M + (H - 2 * M) * 0.64
for (let y = 1; y < 100; y++) {
  if (y % 5 === 0) continue
  const x = fieldL + y * yardW
  parts.push(line(x, hashA - 9, x, hashA + 9, 0.16, 1.6))
  parts.push(line(x, hashB - 9, x, hashB + 9, 0.16, 1.6))
}
// sideline ticks
for (let y = 1; y < 100; y++) {
  if (y % 5 === 0) continue
  const x = fieldL + y * yardW
  parts.push(line(x, M, x, M + 14, 0.13, 1.5))
  parts.push(line(x, H - M - 14, x, H - M, 0.13, 1.5))
}

// yard numbers
const nums = [10, 20, 30, 40, 50, 40, 30, 20, 10]
nums.forEach((n, i) => {
  const x = fieldL + (i + 1) * 10 * yardW
  for (const [y, flip] of [[M + 78, false], [H - M - 30, true]]) {
    parts.push(
      `<text x="${x}" y="${y}" font-family="Impact, Haettenschweiler, sans-serif" font-size="52" fill="#fff" fill-opacity="0.20" text-anchor="middle"${flip ? ` transform="rotate(180 ${x} ${y - 18})"` : ''}>${n}</text>`,
    )
  }
})

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">
<rect width="${W}" height="${H}" fill="#08120b"/>
${parts.join('\n')}
</svg>
`
writeFileSync('public/img/pitch.svg', svg)
console.log(`pitch.svg written (${(svg.length / 1024).toFixed(1)} KB)`)
