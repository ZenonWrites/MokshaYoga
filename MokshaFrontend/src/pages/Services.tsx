import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'
import FeaturedClass from '../components/FeaturedClass'
import ServicesPricing from '../components/ServicesPricing'
import ServicesClosingCTA from '../components/ServicesClosingCTA'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ──────────────────────────────────────────────────────────────────

type Category = 'YOGA' | 'FITNESS' | 'WELLNESS'
type Level = 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Personalised'

interface Service {
  id: number
  title: string
  desc: string
  category: Category
  level: Level
  duration: string
  photo: string
  alt: string
  featured?: boolean
}

const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Power Yoga',
    desc: 'Strength, stamina, and fire — a demanding flow that builds the body from the inside out.',
    category: 'YOGA',
    level: 'Advanced',
    duration: '60 min',
    photo: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&h=500&fit=crop&auto=format',
    alt: 'Woman in a deep floor backbend during Power Yoga class',
    featured: true,
  },
  {
    id: 2,
    title: 'Steam Yoga',
    desc: "Sātva's signature warm-room practice — heat opens the body twice as deep in half the time.",
    category: 'YOGA',
    level: 'All Levels',
    duration: '75 min',
    photo: 'https://images.unsplash.com/photo-1761755227421-b5e07efec0be?w=700&h=500&fit=crop&auto=format',
    alt: 'Misty sunrise over still water, evoking the warmth of Steam Yoga',
    featured: true,
  },
  {
    id: 3,
    title: 'Candle Yoga',
    desc: 'Soft candlelight, slow breath, and long-held postures — a ritual for the end of the day.',
    category: 'YOGA',
    level: 'All Levels',
    duration: '60 min',
    photo: 'https://images.unsplash.com/photo-1640095889747-2090ee12fa7d?w=700&h=500&fit=crop&auto=format',
    alt: 'A single candle flame glowing warmly in a quiet studio',
  },
  {
    id: 4,
    title: 'Pregnancy Yoga',
    desc: 'Medically informed, trimester-aware sequences that honour every stage of pregnancy.',
    category: 'YOGA',
    level: 'Beginner',
    duration: '50 min',
    photo: 'https://images.unsplash.com/photo-1711313530954-39421910bc82?w=700&h=500&fit=crop&auto=format',
    alt: 'Pregnant woman cradling her belly in a moment of quiet connection',
  },
  {
    id: 5,
    title: 'Posture Correction',
    desc: 'Structural alignment work that undoes the patterns of a screen-forward modern life.',
    category: 'FITNESS',
    level: 'All Levels',
    duration: '45 min',
    photo: 'https://images.unsplash.com/photo-1706353399656-210cca727a33?w=700&h=500&fit=crop&auto=format',
    alt: 'Therapist working on a student\'s back alignment',
  },
  {
    id: 6,
    title: 'Aerobics',
    desc: 'High-energy cardio sequences that raise the heart rate and lift the mood in equal measure.',
    category: 'FITNESS',
    level: 'All Levels',
    duration: '60 min',
    photo: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=700&h=500&fit=crop&auto=format',
    alt: 'Group of women in a vibrant aerobics class in front of a mirror',
  },
  {
    id: 7,
    title: 'Zumba',
    desc: 'Latin-inspired dance fitness that feels like a party and works like a workout.',
    category: 'FITNESS',
    level: 'All Levels',
    duration: '60 min',
    photo: 'https://images.unsplash.com/photo-1527933053326-89d1746b76b9?w=700&h=500&fit=crop&auto=format',
    alt: 'Woman in motion during a high-energy Zumba class',
  },
  {
    id: 8,
    title: 'Ice Therapy',
    desc: 'Cold-immersion recovery that reduces inflammation, sharpens focus, and resets the system.',
    category: 'WELLNESS',
    level: 'All Levels',
    duration: '30 min',
    photo: 'https://images.unsplash.com/photo-1712161321522-c24f686e4ace?w=700&h=500&fit=crop&auto=format',
    alt: 'A bucket filled with ice for cold immersion therapy',
  },
  {
    id: 9,
    title: 'Detox Juices',
    desc: 'Cold-pressed, Ayurveda-inspired blends designed around your constitution and goals.',
    category: 'WELLNESS',
    level: 'All Levels',
    duration: 'Daily',
    photo: 'https://images.unsplash.com/photo-1610622930110-3c076902312a?w=700&h=500&fit=crop&auto=format',
    alt: 'A glass of vibrant green detox juice held in natural light',
  },
  {
    id: 10,
    title: 'Diet Plans',
    desc: 'Personalised nutritional guidance that works alongside your yoga practice, not against it.',
    category: 'WELLNESS',
    level: 'Personalised',
    duration: 'Ongoing',
    photo: 'https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=700&h=500&fit=crop&auto=format',
    alt: 'Meal prep containers filled with colourful whole foods',
  },
]

const TABS = ['ALL', 'YOGA', 'FITNESS', 'WELLNESS'] as const
type Tab = typeof TABS[number]

const LEVEL_STYLE: Record<Level, { bg: string; color: string }> = {
  'All Levels': { bg: 'rgba(107,122,83,0.12)', color: '#5c6b45' },
  'Beginner': { bg: 'rgba(184,163,132,0.18)', color: '#7a6340' },
  'Intermediate': { bg: 'rgba(154,138,118,0.15)', color: '#5e4e38' },
  'Advanced': { bg: 'rgba(38,33,28,0.09)', color: '#3a3028' },
  'Personalised': { bg: 'rgba(107,122,83,0.18)', color: '#4a5a35' },
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ─── Service card ───────────────────────────────────────────────────────────

function ServiceCard({ service, index, revealed }: { service: Service; index: number; revealed: boolean }) {
  const reduced = useReducedMotion()

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{
        layout: { duration: 0.35, ease: EASE },
        opacity: { duration: 0.45, ease: EASE, delay: revealed ? index * 0.065 : 0 },
        y: { duration: 0.45, ease: EASE, delay: revealed ? index * 0.065 : 0 },
        scale: { duration: 0.3 },
      }}
      className="group relative flex flex-col overflow-hidden"
      style={{
        borderRadius: 20,
        background: '#fcf9f4',
        border: '1px solid rgba(38,33,28,0.08)',
        boxShadow: '0 2px 12px rgba(38,33,28,0.05)',
      }}
      whileHover={reduced ? {} : { y: -4, boxShadow: '0 12px 36px rgba(38,33,28,0.11)' }}
    >
      {/* Photo */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/2', background: '#ddd5c8' }}>
        <motion.img
          src={service.photo}
          alt={service.alt}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          whileHover={reduced ? {} : { scale: 1.06 }}
          transition={{ duration: 0.65, ease: EASE }}
        />
        {/* Category tag */}
        <div
          className="absolute top-3.5 left-3.5 rounded-full px-3 py-1 text-[9px] uppercase tracking-widest"
          style={{ background: 'rgba(247,242,234,0.9)', color: '#6b7a53', backdropFilter: 'blur(4px)' }}
        >
          {service.category}
        </div>
        {/* Featured dot */}
        {service.featured && (
          <div
            className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full"
            style={{ background: '#6b7a53' }}
            title="Featured class"
            aria-label="Featured class"
          />
        )}
        {/* Hover book overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(26,22,18,0.55)' }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          aria-hidden="true"
        >
          <Link
            to="/booking"
            className="rounded-full px-6 py-2.5 text-xs uppercase tracking-widest font-medium pointer-events-auto"
            style={{ background: '#f7f2ea', color: '#26211c' }}
            tabIndex={-1}
          >
            Book Now
          </Link>
        </motion.div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 pt-4">
        <h3
          className="mb-1.5 leading-snug"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '1.15rem',
            color: '#26211c',
          }}
        >
          {service.title}
        </h3>
        <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: '#7a6b5d', fontWeight: 300 }}>
          {service.desc}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider"
            style={{ background: LEVEL_STYLE[service.level].bg, color: LEVEL_STYLE[service.level].color }}
          >
            {service.level}
          </span>
          <span className="text-[10px] uppercase tracking-wider" style={{ color: '#b5a898' }}>·</span>
          <span className="text-[10px] uppercase tracking-wider" style={{ color: '#9a8a76' }}>
            {service.duration}
          </span>
        </div>
      </div>

      {/* Bottom link */}
      <div
        className="px-5 pb-4 pt-0 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(38,33,28,0.07)', paddingTop: '0.75rem' }}
      >
        <Link
          to="/booking"
          className="text-xs uppercase tracking-wider transition-opacity duration-200 hover:opacity-60"
          style={{ color: '#6b7a53' }}
          aria-label={`Book ${service.title}`}
        >
          Book this class →
        </Link>
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 opacity-30" fill="none" stroke="#26211c" strokeWidth="1.3">
          <path d="M4 12L12 4M12 4H6M12 4v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.article>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Services() {
  const [activeFilter, setActiveFilter] = useState<Tab>('ALL')
  const [revealed, setRevealed] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const filtered = activeFilter === 'ALL'
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeFilter)

  // GSAP ScrollTrigger — reveal grid on scroll entry
  useEffect(() => {
    if (!gridRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: 'top 82%',
        once: true,
        onEnter: () => setRevealed(true),
      })
    })
    // If already in view (short viewport or no scroll needed)
    if (gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.9) setRevealed(true)
    }
    return () => ctx.revert()
  }, [])

  // Re-trigger reveal on filter change so new cards animate in
  const handleFilterChange = (tab: Tab) => {
    if (tab === activeFilter) return
    // Briefly hide then reveal so cards re-animate
    setRevealed(false)
    setActiveFilter(tab)
    requestAnimationFrame(() => requestAnimationFrame(() => setRevealed(true)))
  }

  return (
    <main style={{ background: '#f7f2ea' }}>

      {/* ── Hero ───────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="pt-36 md:pt-44 pb-16 md:pb-20 px-8 md:px-16 lg:px-24"
        aria-labelledby="services-hero-heading"
      >
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <motion.p
              className="text-xs uppercase tracking-[0.28em] mb-6"
              style={{ color: '#9a8a76' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              What We Offer
            </motion.p>

            <motion.h1
              id="services-hero-heading"
              className="mb-6 leading-[1.08]"
              style={{
                color: '#26211c',
                fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 300,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontSize: '0.48em',
                  color: '#9a8a76',
                  marginBottom: '0.5rem',
                }}
              >
                Every Body.
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                Every Practice.
              </span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: '#6b5e52', fontWeight: 300, maxWidth: 520 }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            >
              Ten disciplines under one roof — from dynamic Power Yoga to restorative Ice Therapy. Each one designed to work alone and amplify the others.
            </motion.p>
          </div>

          {/* Stat strip */}
          <motion.div
            className="mt-12 flex flex-wrap gap-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          >
            {[
              { value: '10', label: 'Disciplines' },
              { value: '6', label: 'Daily Classes' },
              { value: '12', label: 'Max per Class' },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2.5">
                <span
                  style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '2rem', color: '#26211c', lineHeight: 1 }}
                >
                  {s.value}
                </span>
                <span className="text-xs uppercase tracking-[0.18em]" style={{ color: '#9a8a76' }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hairline */}
        <div className="mt-14 max-w-6xl mx-auto" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />
      </section>

      {/* ── Filter + Grid ──────────────────────────────── */}
      <section className="pb-28 md:pb-36 px-8 md:px-16 lg:px-24" aria-label="Services catalogue">
        <div className="max-w-6xl mx-auto">

          {/* Filter tab bar */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-12">
            <div
              role="group"
              aria-label="Filter services by category"
              className="inline-flex rounded-full p-1.5 gap-0.5"
              style={{ background: 'rgba(38,33,28,0.06)' }}
            >
              {TABS.map((tab) => {
                const active = activeFilter === tab
                return (
                  <button
                    key={tab}
                    onClick={() => handleFilterChange(tab)}
                    className="relative px-5 py-2 text-xs uppercase tracking-widest rounded-full transition-colors duration-200"
                    style={{ color: active ? '#f7f2ea' : '#7a6b5d', zIndex: 1 }}
                    aria-pressed={active}
                  >
                    {active && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: '#26211c' }}
                        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative" style={{ zIndex: 2 }}>{tab}</span>
                    {/* Card count badge */}
                    <span
                      className="relative ml-1.5 text-[9px] opacity-50"
                      style={{ zIndex: 2 }}
                      aria-hidden="true"
                    >
                      {tab === 'ALL' ? SERVICES.length : SERVICES.filter((s) => s.category === tab).length}
                    </span>
                  </button>
                )
              })}
            </div>

            <p className="text-xs uppercase tracking-[0.18em]" style={{ color: '#9a8a76' }}>
              {filtered.length} {filtered.length === 1 ? 'service' : 'services'}
            </p>
          </div>

          {/* Card grid */}
          <motion.div
            ref={gridRef}
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((service, i) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={i}
                  revealed={revealed}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                className="py-24 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-xs uppercase tracking-[0.22em] mb-3" style={{ color: '#9a8a76' }}>No results</p>
                <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#26211c', fontSize: '1.4rem' }}>
                  No services in this category yet.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA */}
          <motion.div
            className="mt-20 flex flex-col md:flex-row items-center justify-between gap-6 pt-10"
            style={{ borderTop: '1px solid rgba(38,33,28,0.1)' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.22em] mb-2" style={{ color: '#9a8a76' }}>
                Not sure where to start?
              </p>
              <p
                style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.35rem', color: '#26211c' }}
              >
                We'll find the right fit together.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full px-6 py-3 text-xs uppercase tracking-widest transition-all duration-200"
                style={{ border: '1px solid rgba(38,33,28,0.2)', color: '#26211c' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#26211c'; (e.currentTarget as HTMLElement).style.color = '#f7f2ea' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#26211c' }}
              >
                Get in Touch
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs uppercase tracking-widest font-medium transition-colors duration-200"
                style={{ background: '#6b7a53', color: 'white' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#5c6b45')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#6b7a53')}
              >
                Book a Class
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <FeaturedClass />
      <ServicesPricing />
      <ServicesClosingCTA />
    </main>
  )
}
