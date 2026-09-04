// The source flyer is a square graphic sitting on a white 4:3 canvas. Detect the
// artwork's real bounds and crop the white bars off so it sits clean on the dark site.
import sharp from 'sharp'

const SRC = process.argv[2]
const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

const colIsWhite = (x) => {
  let light = 0
  for (let y = 0; y < height; y += 4) {
    const i = (y * width + x) * channels
    if (data[i] > 232 && data[i + 1] > 232 && data[i + 2] > 232) light++
  }
  return light / Math.ceil(height / 4) > 0.9
}

let left = 0
while (left < width && colIsWhite(left)) left++
let right = width - 1
while (right > left && colIsWhite(right)) right--

const w = right - left + 1
console.log(`source ${width}x${height} -> content x:${left}..${right} (${w}px wide), trimmed ${width - w}px of white`)

await sharp(SRC)
  .extract({ left, top: 0, width: w, height })
  .resize({ width: 1200, withoutEnlargement: true })
  .jpeg({ quality: 62 })
  .toFile('public/img/camp.jpg')
console.log('public/img/camp.jpg rewritten')
