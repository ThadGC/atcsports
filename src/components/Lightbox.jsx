import { useCallback, useEffect, useRef } from 'react'
import Icon from './Icon.jsx'

// Full-size view of a gallery photo. Closes on the X, on a click outside the image,
// and on Escape. Focus moves to the close button on open and returns to whatever
// opened it on close, so it is usable from the keyboard.
export default function Lightbox({ photo, onClose, onPrev, onNext }) {
  const closeRef = useRef(null)
  const opener = useRef(null)

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    },
    [onClose, onPrev, onNext],
  )

  useEffect(() => {
    if (!photo) return
    opener.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKey)
      opener.current?.focus?.()
    }
  }, [photo, handleKey])

  if (!photo) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
    >
      {/* Backdrop: clicking anywhere off the photo closes it. */}
      <button
        type="button"
        aria-label="Close photo"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/92 backdrop-blur-xl"
      />

      <div className="relative z-10 flex max-h-full w-full max-w-5xl flex-col items-center gap-4">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className="grid h-11 w-11 shrink-0 place-items-center self-end rounded-full border border-gold/45 bg-ink-800/90 text-gold transition-all duration-500 ease-swift hover:border-gold hover:bg-gold hover:text-ink"
        >
          <Icon name="close" className="h-4 w-4" strokeWidth={2} />
        </button>

        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-[0_40px_90px_-25px_rgba(0,0,0,0.95)]"
        />

        <div className="flex shrink-0 items-center gap-3">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous photo"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/16 text-white/75 transition-all duration-500 ease-swift hover:border-gold/55 hover:text-gold"
            >
              <Icon name="arrow" className="h-4 w-4 -rotate-[135deg]" strokeWidth={1.8} />
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              aria-label="Next photo"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/16 text-white/75 transition-all duration-500 ease-swift hover:border-gold/55 hover:text-gold"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-45" strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
