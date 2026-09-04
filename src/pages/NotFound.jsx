import { navFlat, org } from '../data/site.js'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="That page has moved or never existed. Head back to ATC Sports for flag football, 7-on-7 and skills camps in Roseville, California."
        path="/404"
      />

      <section className="relative grid min-h-[100dvh] place-items-center overflow-hidden py-32">
        <div className="absolute inset-0">
          <img src="/img/flag-pull.jpg" alt="" aria-hidden="true" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/92" />
          <div className="stadium-glow absolute inset-0" />
        </div>

        <div className="shell relative text-center">
          <Reveal>
            <p className="font-display text-[clamp(6rem,26vw,17rem)] leading-[0.8] display-skew text-metal">
              404
            </p>
            <h1 className="mt-6 font-display t-h2 display-skew text-white">
              Incomplete pass
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-[1rem] leading-relaxed text-white/58">
              That page has moved or never existed. Let's get you back in the game.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 xs:flex-row">
              <Button to="/">Back to home</Button>
              <Button href={org.phoneHref} variant="ghost" icon="phone">{org.phone}</Button>
            </div>

            <div className="mx-auto mt-14 max-w-2xl border-t border-white/10 pt-8">
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                Try one of these
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
                {navFlat.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-2 text-[0.82rem] font-semibold text-white/68 transition-all duration-700 ease-swift hover:border-gold/45 hover:bg-gold/7 hover:text-gold"
                    >
                      {item.label}
                      <Icon
                        name="arrow"
                        className="h-3 w-3 opacity-0 transition-all duration-500 group-hover:opacity-100"
                        strokeWidth={1.9}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
