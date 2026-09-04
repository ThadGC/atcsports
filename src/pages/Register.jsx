import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { emailTypo, passwordStrength, validateEmail, validateName, validatePassword } from '../lib/validate.js'
import Seo from '../components/Seo.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Field, { Notice } from '../components/Field.jsx'
import AuthShell from '../components/AuthShell.jsx'

const BLANK = { firstName: '', lastName: '', email: '', phone: '', password: '' }

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(BLANK)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState('')
  const [suggest, setSuggest] = useState(null)

  const strength = passwordStrength(form.password)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: null }))
    if (k === 'email') setSuggest(null)
  }

  const checkEmail = () => {
    const err = validateEmail(form.email)
    setErrors((x) => ({ ...x, email: err }))
    if (!err) setSuggest(emailTypo(form.email))
  }

  const validate = () => {
    const next = {
      firstName: validateName(form.firstName, 'first name'),
      lastName: validateName(form.lastName, 'last name'),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    }
    setErrors(next)
    return !Object.values(next).some(Boolean)
  }

  const submit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) {
      document.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    setBusy(true)
    try {
      await register({ ...form, email: form.email.trim().toLowerCase() })
      navigate('/account', { replace: true })
    } catch (err) {
      setServerError(err.message)
      if (err.fields) setErrors((x) => ({ ...x, ...err.fields }))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo
        title="Create your parent account"
        description="Create an ATC Sports parent account to register your athlete for flag football, 7-on-7 and skills camps in Roseville, California. Takes about 30 seconds."
        path="/register"
        image="/img/champion.jpg"
      />

      <AuthShell
        eyebrow="Winter 2026 · Registration open"
        title="Get them on"
        accent="a team"
        lead="Create your parent account once, then register every athlete in your family from one place. Takes about 30 seconds."
        image="/img/champion.jpg"
        aside={
          <ul className="space-y-3">
            {[
              'Manage every athlete in one account',
              'Division times and field details in one place',
              'Friend and coach requests kept on file',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[0.92rem] text-white/62">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2} />
                {t}
              </li>
            ))}
          </ul>
        }
      >
        <h2 className="font-display text-[1.6rem] display-skew text-white">Create your account</h2>
        <p className="mt-2.5 text-[0.9rem] text-white/52">
          Already have one?{' '}
          <Link to="/login" className="font-semibold text-gold hover:underline">Log in</Link>
        </p>

        <form onSubmit={submit} noValidate className="mt-7 space-y-5">
          {serverError && <Notice tone="error">{serverError}</Notice>}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="First name" name="firstName" value={form.firstName}
              onChange={set('firstName')} error={errors.firstName}
              placeholder="Jordan" autoComplete="given-name" required
            />
            <Field
              label="Last name" name="lastName" value={form.lastName}
              onChange={set('lastName')} error={errors.lastName}
              placeholder="Reed" autoComplete="family-name" required
            />
          </div>

          <div>
            <Field
              label="Email" name="email" type="email" inputMode="email"
              value={form.email} onChange={set('email')} onBlur={checkEmail}
              error={errors.email} placeholder="you@example.com"
              autoComplete="email" required
            />
            {suggest && (
              <button
                type="button"
                onClick={() => { setForm((f) => ({ ...f, email: suggest })); setSuggest(null) }}
                className="mt-2 text-[0.79rem] text-gold hover:underline"
              >
                Did you mean <strong>{suggest}</strong>?
              </button>
            )}
          </div>

          <Field
            label="Mobile" name="phone" type="tel" inputMode="tel"
            value={form.phone} onChange={set('phone')} error={errors.phone}
            placeholder="(209) 555-0134" autoComplete="tel"
            hint="Only used for weather calls and game-day changes."
          />

          <div>
            <Field
              label="Password" name="password" type="password"
              value={form.password} onChange={set('password')}
              error={errors.password} placeholder="At least 8 characters"
              autoComplete="new-password" required
            />
            {form.password && !errors.password && (
              <div className="mt-2.5 flex items-center gap-3">
                <div className="flex h-1 flex-1 gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={[
                        'h-full flex-1 rounded-full transition-colors duration-500',
                        i < strength.score ? 'bg-gold' : 'bg-white/12',
                      ].join(' ')}
                    />
                  ))}
                </div>
                <span className="shrink-0 text-[0.74rem] font-semibold text-white/50">
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <Button type="submit" full disabled={busy} icon="arrow">
            {busy ? 'Creating your account…' : 'Create account'}
          </Button>

          <p className="text-[0.76rem] leading-relaxed text-white/35">
            By creating an account you agree to receive league updates about your athlete's
            season. No credit card required to create an account.
          </p>
        </form>
      </AuthShell>
    </>
  )
}
