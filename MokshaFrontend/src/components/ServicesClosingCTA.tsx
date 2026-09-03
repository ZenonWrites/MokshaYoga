import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const MARQUEE_TEXT = 'FIND YOUR PRACTICE  //  '
const REPEATED = MARQUEE_TEXT.repeat(12)

export default function ServicesClosingCTA() {
  const reduced = useReducedMotion()

  return (
    <>
      <section
        className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24 text-center"
        style={{ background: '#f7f2ea', borderTop: '1px solid rgba(38,33,28,0.1)' }}
        aria-labelledby="services-cta-heading"
      >
        {/* Radial accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(107,122,83,0.07) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-2xl mx-auto">
          <motion.p
            className="text-xs uppercase tracking-[0.28em] mb-5"
            style={{ color: '#9a8a76' }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Start today
          </motion.p>

          <motion.h2
            id="services-cta-heading"
            className="mb-8 leading-tight"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontWeight: 300,
                fontSize: 'clamp(0.7rem, 1.3vw, 0.95rem)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#9a8a76',
                marginBottom: '0.5rem',
              }}
            >
              The right practice is already waiting.
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(2rem, 5vw, 3.6rem)',
                color: '#26211c',
                lineHeight: 1.1,
              }}
            >
              Your first class is one step away.
            </span>
          </motion.h2>

          <motion.p
            className="mb-10 text-base leading-relaxed"
            style={{ color: '#6b5e52', fontWeight: 300 }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.18 }}
          >
            Browse the timetable, pick a session that suits your schedule, and walk in. No experience necessary for most classes — just show up.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.25, ease: EASE }}
          >
            <motion.div whileHover={reduced ? {} : { scale: 1.03 }} whileTap={reduced ? {} : { scale: 0.97 }}>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-sm uppercase tracking-widest font-medium transition-colors duration-200"
                style={{ background: '#26211c', color: '#f7f2ea' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#6b7a53')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#26211c')}
              >
                <span>Book Your Class</span>
                <svg viewBox="0 0 16 16" className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 8h12M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>

            <Link
              to="/about"
              className="text-sm uppercase tracking-widest transition-opacity hover:opacity-60"
              style={{ color: '#9a8a76', borderBottom: '1px solid rgba(154,138,118,0.4)', paddingBottom: 1 }}
            >
              Learn about us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div
        className="overflow-hidden py-3.5"
        style={{ background: '#26211c' }}
        aria-hidden="true"
        onMouseEnter={(e) => {
          const t = e.currentTarget.querySelector('.services-marquee') as HTMLElement | null
          if (t) t.style.animationPlayState = 'paused'
        }}
        onMouseLeave={(e) => {
          const t = e.currentTarget.querySelector('.services-marquee') as HTMLElement | null
          if (t) t.style.animationPlayState = 'running'
        }}
      >
        <div
          className="services-marquee marquee-track whitespace-nowrap"
          style={{ animationPlayState: reduced ? 'paused' : 'running' }}
        >
          <span
            className="text-xs uppercase tracking-[0.28em]"
            style={{ color: 'rgba(247,242,234,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
          >
            {REPEATED}
          </span>
        </div>
      </div>
    </>
  )
}
