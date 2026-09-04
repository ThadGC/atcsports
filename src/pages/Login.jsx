import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { validateEmail } from '../lib/validate.js'
import Seo from '../components/Seo.jsx'
import Button from '../components/Button.jsx'
import Field, { Notice } from '../components/Field.jsx'
import AuthShell from '../components/AuthShell.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/account'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState('')

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: null }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setServerError('')
    const next = {
      email: validateEmail(form.email),
      password: form.password ? null : 'Enter your password.',
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) {
      document.querySelector('[aria-invalid="true"]')?.focus()
      return
    }
    setBusy(true)
    try {
      await login({ email: form.email.trim().toLowerCase(), password: form.password })
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo
        title="Log in"
        description="Log in to your ATC Sports parent account to manage your athletes, divisions and season registrations."
        path="/login"
        image="/img/action-5.jpg"
      />

      <AuthShell
        eyebrow="Parent account"
        title="Welcome"
        accent="back"
        lead="Log in to manage your athletes, check your division's game time and keep your details current."
        image="/img/action-5.jpg"
      >
        <h2 className="font-display text-[1.6rem] display-skew text-white">Log in</h2>
        <p className="mt-2.5 text-[0.9rem] text-white/52">
          New here?{' '}
          <Link to="/register" className="font-semibold text-gold hover:underline">
            Create an account
          </Link>
        </p>

        <form onSubmit={submit} noValidate className="mt-7 space-y-5">
          {serverError && <Notice tone="error">{serverError}</Notice>}

          <Field
            label="Email" name="email" type="email" inputMode="email"
            value={form.email} onChange={set('email')} error={errors.email}
            placeholder="you@example.com" autoComplete="email" required
          />

          <Field
            label="Password" name="password" type="password"
            value={form.password} onChange={set('password')} error={errors.password}
            placeholder="Your password" autoComplete="current-password" required
          />

          <Button type="submit" full disabled={busy} icon="arrow">
            {busy ? 'Logging in…' : 'Log in'}
          </Button>
        </form>
      </AuthShell>
    </>
  )
}
