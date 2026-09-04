// Stadium ribbon. Duplicated track so the loop is seamless.
export default function Marquee({ items, className = '' }) {
  const row = [...items, ...items]
  return (
    <div
      className={['relative flex overflow-hidden border-y border-white/8 bg-ink-800/60 py-4', className].join(' ')}
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
        {row.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8 sm:gap-12">
            <span className="font-display text-[0.95rem] uppercase tracking-[0.14em] text-white/38 sm:text-lg">
              {item}
            </span>
            <span className="h-1 w-1 shrink-0 rotate-45 bg-gold/60" />
          </span>
        ))}
      </div>
    </div>
  )
}
