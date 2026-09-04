import { org } from '../data/site.js'
import Icon from './Icon.jsx'

// Tablet only. Below xl the phone number leaves the nav bar, where it crowded the
// links; on mobile the sticky bottom bar already carries Call us, so this fills the
// gap in between. Bottom right, clear of the footer content.
export default function FloatingCall() {
  return (
    <a
      href={org.phoneHref}
      aria-label={`Call ${org.name} on ${org.phone}`}
      className="group fixed bottom-6 right-6 z-[57] hidden h-14 items-center gap-3 rounded-full border border-gold/45 bg-ink-800/92 pl-4 pr-5 text-[0.88rem] font-bold text-gold shadow-[0_18px_45px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-500 ease-swift hover:border-gold hover:bg-gold hover:text-ink md:inline-flex xl:hidden"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/14 transition-colors duration-500 group-hover:bg-ink/12">
        <Icon name="phone" className="h-4 w-4" strokeWidth={1.7} />
      </span>
      {org.phone}
    </a>
  )
}
