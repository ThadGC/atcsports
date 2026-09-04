import { camp, org } from '../data/site.js'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Bezel from '../components/Bezel.jsx'
import PageHero from '../components/PageHero.jsx'
import { Section, SectionHead } from '../components/Section.jsx'

const PILLAR_ICONS = ['bolt', 'target', 'ball', 'trophy']

export default function Camps() {
  return (
    <>
      <Seo
        title="Elite Youth Football Skills Camps"
        description="A high-intensity youth football skills camp in Roseville, CA covering speed, agility, football IQ and position-specific technique. June 20 and June 27, 9:00 to 11:00 AM at Mahany Football Fields."
        path="/camps"
        image="/img/camp.jpg"
      />

      <PageHero
        eyebrow="Camps & clinics"
        title="Elite Youth"
        accent="Skills Camp"
        lead={camp.blurb}
        image="/img/action-3.jpg"
        alt="ATC Sports athletes competing during a skills session"
        ctas={
          <>
            <Button href={org.registerUrl}>Reserve a spot</Button>
            <Button href={org.phoneHref} variant="ghost" icon="phone">{org.phone}</Button>
          </>
        }
        stats={[
          ['2', 'Sessions'],
          ['2 hrs', 'Each'],
          ['3', 'Coaching crews'],
          ['All', 'Levels'],
        ]}
      />

      <Section>
        <div className="shell grid gap-4 sm:gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Bezel className="h-full">
              {/* contain, not cover: the flyer carries the dates and location, so it
                  must never be cropped */}
              <div className="relative flex h-full min-h-[300px] items-center justify-center bg-ink-800 p-2">
                <img
                  src="/img/camp.jpg"
                  alt="Elite Youth Football Skills Camp flyer showing dates, time and location"
                  loading="lazy"
                  className="max-h-[520px] w-full rounded-2xl object-contain"
                />
              </div>
            </Bezel>
          </Reveal>

          <div className="lg:col-span-7">
            <SectionHead eyebrow="Camp details" title={camp.name} />

            <Reveal delay={120}>
              <dl className="mt-9 grid gap-4 xs:grid-cols-3">
                {[
                  ['calendar', 'Dates', camp.dates],
                  ['clock', 'Time', camp.time],
                  ['pin', 'Location', camp.location],
                ].map(([icon, label, value]) => (
                  <div key={label}>
                    <Bezel className="h-full">
                      <div className="p-5 sm:p-6">
                        <Icon name={icon} className="h-5 w-5 text-gold" strokeWidth={1.4} />
                        <dt className="mt-4 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/42">
                          {label}
                        </dt>
                        <dd className="mt-1.5 text-[0.95rem] font-semibold leading-snug text-white">
                          {value}
                        </dd>
                      </div>
                    </Bezel>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-5">
                <Bezel>
                  <div className="p-6 sm:p-8">
                    <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                      Expert instruction from
                    </h3>
                    <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2.5">
                      {camp.partners.map((p) => (
                        <li
                          key={p}
                          className="rounded-full border border-white/12 bg-white/4 px-4 py-2 font-display text-[0.8rem] tracking-wide text-white/85"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Bezel>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="border-t border-white/8">
        <div className="shell">
          <SectionHead
            align="center"
            eyebrow="What they work on"
            title="Four pillars, two hours"
            lead="Every session is built around competitive drills and expert coaching, not standing in line."
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {camp.pillars.map((pillar, i) => (
              <Reveal key={pillar} delay={i * 90}>
                <Bezel className="h-full">
                  <div className="relative h-full p-7 text-center sm:p-8">
                    <div className="field-lines absolute inset-0 opacity-25" />
                    <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-full border border-gold/28 bg-gold/8 text-gold">
                      <Icon name={PILLAR_ICONS[i]} className="h-5 w-5" strokeWidth={1.4} />
                    </span>
                    <h3 className="relative mt-5 font-display text-[1.05rem] display-skew tracking-wide text-white">
                      {pillar}
                    </h3>
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-14 text-center">
              <p className="font-display t-h3 display-skew text-metal">
                Take your game to the next level
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 xs:flex-row">
                <Button href={org.registerUrl}>Reserve a spot</Button>
                <Button to="/contact" variant="ghost" icon="mail">Ask about camps</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
