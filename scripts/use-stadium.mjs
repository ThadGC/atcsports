// Installs a supplied photo as the fixed site backdrop.
//
//   npm run stadium -- /path/to/photo.jpg
//   npm run stadium                      (picks the newest image in ~/Downloads or ~/Desktop)
//
// Nothing else changes: the CSS already points at public/img/stadium.jpg.
import sharp from 'sharp'
import { readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const EXT = /\.(jpe?g|png|webp|heic|avif)$/i

function newestImage() {
  const dirs = [join(homedir(), 'Downloads'), join(homedir(), 'Desktop')].filter(existsSync)
  const files = dirs.flatMap((d) =>
    readdirSync(d)
      .filter((f) => EXT.test(f))
      .map((f) => join(d, f))
      .map((p) => ({ p, t: statSync(p).mtimeMs })),
  )
  if (!files.length) return null
  return files.sort((a, b) => b.t - a.t)[0].p
}

const src = process.argv[2] || newestImage()
if (!src) {
  console.error(
    'No image given and none found in ~/Downloads or ~/Desktop.\n' +
      'Save the photo, then run:  npm run stadium -- /path/to/photo.jpg',
  )
  process.exit(1)
}

const meta = await sharp(src).metadata()
if (meta.width < 1200) {
  console.warn(`Heads up: ${meta.width}px wide is small for a full-bleed backdrop.`)
}

await sharp(src)
  .resize({ width: 2400, height: 1350, fit: 'cover', position: 'centre' })
  .jpeg({ quality: 72, mozjpeg: true })
  .toFile('public/img/stadium.jpg')

const out = await sharp('public/img/stadium.jpg').metadata()
console.log(`Installed ${src}`)
console.log(`  -> public/img/stadium.jpg  ${out.width}x${out.height}`)
console.log('Now run: npm run build')
