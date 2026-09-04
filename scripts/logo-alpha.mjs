import sharp from 'sharp'

// Source logos are gold/white artwork on solid black. Bake luminance into alpha so the
// mark composites cleanly on any background — no mix-blend-mode tricks needed.
// Low luminance is clamped to fully transparent to kill JPEG noise in the black field.
const FLOOR = 34   // at or below -> fully transparent
const CEIL = 78    // at or above -> fully opaque

async function keyOut(src, out, width) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .resize({ width, withoutEnlargement: true })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const px = Buffer.from(data)
  for (let i = 0; i < px.length; i += info.channels) {
    const lum = Math.max(px[i], px[i + 1], px[i + 2])
    px[i + 3] =
      lum <= FLOOR ? 0 : lum >= CEIL ? 255 : Math.round(((lum - FLOOR) / (CEIL - FLOOR)) * 255)
  }

  await sharp(px, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png({ compressionLevel: 9, palette: false })
    .toFile(out)
  console.log(`${out}  ${info.width}x${info.height}`)
}

const SP = process.argv[2]
await keyOut(`${SP}/site_6.png`, 'public/img/logo-wide.png', 1200)
await keyOut(`${SP}/site_1.png`, 'public/img/logo-mark.png', 400)
