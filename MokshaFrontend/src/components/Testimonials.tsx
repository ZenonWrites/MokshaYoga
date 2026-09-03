import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rekha Mahajan',
    role: 'Marketing Manager · Member since 2022',
    photo: 'https://images.unsplash.com/photo-1662850886700-4ec19bd30d11?w=400&h=500&fit=crop&auto=format',
    quote: 'After fifteen years of lower back pain and three failed physiotherapy courses, I walked into Sātva half-believing anything could help. Within eight weeks, I slept through the night without waking in pain for the first time I can remember. Ujwala did not treat my spine — she taught me how to live inside my body again.',
    condition: 'Chronic Back Pain',
  },
  {
    id: 2,
    name: 'Sunita Parab',
    role: 'School Teacher · Member since 2021',
    photo: 'https://images.unsplash.com/photo-1669844444850-5acd7e8c71c5?w=400&h=500&fit=crop&auto=format',
    quote: 'My doctor told me to manage my PCOD with medication for life. I decided to also try yoga. Six months of consistent practice at Sātva — the hormonal shifts were visible in my blood reports. My gynaecologist asked what I had changed. I said I had started breathing properly.',
    condition: 'PCOD Management',
  },
  {
    id: 3,
    name: 'Divya Kulkarni',
    role: 'Software Engineer · Member since 2023',
    photo: 'https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?w=400&h=500&fit=crop&auto=format',
    quote: 'I had been living with vertigo for two years — sudden spells that would floor me mid-meeting. Kavita worked with me on vestibular balance sequences, very gently, over four months. The spells reduced to once a month, then once in three months. I have not had an episode in six months.',
    condition: 'Vertigo Recovery',
  },
  {
    id: 4,
    name: 'Nandita Rao',
    role: 'Homemaker · Member since 2022',
    photo: 'https://images.unsplash.com/photo-1562337404-3044c84ac061?w=400&h=500&fit=crop&auto=format',
    quote: "Eighteen kilograms over two years — not through any crash programme, but through understanding what my body needed. Ananya's Power Yoga built the muscle; Meera's evening meditation stopped the emotional eating. No diet, no deprivation. Just a relationship with my body that I had never had before.",
    condition: 'Weight & Wellbeing',
  },
  {
    id: 5,
    name: 'Farida Shaikh',
    role: 'Retired Principal · Member since 2020',
    photo: 'https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?w=400&h=500&fit=crop&auto=format',
    quote: 'At sixty-three, I came in expecting to be told I was too old. Instead, Priya met me exactly where I was and built a practice around my needs. My bone density scan improved at my last check-up. My cardiologist says my resting heart rate is better than patients half my age.',
    condition: 'Healthy Ageing',
  },
]

function pad(n: number) { return String(n).padStart(2, '0') }

export default function Testimonials() {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const reduced = useReducedMotion()
  const t = TESTIMONIALS[idx]

  const go = (next: number) => {
    setDir(next > idx ? 1 : -1)
    setIdx(next)
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * -24 }),
  }

  return (
    <section
      className="relative py-28 md:py-36 px-8 md:px-16 lg:px-24"
      style={{ background: '#f7f2ea' }}
      aria-labelledby="testimonials-heading"
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: '#9a8a76' }}>Member Stories</p>
            <h2
              id="testimonials-heading"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#26211c', lineHeight: 1.15 }}
            >
              Stories of{' '}
              <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 300, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.8em' }}>
                Transformation
              </span>
            </h2>
          </div>

          {/* Counter + arrows */}
          <div className="flex items-center gap-5">
            <span className="text-sm tabular-nums" style={{ color: '#9a8a76' }}>
              <span style={{ color: '#26211c', fontWeight: 500 }}>{pad(idx + 1)}</span>
              <span className="mx-1">/</span>
              {pad(TESTIMONIALS.length)}
            </span>
            <div className="flex gap-2">
              {(['prev', 'next'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => go(d === 'prev' ? Math.max(0, idx - 1) : Math.min(TESTIMONIALS.length - 1, idx + 1))}
                  disabled={(d === 'prev' && idx === 0) || (d === 'next' && idx === TESTIMONIALS.length - 1)}
                  className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 disabled:opacity-25"
                  style={{ borderColor: 'rgba(38,33,28,0.2)', color: '#26211c' }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) { (e.currentTarget as HTMLElement).style.background = '#26211c'; (e.currentTarget as HTMLElement).style.color = '#f7f2ea' } }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#26211c' }}
                  aria-label={d === 'prev' ? 'Previous story' : 'Next story'}
                >
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {d === 'prev'
                      ? <path d="M10 4L6 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
                      : <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main panel */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={t.id}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.32, 0, 0.28, 1] }}
            className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-start"
          >
            {/* Client photo */}
            <div className="relative shrink-0">
              <div
                className="overflow-hidden"
                style={{ borderRadius: 20, aspectRatio: '4/5', background: '#e0d7ca' }}
              >
                <img
                  src={t.photo}
                  alt={`Portrait of ${t.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {/* Condition tag */}
              <div
                className="absolute -bottom-4 left-4 rounded-full px-4 py-2"
                style={{ background: '#6b7a53', color: 'white', boxShadow: '0 4px 16px rgba(107,122,83,0.3)' }}
              >
                <p className="text-[10px] uppercase tracking-widest">{t.condition}</p>
              </div>
            </div>

            {/* Quote panel */}
            <div className="pt-2 md:pt-4">
              {/* Large opening quote mark */}
              <p
                className="leading-none mb-4 select-none"
                style={{ fontFamily: 'var(--font-serif)', fontSize: '5rem', color: 'rgba(107,122,83,0.18)', lineHeight: 1, marginTop: -16 }}
                aria-hidden="true"
              >
                "
              </p>

              <blockquote
                className="text-lg md:text-xl leading-relaxed mb-8"
                style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#3a3028', fontWeight: 400 }}
              >
                {t.quote}
              </blockquote>

              <div style={{ height: 1, background: 'rgba(38,33,28,0.1)', marginBottom: '1.5rem' }} aria-hidden="true" />

              <div>
                <p className="font-medium text-sm" style={{ color: '#26211c' }}>{t.name}</p>
                <p className="text-xs mt-1" style={{ color: '#9a8a76', fontWeight: 300 }}>{t.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-12" role="tablist" aria-label="Testimonial navigation">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Go to story ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 24 : 6,
                height: 6,
                background: i === idx ? '#6b7a53' : 'rgba(38,33,28,0.18)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
