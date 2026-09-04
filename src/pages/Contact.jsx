import { useState } from 'react'
import { org, venues } from '../data/site.js'
import { contact as contactApi } from '../lib/api.js'
import { validateEmail, validateName } from '../lib/validate.js'
import Seo from '../components/Seo.jsx'
import Reveal from '../components/Reveal.jsx'
import Button from '../components/Button.jsx'
import Icon from '../components/Icon.jsx'
import Bezel from '../components/Bezel.jsx'
import PageHero from '../components/PageHero.jsx'
import Field, { Notice } from '../components/Field.jsx'
import { Section } from '../components/Section.jsx'

const BLANK = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(BLANK)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [serverError, setServerError] = useState('')

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: null }))
  }

  const validate = () => {
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      message: !form.message.trim()
        ? 'Tell us how we can help.'
        : form.message.trim().length < 10
          ? 'Add a little more detail so we can answer properly.'
          : null,
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
    setStatus('sending')
    try {
      await contactApi.send(form)
      setStatus('sent')
      setForm(BLANK)
    } catch (err) {
      setStatus('error')
      setServerError(err.message)
      if (err.fields) setErrors((x) => ({ ...x, ...err.fields }))
    }
  }

  return (
    <>
      <Seo
        title="Contact ATC Sports"
        description="Questions about divisions, registration, uniforms or coaching? Call ATC Sports on (209) 986-0460 or send the league a message. Based in Roseville, California."
        path="/contact"
        image="/img/action-3.jpg"
      />

      <PageHero
        eyebrow="Get in touch"
        title="Talk to"
        accent="the league"
        lead="Questions about which division your child belongs in, uniforms, or volunteering to coach? A real person answers."
        image="/img/action-3.jpg"
        alt="ATC Sports athletes competing during a Saturday league game"
      />

      <Section className="!pt-10 sm:!pt-16 lg:!pt-24">
        <div className="shell grid gap-4 sm:gap-5 lg:grid-cols-12">
          {/* Form */}
          <Reveal className="lg:col-span-7">
            <Bezel className="h-full">
              <div className="p-7 sm:p-9 lg:p-10">
                <h2 className="font-display t-h3 display-skew text-white">Send a message</h2>
                <p className="mt-3 text-[0.92rem] text-white/55">
                  We answer most messages within a day. In a hurry? Call{' '}
                  <a href={org.phoneHref} className="font-semibold text-gold hover:underline">
                    {org.phone}
                  </a>
                  .
                </p>

                {status === 'sent' ? (
                  <div className="mt-8 space-y-5">
                    <Notice tone="success" title="Message sent.">
                      Thanks for reaching out. We'll get back to you shortly. If it's urgent,
                      give us a call and we'll pick up.
                    </Notice>
                    <Button variant="ghost" icon="mail" onClick={() => setStatus('idle')}>
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate className="mt-8 space-y-5">
                    {serverError && <Notice tone="error">{serverError}</Notice>}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Your name"
                        name="name"
                        value={form.name}
                        onChange={set('name')}
                        error={errors.name}
                        placeholder="Jordan Reed"
                        autoComplete="name"
                        required
                      />
                      <Field
                        label="Email"
                        name="email"
                        type="email"
                        inputMode="email"
                        value={form.email}
                        onChange={set('email')}
                        error={errors.email}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>

                    <Field
                      label="Subject"
                      name="subject"
                      value={form.subject}
                      onChange={set('subject')}
                      error={errors.subject}
                      placeholder="Which division for a 2nd grader?"
                      hint="Helps us route your message to the right person."
                    />

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-[0.78rem] font-bold tracking-wide text-white/78"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={set('message')}
                        placeholder="Tell us about your athlete: grade, experience, and what you'd like to know."
                        aria-invalid={errors.message ? 'true' : undefined}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        className={['field resize-y', errors.message ? 'field-error' : ''].join(' ')}
                      />
                      {errors.message && (
                        <p
                          id="message-error"
                          role="alert"
                          className="mt-2 flex items-start gap-1.5 text-[0.79rem] text-red-300"
                        >
                          <Icon name="alert" className="mt-[0.1rem] h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" disabled={status === 'sending'} icon="arrow">
                      {status === 'sending' ? 'Sending…' : 'Send message'}
                    </Button>

                    <p className="text-[0.76rem] leading-relaxed text-white/35">
                      We use your details to answer your question and nothing else. We never sell
                      or share your information.
                    </p>
                  </form>
                )}
              </div>
            </Bezel>
          </Reveal>

          {/* Details */}
          <Reveal delay={110} className="lg:col-span-5">
            <div className="grid h-full gap-4 sm:gap-5">
              <Bezel>
                <div className="p-7 sm:p-8">
                  <h2 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                    Direct
                  </h2>
                  <ul className="mt-6 space-y-5">
                    <li>
                      <a href={org.phoneHref} className="group flex items-start gap-3.5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/28 bg-gold/8 text-gold">
                          <Icon name="phone" className="h-4 w-4" strokeWidth={1.5} />
                        </span>
                        <span>
                          <span className="block text-[0.66rem] font-bold uppercase tracking-[0.16em] text-white/42">
                            Call the league
                          </span>
                          <span className="mt-1 block text-[1.02rem] font-semibold text-white transition-colors group-hover:text-gold">
                            {org.phone}
                          </span>
                        </span>
                      </a>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/28 bg-gold/8 text-gold">
                        <Icon name="user" className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span>
                        <span className="block text-[0.66rem] font-bold uppercase tracking-[0.16em] text-white/42">
                          League president
                        </span>
                        <span className="mt-1 block text-[1.02rem] font-semibold text-white">
                          {org.president}
                        </span>
                      </span>
                    </li>
                    <li className="flex items-start gap-3.5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/28 bg-gold/8 text-gold">
                        <Icon name="pin" className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span>
                        <span className="block text-[0.66rem] font-bold uppercase tracking-[0.16em] text-white/42">
                          Based in
                        </span>
                        <span className="mt-1 block text-[1.02rem] font-semibold text-white">
                          {org.city}
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              </Bezel>

              <Bezel>
                <div className="p-7 sm:p-8">
                  <h2 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                    Follow the season
                  </h2>
                  <div className="mt-5 grid gap-3">
                    {org.socials.map((s) => (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3.5 rounded-2xl border border-white/10 p-3.5 transition-all duration-700 ease-swift hover:border-gold/45 hover:bg-gold/6"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/6 text-white/70 transition-colors group-hover:text-gold">
                          <Icon name={s.name.toLowerCase()} className="h-4 w-4" strokeWidth={1.45} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[0.88rem] font-semibold text-white">{s.name}</span>
                          <span className="block truncate text-[0.78rem] text-white/45">{s.handle}</span>
                        </span>
                        <Icon
                          name="arrow"
                          className="ml-auto h-3.5 w-3.5 shrink-0 text-white/30 transition-all duration-500 ease-swift group-hover:translate-x-0.5 group-hover:text-gold"
                          strokeWidth={1.8}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </Bezel>

              <Bezel>
                <div className="p-7 sm:p-8">
                  <h2 className="text-[0.66rem] font-bold uppercase tracking-[0.24em] text-gold/85">
                    Fields
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {venues.map((v) => (
                      <li key={v.name}>
                        <a href={v.map} target="_blank" rel="noopener noreferrer" className="group flex min-h-[44px] items-start gap-3 py-0.5">
                          <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                          <span>
                            <span className="block text-[0.9rem] font-semibold text-white transition-colors group-hover:text-gold">
                              {v.name}
                            </span>
                            <span className="block text-[0.78rem] text-white/45">{v.address}</span>
                          </span>
                        </a>
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
