import { useCallback, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const SLIDES = [
  {
    id: 1,
    photo: 'https://images.unsplash.com/photo-1761034114091-6d30447e25aa?w=1200&h=760&fit=crop&auto=format',
    alt: 'Yoga instructor guiding a student into downward dog pose in warm studio light',
    label: 'Personal Guidance',
    caption: 'Every student receives hands-on adjustments throughout the session.',
    type: 'steam-yoga',
  },
  {
    id: 2,
    photo: 'https://images.unsplash.com/photo-1787647089977-3db9bf565328?w=1200&h=760&fit=crop&auto=format',
    alt: 'Group of students on yoga mats in a bright open studio',
    label: 'Community Practice',
    caption: "Twelve students — small enough that everyone's progress is noticed.",
    type: 'steam-yoga',
  },
  {
    id: 3,
    photo: 'https://images.unsplash.com/photo-1787647089905-2a7d6a087ee8?w=1200&h=760&fit=crop&auto=format',
    alt: 'Students holding tree pose together in the Sātva studio',
    label: 'Balance & Focus',
    caption: 'Heat sharpens proprioception — balance postures feel distinctly different in steam.',
    type: 'steam-yoga',
  },
  {
    id: 4,
    photo: 'https://images.unsplash.com/photo-1787647090307-706df57182d3?w=1200&h=760&fit=crop&auto=format',
    alt: 'Students stretching deeply on mats in the studio',
    label: 'Deep Release',
    caption: 'Warm muscles lengthen safely to ranges cold practice rarely reaches.',
    type: 'steam-yoga',
  },
  {
    id: 5,
    photo: 'https://images.unsplash.com/photo-1787647089977-b3e9a82565f5?w=1200&h=760&fit=crop&auto=format',
    alt: 'Three students in warrior pose with arms extended wide',
    label: 'Strength & Expansion',
    caption: 'Standing sequences build the heat that steam maintains — power doubled.',
    type: 'steam-yoga',
  },
]

const SLIDE_GAP = 16

function pad(n: number) { return String(n).padStart(2, '0') }

export default function FeaturedClass() {
  const [idx, setIdx] = useState(0)
  const x = useMotionValue(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(next, SLIDES.length - 1))
    setIdx(clamped)
    const containerW = containerRef.current?.offsetWidth ?? 800
    animate(x, -(clamped * (containerW + SLIDE_GAP)), {
      type: 'spring', stiffness: 280, damping: 34,
    })
  }, [x])

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const containerW = containerRef.current?.offsetWidth ?? 800
    const threshold = containerW * 0.18
    if (info.offset.x < -threshold || info.velocity.x < -300) goTo(idx + 1)
    else if (info.offset.x > threshold || info.velocity.x > 300) goTo(idx - 1)
    else goTo(idx)
  }

  const slide = SLIDES[idx]

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: '#26211c' }}
      aria-labelledby="featured-heading"
    >
      <div className="px-8 md:px-16 lg:px-24 max-w-6xl mx-auto mb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.p
              className="text-xs uppercase tracking-[0.28em] mb-4"
              style={{ color: 'rgba(247,242,234,0.4)' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured Class
            </motion.p>
            <motion.h2
              id="featured-heading"
              className="leading-tight"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.8rem)',
                color: '#f7f2ea',
              }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            >
              Steam Yoga —{' '}
              <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.72em', color: 'rgba(247,242,234,0.55)' }}>
                Our Signature
              </span>
            </motion.h2>
          </div>

          {/* Counter + arrows */}
          <motion.div
            className="flex items-center gap-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm tabular-nums" style={{ color: 'rgba(247,242,234,0.4)' }}>
              <span style={{ color: '#f7f2ea', fontWeight: 500 }}>{pad(idx + 1)}</span>
              <span className="mx-1">/</span>
              {pad(SLIDES.length)}
            </span>
            <div className="flex gap-2">
              {(['prev', 'next'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => goTo(d === 'prev' ? idx - 1 : idx + 1)}
                  disabled={(d === 'prev' && idx === 0) || (d === 'next' && idx === SLIDES.length - 1)}
                  className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 disabled:opacity-20"
                  style={{ borderColor: 'rgba(247,242,234,0.2)', color: '#f7f2ea' }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) (e.currentTarget as HTMLElement).style.background = 'rgba(247,242,234,0.1)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  aria-label={d === 'prev' ? 'Previous slide' : 'Next slide'}
                >
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {d === 'prev'
                      ? <path d="M10 4L6 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
                      : <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Description */}
        <motion.p
          className="mt-6 text-sm leading-relaxed"
          style={{ color: 'rgba(247,242,234,0.55)', maxWidth: 500, fontWeight: 300 }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Practised in a room held at 38–40°C, Steam Yoga accelerates muscle opening, flushes toxins through sweat, and creates a meditative intensity unlike any room-temperature class. Our most-requested session — available Tuesday and Thursday mornings, Saturday evenings.
        </motion.p>
      </div>

      {/* Carousel */}
      <div className="px-8 md:px-16 lg:px-24" ref={containerRef}>
        <div className="overflow-hidden" style={{ borderRadius: 22 }}>
          <motion.div
            ref={trackRef}
            className="flex"
            style={{ x, gap: SLIDE_GAP, cursor: 'grab' }}
            drag="x"
            dragConstraints={{ left: -(SLIDES.length - 1) * 1200, right: 0 }}
            dragElastic={0.06}
            onDragEnd={handleDragEnd}
            whileDrag={{ cursor: 'grabbing' }}
            aria-label="Featured class photo carousel"
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className="relative shrink-0 w-full overflow-hidden"
                style={{ borderRadius: 20, aspectRatio: '16/9', background: '#3a3028', minWidth: 0 }}
                role="group"
                aria-label={`Slide ${i + 1}: ${slide.label}`}
              >
                <img
                  src={slide.photo}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(18,14,10,0.75) 0%, transparent 55%)' }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Slide info + CTA */}
      <div className="px-8 md:px-16 lg:px-24 max-w-6xl mx-auto mt-7">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] mb-1" style={{ color: 'rgba(247,242,234,0.4)' }}>
              {slide.label}
            </p>
            <p className="text-sm" style={{ color: 'rgba(247,242,234,0.65)', fontWeight: 300, maxWidth: 460 }}>
              {slide.caption}
            </p>
          </div>

          <Link
            to={`/booking?type=${slide.type}`}
            className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-xs uppercase tracking-widest font-medium transition-colors duration-200"
            style={{ background: '#6b7a53', color: 'white' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#5c6b45')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#6b7a53')}
          >
            <span>Book Now</span>
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 8h12M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>

        {/* Dot indicators */}
        <div className="flex gap-1.5 mt-6" role="tablist" aria-label="Slide navigation">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Go to slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                height: 4,
                width: i === idx ? 24 : 4,
                background: i === idx ? '#6b7a53' : 'rgba(247,242,234,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
