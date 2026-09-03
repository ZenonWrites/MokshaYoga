import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const MARQUEE_TEXT = 'BOOK A CLASS  //  '
const REPEATED = MARQUEE_TEXT.repeat(14)

export default function AboutCTA() {

  const reduced = useReducedMotion()

  return (
    <>
      <section
        className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24 text-center overflow-hidden"
        style={{ background: '#26211c' }}
        aria-labelledby="about-cta-heading"
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(107,122,83,0.12) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.p
            className="text-xs uppercase tracking-[0.28em] mb-6"
            style={{ color: 'rgba(247,242,234,0.4)' }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to begin
          </motion.p>

          <motion.h2
            id="about-cta-heading"
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
                fontSize: 'clamp(0.75rem, 1.4vw, 1rem)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(247,242,234,0.5)',
                marginBottom: '0.4rem',
              }}
            >
              Your practice starts with
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(2rem, 5vw, 3.8rem)',
                color: '#f7f2ea',
                lineHeight: 1.1,
              }}
            >
              A single class
            </span>
          </motion.h2>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
          >
            <motion.div
              style={{ willChange: 'transform', display: 'inline-block' }}
              whileHover={reduced ? {} : { scale: 1.04 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
            >
              <Link
                to="/booking"
                className="inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-sm uppercase tracking-widest font-medium"
                style={{ background: '#6b7a53', color: 'white', transition: 'background 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#5c6b45')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#6b7a53')}
              >
                <span>Schedule a Class</span>
                <svg viewBox="0 0 16 16" className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 8h12M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>

            <Link
              to="/contact"
              className="text-sm uppercase tracking-widest font-light transition-opacity hover:opacity-60"
              style={{ color: 'rgba(247,242,234,0.5)', borderBottom: '1px solid rgba(247,242,234,0.2)', paddingBottom: 1 }}
            >
              Or get in touch
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Marquee strip */}
      <div
        className="overflow-hidden py-3.5"
        style={{ background: '#6b7a53' }}
        aria-hidden="true"
        onMouseEnter={(e) => {
          const track = e.currentTarget.querySelector('.about-marquee') as HTMLElement | null
          if (track) track.style.animationPlayState = 'paused'
        }}
        onMouseLeave={(e) => {
          const track = e.currentTarget.querySelector('.about-marquee') as HTMLElement | null
          if (track) track.style.animationPlayState = 'running'
        }}
      >
        <div
          className="about-marquee marquee-track whitespace-nowrap"
          style={{ animationPlayState: reduced ? 'paused' : 'running' }}
        >
          <span
            className="text-xs uppercase tracking-[0.28em]"
            style={{ color: 'rgba(247,242,234,0.65)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
          >
            {REPEATED}
          </span>
        </div>
      </div>
    </>
  )
}
