import { org, sevens } from '../data/site.js'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Bezel from '../components/Bezel.jsx'
import PageHero from '../components/PageHero.jsx'
import { Section, SectionHead } from '../components/Section.jsx'

export default function Sevens() {
  return (
    <>
      <Seo
        title="7-on-7 Football League in Roseville, CA"
        description="ATC Sports 7-on-7 is a competitive off-season passing league for local football programs, coaches and athletes. Five-week season, two games per game day, 21-minute running clock. No linemen, no tackling."
        path="/7v7"
        image="/img/qb-drop.jpg"
      />

      <PageHero
        eyebrow="Off-season development"
        title="7-on-7"
        accent="Football"
        lead="Pure passing football. No linemen, no tackling. Just quarterback play, route running, coverage recognition and football IQ against real competition."
        image="/img/qb-drop.jpg"
        alt="A young quarterback setting his feet to throw while his coach watches from behind"
        ctas={
          <>
            <Button href={org.registerUrl}>Register a team</Button>
            <Button href={org.phoneHref} variant="ghost" icon="phone">{org.phone}</Button>
          </>
        }
        stats={[
          ['5', 'Week season'],
          ['2', 'Games a day'],
          ['21', 'Min clock'],
          ['40', 'Yard field'],
        ]}
      />

      <Section>
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="The format" title="Built for the passing game" />
          </div>
          <div className="space-y-5 text-[1rem] leading-relaxed text-white/62 lg:col-span-7">
            <Reveal><p>{sevens.intro}</p></Reveal>
            <Reveal delay={90}>
              <p>
                Unlike traditional tackle football, 7-on-7 does not use offensive or defensive
                linemen, so athletes and coaches can focus specifically on passing concepts,
                coverage recognition, spacing and execution. Because there is no tackling or
                blocking, the game emphasizes skill development, decision-making and repetition
                in live game situations.
              </p>
            </Reveal>
            <Reveal delay={170}><p>{sevens.who}</p></Reveal>
          </div>
        </div>
      </Section>

      <Section className="section-ruled">
        <div className="shell">
          <SectionHead eyebrow="Rules" title="How the game is played" lead={sevens.field} />

          <div className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Bezel className="h-full">
                <div className="relative p-7 sm:p-9">
                  <h3 className="relative text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                    Key rules
                  </h3>
                  <ul className="relative mt-6 space-y-3.5">
                    {sevens.rules.map((r) => (
                      <li key={r} className="flex items-start gap-3">
                        <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                        <span className="text-[0.95rem] leading-relaxed text-white/68">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Bezel>
            </Reveal>

            <Reveal delay={110} className="lg:col-span-5">
              <div className="grid h-full gap-4 sm:gap-5">
                <Bezel>
                  <div className="p-7 sm:p-8">
                    <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                      Scoring
                    </h3>
                    <ul className="mt-5 divide-y divide-white/8">
                      {sevens.scoring.map(([what, pts]) => (
                        <li key={what} className="flex items-baseline justify-between gap-4 py-3">
                          <span className="text-[0.9rem] text-white/65">{what}</span>
                          <span className="font-display text-lg tracking-wide text-metal">{pts}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Bezel>

                <Bezel>
                  <div className="p-7 sm:p-8">
                    <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                      Season structure
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {sevens.structure.map((s) => (
                        <li key={s} className="flex items-start gap-2.5 text-[0.9rem] text-white/68">
                          <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2} />
                          {s}
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

      <Section className="section-ruled">
        <div className="shell text-center">
          <Reveal>
            <span className="eyebrow">Coaches & programs</span>
            <h2 className="mx-auto mt-6 max-w-3xl font-display t-h2 display-skew">
              <span className="text-white">Sharpen your team</span>{' '}
              <span className="text-metal">before the fall</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[1rem] leading-relaxed text-white/60">
              Bring your program in for five weeks of live reps, real coverage looks and the kind
              of chemistry you cannot build in a practice script.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 xs:flex-row">
              <Button href={org.registerUrl}>Register a team</Button>
              <Button to="/contact" variant="ghost" icon="mail">Talk to the league</Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
