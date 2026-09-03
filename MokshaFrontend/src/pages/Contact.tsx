import { useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { useMagneticButton } from '../hooks/useMagneticCursor'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Floating label field ──────────────────────────────────────────────────

interface FloatFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  error?: string
  autoComplete?: string
  multiline?: boolean
  rows?: number
}

function FloatField({ id, label, type = 'text', value, onChange, error, autoComplete, multiline, rows = 5 }: FloatFieldProps) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0

  const labelVariants = {
    resting: { y: 0, scale: 1, color: error ? '#c0392b' : '#9a8a76' },
    lifted:  { y: multiline ? -28 : -24, scale: 0.78, color: error ? '#c0392b' : focused ? '#6b7a53' : '#9a8a76' },
  }

  const sharedInputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9375rem',
    color: '#26211c',
    fontWeight: 300,
    paddingTop: '1.5rem',
    paddingBottom: '0.5rem',
    resize: 'none',
  }

  return (
    <div className="relative mb-5">
      <div
        className="relative"
        style={{
          borderBottom: `1px solid ${error ? '#c0392b' : focused ? '#6b7a53' : 'rgba(38,33,28,0.2)'}`,
          transition: 'border-color 0.25s',
          paddingBottom: 2,
        }}
      >
        {/* Animated label */}
        <motion.label
          htmlFor={id}
          className="absolute left-0 text-sm pointer-events-none origin-left"
          style={{ top: multiline ? '1.6rem' : '1.45rem' }}
          animate={lifted ? 'lifted' : 'resting'}
          variants={labelVariants}
          transition={{ duration: 0.22, ease: EASE }}
        >
          {label}
        </motion.label>

        {/* Focus line */}
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          style={{ background: '#6b7a53', originX: 0 }}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />

        {multiline ? (
          <textarea
            id={id}
            value={value}
            rows={rows}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-err` : undefined}
            style={sharedInputStyle}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-err` : undefined}
            style={sharedInputStyle}
          />
        )}
      </div>

      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs" style={{ color: '#c0392b' }}>
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Submit button states ──────────────────────────────────────────────────

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

function SubmitButton({ state, reduced }: { state: SubmitState; reduced: boolean }) {
  const btnRef = useMagneticButton()

  return (
    <motion.button
      ref={btnRef}
      type="submit"
      disabled={state === 'loading' || state === 'success'}
      className="relative inline-flex items-center gap-3 rounded-full px-9 py-4 text-sm uppercase tracking-widest font-medium overflow-hidden disabled:opacity-80"
      style={{
        background: state === 'success' ? '#6b7a53' : state === 'error' ? '#c0392b' : '#26211c',
        color: '#f7f2ea',
        willChange: 'transform',
        transition: 'background 0.35s ease, transform 0.22s cubic-bezier(0.22,1,0.36,1)',
      }}
      whileHover={reduced || state !== 'idle' ? {} : { scale: 1.03 }}
      whileTap={reduced || state !== 'idle' ? {} : { scale: 0.97 }}
      aria-live="polite"
      aria-label={
        state === 'loading' ? 'Sending message…' :
        state === 'success' ? 'Message sent!' :
        state === 'error' ? 'Try again' :
        'Send Message'
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === 'loading' && (
          <motion.span
            key="loading"
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Sending…
          </motion.span>
        )}
        {state === 'success' && (
          <motion.span
            key="success"
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {/* Checkmark SVG draws itself */}
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden="true">
              <motion.path
                d="M4 10l4.5 4.5L16 6"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </svg>
            Message Sent!
          </motion.span>
        )}
        {state === 'error' && (
          <motion.span
            key="error"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            Try Again
          </motion.span>
        )}
        {state === 'idle' && (
          <motion.span
            key="idle"
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            Send Message
            <svg viewBox="0 0 16 16" className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M2 8h12M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// ─── Contact form ──────────────────────────────────────────────────────────

interface FormErrors { name?: string; email?: string; message?: string }

function validateForm(name: string, email: string, message: string): FormErrors {
  const e: FormErrors = {}
  if (!name.trim()) e.name = 'Name is required'
  if (!email) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
  if (!message.trim()) e.message = 'Message is required'
  else if (message.trim().length < 20) e.message = 'Tell us a little more (min 20 characters)'
  return e
}

async function stubApiContact(data: Record<string, string>): Promise<void> {
  // Simulate network round-trip; replace with real fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
  await new Promise((res, rej) =>
    setTimeout(() => (data.email.includes('fail') ? rej(new Error('Server error')) : res(undefined)), 1400)
  )
}

function ContactForm({ reduced }: { reduced: boolean }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const formControls = useAnimationControls()

  const shake = async () => {
    if (reduced) return
    await formControls.start({ x: [0, -8, 8, -5, 5, -3, 3, 0], transition: { duration: 0.4 } })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateForm(name, email, message)
    setErrors(errs)
    if (Object.keys(errs).length) { await shake(); return }

    setSubmitState('loading')
    try {
      await stubApiContact({ name, email, phone, message })
      setSubmitState('success')
    } catch {
      setSubmitState('error')
      setTimeout(() => setSubmitState('idle'), 3000)
    }
  }

  return (
    <motion.form
      animate={formControls}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact Sātva Yoga"
    >
      <FloatField id="c-name" label="Your Name" value={name} onChange={setName} error={errors.name} autoComplete="name" />
      <FloatField id="c-email" label="Email Address" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" />
      <FloatField id="c-phone" label="Phone (optional)" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
      <FloatField id="c-msg" label="Your Message" value={message} onChange={setMessage} error={errors.message} multiline rows={5} />

      <div className="mt-8 flex items-center gap-5">
        <SubmitButton state={submitState} reduced={reduced} />
        {submitState === 'error' && (
          <motion.p
            className="text-xs"
            style={{ color: '#c0392b' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            Something went wrong — please try again.
          </motion.p>
        )}
      </div>
    </motion.form>
  )
}

// ─── Info card ─────────────────────────────────────────────────────────────

const BADGES = [
  { label: 'Women-Owned', icon: '♀' },
  { label: 'Wheelchair Accessible', icon: '♿' },
  { label: 'Google Pay', icon: 'G' },
]

const HOURS = [
  { days: 'Mon – Fri', time: '5:45 AM – 9:00 PM' },
  { days: 'Saturday', time: '6:00 AM – 6:00 PM' },
  { days: 'Sunday', time: '7:00 AM – 12:00 PM' },
]

function InfoCard() {
  return (
    <div className="flex flex-col gap-0 h-full">
      {/* Address */}
      <div className="pb-6" style={{ borderBottom: '1px solid rgba(38,33,28,0.1)' }}>
        <p className="text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: '#9a8a76' }}>Studio Address</p>
        <address className="not-italic text-sm leading-relaxed" style={{ color: '#3a3028', fontWeight: 300 }}>
          Shop No 7, Park Unique CHS<br />
          Shakti Nagar, Dahisar East<br />
          Mumbai 400 068, Maharashtra
        </address>
        <a
          href="https://maps.google.com/?q=Dahisar+East+Mumbai"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider transition-opacity hover:opacity-60"
          style={{ color: '#6b7a53' }}
          aria-label="Open directions in Google Maps"
        >
          <svg viewBox="0 0 14 14" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M7 1C4.8 1 3 2.8 3 5c0 3.2 4 8 4 8s4-4.8 4-8c0-2.2-1.8-4-4-4z" />
            <circle cx="7" cy="5" r="1.4" />
          </svg>
          Get Directions
        </a>
      </div>

      {/* Phone + Email */}
      <div className="py-6" style={{ borderBottom: '1px solid rgba(38,33,28,0.1)' }}>
        <p className="text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: '#9a8a76' }}>Contact</p>
        <div className="flex flex-col gap-2">
          <a href="tel:+919321524280" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style={{ color: '#3a3028', fontWeight: 300 }}>
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 1.5h2.5l1.2 3L4.8 6a8 8 0 002.2 2.2l1.5-1.4 3 1.2v2.5a1 1 0 01-1 1A10 10 0 011.5 2.5a1 1 0 011-1z" />
            </svg>
            093215 24280
          </a>
          <a href="mailto:hello@satva.yoga" className="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style={{ color: '#3a3028', fontWeight: 300 }}>
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
              <rect x="1" y="3" width="12" height="8.5" rx="1.2" />
              <path d="M1 3.5l6 4.5 6-4.5" />
            </svg>
            hello@satva.yoga
          </a>
        </div>
      </div>

      {/* Hours */}
      <div className="py-6" style={{ borderBottom: '1px solid rgba(38,33,28,0.1)' }}>
        <p className="text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: '#9a8a76' }}>Studio Hours</p>
        <div className="flex flex-col gap-2">
          {HOURS.map((h) => (
            <div key={h.days} className="flex items-baseline justify-between gap-4">
              <span className="text-xs" style={{ color: '#7a6b5d', fontWeight: 300 }}>{h.days}</span>
              <span className="text-xs tabular-nums" style={{ color: '#3a3028' }}>{h.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge chips */}
      <div className="py-6" style={{ borderBottom: '1px solid rgba(38,33,28,0.1)' }}>
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-wider"
              style={{ background: 'rgba(107,122,83,0.1)', color: '#5c6b45', border: '1px solid rgba(107,122,83,0.2)' }}
            >
              <span aria-hidden="true" style={{ fontSize: '0.7rem' }}>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div
        className="mt-6 overflow-hidden flex-1 min-h-44 flex items-center justify-center"
        style={{ borderRadius: 16, background: '#e8dfd2', minHeight: 180 }}
        aria-label="Map showing studio location in Dahisar East, Mumbai"
        role="img"
      >
        {/* Real embed: <iframe src="https://maps.google.com/..." /> */}
        <div className="text-center px-6">
          <svg viewBox="0 0 40 40" className="w-8 h-8 mx-auto mb-3 opacity-30" fill="none" stroke="#6b7a53" strokeWidth="1.5">
            <path d="M20 4C13.4 4 8 9.4 8 16c0 9.6 12 20 12 20s12-10.4 12-20C32 9.4 26.6 4 20 4z" />
            <circle cx="20" cy="16" r="4" />
          </svg>
          <p className="text-xs uppercase tracking-wider" style={{ color: '#9a8a76' }}>
            Dahisar East, Mumbai
          </p>
          <a
            href="https://maps.google.com/?q=Park+Unique+CHS+Dahisar+East+Mumbai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-[10px] uppercase tracking-widest transition-opacity hover:opacity-60"
            style={{ color: '#6b7a53' }}
          >
            Open in Maps →
          </a>
        </div>
      </div>
    </div>
  )
}

// ─── FAQ accordion ─────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'What are your class timings?',
    a: 'We run six sessions daily: 5:45 AM, 7:00 AM, 8:30 AM, 10:00 AM, 5:30 PM, and 7:00 PM on weekdays. Saturday runs until 6:00 PM; Sunday is a single morning session at 7:00 AM. Full timetable is on the Booking page.',
  },
  {
    q: 'How does membership work?',
    a: 'We offer class-based packs (10 or 20 classes valid for 3–6 months) and monthly memberships (Basic / Unlimited / Premium). All memberships include mat and props. Monthly plans auto-renew unless cancelled 7 days before your billing date.',
  },
  {
    q: 'Can I drop in for a single class?',
    a: 'Yes — drop-in is ₹650 per class, bookable up to 24 hours in advance via our Booking page or by WhatsApp. We cap all classes at 12 students, so we recommend booking ahead, especially for Steam Yoga and Candle Yoga which fill fast.',
  },
  {
    q: 'What should I bring?',
    a: 'For most classes: comfortable stretch clothing, a water bottle, and an open mind. Mats and all props are provided. For Steam Yoga, bring a small towel and change of clothing. For Ice Therapy, we provide everything — just arrive 10 minutes early for the briefing.',
  },
  {
    q: "I'm a complete beginner. Where do I start?",
    a: "Start with Hatha Basics (Tue/Thu/Sat, 8:30 AM) or Morning Flow (any weekday, 6:00 AM). Both are designed to be beginner-friendly. You're also welcome to message us before your first class — Ujwala often replies personally and can help match you to the right session.",
  },
]

function FaqItem({ item, isOpen, onToggle, reduced }: { item: typeof FAQS[0]; isOpen: boolean; onToggle: () => void; reduced: boolean }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(38,33,28,0.1)' }}>
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span
          className="text-sm font-medium leading-snug transition-colors duration-200 group-hover:opacity-70"
          style={{ color: '#26211c' }}
        >
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
          className="shrink-0"
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="#9a8a76" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: { duration: reduced ? 0 : 0.32, ease: EASE }, opacity: { duration: reduced ? 0 : 0.25 } }}
            style={{ overflow: 'hidden' }}
          >
            <p className="pb-5 text-sm leading-relaxed" style={{ color: '#6b5e52', fontWeight: 300 }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Contact() {
  const reduced = useReducedMotion()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main style={{ background: '#f7f2ea' }}>

      {/* ── Hero ───────────────────────── */}
      <section className="pt-36 md:pt-44 pb-14 md:pb-18 px-8 md:px-16 lg:px-24" aria-labelledby="contact-heading">
        <div className="max-w-6xl mx-auto">
          <motion.p
            className="text-xs uppercase tracking-[0.28em] mb-5"
            style={{ color: '#9a8a76' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get in Touch
          </motion.p>

          <motion.h1
            id="contact-heading"
            className="mb-5 leading-tight"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              color: '#26211c',
            }}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          >
            {"We'd Love to"}{' '}
            <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 300, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.62em', color: '#9a8a76' }}>
              Hear From You
            </span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: '#6b5e52', fontWeight: 300, maxWidth: 480 }}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            Questions about classes, membership, or your first visit — we respond to every message, usually within a few hours.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto mt-12" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />
      </section>

      {/* ── Form + Info ─────────────────── */}
      <section className="pb-24 md:pb-32 px-8 md:px-16 lg:px-24" aria-label="Contact form and studio information">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 lg:gap-20 items-start">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            <p className="text-[10px] uppercase tracking-[0.24em] mb-8" style={{ color: '#9a8a76' }}>Send a Message</p>
            <ContactForm reduced={reduced} />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          >
            <p className="text-[10px] uppercase tracking-[0.24em] mb-8" style={{ color: '#9a8a76' }}>Find Us</p>
            <InfoCard />
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────── */}
      <section
        className="py-20 md:py-28 px-8 md:px-16 lg:px-24"
        style={{ background: '#ede7da', borderTop: '1px solid rgba(38,33,28,0.1)' }}
        aria-labelledby="faq-heading"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">

          {/* FAQ label col */}
          <div className="lg:sticky lg:top-28 self-start">
            <motion.p
              className="text-[10px] uppercase tracking-[0.28em] mb-4"
              style={{ color: '#9a8a76' }}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
            >
              Common Questions
            </motion.p>
            <motion.h2
              id="faq-heading"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#26211c', lineHeight: 1.2 }}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: '#7a6b5d', fontWeight: 300 }}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.18 }}
            >
              Still have a question? Drop us a message using the form above.
            </motion.p>
          </div>

          {/* Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          >
            <div style={{ borderTop: '1px solid rgba(38,33,28,0.1)' }}>
              {FAQS.map((item, i) => (
                <FaqItem
                  key={i}
                  item={item}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  reduced={reduced}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
