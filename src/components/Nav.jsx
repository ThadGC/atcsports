import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, navFlat, org } from '../data/site.js'
import { useAuth } from '../auth/AuthContext.jsx'
import Icon from './Icon.jsx'
import Button from './Button.jsx'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [lifted, setLifted] = useState(false)
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page behind the overlay without a layout jump.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-[60] pointer-events-none">
        <div className="shell">
          <div
            className={[
              'pointer-events-auto relative mx-auto grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-full glass transition-all duration-700 ease-swift',
              lifted
                ? 'mt-3 py-2 pl-1.5 pr-2 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.95)] sm:pl-3'
                : 'mt-4 py-2.5 pl-1.5 pr-2.5 sm:mt-6 sm:pl-3.5',
            ].join(' ')}
          >
            {/* Clickable logo → home */}
            <Link
              to="/"
              className="-ml-1 flex min-h-[44px] shrink-0 items-center rounded-full pt-1 transition-opacity duration-500 hover:opacity-80 sm:ml-0 sm:pt-0"
              aria-label={`${org.name} home`}
            >
              <img
                src="/img/logo-wide.png"
                alt=""
                width="150"
                height="24"
                className="h-8 w-auto shrink-0 sm:h-9 lg:h-9 xl:h-10"
              />
              <span className="sr-only">{org.name}</span>
            </Link>


            {/* Desktop links, pinned to the true centre of the bar so the logo and
                the CTA cluster can change width without shifting them. */}
            <nav className="hidden min-w-0 justify-center lg:flex lg:items-center" aria-label="Primary">
              {nav.map((item) =>
                item.children ? (
                  <div key={item.label} className="group/menu relative">
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        [
                          'relative flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.74rem] font-bold uppercase tracking-[0.08em] transition-all duration-500 ease-swift xl:px-3.5 xl:text-[0.78rem] xl:tracking-[0.1em]',
                          isActive || item.children.some((c) => c.href === pathname)
                            ? 'text-gold'
                            : 'text-white/62 hover:text-white',
                        ].join(' ')
                      }
                    >
                      {item.label}
                      <Icon
                        name="arrow"
                        className="h-2.5 w-2.5 rotate-45 opacity-60 transition-transform duration-500 group-hover/menu:translate-y-px"
                        strokeWidth={2.2}
                      />
                    </NavLink>

                    {/* Opens on hover and on keyboard focus, so it is reachable by tab. */}
                    <div className="pointer-events-none absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 opacity-0 transition-all duration-300 ease-swift group-hover/menu:pointer-events-auto group-hover/menu:opacity-100 group-focus-within/menu:pointer-events-auto group-focus-within/menu:opacity-100">
                      <div className="glass-panel overflow-hidden rounded-3xl p-1.5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.98)]">
                        {item.children.map((c) => (
                          <NavLink
                            key={c.href}
                            to={c.href}
                            className={({ isActive }) =>
                              [
                                'block rounded-2xl px-3.5 py-2.5 transition-colors duration-300',
                                isActive ? 'bg-gold/12 text-gold' : 'text-white/80 hover:bg-white/6 hover:text-gold',
                              ].join(' ')
                            }
                          >
                            <span className="block text-[0.82rem] font-bold">{c.label}</span>
                            <span className="mt-0.5 block text-[0.72rem] text-white/42">{c.note}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      [
                        'relative whitespace-nowrap rounded-full px-2.5 py-2 text-[0.74rem] font-bold uppercase tracking-[0.08em] transition-all duration-500 ease-swift xl:px-3.5 xl:text-[0.78rem] xl:tracking-[0.1em]',
                        isActive ? 'text-gold' : 'text-white/62 hover:text-white',
                      ].join(' ')
                    }
                  >
                    {item.label}
                  </NavLink>
                ),
              )}
            </nav>

            <div className="col-start-3 flex items-center justify-end gap-1.5 sm:gap-2">
              {/* Phone and account collapse to gold icon buttons from tablet up, where
                  the bar is tight, and expand back to labelled pills on wide desktop. */}
              <a
                href={org.phoneHref}
                aria-label={`Call ${org.name} on ${org.phone}`}
                className="hidden h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/8 px-3 text-[0.78rem] font-bold text-gold transition-all duration-500 ease-swift hover:border-gold/60 hover:bg-gold/14 md:inline-flex 2xl:px-4"
              >
                <Icon name="phone" className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.6} />
                <span className="hidden 2xl:inline">{org.phone}</span>
              </a>

              {user ? (
                <Link
                  to="/account"
                  aria-label="Your account"
                  className="hidden h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 text-[0.78rem] font-bold text-gold transition-all duration-500 ease-swift hover:bg-gold/16 sm:inline-flex 2xl:px-4"
                >
                  <Icon name="user" className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.6} />
                  <span className="hidden 2xl:inline">{user.firstName || 'Account'}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  aria-label="Log in"
                  className="hidden h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-white/12 px-3 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-gold transition-all duration-500 ease-swift hover:border-gold/50 hover:bg-gold/8 sm:inline-flex 2xl:px-4"
                >
                  <Icon name="lock" className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.6} />
                  <span className="hidden 2xl:inline">Log in</span>
                </Link>
              )}

              <Button
                to="/register"
                className="!hidden !px-3.5 !py-2 !pl-4 sm:!inline-flex"
                icon="arrow"
              >
                Register
              </Button>

              {/* Morphing hamburger */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/12 transition-colors duration-500 hover:border-gold/45 lg:hidden"
              >
                <span className="relative block h-3 w-[18px]">
                  <span
                    className="absolute left-0 block h-[1.5px] w-full rounded-full bg-white transition-all duration-500 ease-swift"
                    style={{
                      top: open ? '50%' : '0%',
                      transform: open ? 'translateY(-50%) rotate(45deg)' : 'none',
                    }}
                  />
                  <span
                    className="absolute left-0 block h-[1.5px] w-full rounded-full bg-white transition-all duration-500 ease-swift"
                    style={{
                      bottom: open ? '50%' : '0%',
                      transform: open ? 'translateY(50%) rotate(-45deg)' : 'none',
                    }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen overlay */}
      <div
        className={[
          'fixed inset-0 z-[55] lg:hidden transition-all duration-700 ease-swift',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        aria-hidden={!open}
        // Keep the closed menu out of the tab order and the a11y tree entirely.
        // (string value because React 18 does not yet map the boolean `inert` prop)
        {...(open ? {} : { inert: '' })}
      >
        <div
          className="absolute inset-0 bg-ink/92 backdrop-blur-3xl"
          onClick={() => setOpen(false)}
        />
        <div className="stadium-glow absolute inset-0 opacity-60" />

        <div className="relative flex h-[100dvh] flex-col overflow-y-auto px-6 pb-10 pt-28">
          <nav className="flex flex-col" aria-label="Mobile">
            {navFlat.map((item, i) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  [
                    'group border-b border-white/8 py-4 font-display t-h3 display-skew transition-colors duration-500',
                    isActive ? 'text-metal' : 'text-white/85 hover:text-gold',
                  ].join(' ')
                }
                style={{
                  transform: open ? 'translateY(0)' : 'translateY(2.5rem)',
                  opacity: open ? 1 : 0,
                  transition: `transform 700ms cubic-bezier(0.32,0.72,0,1) ${90 + i * 55}ms, opacity 700ms cubic-bezier(0.32,0.72,0,1) ${90 + i * 55}ms, color 400ms ease`,
                }}
              >
                <span className="flex items-center justify-between gap-4">
                  {item.label}
                  <Icon
                    name="arrow"
                    className="h-5 w-5 shrink-0 text-gold/50 transition-transform duration-500 ease-swift group-hover:translate-x-1"
                    strokeWidth={1.6}
                  />
                </span>
              </NavLink>
            ))}
          </nav>

          <div
            className="mt-8 grid gap-3"
            style={{
              transform: open ? 'translateY(0)' : 'translateY(2rem)',
              opacity: open ? 1 : 0,
              transition: `transform 700ms cubic-bezier(0.32,0.72,0,1) ${90 + navFlat.length * 55}ms, opacity 700ms cubic-bezier(0.32,0.72,0,1) ${90 + navFlat.length * 55}ms`,
            }}
          >
            <Button to="/register" full>Register your athlete</Button>
            {user ? (
              <>
                <Button to="/account" variant="ghost" icon="user" full>My account</Button>
                <Button variant="ghost" icon="logout" full onClick={logout}>Log out</Button>
              </>
            ) : (
              <Button to="/login" variant="ghost" icon="lock" full>Log in</Button>
            )}
            <a
              href={org.phoneHref}
              className="mt-2 flex items-center justify-center gap-2.5 py-2 text-base font-bold text-white/80 transition-colors hover:text-gold"
            >
              <Icon name="phone" className="h-4 w-4" strokeWidth={1.6} />
              {org.phone}
            </a>
            <div className="flex items-center justify-center gap-3 pt-1">
              {org.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/12 text-white/70 transition-all duration-500 hover:border-gold/50 hover:text-gold"
                >
                  <Icon name={s.name.toLowerCase()} className="h-4.5 w-4.5" strokeWidth={1.45} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
