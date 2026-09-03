import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const IMG = 'https://images.unsplash.com/photo-1577344718665-3e7c0c1ecf6b?w=1200&h=1600&fit=crop&auto=format'

interface Hotspot {
  id: string
  x: string
  y: string
  yPct: number  // numeric y for sort
  label: string
  title: string
  body: string
  align: 'left' | 'right'
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'shoulders',
    x: '38%',
    y: '22%',
    yPct: 22,
    label: 'Shoulders',
    title: 'Open Your Shoulders',
    body: 'Chest and shoulder openers counter the forward collapse of screen-heavy days, relieving neck strain and improving posture from the inside out.',
    align: 'left',
  },
  {
    id: 'back',
    x: '55%',
    y: '40%',
    yPct: 40,
    label: 'Spine',
    title: 'Release Your Back',
    body: 'Targeted spinal decompression through forward folds, twists, and cat-cow sequences dissolve chronic tension and restore natural curvature.',
    align: 'right',
  },
  {
    id: 'hips',
    x: '52%',
    y: '65%',
    yPct: 65,
    label: 'Hips',
    title: 'Free Your Hips',
    body: 'The hips store emotional and muscular tension in equal measure. Deep hip sequences release both, restoring fluid movement and emotional ease.',
    align: 'right',
  },
]

// Already sorted top→bottom by yPct
const SORTED = [...HOTSPOTS].sort((a, b) => a.yPct - b.yPct)

// ─── PulseDot ────────────────────────────────────────────────────────────────

function PulseDot({
  spot, isRevealed, isOpen, onToggle,
}: {
  spot: Hotspot; isRevealed: boolean; isOpen: boolean; onToggle: () => void
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="absolute"
      style={{ left: spot.x, top: spot.y, transform: 'translate(-50%, -50%)', zIndex: 20 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{
        duration: reduced ? 0 : 1.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Pulse rings — only when revealed and not open */}
      {!reduced && isRevealed && !isOpen && (
        <>
          <motion.span
            className="absolute rounded-full"
            style={{ inset: -8, border: '1px solid rgba(247,242,234,0.4)' }}
            animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeOut' }}
            aria-hidden="true"
          />
          <motion.span
            className="absolute rounded-full"
            style={{ inset: -8, border: '1px solid rgba(247,242,234,0.25)' }}
            animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, delay: 0.5, ease: 'easeOut' }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Dot button */}
      <motion.button
        className="relative w-8 h-8 rounded-full flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ background: isOpen ? '#6b7a53' : 'rgba(247,242,234,0.92)', backdropFilter: 'blur(6px)' }}
        onClick={isRevealed ? onToggle : undefined}
        whileHover={reduced || !isRevealed ? {} : { scale: 1.15 }}
        whileTap={reduced || !isRevealed ? {} : { scale: 0.92 }}
        aria-label={isOpen ? `Close ${spot.title}` : `Learn about ${spot.title}`}
        aria-expanded={isOpen}
        tabIndex={isRevealed ? 0 : -1}
      >
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ display: 'block', color: isOpen ? 'white' : '#26211c', lineHeight: 1 }}
        >
          <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 3v8M3 7h8" strokeLinecap="round" />
          </svg>
        </motion.span>
      </motion.button>

      {/* Info card */}
      <AnimatePresence>
        {isOpen && isRevealed && (
          <motion.div
            className="absolute top-1/2 w-60 rounded-2xl p-5"
            style={{
              [spot.align === 'right' ? 'left' : 'right']: 'calc(100% + 12px)',
              transform: 'translateY(-50%)',
              background: 'rgba(247,242,234,0.96)',
              border: '1px solid rgba(38,33,28,0.1)',
              boxShadow: '0 12px 40px rgba(38,33,28,0.14)',
              zIndex: 30,
            }}
            initial={{ opacity: 0, scale: 0.9, y: '-50%', x: spot.align === 'right' ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: '-50%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            role="tooltip"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: '#9a8a76' }}>
              {spot.label}
            </p>
            <h3 className="mb-2 leading-snug" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.05rem', color: '#26211c' }}>
              {spot.title}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: '#7a6b5d', fontWeight: 300 }}>
              {spot.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function BodyBenefits() {
  const [openId, setOpenId]         = useState<string | null>(null)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)
  const reduced    = useReducedMotion()

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  useEffect(() => {
    // With reduced motion, reveal everything immediately
    if (reduced) {
      setRevealedIds(new Set(SORTED.map((s) => s.id)))
      return
    }

    const section = sectionRef.current
    if (!section) return

    const triggers = SORTED.map((spot, i) => {
      // Each dot's trigger fires when the corresponding fraction of the section
      // has scrolled past the centre of the viewport — top dot fires earliest.
      const startOffset = 10 + i * 28  // 10%, 38%, 66% through the section

      return ScrollTrigger.create({
        trigger: section,
        start: `${startOffset}% center`,
        once: true,
        onEnter: () => {
          setRevealedIds((prev) => {
            const next = new Set(prev)
            next.add(spot.id)
            return next
          })
        },
      })
    })

    return () => triggers.forEach((t) => t.kill())
  }, [reduced])

  const allRevealed = revealedIds.size === SORTED.length

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 px-8 md:px-16 lg:px-24"
      style={{ background: '#ede7da' }}
      aria-labelledby="body-benefits-heading"
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: '#9a8a76' }}>Benefits</p>
          <h2
            id="body-benefits-heading"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#26211c', lineHeight: 1.15 }}
          >
            What Yoga Does{' '}
            <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 300, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.78em' }}>
              for Your Body
            </span>
          </h2>
        </div>

        {/* Photo container */}
        <div
          className="relative overflow-visible rounded-2xl"
          style={{ background: '#c8bfb0' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpenId(null) }}
        >
          <img
            src={IMG}
            alt="Person in a deep meditative yoga pose demonstrating full-body alignment and stillness"
            className="w-full object-cover rounded-2xl"
            style={{ maxHeight: '90vh', minHeight: 520, objectPosition: 'center top' }}
            loading="lazy"
            decoding="async"
          />

          {/* Dark vignette */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(18,14,10,0.15) 0%, rgba(18,14,10,0.35) 100%)' }}
            aria-hidden="true"
          />

          {/* Hotspots */}
          {SORTED.map((spot) => (
            <PulseDot
              key={spot.id}
              spot={spot}
              isRevealed={revealedIds.has(spot.id)}
              isOpen={openId === spot.id}
              onToggle={() => toggle(spot.id)}
            />
          ))}

          {/* Corner label */}
          <AnimatePresence>
            {allRevealed && (
              <motion.div
                className="absolute bottom-6 left-6 pointer-events-none"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              >
                <p className="text-xs uppercase tracking-[0.22em]" style={{ color: 'rgba(247,242,234,0.5)' }}>
                  Tap the markers to explore
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
