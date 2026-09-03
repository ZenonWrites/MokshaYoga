import { useEffect, useRef, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMagneticButton } from '../hooks/useMagneticCursor'
import { useReducedMotion } from '../hooks/useReducedMotion'
import SplitHeadline from './SplitHeadline'

gsap.registerPlugin(ScrollTrigger)

const ParticlesDust = lazy(() => import('./ParticlesDust'))
const HeroScene = lazy(() => import('./HeroScene'))

const HERO_IMG =
  'https://images.unsplash.com/photo-1564505892311-612d1e35b375?w=1800&h=1080&fit=crop&auto=format'

const AVATARS = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&auto=format',
]

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
})

const fadeUpInstant = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.01 } } }

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const ctaRef = useMagneticButton()

  useEffect(() => {
    if (reduced || !imgRef.current || !sectionRef.current) return

    const tl = gsap.to(imgRef.current, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    })

    return () => {
      tl.scrollTrigger?.kill()
    }
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-charcoal"
      style={{ height: '100svh', minHeight: 620, background: '#1a1612' }}
      aria-label="Hero: Balance, Calm, Reconnect"
    >
      {/* Parallax background image */}
      <div
        ref={imgRef}
        className="absolute inset-0 scale-110 origin-center"
        style={{ willChange: 'transform' }}
      >
        <img
          src={HERO_IMG}
          alt="Silhouette practicing yoga in calm dusk water reflecting warm amber sky"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(18,14,10,0.45) 0%, rgba(18,14,10,0.25) 40%, rgba(18,14,10,0.72) 100%)',
        }}
        aria-hidden="true"
      />

      {/* R3F orb */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Particles */}
      <Suspense fallback={null}>
        <ParticlesDust />
      </Suspense>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-20 md:pb-28">

        {/* Top-right: social proof pill */}
        <motion.div
          className="absolute top-28 right-8 md:right-16 lg:right-24"
          variants={reduced ? fadeUpInstant : fadeUp(1.6)}
          initial="hidden"
          animate="visible"
        >
          <div
            className="flex items-center gap-2.5 rounded-full px-3.5 py-2"
            style={{
              background: 'rgba(247,242,234,0.12)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(247,242,234,0.18)',
            }}
          >
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {AVATARS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Member ${i + 1}`}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                />
              ))}
            </div>
            <p className="text-white text-xs leading-tight pr-1" style={{ maxWidth: 130 }}>
              <span className="font-medium">Loved by 500+</span>
              <br />
              <span style={{ opacity: 0.7 }}>Dahisar Members</span>
            </p>
          </div>
        </motion.div>

        {/* Eyebrow label */}
        <motion.p
          className="text-xs uppercase tracking-[0.22em] mb-7"
          style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-sans)' }}
          variants={reduced ? fadeUpInstant : fadeUp(0.15)}
          initial="hidden"
          animate="visible"
        >
          Dahisar, Mumbai · Est. 2019
        </motion.p>

        {/* Headline */}
        <SplitHeadline reduced={reduced} />

        {/* Subheading */}
        <motion.p
          className="mt-7 mb-10 text-base md:text-lg font-light leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.68)', maxWidth: 460, fontFamily: 'var(--font-sans)' }}
          variants={reduced ? fadeUpInstant : fadeUp(1.4)}
          initial="hidden"
          animate="visible"
        >
          A quiet practice in the heart of Dahisar. Find stillness, build strength, come home to yourself.
        </motion.p>

        {/* CTA row */}
        <motion.div
          className="flex items-center gap-6"
          variants={reduced ? fadeUpInstant : fadeUp(1.65)}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            ref={ctaRef}
            className="relative inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm uppercase tracking-widest font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{
              background: '#6b7a53',
              color: 'white',
              transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1), background 0.2s',
              willChange: 'transform',
            }}
            whileHover={reduced ? {} : { scale: 1.04 }}
            whileTap={reduced ? {} : { scale: 0.97 }}
            onClick={() => window.location.href = '/booking'}
          >
            <span>Start Your Journey</span>
            <svg viewBox="0 0 16 16" className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 8h12M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

          <button
            className="text-sm uppercase tracking-widest font-light"
            style={{ color: 'rgba(255,255,255,0.58)', borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: 1 }}
            onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn more
          </button>
        </motion.div>
      </div>

      {/* Bottom hairline divider */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20"
        style={{ height: 1, background: 'rgba(255,255,255,0.08)' }}
        aria-hidden="true"
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-20 flex flex-col items-center gap-2"
        style={{ x: '-50%' }}
        variants={reduced ? fadeUpInstant : fadeUp(2.0)}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="w-px bg-white"
          style={{ height: 36, opacity: 0.3 }}
          animate={reduced ? {} : { scaleY: [0, 1, 0], originY: 0 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          aria-hidden="true"
        />
        <span className="text-white text-[9px] uppercase tracking-[0.3em]" style={{ opacity: 0.3 }}>
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
