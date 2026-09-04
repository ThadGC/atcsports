// Shared section chrome: heavy vertical rhythm + eyebrow + display heading.
import Reveal from './Reveal.jsx'

export function SectionHead({ eyebrow, title, lead, align = 'left', className = '' }) {
  const centered = align === 'center'
  return (
    <div
      className={[
        centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl',
        className,
      ].join(' ')}
    >
      {eyebrow && (
        <Reveal y={20}>
          <span className="eyebrow">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={80}>
        <h2 className="mt-5 font-display t-h2 display-skew text-white">{title}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={150}>
          <p
            className={[
              'mt-5 text-[1.02rem] leading-relaxed text-white/58 sm:text-[1.08rem]',
              centered ? 'mx-auto max-w-2xl' : 'max-w-2xl',
            ].join(' ')}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  )
}

export function Section({ children, className = '', id }) {
  return (
    <section id={id} className={['relative py-20 sm:py-24 lg:py-32', className].join(' ')}>
      {children}
    </section>
  )
}
