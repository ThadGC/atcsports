import { useEffect } from 'react'

// Feeds the cursor position to whichever card is under it, as --mx/--my.
//
// One delegated listener for the whole page rather than one per card, throttled to a
// frame, and never attached on touch devices where there is no hover to track.
export default function CardGlow() {
  useEffect(() => {
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    let queued = null

    const apply = () => {
      frame = 0
      const e = queued
      if (!e) return
      const card = e.target instanceof Element ? e.target.closest('.bezel') : null
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }

    const onMove = (e) => {
      queued = { target: e.target, clientX: e.clientX, clientY: e.clientY }
      if (!frame) frame = requestAnimationFrame(apply)
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
