import Reveal from './Reveal.jsx'
import Button from './Button.jsx'

export default function PageHero({ eyebrow, title, accent, lead, image, alt, ctas, stats }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        {image && (
          <img
            src={image}
            alt={alt || ''}
            aria-hidden={alt ? undefined : 'true'}
            className="h-full w-full object-cover object-center"
            fetchpriority="high"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/82 to-ink/55" />
        <div className="field-lines absolute inset-0 opacity-40" />
        <div className="stadium-glow absolute inset-0 opacity-75" />
      </div>

      <div className="shell relative pb-16 pt-36 sm:pb-20 sm:pt-44 lg:pb-24 lg:pt-52">
        <div className="max-w-3xl">
          <Reveal y={22}>
            <span className="eyebrow">
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 font-display t-h1 display-skew">
              <span className="text-white">{title}</span>{' '}
              {accent && <span className="text-metal">{accent}</span>}
            </h1>
          </Reveal>
          {lead && (
            <Reveal delay={190}>
              <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-white/68 sm:text-[1.1rem]">
                {lead}
              </p>
            </Reveal>
          )}
          {ctas && (
            <Reveal delay={280}>
              <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">{ctas}</div>
            </Reveal>
          )}
          {stats && (
            <Reveal delay={360}>
              <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
                {stats.map(([n, label]) => (
                  <div key={label} className="border-l border-gold/28 pl-4">
                    <dt className="font-display text-2xl text-metal sm:text-3xl">{n}</dt>
                    <dd className="mt-1 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-white/48">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
export { Button }
