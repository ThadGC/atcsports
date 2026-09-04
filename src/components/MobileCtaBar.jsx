import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { org } from '../data/site.js'
import Icon from './Icon.jsx'

// Sticky mobile action bar. It stays out of the way until the reader has scrolled
// past the hero's own buttons, so it never competes with them.
//
// The hero marks its CTA block with data-hero-cta; pages without one (inner pages,
// the account area) fall back to a plain scroll threshold.
export default function MobileCtaBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const anchor = document.querySelector('[data-hero-cta]')

    if (anchor && typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        ([entry]) => {
          // Visible once the hero buttons have scrolled up and out of view.
          setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0)
        },
        { threshold: 0 },
      )
      io.observe(anchor)
      return () => io.disconnect()
    }

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setShow(window.scrollY > 320)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      className={[
        'fixed inset-x-0 bottom-0 z-[58] lg:hidden',
        'transition-all duration-500 ease-swift',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0',
      ].join(' ')}
      // Hidden from assistive tech until it is actually on screen.
      aria-hidden={!show}
      {...(show ? {} : { inert: '' })}
    >
      <div className="glass border-x-0 border-b-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto flex max-w-md items-center gap-2.5">
          <Link
            to="/register"
            className="btn btn-gold min-h-[52px] flex-1 justify-center !px-4 !pl-5"
          >
            <span className="text-[0.9rem]">Register</span>
            <span className="btn-pip">
              <Icon name="arrow" className="h-[0.95rem] w-[0.95rem]" strokeWidth={1.7} />
            </span>
          </Link>

          <a
            href={org.phoneHref}
            className="btn btn-ghost min-h-[52px] flex-1 justify-center !px-4 !pl-5"
          >
            <span className="text-[0.9rem]">Call us</span>
            <span className="btn-pip">
              <Icon name="phone" className="h-[0.95rem] w-[0.95rem]" strokeWidth={1.7} />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
