import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon.jsx'

// Dropdown styled to the site rather than to the operating system. A native <select>
// renders as an iOS wheel or a Windows list box and ignores everything around it.
//
// Keeps the keyboard behaviour people expect from a listbox: arrows move, Home and End
// jump, Enter and Space choose, Escape closes, typing jumps to a match.
export default function Select({ label, value, onChange, options, id, hint, className = '' }) {
  const auto = useId()
  const listId = id || `select-${auto}`
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)))
  const wrap = useRef(null)
  const btn = useRef(null)
  const listRef = useRef(null)
  const typed = useRef({ str: '', at: 0 })
  const [rect, setRect] = useState(null)

  // The panel is portalled to <body>, so it needs the trigger's viewport position.
  // Anything else gets trapped: an ancestor with a transform, a filter or its own
  // z-index forms a stacking context that a child's z-index cannot escape, and the
  // panel ends up painted under whatever section follows it.
  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const r = btn.current?.getBoundingClientRect()
      if (!r) return
      const GAP = 8
      const MIN = 140
      const below = window.innerHeight - r.bottom - GAP - 8
      const above = r.top - GAP - 8
      // Open upward when there is not enough room beneath the trigger, and cap the
      // height to whatever space there actually is, so the list never runs off screen.
      const up = below < MIN && above > below
      setRect({
        top: up ? undefined : r.bottom + GAP,
        bottom: up ? window.innerHeight - r.top + GAP : undefined,
        left: r.left,
        width: r.width,
        maxHeight: Math.max(MIN, Math.min(288, up ? above : below)),
      })
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  // Close when focus or a click leaves the control.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrap.current?.contains(e.target)) return
      if (listRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  useEffect(() => {
    if (open) listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const choose = (i) => {
    onChange(options[i])
    setOpen(false)
    btn.current?.focus()
  }

  const onKeyDown = (e) => {
    const last = options.length - 1
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setActive(Math.max(0, options.indexOf(value)))
      setOpen(true)
      return
    }
    if (!open) return

    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); btn.current?.focus() }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(last, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0) }
    else if (e.key === 'End') { e.preventDefault(); setActive(last) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active) }
    else if (e.key === 'Tab') { setOpen(false) }
    else if (e.key.length === 1) {
      // type-ahead
      const now = Date.now()
      typed.current.str = now - typed.current.at > 800 ? e.key : typed.current.str + e.key
      typed.current.at = now
      const hit = options.findIndex((o) => o.toLowerCase().startsWith(typed.current.str.toLowerCase()))
      if (hit !== -1) setActive(hit)
    }
  }

  return (
    <div className={className}>
      {label && (
        <span id={`${listId}-label`} className="block text-[0.63rem] font-bold uppercase tracking-[0.2em] text-gold/85">
          {label}
        </span>
      )}

      <div ref={wrap} className="relative mt-3">
        <button
          ref={btn}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${listId}-list`}
          aria-labelledby={label ? `${listId}-label` : undefined}
          onClick={() => { setActive(Math.max(0, options.indexOf(value))); setOpen((v) => !v) }}
          onKeyDown={onKeyDown}
          className={[
            'field flex min-h-[3rem] w-full items-center justify-between gap-3 text-left',
            open ? 'border-gold/70 bg-gold/6' : '',
          ].join(' ')}
        >
          <span className="truncate">{value}</span>
          <Icon
            name="arrow"
            className={[
              'h-3.5 w-3.5 shrink-0 text-gold transition-transform duration-500 ease-swift',
              open ? '-rotate-[135deg]' : 'rotate-45',
            ].join(' ')}
            strokeWidth={2}
          />
        </button>

        {open &&
          rect &&
          createPortal(
            <ul
              ref={listRef}
              id={`${listId}-list`}
              role="listbox"
              aria-labelledby={label ? `${listId}-label` : undefined}
              tabIndex={-1}
              style={{
                top: rect.top,
                bottom: rect.bottom,
                left: rect.left,
                width: rect.width,
                maxHeight: rect.maxHeight,
              }}
              className="glass-panel fixed z-[80] overflow-y-auto rounded-2xl p-1.5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.98)]"
            >
              {options.map((o, i) => {
                const selected = o === value
                return (
                  <li key={o}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      data-active={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(i)}
                      className={[
                        'flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[0.88rem] transition-colors duration-200',
                        selected ? 'text-gold' : 'text-white/80',
                        i === active ? 'bg-white/8' : '',
                      ].join(' ')}
                    >
                      <span className="truncate">{o}</span>
                      {selected && <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.4} />}
                    </button>
                  </li>
                )
              })}
            </ul>,
            document.body,
          )}
      </div>

      {hint && <p className="mt-2 text-[0.78rem] text-white/38">{hint}</p>}
    </div>
  )
}
