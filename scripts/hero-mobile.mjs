// Builds the mobile hero crop.
//
// Phone heroes are tall and the photo is wide, so object-cover fits by height and
// crops only horizontally: object-position Y does nothing, and the athlete's head
// lands wherever it sits in the source. In this photo that is the top fifth, well
// above the headline. Cropping the source so his head sits ~40% down the frame is
// the only way to place him beside the words.
import sharp from 'sharp'

const SRC = process.argv[2]
const { width, height } = await sharp(SRC).metadata()

// Head measured on the source, as a fraction of each axis.
const HEAD_Y = 0.195
const TARGET_Y = 0.30 // where it should sit in the finished crop

const cropH = Math.round((HEAD_Y * height) / TARGET_Y)
await sharp(SRC)
  .extract({ left: 0, top: 0, width, height: Math.min(cropH, height) })
  .resize({ width: 1200, withoutEnlargement: true })
  .jpeg({ quality: 68 })
  .toFile('public/img/hero-mobile.jpg')

const m = await sharp('public/img/hero-mobile.jpg').metadata()
console.log(`hero-mobile.jpg  ${m.width}x${m.height} (head now ~${Math.round(TARGET_Y * 100)}% down)`)
