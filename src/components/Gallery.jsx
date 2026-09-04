import { useCallback, useEffect, useRef, useState } from 'react'
import { gallery } from '../data/site.js'
import Icon from './Icon.jsx'

// Game day collage. Every photo the league has, laid out at mixed sizes, paged
// horizontally so the whole set is reachable without an endless vertical scroll.
//
// Sizes repeat on a 4-photo cycle so each page has one large frame and three smaller
// ones, which keeps the rhythm regular however many photos get added later.
const SPAN = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
]

const PER_PAGE = 4

export default function Gallery() {
  const trackRef = useRef(null)
  const [page, setPage] = useState(0)
  const pages = Math.ceil(gallery.length / PER_PAGE)

  const goTo = useCallback((i) => {
    const track = trackRef.current
    if (!track) return
    const next = Math.max(0, Math.min(pages - 1, i))
    track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' })
    setPage(next)
  }, [pages])

  // Keep the dots in step when the reader swipes instead of using the buttons.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setPage(Math.round(track.scrollLeft / track.clientWidth))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const groups = Array.from({ length: pages }, (_, p) =>
    gallery.slice(p * PER_PAGE, p * PER_PAGE + PER_PAGE),
  )

  return (
    <div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Game day photos"
      >
        {groups.map((group, gi) => (
          <div
            key={gi}
            className="grid w-full shrink-0 snap-start auto-rows-[minmax(0,1fr)] grid-cols-3 gap-3 sm:gap-4"
            style={{ gridTemplateRows: 'repeat(3, minmax(0, 1fr))', minHeight: 'clamp(22rem, 52vw, 34rem)' }}
          >
            {group.map((g, i) => (
              <figure
                key={g.src}
                className={[
                  'group relative m-0 overflow-hidden rounded-2xl border border-white/8',
                  SPAN[i % SPAN.length],
                ].join(' ')}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading={gi === 0 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover transition-transform duration-[1100ms] ease-swift group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-25" />
              </figure>
            ))}
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-7 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Previous photos"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/14 text-white/70 transition-all duration-500 ease-swift hover:border-gold/50 hover:text-gold disabled:pointer-events-none disabled:opacity-30"
          >
            <Icon name="arrow" className="h-4 w-4 -rotate-[135deg]" strokeWidth={1.8} />
          </button>

          <div className="flex items-center gap-2">
            {groups.map((_, i) => (
              // The dot stays small; the button around it is a full 44px target.
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Photos, page ${i + 1} of ${pages}`}
                aria-current={i === page}
                className="group/dot grid h-11 place-items-center px-1"
              >
                <span
                  className={[
                    'block h-1.5 rounded-full transition-all duration-500 ease-swift',
                    i === page ? 'w-7 bg-gold' : 'w-1.5 bg-white/25 group-hover/dot:bg-white/50',
                  ].join(' ')}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page === pages - 1}
            aria-label="More photos"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/14 text-white/70 transition-all duration-500 ease-swift hover:border-gold/50 hover:text-gold disabled:pointer-events-none disabled:opacity-30"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-45" strokeWidth={1.8} />
          </button>
        </div>
      )}
    </div>
  )
}
