import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useMagneticButton } from '../hooks/useMagneticCursor'
import { useReducedMotion } from '../hooks/useReducedMotion'

const CTA_IMG = 'https://images.unsplash.com/photo-1486707471592-8e7eb7e36f78?w=1800&h=1100&fit=crop&auto=format'

const MARQUEE_TEXT = 'START YOUR JOURNEY  //  '
const REPEATED = MARQUEE_TEXT.repeat(12)

export default function ClosingCTA() {
  const ctaRef = useMagneticButton()
  const reduced = useReducedMotion()
  const marqueeRef = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* Dark hero CTA */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ minHeight: '88vh', background: '#1a1612' }}
        aria-labelledby="cta-heading"
      >
        {/* Background photo */}
        <img
          src={CTA_IMG}
          alt="Misty ancient forest at dawn, a path disappearing into the fog"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.45 }}
          loading="lazy"
          decoding="async"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(18,14,10,0.5) 0%, rgba(18,14,10,0.3) 50%, rgba(18,14,10,0.75) 100%)' }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 px-8 md:px-16 max-w-4xl mx-auto">
          <motion.p
            className="text-xs uppercase tracking-[0.28em] mb-8"
            style={{ color: 'rgba(247,242,234,0.45)' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Your practice awaits
          </motion.p>

          <motion.h2
            id="cta-heading"
            className="mb-10 leading-[1.08]"
            style={{
              color: '#f7f2ea',
              fontSize: 'clamp(2.2rem, 6vw, 5rem)',
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', fontSize: '0.65em' }}>
              One Decision Can
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              Change Your Life
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <motion.button
              ref={ctaRef}
              className="inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm uppercase tracking-widest font-medium"
              style={{ background: '#6b7a53', color: 'white', willChange: 'transform', transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), background 0.2s' }}
              whileHover={reduced ? {} : { scale: 1.04 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
              onClick={() => (window.location.href = '/booking')}
            >
              <span>Begin Your Journey</span>
              <svg viewBox="0 0 16 16" className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8h12M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        </div>

        {/* Contact bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 md:px-16 lg:px-24 py-8"
          style={{ borderTop: '1px solid rgba(247,242,234,0.1)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Left: email + phone */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
            <a
              href="mailto:hello@satva.yoga"
              className="flex items-center gap-2.5 text-sm transition-opacity duration-200 hover:opacity-70"
              style={{ color: 'rgba(247,242,234,0.65)' }}
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="1" y="3" width="14" height="10" rx="1.5" />
                <path d="M1 4l7 5 7-5" strokeLinecap="round" />
              </svg>
              hello@satva.yoga
            </a>
            <a
              href="tel:+912235551234"
              className="flex items-center gap-2.5 text-sm transition-opacity duration-200 hover:opacity-70"
              style={{ color: 'rgba(247,242,234,0.65)' }}
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M3 2h3l1.5 3.5L6 7a9 9 0 003 3l1.5-1.5L14 10v3a1 1 0 01-1 1A12 12 0 012 3a1 1 0 011-1z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              +91 22 3555 1234
            </a>
          </div>

          {/* Right: address */}
          <address
            className="text-sm not-italic"
            style={{ color: 'rgba(247,242,234,0.45)', textAlign: 'right' }}
          >
            12, Shree Nagar, Dahisar East<br />
            Mumbai, Maharashtra 400 068
          </address>
        </motion.div>
      </section>

      {/* Marquee strip */}
      <div
        className="relative overflow-hidden py-4"
        style={{ background: '#6b7a53', cursor: 'default' }}
        role="marquee"
        aria-label="Start your journey"
        onMouseEnter={() => {
          if (marqueeRef.current) marqueeRef.current.style.animationPlayState = 'paused'
        }}
        onMouseLeave={() => {
          if (marqueeRef.current) marqueeRef.current.style.animationPlayState = 'running'
        }}
      >
        <div
          ref={marqueeRef}
          className="marquee-track whitespace-nowrap"
          style={{ animationPlayState: reduced ? 'paused' : 'running' }}
          aria-hidden="true"
        >
          <span
            className="text-sm uppercase tracking-[0.28em]"
            style={{ color: 'rgba(247,242,234,0.7)', fontFamily: 'var(--font-sans)', fontWeight: 300 }}
          >
            {REPEATED}
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="py-8 px-8 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ background: '#26211c', borderTop: '1px solid rgba(247,242,234,0.06)' }}
      >
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'rgba(247,242,234,0.3)' }}>
          © 2026 Sātva Yoga, Dahisar
        </p>
        <nav className="flex gap-6" aria-label="Footer">
          {['Privacy', 'Terms', 'Instagram', 'WhatsApp'].map((l) => (
            <a
              key={l}
              href={`/${l.toLowerCase()}`}
              className="text-xs uppercase tracking-wider transition-opacity duration-200 hover:opacity-60"
              style={{ color: 'rgba(247,242,234,0.35)' }}
            >
              {l}
            </a>
          ))}
        </nav>
      </footer>
    </>
  )
}
