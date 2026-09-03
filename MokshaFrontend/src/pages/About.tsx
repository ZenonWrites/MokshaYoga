import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'
import MeetUjwala from '../components/MeetUjwala'
import OurValues from '../components/OurValues'
import TrustBadges from '../components/TrustBadges'
import AboutCTA from '../components/AboutCTA'

gsap.registerPlugin(ScrollTrigger)

// ─── Word-reveal heading ─────────────────────────────────────────────────────

const WORD_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface WordRevealProps {
  text: string
  as?: 'h1' | 'h2'
  className?: string
  style?: React.CSSProperties
  reduced: boolean
  delay?: number
}

function WordReveal({ text, as: Tag = 'h1', className = '', style, reduced, delay = 0 }: WordRevealProps) {
  const words = text.split(' ')

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: delay } },
  }

  const wordVariant = {
    hidden: { y: '110%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.72, ease: WORD_EASE },
    },
  }

  const instantVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
  }

  return (
    <Tag className={className} style={style} aria-label={text}>
      <motion.span
        className="flex flex-wrap gap-x-[0.25em] gap-y-1"
        variants={container}
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        {words.map((word, i) => (
          <span key={i} style={{ overflow: 'hidden', display: 'inline-block', lineHeight: 1.15 }}>
            <motion.span
              style={{ display: 'inline-block' }}
              variants={reduced ? instantVariant : wordVariant}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

// ─── Count-up stat ────────────────────────────────────────────────────────────

interface StatProps {
  prefix?: string
  value: number
  suffix: string
  label: string
  decimals?: number
  reduced: boolean
}

function CountStat({ prefix = '', value, suffix, label, decimals = 0, reduced }: StatProps) {
  const el = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    if (reduced || !el.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el.current!,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          if (triggered.current) return
          triggered.current = true
          const obj = { val: 0 }
          gsap.to(obj, {
            val: value,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              if (el.current) {
                el.current.textContent = obj.val.toFixed(decimals)
              }
            },
          })
        },
      })
    })

    return () => ctx.revert()
  }, [reduced, value, decimals])

  return (
    <div className="flex flex-col items-start py-8" style={{ borderTop: '1px solid rgba(38,33,28,0.1)' }}>
      <p
        className="mb-2 leading-none tabular-nums"
        style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', color: '#26211c' }}
      >
        {prefix}
        <span ref={el}>{reduced ? value.toFixed(decimals) : '0'}</span>
        {suffix}
      </p>
      <p className="text-xs uppercase tracking-[0.2em]" style={{ color: '#9a8a76' }}>{label}</p>
    </div>
  )
}

// ─── Images ──────────────────────────────────────────────────────────────────

const HERO_IMG =
  'https://images.unsplash.com/photo-1661307976757-2aa4a5882a4b?w=900&h=1100&fit=crop&auto=format'

const STORY_IMG =
  'https://images.unsplash.com/photo-1538024333176-f25f63f873ee?w=700&h=900&fit=crop&auto=format'

// ─── Page ────────────────────────────────────────────────────────────────────

const STORY_COLS = [
  {
    eyebrow: 'The Beginning',
    body: 'Sātva began in 2019 in a small rented flat in Dahisar East. Ujwala Sharma — then teaching in borrowed community halls — had a singular conviction: that the people of Dahisar deserved the same quality of yoga available in South Mumbai and Bandra, without the commute or the cost.\n\nFrom twelve founding students, word spread quietly. Within a year, the studio had outgrown two spaces. Today it is a purpose-built practice room that holds the warmth of its origins.',
  },
  {
    eyebrow: 'What Sets Us Apart',
    body: 'We cap every class at twelve students. Not for exclusivity — for attention. Every body that walks in receives hands-on guidance and a practice shaped to its particular needs.\n\nWe also offer steam yoga and candlelit Yin sessions, which students consistently name as transformative. The warmth, the low light, and the ritual of the candle shift something in the nervous system that ordinary studio lighting simply cannot.',
  },
  {
    eyebrow: 'Our Commitment',
    body: 'Sātva operates on the belief that yoga is medicine — not metaphorically, but practically. We track student progress, co-ordinate with physiotherapists and gynaecologists, and adapt programmes to chronic conditions, hormonal shifts, injury recovery, and life transitions.\n\nThe result is a community that stays. Our average membership tenure is over two years — not because we lock students in, but because what they find here, they do not find elsewhere.',
  },
]

const STATS = [
  { value: 5, suffix: '+ Years', label: 'Studio in Dahisar', decimals: 0 },
  { value: 500, suffix: '+ Members', label: 'Lives Changed', decimals: 0 },
  { value: 4.8, suffix: '★', label: '94 Verified Reviews', decimals: 1 },
]

export default function About() {
  const reduced = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  // Subtle parallax on hero photo
  useEffect(() => {
    if (reduced || !imgRef.current || !heroRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.4 },
      })
    }, heroRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <main style={{ background: '#f7f2ea' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative pt-36 md:pt-44 pb-20 md:pb-28 px-8 md:px-16 lg:px-24 overflow-hidden"
        style={{ background: '#f7f2ea' }}
        aria-labelledby="about-hero-heading"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-14 lg:gap-20 items-start">

          {/* Left: text */}
          <div>
            <motion.p
              className="text-xs uppercase tracking-[0.28em] mb-7"
              style={{ color: '#9a8a76' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Story
            </motion.p>

            <WordReveal
              text="Rooted in Dahisar, Growing Every Body's Practice"
              as="h1"
              reduced={reduced}
              delay={0.12}
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
                color: '#26211c',
                lineHeight: 1.15,
                marginBottom: '2rem',
              }}
            />

            <motion.p
              className="text-base md:text-lg leading-relaxed mb-10"
              style={{ color: '#6b5e52', maxWidth: 520, fontWeight: 300 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              We are a small-batch yoga studio built for the people of Dahisar. Every class is personal, every practice is purposeful, and every student — beginner or advanced — is seen.
            </motion.p>

            {/* Founding year badge */}
            <motion.div
              className="inline-flex items-center gap-3 rounded-full px-5 py-2.5"
              style={{ border: '1px solid rgba(38,33,28,0.14)', background: 'rgba(107,122,83,0.07)' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#6b7a53' }} aria-hidden="true" />
              <span className="text-xs uppercase tracking-[0.2em]" style={{ color: '#5c6b45' }}>
                Est. 2019 · Dahisar East, Mumbai
              </span>
            </motion.div>
          </div>

          {/* Right: photo */}
          <motion.div
            className="relative lg:sticky lg:top-28"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: WORD_EASE }}
          >
            <div
              className="overflow-hidden"
              style={{ borderRadius: 22, aspectRatio: '3/4', background: '#ddd5c8' }}
            >
              <div ref={imgRef} className="w-full h-full scale-110 origin-center">
                <img
                  src={HERO_IMG}
                  alt="A student in a quiet moment of reflection, sitting with tea inside the Sātva studio"
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>

            {/* Floating label */}
            <motion.div
              className="absolute -bottom-5 -right-3 md:-right-6 rounded-2xl px-5 py-4"
              style={{ background: '#f7f2ea', border: '1px solid rgba(38,33,28,0.1)', boxShadow: '0 8px 32px rgba(38,33,28,0.08)' }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.95 }}
            >
              <p className="text-xs uppercase tracking-[0.18em] mb-0.5" style={{ color: '#9a8a76' }}>
                Max class size
              </p>
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.5rem', color: '#26211c', lineHeight: 1.1 }}>
                12 students
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom hairline */}
        <div className="absolute bottom-0 left-8 right-8 md:left-16 md:right-16 lg:left-24 lg:right-24" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />
      </section>

      {/* ── Studio Story ─────────────────────────────────── */}
      <StudioStory reduced={reduced} />

      <MeetUjwala />
      <OurValues />
      <TrustBadges />
      <AboutCTA />
    </main>
  )
}

// ─── Studio Story section (separate component to keep About readable) ─────────

function StudioStory({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const colsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (reduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      colsRef.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out',
          delay: i * 0.13,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 px-8 md:px-16 lg:px-24"
      style={{ background: '#f7f2ea' }}
      aria-labelledby="studio-story-heading"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section label */}
        <div className="mb-14 flex items-center gap-5">
          <p className="text-xs uppercase tracking-[0.28em]" style={{ color: '#9a8a76' }}>Studio Story</p>
          <div className="flex-1" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />
        </div>

        {/* 3-col editorial text */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {STORY_COLS.map((col, i) => (
            <div
              key={col.eyebrow}
              ref={(el) => { if (el) colsRef.current[i] = el }}
              className="px-0 md:px-8 py-8 md:py-0 first:pl-0 last:pr-0"
              style={{
                borderTop: '1px solid rgba(38,33,28,0.1)',
                borderLeft: i > 0 ? '1px solid rgba(38,33,28,0.1)' : undefined,
              }}
            >
              <div className="md:px-8 first:md:pl-0 last:md:pr-0">
                <p className="text-[10px] uppercase tracking-[0.24em] mb-4" style={{ color: '#9a8a76' }}>
                  {col.eyebrow}
                </p>
                {col.body.split('\n\n').map((para, j) => (
                  <p key={j} className={`text-sm leading-relaxed ${j > 0 ? 'mt-4' : ''}`} style={{ color: '#6b5e52', fontWeight: 300 }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Image + Stats row */}
        <div className="mt-20 md:mt-24 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12 md:gap-16 items-end">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
            {STATS.map((s) => (
              <CountStat key={s.suffix} {...s} reduced={reduced} />
            ))}
          </div>

          {/* Story image */}
          <motion.div
            className="overflow-hidden"
            style={{ borderRadius: 18, aspectRatio: '3/4', background: '#ddd5c8' }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: WORD_EASE }}
          >
            <img
              src={STORY_IMG}
              alt="Seated Buddha statue with pillar candles burning in the Sātva studio space"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </div>

        {/* Quote callout */}
        <motion.div
          className="mt-20 md:mt-24 py-12 px-10 md:px-16 rounded-2xl"
          style={{ background: '#ede7da', border: '1px solid rgba(38,33,28,0.08)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="text-xl md:text-2xl leading-relaxed mb-6"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#3a3028' }}
            >
              "We did not build a gym that does yoga. We built a sanctuary that does community. The difference is everything."
            </p>
            <p className="text-xs uppercase tracking-[0.22em]" style={{ color: '#9a8a76' }}>
              Ujwala Sharma · Founder
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
