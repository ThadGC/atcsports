import { Link } from 'react-router-dom'
import { camp, flagFootball, gallery, org, parentPromises, programs, venues } from '../data/site.js'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Bezel from '../components/Bezel.jsx'
import Marquee from '../components/Marquee.jsx'
import Gallery from '../components/Gallery.jsx'
import { Section, SectionHead } from '../components/Section.jsx'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: org.name,
  slogan: org.tagline,
  url: 'https://atcfootball.com/',
  logo: 'https://atcfootball.com/img/logo-mark.png',
  telephone: '+1-209-986-0460',
  sport: 'American Football',
  areaServed: 'Roseville, Rocklin and Placer County, California',
  address: { '@type': 'PostalAddress', addressLocality: 'Roseville', addressRegion: 'CA', addressCountry: 'US' },
  sameAs: org.socials.map((s) => s.url),
  location: venues.map((v) => ({
    '@type': 'Place',
    name: v.name,
    address: { '@type': 'PostalAddress', streetAddress: v.address },
  })),
}

const HERO_STATS = [
  ['9', 'Saturdays'],
  ['10', 'Players a team'],
  ['Pre-K to 8', 'Grades'],
  ['2', 'Home fields'],
]

export default function Home() {
  return (
    <>
      <Seo
        title="Youth Flag Football & 7v7 in Roseville, CA"
        description="ATC Sports runs competitive youth flag football, 7-on-7 and skills camps in Roseville, California. One Saturday morning, real fields, real officials, 10-player rosters. Pre-K through 8th grade, co-ed and girls divisions."
        path="/"
        schema={schema}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative min-h-[100dvh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/img/flag-pull.jpg"
            alt="An ATC Sports ball carrier cutting into the end zone as a defender reaches for the flag"
            /* Widened and left-anchored on desktop so the athlete sits on the opposite
               side from the headline; the crop is raised so his head clears the nav. */
            className="absolute inset-y-0 left-0 h-full w-full max-w-none object-cover object-[64%_32%] sm:object-[58%_30%] md:w-[130%] md:object-[40%_26%] lg:w-[126%] lg:object-[42%_28%] xl:w-[120%]"
            fetchpriority="high"
            width="1400"
            height="1302"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/72 to-ink/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent lg:via-ink/45" />
          <div className="stadium-glow absolute inset-0 opacity-70" />
        </div>

        <div className="shell relative flex min-h-[100dvh] flex-col justify-end pb-14 pt-32 sm:pb-20 sm:pt-36 md:justify-start md:pb-24 md:pt-[20vh] lg:justify-center lg:pt-36">
          <div className="max-w-4xl lg:pl-10 xl:pl-16">
            <Reveal y={26}>
              <span className="eyebrow eyebrow--live">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                Winter 2026 · Registration open
              </span>
            </Reveal>

            <Reveal delay={110}>
              <h1 className="mt-6 font-display t-hero display-skew">
                <span className="block text-white">Built To</span>
                <span className="block text-metal">Compete</span>
              </h1>
            </Reveal>

            <Reveal delay={220}>
              <p className="mt-7 max-w-xl text-[1.05rem] leading-relaxed text-white/72 sm:text-[1.2rem]">
                Youth flag football that respects your Saturday. Practice and game run back to
                back on the same field. Real turf, real officials, and rosters small enough
                that your kid actually touches the ball.
              </p>
            </Reveal>

            <Reveal delay={310}>
              <div className="mt-9 flex flex-col gap-3 [&>a]:justify-center xs:flex-row xs:flex-wrap xs:[&>a]:justify-start" data-hero-cta>
                <Button to="/register">Register your athlete</Button>
                <Button to="/flag-football" variant="ghost" icon="calendar">
                  See the Winter season
                </Button>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-6 sm:mt-14 sm:grid-cols-4">
                {HERO_STATS.map(([n, label]) => (
                  <div key={label} className="border-l border-gold/28 pl-4">
                    <dt className="font-display text-2xl text-metal sm:text-3xl">{n}</dt>
                    <dd className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/48">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          'Flag Football',
          'Pre-K to 8th Grade',
          '7-on-7',
          'Co-Ed & Girls Divisions',
          'Skills Camps',
          'Whitney High School',
          'Mahany Park',
          'Built To Compete',
        ]}
      />

      {/* ---------------- WHY PARENTS PICK ATC ---------------- */}
      <Section>
        <div className="shell">
          <SectionHead
            eyebrow="For parents"
            title={<>Four things you<br className="hidden sm:block" /> actually care about</>}
            lead="You are the one driving, paying and rearranging the weekend. Here is exactly what you get for it."
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-16">
            {parentPromises.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <Bezel className="h-full">
                  <div className="relative h-full p-7 sm:p-9">
                    <span className="relative font-display text-5xl text-white sm:text-6xl">
                      0{i + 1}
                    </span>
                    <h3 className="relative mt-3 font-display text-[1.35rem] display-skew text-gold sm:text-[1.6rem]">
                      {p.title}
                    </h3>
                    <p className="relative mt-3.5 text-[0.97rem] leading-relaxed text-white/62">
                      {p.body}
                    </p>
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------- PROGRAMS (asymmetric bento) ---------------- */}
      <Section className="section-ruled">
        <div className="shell">
          <SectionHead
            eyebrow="Programs"
            title="Three ways to play"
            lead="Whether they have never held a football or they are already starting at quarterback, there is a lane for them here."
          />

          <div className="mt-14 grid gap-4 sm:gap-5 lg:mt-16 lg:grid-cols-12">
            {programs.map((p, i) => (
              <Reveal
                key={p.slug}
                delay={i * 100}
                className={
                  i === 0 ? 'lg:col-span-7' : i === 1 ? 'lg:col-span-5' : 'lg:col-span-6 lg:col-start-4'
                }
              >
                <Link to={p.href} className="group block h-full">
                  <Bezel className="h-full transition-transform duration-700 ease-swift group-hover:-translate-y-1">
                    <div className="relative h-full">
                      <div
                        className={[
                          'relative overflow-hidden',
                          i === 0 ? 'aspect-[16/10] lg:aspect-[16/9]' : 'aspect-[16/10]',
                        ].join(' ')}
                      >
                        <img
                          src={p.image}
                          alt={p.alt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1100ms] ease-swift group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/30 to-transparent" />
                      </div>

                      <div className="relative -mt-14 p-7 sm:p-8">
                        <span className="eyebrow">{p.ages}</span>
                        <h3 className="mt-4 font-display t-h3 display-skew text-white transition-colors duration-500 group-hover:text-gold">
                          {p.name}
                        </h3>
                        <p className="mt-3 text-[0.97rem] leading-relaxed text-white/60">
                          {p.blurb}
                        </p>

                        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/8 pt-5">
                          {p.stats.map(([n, l]) => (
                            <div key={l}>
                              <dt className="font-display text-xl text-metal">{n}</dt>
                              <dd className="mt-0.5 text-[0.63rem] font-bold uppercase tracking-[0.16em] text-white/42">
                                {l}
                              </dd>
                            </div>
                          ))}
                        </dl>

                        <span className="mt-6 inline-flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-gold">
                          Explore
                          <Icon
                            name="arrow"
                            className="h-3.5 w-3.5 transition-transform duration-700 ease-swift group-hover:translate-x-1 group-hover:-translate-y-0.5"
                            strokeWidth={1.9}
                          />
                        </span>
                      </div>
                    </div>
                  </Bezel>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------- SEASON SNAPSHOT ---------------- */}
      <Section className="section-ruled">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <SectionHead
                eyebrow={`${flagFootball.season} season`}
                title="Nine Saturdays. One championship."
                lead={flagFootball.window}
              />
              <Reveal delay={200}>
                <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-white/55">
                  {flagFootball.scheduleNote}
                </p>
                <div className="mt-8 flex flex-col gap-3 xs:flex-row">
                  <Button to="/flag-football" icon="calendar">Full season details</Button>
                  <Button to="/register" variant="ghost">Sign up</Button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={120}>
                <Bezel>
                  <div className="relative p-6 sm:p-8">
                    <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                      Game day rundown
                    </h3>
                    <ul className="mt-6 divide-y divide-white/8">
                      {flagFootball.times.map(([grade, practice, game]) => (
                        <li
                          key={grade}
                          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5"
                        >
                          <span className="font-display text-base tracking-wide text-white sm:text-lg">
                            {grade}
                          </span>
                          <span className="flex gap-5 text-[0.82rem] tabular-nums sm:gap-8 sm:text-[0.9rem]">
                            <span className="text-white/45">
                              Practice <span className="text-white/80">{practice}</span>
                            </span>
                            <span className="text-white/45">
                              Game <span className="text-gold">{game}</span>
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-[0.8rem] leading-relaxed text-white/40">
                      Each team practices for one hour immediately before their game. Times may
                      shift based on division sizes and field availability.
                    </p>
                  </div>
                </Bezel>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------- PRICING ---------------- */}
      <Section className="section-ruled">
        <div className="shell">
          <SectionHead
            align="center"
            eyebrow="Registration"
            title="Sign up early, pay less"
            lead={flagFootball.feeNote}
          />

          <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3 sm:gap-5">
            {flagFootball.pricing.map((tier, i) => (
              <Reveal key={tier.label} delay={i * 100}>
                <Bezel
                  className={['h-full', tier.best ? 'ring-1 ring-gold/45' : ''].join(' ')}
                >
                  <div className="relative flex h-full flex-col p-7 text-center sm:p-8">
                    {tier.best && (
                      <span className="absolute inset-x-0 top-0 mx-auto w-max -translate-y-1/2 rounded-full bg-gradient-to-r from-gold-200 to-gold-500 px-3.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-ink">
                        Best value
                      </span>
                    )}
                    <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-white/55">
                      {tier.label}
                    </h3>
                    <p
                      className={[
                        'mt-4 font-display text-5xl sm:text-6xl',
                        tier.best ? 'text-metal' : 'text-white',
                      ].join(' ')}
                    >
                      {tier.price}
                    </p>
                    <p className="mt-3 text-[0.82rem] text-white/45">{tier.note}</p>
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </div>

          <Reveal delay={220}>
            <p className="mx-auto mt-9 max-w-2xl text-center text-[0.85rem] leading-relaxed text-white/42">
              {flagFootball.uniformNote}
            </p>
            <div className="mt-8 flex justify-center">
              <Button to="/register">Claim your spot</Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------- CAMP ---------------- */}
      <Section className="section-ruled">
        <div className="shell">
          <Reveal>
            <Bezel>
              <div className="relative grid lg:grid-cols-2">
                <div className="relative order-2 min-h-[280px] overflow-hidden lg:order-1 lg:min-h-[440px]">
                  <img
                    src="/img/camp.jpg"
                    alt="Elite Youth Football Skills Camp graphic showing athletes competing for a catch"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-800/85 to-transparent lg:bg-gradient-to-r" />
                </div>

                <div className="order-1 p-8 sm:p-10 lg:order-2 lg:p-14">
                  <span className="eyebrow">Camps & clinics</span>
                  <h2 className="mt-5 font-display t-h2 display-skew text-white">
                    {camp.name}
                  </h2>
                  <p className="mt-5 text-[0.98rem] leading-relaxed text-white/60">
                    {camp.blurb}
                  </p>

                  <dl className="mt-8 grid gap-4 xs:grid-cols-3">
                    {[
                      ['calendar', 'Dates', camp.dates],
                      ['clock', 'Time', camp.time],
                      ['pin', 'Where', camp.location],
                    ].map(([icon, label, value]) => (
                      <div key={label} className="flex gap-3">
                        <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                        <div>
                          <dt className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/42">
                            {label}
                          </dt>
                          <dd className="mt-1 text-[0.88rem] font-semibold text-white">{value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-9">
                    <Button to="/camps" variant="ghost" icon="bolt">Camp details</Button>
                  </div>
                </div>
              </div>
            </Bezel>
          </Reveal>
        </div>
      </Section>

      {/* ---------------- GALLERY ---------------- */}
      <Section className="section-ruled !pb-0">
        <div className="shell">
          <SectionHead
            align="center"
            eyebrow="Game day"
            title="This is what Saturday looks like"
          />
        </div>

        <div className="shell mt-14">
          <Gallery />
        </div>

        <div className="pb-20 sm:pb-24" />
      </Section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="section-ruled relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/img/catch.jpg"
            alt=""
            loading="lazy"
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-ink/86" />
          <div className="stadium-glow absolute inset-0" />
        </div>

        <div className="shell relative py-24 text-center sm:py-32 lg:py-40">
          <Reveal>
            <span className="eyebrow">Winter 2026</span>
            <h2 className="mx-auto mt-6 max-w-4xl font-display t-h1 display-skew">
              <span className="text-white">Give them a season</span>{' '}
              <span className="text-metal">worth remembering</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[1.02rem] leading-relaxed text-white/62">
              Spots fill by division and rosters cap at ten. Create your parent account and get
              your athlete on a team before their grade closes.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 xs:flex-row">
              <Button to="/register">Register your athlete</Button>
              <Button href={org.phoneHref} variant="ghost" icon="phone">
                {org.phone}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
