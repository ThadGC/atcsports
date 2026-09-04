import { divisions, flagFootball, org } from '../data/site.js'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Bezel from '../components/Bezel.jsx'
import PageHero from '../components/PageHero.jsx'
import { Section, SectionHead } from '../components/Section.jsx'

// Practice/game times keyed by the grade band they belong to.
const TIME_BY_GRADE = Object.fromEntries(
  flagFootball.times.map(([grade, practice, game]) => [grade, { practice, game }]),
)

function timeFor(label) {
  if (label.startsWith('Pre-K')) return TIME_BY_GRADE['Kindergarten']
  return TIME_BY_GRADE[label] || null
}

function DivisionCard({ label, kind, i }) {
  const t = timeFor(label)
  return (
    <Reveal delay={i * 70}>
      <Bezel className="h-full">
        <div className="relative flex h-full flex-col p-6 sm:p-7">
          <div className="field-lines absolute inset-0 opacity-20" />
          <span
            className={[
              'relative w-max rounded-full px-2.5 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.16em]',
              kind === 'Girls'
                ? 'bg-gold/14 text-gold-200 ring-1 ring-gold/30'
                : 'bg-white/6 text-white/60 ring-1 ring-white/12',
            ].join(' ')}
          >
            {kind}
          </span>
          <h3 className="relative mt-4 font-display text-[1.3rem] display-skew leading-tight text-white sm:text-[1.45rem]">
            {label}
          </h3>
          {t && (
            <dl className="relative mt-5 space-y-2 border-t border-white/8 pt-4 text-[0.8rem]">
              <div className="flex justify-between gap-3">
                <dt className="text-white/42">Practice</dt>
                <dd className="font-medium text-white/80">{t.practice}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-white/42">Game</dt>
                <dd className="font-semibold text-gold">{t.game}</dd>
              </div>
            </dl>
          )}
        </div>
      </Bezel>
    </Reveal>
  )
}

export default function Divisions() {
  return (
    <>
      <Seo
        title="Divisions: Pre-K to 8th Grade, Co-Ed & Girls"
        description="ATC Sports flag football divisions run from Pre-K/Kindergarten through 8th grade, with dedicated co-ed and girls brackets. See practice and game times for every grade band."
        path="/divisions"
        image="/img/action-5.jpg"
      />

      <PageHero
        eyebrow="Winter 2026"
        title="Find their"
        accent="Division"
        lead="Nine divisions across co-ed and girls brackets, grouped by grade so your athlete competes with kids their own age and size."
        image="/img/action-5.jpg"
        alt="ATC Sports players lining up before the snap"
        ctas={
          <>
            <Button to="/register">Register your athlete</Button>
            <Button to="/flag-football" variant="ghost" icon="calendar">Season details</Button>
          </>
        }
      />

      <Section>
        <div className="shell">
          <SectionHead
            eyebrow="Co-ed divisions"
            title="Co-Ed"
            lead="Open to all athletes. Practice runs the hour before each game on the same field."
          />
          <div className="mt-12 grid gap-4 xs:grid-cols-2 sm:gap-5 lg:grid-cols-5">
            {divisions.coed.map((d, i) => (
              <DivisionCard key={d} label={d} kind="Co-Ed" i={i} />
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-t border-white/8">
        <div className="shell">
          <SectionHead
            eyebrow="Girls divisions"
            title="Girls"
            lead="A dedicated bracket from 1st grade up, so girls compete with and against each other all season."
          />
          <div className="mt-12 grid gap-4 xs:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {divisions.girls.map((d, i) => (
              <DivisionCard key={d} label={d} kind="Girls" i={i} />
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-t border-white/8">
        <div className="shell">
          <Reveal>
            <Bezel>
              <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:p-12">
                <div>
                  <span className="eyebrow">Not sure where they fit?</span>
                  <h2 className="mt-5 font-display t-h3 display-skew text-white">
                    Divisions go by grade, not birthday
                  </h2>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-white/58">
                    Register your athlete under the grade they are currently in. If a division
                    fills or numbers are tight, we will call you before moving anyone, and
                    friend and coach requests are honored whenever possible.
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <Button to="/register" full>Register your athlete</Button>
                  <Button href={org.phoneHref} variant="ghost" icon="phone" full>
                    Call {org.phone}
                  </Button>
                  <a
                    href={org.live.standings}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 text-[0.82rem] font-semibold text-white/50 transition-colors hover:text-gold"
                  >
                    View live standings
                    <Icon name="arrow" className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </a>
                </div>
              </div>
            </Bezel>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
