import { Link } from 'react-router-dom'
import { nav, org, venues } from '../data/site.js'
import Icon from './Icon.jsx'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-ink-800">
      <div className="stadium-glow pointer-events-none absolute inset-0 opacity-40" />

      <div className="shell relative py-16 md:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-11 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" aria-label={`${org.name} home`} className="inline-block">
              <img
                src="/img/logo-wide.png"
                alt={`${org.name} logo`}
                width="260"
                height="41"
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-white/58">
              Competitive, organized youth football in {org.city}. Flag football, 7-on-7 and
              skills camps built around development, culture and a game day worth showing up for.
            </p>
            <div className="mt-6 flex gap-3">
              {org.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${org.name} on ${s.name}`}
                  className="group grid h-11 w-11 place-items-center rounded-full border border-white/12 text-white/65 transition-all duration-700 ease-swift hover:border-gold/55 hover:bg-gold/8 hover:text-gold"
                >
                  <Icon name={s.name.toLowerCase()} className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.4} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
              Programs
            </h2>
            <ul className="mt-3 space-y-0.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="inline-flex min-h-[44px] items-center text-[0.92rem] text-white/60 transition-colors duration-500 hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <h2 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
              League Central
            </h2>
            <ul className="mt-3 space-y-0.5">
              {[
                ['Schedule', org.live.schedule],
                ['Scores', org.live.scores],
                ['Standings', org.live.standings],
                ['Registration portal', org.registerUrl],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-[44px] items-center gap-1.5 text-[0.92rem] text-white/60 transition-colors duration-500 hover:text-gold"
                  >
                    {label}
                    <Icon
                      name="arrow"
                      className="h-3 w-3 opacity-0 transition-all duration-500 ease-swift group-hover:translate-x-0.5 group-hover:opacity-100"
                      strokeWidth={1.9}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 text-center lg:col-span-3 lg:text-left">
            <h2 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
              Get In Touch
            </h2>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={org.phoneHref}
                  className="flex min-h-[44px] items-center justify-center gap-3 text-[0.92rem] text-white/72 transition-colors duration-500 hover:text-gold lg:justify-start"
                >
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
                  {org.phone}
                </a>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="flex min-h-[44px] items-center justify-center gap-3 text-[0.92rem] text-white/72 transition-colors duration-500 hover:text-gold lg:justify-start"
                >
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
                  Message the league
                </Link>
              </li>
              {venues.map((v) => (
                <li key={v.name}>
                  <a
                    href={v.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] items-center justify-center gap-3 text-[0.92rem] text-white/72 transition-colors duration-500 hover:text-gold lg:justify-start"
                  >
                    <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.5} />
                    <span>
                      {v.name}
                      <span className="block text-[0.8rem] text-white/42">{v.address}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/8 pt-7 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-[0.8rem] text-white/40">
            © {year} {org.name}. All rights reserved.
          </p>

          <p className="order-last flex items-center gap-1.5 text-[0.8rem] text-white/40 sm:order-none">
            Designed with
            <Icon
              name="heart"
              className="h-3.5 w-3.5 shrink-0 text-gold"
              strokeWidth={1.6}
              fill
            />
            <span className="font-semibold text-white/60">Apex Growth</span>
          </p>

          <p className="text-[0.8rem] text-white/40">
            {org.city} · Built to compete.
          </p>
        </div>
      </div>
    </footer>
  )
}
