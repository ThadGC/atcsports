// Builds the fixed site backdrop. This is atmosphere, not a photo anyone is meant to
// study, so it is widened, softened and darkened until only the field and stands read.
// Drop a different photo in as the source and re-run to swap it.
import sharp from 'sharp'

const SRC = process.argv[2] || 'public/img/catch.jpg'
await sharp(SRC)
  .resize({ width: 2000, height: 1125, fit: 'cover', position: 'centre' })
  .blur(2.5)
  .modulate({ brightness: 0.62, saturation: 0.85 })
  .jpeg({ quality: 58 })
  .toFile('public/img/stadium.jpg')

const m = await sharp('public/img/stadium.jpg').metadata()
console.log(`public/img/stadium.jpg  ${m.width}x${m.height}  ${(m.size / 1024).toFixed(0)} KB`)
