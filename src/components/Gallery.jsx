import { gallery } from '../data/site.js'

// Game day collage. Tightly packed, mixed sizes, small gaps, and no stretched rows.
//
// Rows are a fixed height and each tile spans a set number of them, so the varied
// shapes come from the spans rather than from rows stretching to fill leftover space,
// which is what opened the gaps.
//
//   mobile  2 columns, tall and wide tiles alternating
//   desktop 6 columns x 2 rows, which the seven photos fill exactly and which sits
//           inside one screen
//
// Class strings are written out in full because Tailwind only reads literal text.
const PLACE = [
  'col-span-2 row-span-3 lg:col-span-2 lg:row-span-2',
  'col-span-1 row-span-2 lg:col-span-2 lg:row-span-1',
  'col-span-1 row-span-2 lg:col-span-2 lg:row-span-1',
  'col-span-1 row-span-3 lg:col-span-1 lg:row-span-1',
  'col-span-1 row-span-3 lg:col-span-1 lg:row-span-1',
  'col-span-1 row-span-2 lg:col-span-1 lg:row-span-1',
  'col-span-1 row-span-2 lg:col-span-1 lg:row-span-1',
]

export default function Gallery() {
  return (
    <div className="grid auto-rows-[4.75rem] grid-cols-2 gap-1.5 sm:auto-rows-[6rem] sm:gap-2 lg:h-[clamp(24rem,56vh,32rem)] lg:auto-rows-fr lg:grid-cols-6 lg:grid-rows-2 lg:gap-2">
      {gallery.map((g, i) => (
        <figure
          key={g.src}
          className={['group relative m-0 overflow-hidden rounded-lg', PLACE[i]].join(' ')}
        >
          <img
            src={g.src}
            alt={g.alt}
            loading={i < 3 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-swift group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-15" />
        </figure>
      ))}
    </div>
  )
}
