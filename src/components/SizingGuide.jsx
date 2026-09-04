import { useMemo, useState } from 'react'
import { sizing } from '../data/site.js'
import Bezel from './Bezel.jsx'
import Icon from './Icon.jsx'

// Interactive version of the uniform sizing chart ATC publishes. Pick a category and a
// measurement, type the number, and it points at the size rather than making parents
// read across a wide table on a phone.
const parseRange = (r) => {
  const [lo, hi] = r.split('-').map((v) => parseFloat(v.trim()))
  return { lo, hi: Number.isNaN(hi) ? lo : hi }
}

export default function SizingGuide() {
  const [groupId, setGroupId] = useState(sizing.groups[0].id)
  const [measure, setMeasure] = useState('Chest')
  const [value, setValue] = useState('')

  const group = sizing.groups.find((g) => g.id === groupId)
  const measures = Object.keys(group.rows)
  const active = measures.includes(measure) ? measure : measures[0]

  // Which size the typed measurement falls into. Between two sizes, take the larger.
  const match = useMemo(() => {
    const v = parseFloat(value)
    if (Number.isNaN(v)) return null
    const ranges = group.rows[active].map(parseRange)
    const exact = ranges.findIndex((r) => v >= r.lo && v <= r.hi)
    if (exact !== -1) return { index: exact, exact: true }
    const next = ranges.findIndex((r) => v < r.lo)
    if (next !== -1) return { index: next, exact: false }
    if (v > ranges[ranges.length - 1].hi) return { index: -1, over: true }
    return null
  }, [value, group, active])

  return (
    <Bezel>
      <div className="p-6 sm:p-8 lg:p-10">
        <h3 className="font-display t-h3 display-skew text-white">Uniform sizing guide</h3>
        <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-white/58">{sizing.intro}</p>

        {/* Category */}
        <fieldset className="mt-7 border-0 p-0">
          <legend className="text-[0.63rem] font-bold uppercase tracking-[0.2em] text-gold/85">
            Who is it for
          </legend>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {sizing.groups.map((g) => {
              const on = g.id === groupId
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGroupId(g.id)}
                  aria-pressed={on}
                  className={[
                    'min-h-[44px] rounded-full border px-4 text-[0.82rem] font-bold transition-all duration-500 ease-swift',
                    on
                      ? 'border-gold/60 bg-gold/14 text-gold'
                      : 'border-white/12 text-white/62 hover:border-gold/40 hover:text-white',
                  ].join(' ')}
                >
                  {g.label}
                  {g.sub && <span className="ml-1.5 font-normal opacity-60">{g.sub}</span>}
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* Measurement + value */}
        <div className="mt-6 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-end">
          <fieldset className="border-0 p-0">
            <legend className="text-[0.63rem] font-bold uppercase tracking-[0.2em] text-gold/85">
              Measurement
            </legend>
            <div className="mt-3.5 flex gap-2">
              {measures.map((m) => {
                const on = m === active
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMeasure(m)}
                    aria-pressed={on}
                    className={[
                      'min-h-[44px] rounded-full border px-4 text-[0.82rem] font-bold transition-all duration-500 ease-swift',
                      on
                        ? 'border-gold/60 bg-gold/14 text-gold'
                        : 'border-white/12 text-white/62 hover:border-gold/40 hover:text-white',
                    ].join(' ')}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="sizing-value"
              className="block text-[0.63rem] font-bold uppercase tracking-[0.2em] text-gold/85"
            >
              {active} measurement
            </label>
            <div className="relative mt-3.5">
              <input
                id="sizing-value"
                type="number"
                inputMode="decimal"
                min="10"
                max="70"
                step="0.5"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 27"
                className="field min-h-[44px] pr-16"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.82rem] text-white/40">
                inches
              </span>
            </div>
          </div>
        </div>

        {/* Result */}
        {value !== '' && (
          <div
            role="status"
            className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-gold/30 bg-gold/8 px-4 py-3.5"
          >
            {match && match.index >= 0 ? (
              <>
                <span className="text-[0.9rem] text-white/70">
                  {group.label}, {active.toLowerCase()} {value}&Prime;
                </span>
                <span className="font-display text-xl tracking-wide text-metal">
                  {group.sizes[match.index].code}
                </span>
                {group.sizes[match.index].us && (
                  <span className="text-[0.82rem] text-white/50">
                    US {group.sizes[match.index].us}
                  </span>
                )}
                {!match.exact && (
                  <span className="text-[0.8rem] text-white/45">
                    Between sizes, so this is the looser fit.
                  </span>
                )}
              </>
            ) : (
              <span className="text-[0.88rem] text-white/70">
                That is outside the printed range. Larger and smaller sizes are available on
                request, so give the league a call.
              </span>
            )}
          </div>
        )}

        {/* The chart itself, with the matched column marked */}
        <div className="mt-8 -mx-6 overflow-x-auto px-6 sm:-mx-8 sm:px-8">
          <table className="w-full min-w-[34rem] border-collapse text-[0.88rem]">
            <caption className="pb-3 text-left text-[0.63rem] font-bold uppercase tracking-[0.2em] text-white/42">
              {group.label}
              {group.sub ? ` · ${group.sub}` : ''} · inches
            </caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-white/14 py-2.5 pr-4 text-left text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white/45">
                  Size
                </th>
                {group.sizes.map((sz, i) => (
                  <th
                    key={sz.code}
                    scope="col"
                    className={[
                      'border-b py-2.5 pr-4 text-left font-display text-[0.95rem] tracking-wide',
                      match?.index === i ? 'border-gold text-gold' : 'border-white/14 text-white',
                    ].join(' ')}
                  >
                    {sz.code}
                    {sz.us && (
                      <span className="block text-[0.66rem] font-normal tracking-normal text-white/40">
                        {sz.us}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {measures.map((m) => (
                <tr key={m}>
                  <th
                    scope="row"
                    className={[
                      'whitespace-nowrap border-b border-white/8 py-2.5 pr-4 text-left font-semibold',
                      m === active ? 'text-gold' : 'text-white/70',
                    ].join(' ')}
                  >
                    {m}
                  </th>
                  {group.rows[m].map((cell, i) => (
                    <td
                      key={i}
                      className={[
                        'whitespace-nowrap border-b border-white/8 py-2.5 pr-4 tabular-nums',
                        match?.index === i && m === active
                          ? 'bg-gold/12 font-semibold text-gold'
                          : 'text-white/62',
                      ].join(' ')}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to measure */}
        <div className="mt-8 grid gap-5 border-t border-white/8 pt-6 sm:grid-cols-2">
          <div>
            <h4 className="text-[0.63rem] font-bold uppercase tracking-[0.2em] text-gold/85">
              How to measure
            </h4>
            <dl className="mt-3.5 space-y-2.5">
              {sizing.howTo.map(([term, how]) => (
                <div key={term} className="flex gap-2.5">
                  <dt className="shrink-0 font-semibold text-white">{term}</dt>
                  <dd className="text-[0.92rem] text-white/58">{how}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h4 className="text-[0.63rem] font-bold uppercase tracking-[0.2em] text-gold/85">
              Good to know
            </h4>
            <ul className="mt-3.5 space-y-2.5">
              {sizing.notes.map((note) => (
                <li key={note} className="flex gap-2.5 text-[0.92rem] text-white/58">
                  <Icon name="check" className="mt-1 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2} />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Bezel>
  )
}
