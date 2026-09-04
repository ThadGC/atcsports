import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'
import Bezel from './Bezel.jsx'
import Icon from './Icon.jsx'
import { org } from '../data/site.js'

// Split layout: form on one side, proof and context on the other.
export default function AuthShell({ eyebrow, title, accent, lead, children, aside, image, alt }) {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-36">
      <div className="absolute inset-0">
        <img src={image} alt={alt || ''} aria-hidden={alt ? undefined : 'true'} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/92" />
        <div className="stadium-glow absolute inset-0" />
        <div className="field-lines absolute inset-0 opacity-35" />
      </div>

      <div className="shell relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <Link to="/" className="inline-flex min-h-[44px] items-center" aria-label={`${org.name} home`}>
              <img src="/img/logo-wide.png" alt="" width="220" height="34" className="h-9 w-auto" />
            </Link>
            <span className="eyebrow mt-7">
              {eyebrow}
            </span>
            <h1 className="mt-5 font-display t-h1 display-skew">
              <span className="text-white">{title}</span> <span className="text-metal">{accent}</span>
            </h1>
            <p className="mt-5 max-w-md text-[1rem] leading-relaxed text-white/62">{lead}</p>
            {aside && <div className="mt-9">{aside}</div>}
            <a
              href={org.phoneHref}
              className="mt-7 inline-flex min-h-[44px] items-center gap-2.5 text-[0.88rem] font-semibold text-white/55 transition-colors hover:text-gold"
            >
              <Icon name="phone" className="h-4 w-4" strokeWidth={1.5} />
              Need a hand? {org.phone}
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <Reveal delay={120}>
            <div className="mx-auto max-w-lg lg:mr-0">
              <Bezel>
                <div className="p-7 sm:p-9 lg:p-10">{children}</div>
              </Bezel>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
