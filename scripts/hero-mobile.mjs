// Builds the mobile hero crop.
//
// Phone heroes are tall and the photo is wide, so object-cover fits by height and
// crops only horizontally: object-position Y does nothing, and the athlete's head
// lands wherever it sits in the source. Cropping the source is the only lever on his
// vertical position, and it doubles as the zoom control: a taller crop means less
// upscaling. At the current target the crop is the whole frame, which is both the
// highest his head can sit and the least magnified the photo can be.
import sharp from 'sharp'

const SRC = process.argv[2]
const { width, height } = await sharp(SRC).metadata()

// Head measured on the source, as a fraction of each axis.
const HEAD_Y = 0.195
const TARGET_Y = 0.195 // where it should sit in the finished crop

const cropH = Math.round((HEAD_Y * height) / TARGET_Y)
await sharp(SRC)
  .extract({ left: 0, top: 0, width, height: Math.min(cropH, height) })
  .resize({ width: 1200, withoutEnlargement: true })
  .jpeg({ quality: 68 })
  .toFile('public/img/hero-mobile.jpg')

const m = await sharp('public/img/hero-mobile.jpg').metadata()
console.log(`hero-mobile.jpg  ${m.width}x${m.height} (head now ~${Math.round(TARGET_Y * 100)}% down)`)
