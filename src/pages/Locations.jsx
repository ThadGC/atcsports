import { flagFootball, org, venues } from '../data/site.js'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Bezel from '../components/Bezel.jsx'
import PageHero from '../components/PageHero.jsx'
import { Section, SectionHead } from '../components/Section.jsx'

export default function Locations() {
  return (
    <>
      <Seo
        title="Fields & Locations: Whitney High School & Mahany Park"
        description="ATC Sports games and practices are played at Whitney High School (701 Wildcat Boulevard, Rocklin, CA) and Mahany Park Football Field in Roseville. Directions, parking and game-day notes."
        path="/locations"
        image="/img/catch.jpg"
      />

      <PageHero
        eyebrow="Where we play"
        title="Real fields."
        accent="Real game day."
        lead="Games and practices run on turf at Whitney High School and Mahany Park: lined, lit and officiated. No pop-up cones in a dirt park."
        image="/img/catch.jpg"
        alt="A young receiver making a catch on the Whitney Wildcats field"
        ctas={<Button to="/register">Register your athlete</Button>}
      />

      <Section>
        <div className="shell">
          <SectionHead eyebrow="Venues" title="Two home fields" />

          <div className="mt-12 grid gap-4 sm:gap-5 lg:grid-cols-2">
            {venues.map((v, i) => (
              <Reveal key={v.name} delay={i * 100}>
                <Bezel className="h-full">
                  <div className="relative flex h-full flex-col p-7 sm:p-9">
                    <span className="relative grid h-11 w-11 place-items-center rounded-full border border-gold/28 bg-gold/8 text-gold">
                      <Icon name="pin" className="h-5 w-5" strokeWidth={1.4} />
                    </span>
                    <h3 className="relative mt-5 font-display t-h3 display-skew text-white">
                      {v.name}
                    </h3>
                    <p className="relative mt-2 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-gold/80">
                      {v.detail}
                    </p>
                    <p className="relative mt-4 text-[0.95rem] text-white/60">{v.address}</p>
                    <div className="relative mt-7">
                      <Button href={v.map} variant="ghost" icon="arrow">Open in Maps</Button>
                    </div>
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="section-ruled">
        <div className="shell grid gap-4 sm:gap-5 lg:grid-cols-3">
          {[
            ['calendar', 'Game day is Saturday', flagFootball.window],
            ['ball', 'Rain or shine', flagFootball.weather],
            ['clock', 'Arrive for practice', 'Each team practices for one hour immediately before their scheduled game. Check your division time before you leave the house.'],
          ].map(([icon, title, body], i) => (
            <Reveal key={title} delay={i * 90}>
              <Bezel className="h-full">
                <div className="p-7 sm:p-8">
                  <Icon name={icon} className="h-5 w-5 text-gold" strokeWidth={1.4} />
                  <h3 className="mt-5 font-display text-[1.1rem] display-skew tracking-wide text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-white/58">{body}</p>
                </div>
              </Bezel>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="section-ruled">
        <div className="shell text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display t-h2 display-skew">
              <span className="text-white">Questions about a field?</span>{' '}
              <span className="text-metal">Just call.</span>
            </h2>
            <div className="mt-9 flex flex-col justify-center gap-3 xs:flex-row">
              <Button href={org.phoneHref} icon="phone">{org.phone}</Button>
              <Button to="/contact" variant="ghost" icon="mail">Send a message</Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
