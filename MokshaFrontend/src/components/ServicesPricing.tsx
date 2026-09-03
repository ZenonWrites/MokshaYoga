import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Mode = 'class' | 'monthly'

interface Plan {
  id: string
  name: string
  price: string
  unit: string
  sub?: string
  features: string[]
  popular?: boolean
  cta: string
}

const CLASS_PLANS: Plan[] = [
  {
    id: 'dropin',
    name: 'Drop-In',
    price: '₹650',
    unit: 'per class',
    sub: 'No commitment required',
    features: [
      'Single class of your choice',
      'Valid for any discipline',
      'Booking up to 24 hrs ahead',
      'Mat and props included',
    ],
    cta: 'Book a Class',
  },
  {
    id: 'pack10',
    name: '10-Class Pack',
    price: '₹520',
    unit: 'per class',
    sub: '₹5,200 total · save 20%',
    features: [
      'Any 10 classes, any discipline',
      'Valid for 3 months',
      'Priority booking access',
      'Mat and props included',
      'One free nutrition consult',
    ],
    popular: true,
    cta: 'Get the Pack',
  },
  {
    id: 'pack20',
    name: '20-Class Pack',
    price: '₹450',
    unit: 'per class',
    sub: '₹9,000 total · save 31%',
    features: [
      'Any 20 classes, any discipline',
      'Valid for 6 months',
      'Priority + guest booking',
      'Mat and props included',
      'Monthly nutrition check-in',
      'Free steam yoga session',
    ],
    cta: 'Best Value',
  },
]

const MONTHLY_PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹2,500',
    unit: 'per month',
    sub: '8 classes per month',
    features: [
      '8 classes, any discipline',
      'Weekday morning sessions',
      'Mat and props included',
      'Access to class recordings',
    ],
    cta: 'Start Basic',
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: '₹4,500',
    unit: 'per month',
    sub: 'Unlimited classes · most popular',
    features: [
      'Unlimited classes, all disciplines',
      'All time slots including weekends',
      'Priority booking always',
      'Mat, props, and steam access',
      'Monthly nutrition consult',
      'Guest pass (1/month)',
    ],
    popular: true,
    cta: 'Go Unlimited',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹7,000',
    unit: 'per month',
    sub: 'Unlimited + full wellness support',
    features: [
      'Everything in Unlimited',
      'Weekly private session (1:1)',
      'Personalised diet plan',
      'Ice therapy access',
      'Detox juice programme',
      'Priority WhatsApp support',
    ],
    cta: 'Go Premium',
  },
]

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l3.5 3.5L13 4.5" />
    </svg>
  )
}

function PlanCard({ plan, delay, reduced }: { plan: Plan; delay: number; reduced: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      className="relative flex flex-col"
      style={{
        borderRadius: 20,
        border: plan.popular ? '1.5px solid #6b7a53' : '1px solid rgba(38,33,28,0.1)',
        background: plan.popular ? '#26211c' : '#fcf9f4',
        boxShadow: plan.popular ? '0 16px 48px rgba(38,33,28,0.16)' : '0 2px 12px rgba(38,33,28,0.04)',
      }}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div
          className="absolute -top-3.5 left-1/2 rounded-full px-4 py-1"
          style={{ transform: 'translateX(-50%)', background: '#6b7a53', color: 'white' }}
        >
          <p className="text-[10px] uppercase tracking-widest whitespace-nowrap">Most Popular</p>
        </div>
      )}

      <div className="p-7 pb-5">
        {/* Plan name */}
        <p
          className="text-xs uppercase tracking-[0.22em] mb-4"
          style={{ color: plan.popular ? 'rgba(247,242,234,0.5)' : '#9a8a76' }}
        >
          {plan.name}
        </p>

        {/* Price */}
        <div className="mb-1">
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '2.4rem',
              color: plan.popular ? '#f7f2ea' : '#26211c',
              lineHeight: 1,
            }}
          >
            {plan.price}
          </span>
        </div>
        <p className="text-xs mb-1" style={{ color: plan.popular ? 'rgba(247,242,234,0.45)' : '#9a8a76' }}>
          {plan.unit}
        </p>
        {plan.sub && (
          <p className="text-xs mb-6" style={{ color: plan.popular ? 'rgba(247,242,234,0.35)' : '#b5a898' }}>
            {plan.sub}
          </p>
        )}

        {/* Hairline */}
        <div style={{ height: 1, background: plan.popular ? 'rgba(247,242,234,0.1)' : 'rgba(38,33,28,0.09)', marginBottom: '1.5rem' }} aria-hidden="true" />

        {/* Features */}
        <ul className="flex flex-col gap-3 mb-7" aria-label={`${plan.name} features`}>
          {plan.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2.5 text-xs leading-relaxed"
              style={{ color: plan.popular ? 'rgba(247,242,234,0.72)' : '#6b5e52' }}
            >
              <span style={{ color: plan.popular ? '#6b7a53' : '#8a9a6a' }}>
                <CheckIcon />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-7 pb-7 mt-auto">
        <Link
          to="/booking"
          className="block w-full text-center rounded-full py-3.5 text-xs uppercase tracking-widest font-medium transition-all duration-200"
          style={
            plan.popular
              ? { background: '#6b7a53', color: 'white' }
              : { border: '1px solid rgba(38,33,28,0.18)', color: '#26211c', background: 'transparent' }
          }
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            if (plan.popular) { el.style.background = '#5c6b45' }
            else { el.style.background = '#26211c'; el.style.color = '#f7f2ea' }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            if (plan.popular) { el.style.background = '#6b7a53' }
            else { el.style.background = 'transparent'; el.style.color = '#26211c' }
          }}
        >
          {plan.cta}
        </Link>
      </div>
    </motion.div>
  )
}

export default function ServicesPricing() {
  const [mode, setMode] = useState<Mode>('class')
  const reduced = useReducedMotion()
  const plans = mode === 'class' ? CLASS_PLANS : MONTHLY_PLANS

  return (
    <section
      className="py-24 md:py-32 px-8 md:px-16 lg:px-24"
      style={{ background: '#ede7da' }}
      aria-labelledby="pricing-heading"
    >
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            className="text-xs uppercase tracking-[0.28em] mb-4"
            style={{ color: '#9a8a76' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Membership
          </motion.p>
          <motion.h2
            id="pricing-heading"
            className="mb-10"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              color: '#26211c',
              lineHeight: 1.15,
            }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            Pricing &{' '}
            <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 300, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.78em' }}>
              Membership
            </span>
          </motion.h2>

          {/* Toggle */}
          <motion.div
            className="inline-flex rounded-full p-1.5 gap-0.5"
            style={{ background: 'rgba(38,33,28,0.07)' }}
            role="group"
            aria-label="Pricing mode"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {([
              { key: 'class', label: 'Class-based' },
              { key: 'monthly', label: 'Monthly' },
            ] as { key: Mode; label: string }[]).map(({ key, label }) => {
              const active = mode === key
              return (
                <button
                  key={key}
                  onClick={() => setMode(key)}
                  className="relative px-6 py-2.5 text-xs uppercase tracking-widest rounded-full transition-colors duration-200"
                  style={{ color: active ? '#f7f2ea' : '#7a6b5d', zIndex: 1 }}
                  aria-pressed={active}
                >
                  {active && (
                    <motion.span
                      layoutId="pricing-toggle"
                      className="absolute inset-0 rounded-full"
                      style={{ background: '#26211c' }}
                      transition={{ type: 'spring', stiffness: 340, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative" style={{ zIndex: 2 }}>{label}</span>
                </button>
              )
            })}
          </motion.div>

          {mode === 'monthly' && (
            <motion.p
              className="mt-4 text-xs"
              style={{ color: '#9a8a76' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              All monthly plans include unlimited studio access to props and mats.
            </motion.p>
          )}
        </div>

        {/* Plan cards */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          style={{ paddingTop: '0.75rem' }} // space for popular badge
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                delay={i * 0.09}
                reduced={reduced}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          className="text-center mt-10 text-xs leading-relaxed"
          style={{ color: '#b5a898' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          All prices include GST. Packs are non-transferable and non-refundable after first use.{' '}
          <Link to="/contact" className="underline underline-offset-2 transition-opacity hover:opacity-60">
            Contact us
          </Link>{' '}
          for corporate and group rates.
        </motion.p>
      </div>
    </section>
  )
}
