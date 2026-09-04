import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Lights each gold section rule once, as it scrolls into view. One observer for the
// page rather than one per rule, re-armed whenever the route changes.
export default function SectionRules() {
  const { pathname } = useLocation()

  useEffect(() => {
    const rules = [...document.querySelectorAll('.section-ruled')]
    if (!rules.length) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-lit')
          io.unobserve(e.target)
        }
      },
      // Fire as the rule reaches the lower third, so the sweep reads on the way in.
      { rootMargin: '0px 0px -25% 0px', threshold: 0 },
    )

    rules.forEach((r) => {
      r.classList.remove('is-lit')
      io.observe(r)
    })
    return () => io.disconnect()
  }, [pathname])

  return null
}
