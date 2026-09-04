import { useState } from 'react'
import { flagFootball, org, standingsColumns, teams } from '../data/site.js'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Bezel from '../components/Bezel.jsx'
import Select from '../components/Select.jsx'
import PageHero from '../components/PageHero.jsx'
import { Section, SectionHead } from '../components/Section.jsx'

const KEYS = teams.map((t) => `${t.division} · ${t.grade}`)

export default function Standings() {
  const [key, setKey] = useState(KEYS[0])
  const group = teams.find((t) => `${t.division} · ${t.grade}` === key) || teams[0]

  return (
    <>
      <Seo
        title="Standings, Winter 2026"
        description="ATC Sports flag football standings for Winter 2026. Nine divisions, 71 teams. Tables fill in each Saturday once the season starts on November 14, 2026."
        path="/standings"
        image="/img/flag-pull.jpg"
      />

      <PageHero
        eyebrow={`${flagFootball.season} · 9 divisions`}
        title="The"
        accent="Standings"
        lead="Every division tracks games played, record, points, and points for and against. Tables fill in each Saturday once the season is under way."
        image="/img/flag-pull.jpg"
        alt="A defender reaching for the flag as a ball carrier cuts into the end zone"
        ctas={
          <>
            <Button href={org.live.standings}>Live standings</Button>
            <Button to="/schedule" variant="ghost" icon="calendar">Season schedule</Button>
          </>
        }
      />

      <Section>
        <div className="shell">
          <SectionHead eyebrow="By division" title="Pick a division" />

          <Reveal>
            <div className="mt-8 max-w-md">
              <Select
                id="standings-division"
                label="Division"
                value={key}
                onChange={setKey}
                options={KEYS}
              />
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="mt-8">
              <Bezel>
                <div className="p-5 sm:p-7">
                  <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-display text-[1.15rem] display-skew text-white">{key}</h3>
                    <span className="text-[0.78rem] text-white/45">{group.list.length} teams</span>
                  </div>

                  <div className="-mx-5 overflow-x-auto px-5 sm:-mx-7 sm:px-7">
                    <table className="w-full min-w-[36rem] border-collapse text-[0.9rem]">
                      <thead>
                        <tr>
                          <th scope="col" className="border-b border-white/14 py-2.5 pr-4 text-left text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white/45">
                            Team
                          </th>
                          {standingsColumns.map(([abbr, full]) => (
                            <th
                              key={abbr}
                              scope="col"
                              title={full}
                              className="border-b border-white/14 px-2 py-2.5 text-right text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white/45"
                            >
                              {abbr}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.list.map((name) => (
                          <tr key={name}>
                            <th scope="row" className="whitespace-nowrap border-b border-white/8 py-3 pr-4 text-left font-semibold text-white">
                              {name}
                            </th>
                            {standingsColumns.map(([abbr]) => (
                              <td key={abbr} className="border-b border-white/8 px-2 py-3 text-right tabular-nums text-white/30">
                                &ndash;
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-5 flex items-start gap-2.5 border-t border-white/8 pt-4">
                    <Icon name="calendar" className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                    <p className="text-[0.85rem] leading-relaxed text-white/50">
                      No games have been played yet. The first Saturday is November 14, 2026, and
                      records appear here as results come in.
                    </p>
                  </div>
                </div>
              </Bezel>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <dl className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
              {standingsColumns.map(([abbr, full]) => (
                <div key={abbr} className="flex items-baseline gap-2">
                  <dt className="font-display text-sm tracking-wide text-gold">{abbr}</dt>
                  <dd className="text-[0.85rem] text-white/50">{full}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-8 text-[0.85rem] text-white/45">
              For corrections, please contact the league office as soon as possible.{' '}
              <a href={org.phoneHref} className="font-semibold text-gold hover:underline">{org.phone}</a>
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
