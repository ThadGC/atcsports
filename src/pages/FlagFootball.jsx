import { divisions, flagFootball, org, venues } from '../data/site.js'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Bezel from '../components/Bezel.jsx'
import PageHero from '../components/PageHero.jsx'
import { Section, SectionHead } from '../components/Section.jsx'

export default function FlagFootball() {
  return (
    <>
      <Seo
        title="Youth Flag Football League, Winter 2026"
        description="ATC Sports flag football runs nine Saturdays from November 14, 2026 to January 9, 2027 at Whitney High School and Mahany Park. Pre-K through 8th grade, co-ed and girls divisions, 10-player rosters, from $220."
        path="/flag-football"
        image="/img/flag-pull.jpg"
      />

      <PageHero
        eyebrow={`${flagFootball.season} · Roseville, CA`}
        title="Flag"
        accent="Football"
        lead="One morning a week, your athlete practices for an hour and then plays a real game on a real field. No weeknight scramble, no half a season on the bench."
        image="/img/flag-pull.jpg"
        alt="An ATC Sports ball carrier cutting into the end zone as a defender reaches for the flag"
        ctas={
          <>
            <Button to="/register">Register your athlete</Button>
            <Button href={org.phoneHref} variant="ghost" icon="phone">{org.phone}</Button>
          </>
        }
        stats={[
          ['9', 'Saturdays'],
          ['10', 'Players max'],
          ['9', 'Divisions'],
          ['$220', 'From'],
        ]}
      />

      {/* Welcome */}
      <Section>
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHead
              eyebrow="The league"
              title="Competition without the chaos"
            />
          </div>
          <div className="space-y-5 text-[1rem] leading-relaxed text-white/62 lg:col-span-7">
            <Reveal>
              <p>
                Our organized game day means families can enjoy the excitement of the game
                without the usual stresses. With quality officials and real fields, players
                focus on what matters: competition and growth.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <p>
                Whether your child is just starting out or is already a seasoned athlete, this
                league is designed for them. Every player gets the chance to develop skills and
                build confidence on the field, in an environment built around camaraderie and
                sportsmanship.
              </p>
            </Reveal>
            <Reveal delay={170}>
              <p className="font-display text-xl display-skew text-metal sm:text-2xl">
                Here at ATC Sports, we are Built To Compete.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Season schedule */}
      <Section className="border-t border-white/8">
        <div className="shell">
          <SectionHead
            eyebrow="Season schedule"
            title="Nine weeks, mapped out"
            lead={`${flagFootball.window}. ${flagFootball.scheduleNote}`}
          />

          <div className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Bezel className="h-full">
                <div className="p-6 sm:p-8">
                  <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                    Week by week
                  </h3>
                  <ol className="mt-6 divide-y divide-white/8">
                    {flagFootball.weeks.map(([week, date], i) => {
                      const bye = date.toLowerCase().includes('bye')
                      const title = date.toLowerCase().includes('championship')
                      return (
                        <li
                          key={week}
                          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5"
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={[
                                'grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.68rem] font-bold',
                                title
                                  ? 'bg-gradient-to-br from-gold-200 to-gold-500 text-ink'
                                  : bye
                                    ? 'border border-white/12 text-white/35'
                                    : 'border border-gold/30 text-gold',
                              ].join(' ')}
                            >
                              {i + 1}
                            </span>
                            <span className="font-display text-base tracking-wide text-white">
                              {week}
                            </span>
                          </span>
                          <span
                            className={[
                              'text-[0.86rem]',
                              title ? 'font-semibold text-gold' : bye ? 'text-white/35' : 'text-white/58',
                            ].join(' ')}
                          >
                            {date}
                          </span>
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
                  <div className="hash-marks relative p-6 sm:p-8">
                    <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                      Saturday times
                    </h3>
                    <ul className="mt-6 space-y-3.5">
                      {flagFootball.times.map(([grade, practice, game]) => (
                        <li key={grade}>
                          <p className="font-display text-[0.98rem] tracking-wide text-white">
                            {grade}
                          </p>
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
                      Where you play
                    </h3>
                    <ul className="mt-5 space-y-4">
                      {venues.map((v) => (
                        <li key={v.name}>
                          <a
                            href={v.map}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex min-h-[44px] items-start gap-3 py-0.5"
                          >
                            <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                            <span>
                              <span className="block text-[0.92rem] font-semibold text-white transition-colors group-hover:text-gold">
                                {v.name}
                              </span>
                              <span className="block text-[0.8rem] text-white/45">{v.address}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-t border-white/8 pt-4 text-[0.8rem] leading-relaxed text-white/42">
                      {flagFootball.weather}
                    </p>
                  </div>
                </Bezel>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Divisions + team structure */}
      <Section className="border-t border-white/8">
        <div className="shell grid gap-4 sm:gap-5 lg:grid-cols-2">
          <Reveal>
            <Bezel className="h-full">
              <div className="p-7 sm:p-9">
                <span className="eyebrow">Divisions</span>
                <h2 className="mt-5 font-display t-h3 display-skew text-white">
                  Co-ed and girls, Pre-K to 8th
                </h2>
                <div className="mt-7 grid gap-7 xs:grid-cols-2">
                  {[['Co-Ed', divisions.coed], ['Girls', divisions.girls]].map(([label, list]) => (
                    <div key={label}>
                      <h3 className="text-[0.63rem] font-bold uppercase tracking-[0.2em] text-gold/85">
                        {label}
                      </h3>
                      <ul className="mt-4 space-y-2.5">
                        {list.map((d) => (
                          <li key={d} className="flex items-center gap-2.5 text-[0.9rem] text-white/68">
                            <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Bezel>
          </Reveal>

          <Reveal delay={100}>
            <Bezel className="h-full">
              <div className="p-7 sm:p-9">
                <span className="eyebrow">Team structure</span>
                <h2 className="mt-5 font-display t-h3 display-skew text-white">
                  Small rosters, real reps
                </h2>
                <ul className="mt-7 space-y-5">
                  {[
                    ['users', 'Maximum of 10 players per team', 'Fewer players means more touches, more snaps and more time on the field for your child.'],
                    ['whistle', 'Coached by volunteer adult coaches', 'Parents and community coaches lead every team. Want to coach? Tell us when you register.'],
                    ['shield', 'Friend and coach requests honored', 'Whenever possible, on a first-come, first-served basis. Register early to keep their crew together.'],
                  ].map(([icon, title, body]) => (
                    <li key={title} className="flex gap-4">
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/28 bg-gold/8 text-gold">
                        <Icon name={icon} className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span>
                        <span className="block text-[0.95rem] font-semibold text-white">{title}</span>
                        <span className="mt-1 block text-[0.87rem] leading-relaxed text-white/55">{body}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Bezel>
          </Reveal>
        </div>
      </Section>

      {/* Fees */}
      <Section className="border-t border-white/8">
        <div className="shell">
          <SectionHead
            align="center"
            eyebrow="Season fees"
            title="What it costs"
            lead={flagFootball.feeNote}
          />

          <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3 sm:gap-5">
            {flagFootball.pricing.map((tier, i) => (
              <Reveal key={tier.label} delay={i * 100}>
                <Bezel className={['h-full', tier.best ? 'ring-1 ring-gold/45' : ''].join(' ')}>
                  <div className="relative flex h-full flex-col p-7 text-center sm:p-8">
                    {tier.best && (
                      <span className="absolute inset-x-0 top-0 mx-auto w-max -translate-y-1/2 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 px-3.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-ink">
                        Best value
                      </span>
                    )}
                    <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-white/55">
                      {tier.label}
                    </h3>
                    <p className={['mt-4 font-display text-5xl sm:text-6xl', tier.best ? 'text-metal' : 'text-white'].join(' ')}>
                      {tier.price}
                    </p>
                    <p className="mt-3 text-[0.82rem] text-white/45">{tier.note}</p>
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mx-auto mt-12 max-w-3xl">
              <Bezel>
                <div className="p-7 sm:p-9">
                  <h3 className="flex items-center gap-2.5 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-gold/85">
                    <Icon name="shield" className="h-4 w-4" strokeWidth={1.5} />
                    Uniforms
                  </h3>
                  <p className="mt-4 text-[0.92rem] leading-relaxed text-white/58">
                    {flagFootball.uniformNote}
                  </p>
                </div>
              </Bezel>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Refunds */}
      <Section className="border-t border-white/8">
        <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHead eyebrow="Refund policy" title="Plans change. Here's where you stand." />
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <Bezel>
                <div className="p-6 sm:p-8">
                  <ul className="divide-y divide-white/8">
                    {flagFootball.refunds.map(([when, what]) => (
                      <li key={when} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                        <span className="text-[0.92rem] text-white/68">{when}</span>
                        <span className="font-display text-lg tracking-wide text-metal">{what}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-t border-white/8 pt-4 text-[0.82rem] leading-relaxed text-white/42">
                    {flagFootball.refundNote}
                  </p>
                </div>
              </Bezel>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="border-t border-white/8">
        <div className="shell text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display t-h2 display-skew">
              <span className="text-white">Rosters cap at ten.</span>{' '}
              <span className="text-metal">Get their spot.</span>
            </h2>
            <div className="mt-9 flex flex-col justify-center gap-3 xs:flex-row">
              <Button to="/register">Register your athlete</Button>
              <Button to="/divisions" variant="ghost" icon="users">See all divisions</Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
