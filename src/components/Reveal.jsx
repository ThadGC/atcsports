import { useEffect, useRef, useState } from 'react'

// Heavy, cinematic entry. IntersectionObserver only, never a scroll listener.
// Two safety nets so content can never be permanently invisible:
//   1. If the element is already on screen at mount, show it immediately.
//   2. A failsafe timer reveals it regardless if the observer never fires.
export default function Reveal({
  children,
  delay = 0,
  y = 44,
  as: Tag = 'div',
  className = '',
  once = true,
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    // Already in view on first paint, so don't wait for a scroll.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true)
      if (once) return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          if (once) io.unobserve(el)
        } else if (!once) {
          setShown(false)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' },
    )
    io.observe(el)

    // Failsafe: never leave content stuck at opacity 0.
    const failsafe = window.setTimeout(() => setShown(true), 2500)

    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [once])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        transform: shown ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
        opacity: shown ? 1 : 0,
        filter: shown ? 'blur(0px)' : 'blur(10px)',
        transition: `transform 900ms cubic-bezier(0.32,0.72,0,1) ${delay}ms, opacity 900ms cubic-bezier(0.32,0.72,0,1) ${delay}ms, filter 900ms cubic-bezier(0.32,0.72,0,1) ${delay}ms`,
        willChange: shown ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </Tag>
  )
}
