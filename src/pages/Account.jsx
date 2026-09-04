import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { athletes as athletesApi } from '../lib/api.js'
import { divisions, flagFootball, org } from '../data/site.js'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Bezel from '../components/Bezel.jsx'
import Field, { Notice } from '../components/Field.jsx'
import { Section } from '../components/Section.jsx'

const ALL_DIVISIONS = [
  ...divisions.coed.map((d) => `Co-Ed · ${d}`),
  ...divisions.girls.map((d) => `Girls · ${d}`),
]

const BLANK = { firstName: '', lastName: '', division: ALL_DIVISIONS[0], notes: '' }

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [form, setForm] = useState(BLANK)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    athletesApi
      .list()
      .then((d) => setList(d.athletes || []))
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: null }))
  }

  const addAthlete = async (e) => {
    e.preventDefault()
    const next = {
      firstName: form.firstName.trim() ? null : "Enter your athlete's first name.",
      lastName: form.lastName.trim() ? null : "Enter your athlete's last name.",
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    setBusy(true)
    try {
      const d = await athletesApi.create(form)
      setList((l) => [...l, d.athlete])
      setForm(BLANK)
      setShowForm(false)
      setFlash(`${d.athlete.firstName} added to your account.`)
      setTimeout(() => setFlash(''), 5000)
    } catch (err) {
      setErrors((x) => ({ ...x, form: err.message }))
    } finally {
      setBusy(false)
    }
  }

  const removeAthlete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from your account?`)) return
    const prev = list
    setList((l) => l.filter((a) => a.id !== id))
    try {
      await athletesApi.remove(id)
      setFlash(`${name} removed.`)
      setTimeout(() => setFlash(''), 5000)
    } catch (err) {
      setList(prev)
      setLoadError(err.message)
    }
  }

  const signOut = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <Seo
        title="My account"
        description="Manage your ATC Sports athletes, divisions and season registrations."
        path="/account"
      />

      <section className="relative overflow-hidden pt-32 sm:pt-40">
        <div className="stadium-glow absolute inset-0 opacity-70" />

        <div className="shell relative">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="eyebrow">
                  Parent account
                </span>
                <h1 className="mt-5 font-display t-h1 display-skew">
                  <span className="text-white">Hey,</span>{' '}
                  <span className="text-metal">{user?.firstName}</span>
                </h1>
                <p className="mt-4 max-w-lg text-[1rem] text-white/58">
                  Everything for your family's season in one place.
                </p>
              </div>
              <Button variant="ghost" icon="logout" onClick={signOut}>Log out</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="!pt-14">
        <div className="shell grid gap-4 sm:gap-5 lg:grid-cols-12">
          {/* Athletes */}
          <div className="lg:col-span-7">
            <Reveal>
              <Bezel>
                <div className="p-7 sm:p-9">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="font-display t-h3 display-skew text-white">Your athletes</h2>
                    {!showForm && (
                      <Button variant="ghost" icon="arrow" onClick={() => setShowForm(true)}>
                        Add athlete
                      </Button>
                    )}
                  </div>

                  {flash && <div className="mt-5"><Notice tone="success">{flash}</Notice></div>}
                  {loadError && <div className="mt-5"><Notice tone="error">{loadError}</Notice></div>}

                  {loading ? (
                    <div className="mt-8 flex items-center gap-3 text-white/45">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
                      <span className="text-sm">Loading your athletes…</span>
                    </div>
                  ) : list.length === 0 && !showForm ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-white/14 p-8 text-center">
                      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-gold/28 bg-gold/8 text-gold">
                        <Icon name="users" className="h-5 w-5" strokeWidth={1.4} />
                      </span>
                      <p className="mt-5 font-display text-lg tracking-wide text-white">
                        No athletes yet
                      </p>
                      <p className="mx-auto mt-2 max-w-sm text-[0.9rem] text-white/50">
                        Add your child to get them lined up for the {flagFootball.season} season.
                      </p>
                      <div className="mt-6 flex justify-center">
                        <Button onClick={() => setShowForm(true)}>Add your first athlete</Button>
                      </div>
                    </div>
                  ) : (
                    <ul className="mt-7 space-y-3">
                      {list.map((a) => (
                        <li
                          key={a.id}
                          className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 sm:p-5"
                        >
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-200 to-gold-600 font-display text-base text-ink">
                            {a.firstName?.[0]}
                            {a.lastName?.[0]}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-display text-[1.05rem] tracking-wide text-white">
                              {a.firstName} {a.lastName}
                            </span>
                            <span className="block truncate text-[0.82rem] text-gold/85">{a.division}</span>
                            {a.notes && (
                              <span className="mt-0.5 block truncate text-[0.78rem] text-white/40">{a.notes}</span>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAthlete(a.id, a.firstName)}
                            className="ml-auto rounded-full border border-white/12 px-3.5 py-2 text-[0.75rem] font-semibold text-white/55 transition-all duration-500 hover:border-red-400/45 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {showForm && (
                    <form onSubmit={addAthlete} noValidate className="mt-7 space-y-5 border-t border-white/8 pt-7">
                      <h3 className="text-[0.66rem] font-bold uppercase tracking-[0.22em] text-gold/85">
                        Add an athlete
                      </h3>
                      {errors.form && <Notice tone="error">{errors.form}</Notice>}

                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field
                          label="First name" name="firstName" value={form.firstName}
                          onChange={set('firstName')} error={errors.firstName}
                          placeholder="Riley" required
                        />
                        <Field
                          label="Last name" name="lastName" value={form.lastName}
                          onChange={set('lastName')} error={errors.lastName}
                          placeholder="Reed" required
                        />
                      </div>

                      <div>
                        <label htmlFor="division" className="mb-2 block text-[0.78rem] font-bold tracking-wide text-white/78">
                          Division
                        </label>
                        <select
                          id="division" name="division" value={form.division}
                          onChange={set('division')} className="field min-h-[3rem]"
                        >
                          {ALL_DIVISIONS.map((d) => (
                            <option key={d} value={d} className="bg-ink-700">{d}</option>
                          ))}
                        </select>
                        <p className="mt-2 text-[0.78rem] text-white/38">
                          Go by the grade they are currently in.
                        </p>
                      </div>

                      <Field
                        label="Friend or coach request" name="notes" value={form.notes}
                        onChange={set('notes')} placeholder="Would like to play with Sam Carter"
                        hint="Honored whenever possible, first come, first served."
                      />

                      <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={busy}>
                          {busy ? 'Saving…' : 'Save athlete'}
                        </Button>
                        <Button
                          variant="ghost" icon={null}
                          onClick={() => { setShowForm(false); setForm(BLANK); setErrors({}) }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </Bezel>
            </Reveal>
          </div>

          {/* Side rail */}
          <Reveal delay={110} className="lg:col-span-5">
            <div className="grid gap-4 sm:gap-5">
              <Bezel>
                <div className="p-7 sm:p-8">
                  <h2 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                    Finish your season registration
                  </h2>
                  <p className="mt-4 text-[0.92rem] leading-relaxed text-white/58">
                    Payment and official league registration are handled on our TeamLinkt portal.
                    Your athlete's spot is confirmed once that's done.
                  </p>
                  <div className="mt-6">
                    <Button href={org.registerUrl} full>Go to registration portal</Button>
                  </div>
                </div>
              </Bezel>

              <Bezel>
                <div className="p-7 sm:p-8">
                  <h2 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                    Your details
                  </h2>
                  <dl className="mt-5 space-y-3.5 text-[0.9rem]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/42">Name</dt>
                      <dd className="text-right font-medium text-white">
                        {user?.firstName} {user?.lastName}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/42">Email</dt>
                      <dd className="min-w-0 break-all text-right font-medium text-white">{user?.email}</dd>
                    </div>
                    {user?.phone && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-white/42">Mobile</dt>
                        <dd className="text-right font-medium text-white">{user.phone}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </Bezel>

              <Bezel>
                <div className="p-7 sm:p-8">
                  <h2 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                    Season at a glance
                  </h2>
                  <ul className="mt-5 space-y-3 text-[0.88rem]">
                    {[
                      ['calendar', flagFootball.window],
                      ['pin', flagFootball.locations],
                      ['trophy', 'Week 9 Championship, Saturday January 9'],
                    ].map(([icon, text]) => (
                      <li key={text} className="flex items-start gap-2.5 text-white/62">
                        <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </Bezel>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  )
}
