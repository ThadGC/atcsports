import { useState } from 'react'
import { flagFootball, org, standingsColumns, teams, venues } from '../data/site.js'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Bezel from '../components/Bezel.jsx'
import Select from '../components/Select.jsx'
import PageHero from '../components/PageHero.jsx'
import { Section, SectionHead } from '../components/Section.jsx'

const DIVISIONS = ['All divisions', ...teams.map((t) => `${t.division} · ${t.grade}`)]

// Practice and game times keyed by grade band.
const timeFor = (grade) => {
  const key = grade.startsWith('Pre-K') ? 'Kindergarten' : grade
  const row = flagFootball.times.find(([g]) => g === key)
  return row ? { practice: row[1], game: row[2] } : null
}

export default function Schedule() {
  const [division, setDivision] = useState(DIVISIONS[0])
  const showing = division === DIVISIONS[0] ? teams : teams.filter((t) => `${t.division} · ${t.grade}` === division)

  return (
    <>
      <Seo
        title="Schedule, Winter 2026"
        description="ATC Sports flag football runs nine Saturdays from November 14, 2026 to January 9, 2027 at Whitney High School and Mahany Park. Week by week dates and every division's practice and game time."
        path="/schedule"
        image="/img/action-3.jpg"
      />

      <PageHero
        eyebrow={`${flagFootball.season} · ${DIVISIONS.length - 1} divisions`}
        title="The"
        accent="Schedule"
        lead={`${flagFootball.window}. Every division practices for an hour immediately before its own game, on the same field.`}
        image="/img/action-3.jpg"
        alt="ATC Sports athletes competing during a Saturday league game"
        ctas={
          <>
            <Button to="/register">Register your athlete</Button>
            <Button href={org.live.schedule} variant="ghost" icon="arrow">Live fixtures</Button>
          </>
        }
        stats={[
          ['9', 'Saturdays'],
          ['9', 'Divisions'],
          ['71', 'Teams'],
          ['2', 'Fields'],
        ]}
      />

      <Section>
        <div className="shell">
          <SectionHead
            eyebrow="Week by week"
            title="Nine Saturdays"
            lead={flagFootball.scheduleNote}
          />

          <div className="mt-12 grid gap-4 sm:gap-5 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Bezel className="h-full">
                <div className="p-6 sm:p-8">
                  <ol className="divide-y divide-white/8">
                    {flagFootball.weeks.map(([week, date], i) => {
                      const bye = date.toLowerCase().includes('bye')
                      const title = date.toLowerCase().includes('championship')
                      return (
                        <li key={week} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5">
                          <span className="flex items-center gap-3">
                            <span className={[
                              'grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.68rem] font-bold',
                              title ? 'bg-gradient-to-br from-gold-200 to-gold-500 text-ink'
                                : bye ? 'border border-white/12 text-white/35'
                                : 'border border-gold/30 text-gold',
                            ].join(' ')}>{i + 1}</span>
                            <span className="font-display text-base tracking-wide text-white">{week}</span>
                          </span>
                          <span className={[
                            'text-[0.86rem]',
                            title ? 'font-semibold text-gold' : bye ? 'text-white/35' : 'text-white/58',
                          ].join(' ')}>{date}</span>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              </Bezel>
            </Reveal>

            <Reveal delay={110} className="lg:col-span-5">
              <div className="grid h-full gap-4 sm:gap-5">
                <Bezel>
                  <div className="p-6 sm:p-8">
                    <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                      Saturday times
                    </h3>
                    <ul className="mt-5 space-y-3.5">
                      {flagFootball.times.map(([grade, practice, game]) => (
                        <li key={grade}>
                          <p className="font-display text-[0.98rem] tracking-wide text-white">{grade}</p>
                          <p className="mt-0.5 text-[0.8rem] text-white/45">
                            Practice <span className="text-white/75">{practice}</span>
                            <span className="px-2 text-white/20">·</span>
                            Game <span className="text-gold">{game}</span>
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Bezel>

                <Bezel>
                  <div className="p-6 sm:p-8">
                    <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                      Where
                    </h3>
                    <ul className="mt-5 space-y-4">
                      {venues.map((v) => (
                        <li key={v.name}>
                          <a href={v.map} target="_blank" rel="noopener noreferrer" className="group flex min-h-[44px] items-start gap-3 py-0.5">
                            <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                            <span>
                              <span className="block text-[0.92rem] font-semibold text-white transition-colors group-hover:text-gold">{v.name}</span>
                              <span className="block text-[0.8rem] text-white/45">{v.address}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 border-t border-white/8 pt-4 text-[0.8rem] leading-relaxed text-white/42">
                      {flagFootball.weather}
                    </p>
                  </div>
                </Bezel>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="section-ruled">
        <div className="shell">
          <SectionHead
            eyebrow="Teams"
            title="Who is playing"
            lead="The Winter 2026 roster as the league has it entered. Numbered teams take their coach's name once coaching is confirmed."
          />

          <Reveal>
            <div className="mt-9 max-w-md">
              <Select
                id="division-filter"
                label="Filter by division"
                value={division}
                onChange={setDivision}
                options={DIVISIONS}
              />
            </div>
          </Reveal>

          <div className="mt-9 grid gap-4 sm:gap-5 lg:grid-cols-3">
            {showing.map((t, i) => {
              const time = timeFor(t.grade)
              return (
                <Reveal key={`${t.division}-${t.grade}`} delay={(i % 3) * 80}>
                  <Bezel className="h-full">
                    <div className="p-6 sm:p-7">
                      <span className={[
                        'w-max rounded-full px-2.5 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.16em]',
                        t.division === 'Girls'
                          ? 'bg-gold/14 text-gold-200 ring-1 ring-gold/30'
                          : 'bg-white/6 text-white/60 ring-1 ring-white/12',
                      ].join(' ')}>{t.division}</span>
                      <h3 className="mt-3 font-display text-[1.2rem] display-skew text-white">{t.grade}</h3>
                      {time && (
                        <p className="mt-1.5 text-[0.8rem] text-white/45">
                          Practice <span className="text-white/75">{time.practice}</span>
                          <span className="px-1.5 text-white/20">·</span>
                          Game <span className="text-gold">{time.game}</span>
                        </p>
                      )}
                      <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-white/8 pt-4">
                        {t.list.map((name) => (
                          <li key={name} className="rounded-full border border-white/10 px-2.5 py-1 text-[0.78rem] text-white/68">
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Bezel>
                </Reveal>
              )
            })}
          </div>
        </div>
      </Section>

      <Section className="section-ruled">
        <div className="shell">
          <Reveal>
            <Bezel>
              <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:p-12">
                <div>
                  <span className="eyebrow">Results</span>
                  <h2 className="mt-5 font-display t-h3 display-skew text-white">
                    Scores and standings go live on opening day
                  </h2>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-white/58">
                    The season starts Saturday, November 14, 2026. Until the first whistle
                    there are no results to show. Once games are played, standings track{' '}
                    {standingsColumns.map(([abbr], i) => (
                      <span key={abbr}>
                        {i > 0 && ', '}
                        <span className="text-white/80">{abbr}</span>
                      </span>
                    ))}
                    .
                  </p>
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <Button to="/standings" full icon="trophy">See the standings table</Button>
                  <Button href={org.live.scores} variant="ghost" full>Live scores</Button>
                </div>
              </div>
            </Bezel>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
