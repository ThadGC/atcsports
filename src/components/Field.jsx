import { useState } from 'react'
import Icon from './Icon.jsx'

// Visible label + inline error + 48px touch target. Placeholders are examples, never labels.
export default function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  hint,
  placeholder,
  autoComplete,
  required,
  inputMode,
  children,
}) {
  const [reveal, setReveal] = useState(false)
  const isPassword = type === 'password'
  const errId = `${name}-error`
  const hintId = `${name}-hint`

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={name} className="text-[0.78rem] font-bold tracking-wide text-white/78">
          {label}
          {!required && <span className="ml-1.5 font-normal text-white/35">Optional</span>}
        </label>
        {children}
      </div>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword && reveal ? 'text' : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errId : hint ? hintId : undefined}
          className={['field min-h-[3rem]', isPassword ? 'pr-12' : '', error ? 'field-error' : ''].join(' ')}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-white/45 transition-colors duration-300 hover:text-gold"
          >
            <Icon name={reveal ? 'user' : 'lock'} className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {error ? (
        <p id={errId} role="alert" className="mt-2 flex items-start gap-1.5 text-[0.79rem] text-red-300">
          <Icon name="alert" className="mt-[0.1rem] h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-[0.78rem] text-white/38">{hint}</p>
      ) : null}
    </div>
  )
}

export function Notice({ tone = 'error', title, children }) {
  const ok = tone === 'success'
  return (
    <div
      role={ok ? 'status' : 'alert'}
      className={[
        'flex gap-3 rounded-2xl border p-4',
        ok
          ? 'border-gold/35 bg-gold/8 text-gold-100'
          : 'border-red-400/35 bg-red-400/8 text-red-200',
      ].join(' ')}
    >
      <Icon name={ok ? 'check' : 'alert'} className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
      <div className="text-[0.86rem] leading-relaxed">
        {title && <p className="font-bold">{title}</p>}
        {children && <p className={title ? 'mt-1 opacity-85' : ''}>{children}</p>}
      </div>
    </div>
  )
}
