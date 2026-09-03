import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const TAGS = ['All', 'Certified', 'Personalized', 'Experienced', 'Holistic']

const INSTRUCTORS = [
  {
    id: 1,
    name: 'Ujwala Sharma',
    role: 'Hatha & Vinyasa',
    since: '2019',
    bio: 'Ujwala founded Sātva with a single intention: to make authentic yoga accessible in Dahisar. With 12 years of practice and RYT-500 certification from Mysore, she weaves classical Hatha with modern Vinyasa into seamless, meditative flows.',
    specialties: ['Hatha', 'Vinyasa', 'Pranayama', 'Philosophy'],
    tags: ['Certified', 'Experienced', 'Holistic'],
    photo: 'https://images.unsplash.com/photo-1581423880338-b9e4f9718df6?w=600&h=800&fit=crop&auto=format',
    quote: '"Stillness is not the absence of movement — it is its deepest expression."',
  },
  {
    id: 2,
    name: 'Priya Nair',
    role: 'Ashtanga & Yin',
    since: '2020',
    bio: 'Priya brings the discipline of Ashtanga alongside the surrender of Yin — a rare combination that builds both strength and softness. She completed her training in Pune and holds certifications in Yin Yoga and trauma-informed teaching.',
    specialties: ['Ashtanga', 'Yin', 'Restorative', 'Breathwork'],
    tags: ['Certified', 'Personalized', 'Experienced'],
    photo: 'https://images.unsplash.com/photo-1645081522795-231884bfcbfc?w=600&h=800&fit=crop&auto=format',
    quote: '"The pose begins when you want to leave it."',
  },
  {
    id: 3,
    name: 'Meera Krishnan',
    role: 'Restorative & Meditation',
    since: '2021',
    bio: 'Meera is a certified meditation teacher and somatic movement practitioner. Her classes create a sanctuary for nervous system regulation, guiding students from doing into deep being through gentle restorative sequences.',
    specialties: ['Restorative', 'Meditation', 'Somatic', 'Nidra'],
    tags: ['Certified', 'Personalized', 'Holistic'],
    photo: 'https://images.unsplash.com/photo-1780695298088-0146c39a1d22?w=600&h=800&fit=crop&auto=format',
    quote: '"Rest is a revolutionary act of self-knowing."',
  },
  {
    id: 4,
    name: 'Ananya Desai',
    role: 'Power Yoga & Pilates',
    since: '2021',
    bio: 'Ananya brings athletic precision to her Power Yoga classes, drawing from her background in competitive gymnastics and Pilates. She challenges students to discover strength they did not know they had.',
    specialties: ['Power Yoga', 'Pilates', 'Core', 'Strength'],
    tags: ['Certified', 'Experienced'],
    photo: 'https://images.unsplash.com/photo-1643725111991-f9572f1bf28f?w=600&h=800&fit=crop&auto=format',
    quote: '"Strength is the foundation from which softness becomes possible."',
  },
  {
    id: 5,
    name: 'Kavita Pillai',
    role: 'Prenatal & Gentle Flow',
    since: '2022',
    bio: 'Kavita specialises in prenatal yoga and gentle therapeutic sequences, holding space for students navigating injury, chronic pain, or major life transitions. Her approach is unhurried, attentive, and deeply personalised.',
    specialties: ['Prenatal', 'Gentle Flow', 'Therapeutic', 'Alignment'],
    tags: ['Certified', 'Personalized', 'Holistic'],
    photo: 'https://images.unsplash.com/photo-1643725111947-04da0645ec85?w=600&h=800&fit=crop&auto=format',
    quote: '"Every body carries its own wisdom. My job is to listen alongside you."',
  },
  {
    id: 6,
    name: 'Ravi Menon',
    role: 'Kundalini & Vedic Arts',
    since: '2022',
    bio: 'Ravi trained extensively in the Kundalini tradition and Vedic philosophy, offering the only dedicated Kundalini programme in Dahisar. His classes blend mantra, kriyas, and breathwork into transformative experiences.',
    specialties: ['Kundalini', 'Mantra', 'Vedic Arts', 'Kriyas'],
    tags: ['Certified', 'Experienced', 'Holistic'],
    photo: 'https://images.unsplash.com/photo-1697274715660-cf41497d7e69?w=600&h=800&fit=crop&auto=format',
    quote: '"We are not humans having a spiritual experience — we are spirits, remembering."',
  },
]

const CARD_W = 280
const CARD_GAP = 20

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function InstructorCarousel() {
  const [activeTag, setActiveTag] = useState('All')
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const filtered = activeTag === 'All'
    ? INSTRUCTORS
    : INSTRUCTORS.filter((i) => i.tags.includes(activeTag))

  const clampedIdx = Math.min(activeIdx, filtered.length - 1)
  const active = filtered[clampedIdx] ?? filtered[0]

  const x = useMotionValue(0)

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, filtered.length - 1))
    setActiveIdx(clamped)
    const offset = -(clamped * (CARD_W + CARD_GAP))
    animate(x, offset, { type: 'spring', stiffness: 260, damping: 32 })
  }, [filtered.length, x])

  // Reset on tag change
  useEffect(() => {
    goTo(0)
  }, [activeTag]) // eslint-disable-line react-hooks/exhaustive-deps

  // GSAP section reveal
  useEffect(() => {
    if (reduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('[data-instr-header]', {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 40
    if (info.offset.x < -threshold) goTo(clampedIdx + 1)
    else if (info.offset.x > threshold) goTo(clampedIdx - 1)
    else goTo(clampedIdx)
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-36 overflow-hidden"
      style={{ background: '#f7f2ea' }}
      aria-labelledby="instructors-heading"
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />

      <div className="px-8 md:px-16 lg:px-24 max-w-6xl mx-auto">

        {/* Header */}
        <div data-instr-header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: '#9a8a76' }}>The Team</p>
            <h2
              id="instructors-heading"
              className="leading-tight"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#26211c' }}
            >
              Meet Our{' '}
              <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 300, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.8em' }}>
                Instructors
              </span>
            </h2>
          </div>

          {/* Counter + arrows */}
          <div className="flex items-center gap-5">
            <span className="text-sm tabular-nums" style={{ color: '#9a8a76', fontFamily: 'var(--font-sans)' }}>
              <span style={{ color: '#26211c', fontWeight: 500 }}>{pad(clampedIdx + 1)}</span>
              <span className="mx-1">/</span>
              {pad(filtered.length)}
            </span>
            <div className="flex gap-2">
              {(['prev', 'next'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => goTo(dir === 'prev' ? clampedIdx - 1 : clampedIdx + 1)}
                  disabled={(dir === 'prev' && clampedIdx === 0) || (dir === 'next' && clampedIdx === filtered.length - 1)}
                  className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                  style={{ borderColor: 'rgba(38,33,28,0.2)', color: '#26211c' }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) { (e.currentTarget as HTMLElement).style.background = '#26211c'; (e.currentTarget as HTMLElement).style.color = '#f7f2ea' } }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#26211c' }}
                  aria-label={dir === 'prev' ? 'Previous instructor' : 'Next instructor'}
                >
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {dir === 'prev'
                      ? <path d="M10 4L6 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
                      : <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter instructors">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="rounded-full px-4 py-1.5 text-xs uppercase tracking-wider transition-all duration-200"
              style={{
                background: activeTag === tag ? '#26211c' : 'transparent',
                color: activeTag === tag ? '#f7f2ea' : '#7a6b5d',
                border: `1px solid ${activeTag === tag ? '#26211c' : 'rgba(38,33,28,0.18)'}`,
              }}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel + Detail panel */}
      <div className="flex flex-col lg:flex-row gap-8 px-8 md:px-16 lg:px-24 max-w-6xl mx-auto">

        {/* Carousel track */}
        <div className="relative overflow-hidden" style={{ flex: '0 0 auto', width: '100%', maxWidth: 'min(100%, 620px)' }}>
          <motion.div
            ref={trackRef}
            className="flex gap-5"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -(filtered.length - 1) * (CARD_W + CARD_GAP), right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
            role="list"
            aria-label="Instructor cards"
          >
            {filtered.map((instr, i) => {
              const isActive = i === clampedIdx
              return (
                <motion.div
                  key={instr.id}
                  role="listitem"
                  className="shrink-0 overflow-hidden cursor-grab active:cursor-grabbing"
                  style={{
                    width: CARD_W,
                    borderRadius: 18,
                    background: '#ede7da',
                    border: `1px solid ${isActive ? 'rgba(107,122,83,0.4)' : 'rgba(38,33,28,0.08)'}`,
                  }}
                  animate={{ scale: isActive ? 1 : 0.96, opacity: isActive ? 1 : 0.65 }}
                  transition={{ duration: 0.35, ease: [0.32, 0, 0.28, 1] }}
                  onClick={() => goTo(i)}
                  aria-label={`Select ${instr.name}`}
                >
                  <div className="relative overflow-hidden" style={{ height: 340 }}>
                    <img
                      src={instr.photo}
                      alt={`${instr.name}, ${instr.role} instructor`}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      draggable={false}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(26,22,18,0.6) 0%, transparent 60%)' }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-medium text-sm" style={{ color: '#26211c' }}>{instr.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9a8a76' }}>{instr.role}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Detail panel */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.45, ease: [0.32, 0, 0.28, 1] }}
              className="h-full flex flex-col"
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Since badge */}
              <p className="text-xs uppercase tracking-[0.2em] mb-5" style={{ color: '#9a8a76' }}>
                With us since {active.since}
              </p>

              <h3
                className="mb-1 leading-snug"
                style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: '#26211c' }}
              >
                {active.name}
              </h3>
              <p className="text-xs uppercase tracking-widest mb-6" style={{ color: '#9a8a76' }}>
                {active.role}
              </p>

              {/* Hairline */}
              <div style={{ height: 1, background: 'rgba(38,33,28,0.1)', marginBottom: '1.5rem' }} aria-hidden="true" />

              <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b5e52', fontWeight: 300 }}>
                {active.bio}
              </p>

              {/* Quote */}
              <p
                className="text-sm mb-6 pl-4"
                style={{
                  color: '#8a7a6a',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  borderLeft: '2px solid rgba(107,122,83,0.3)',
                  lineHeight: 1.6,
                }}
              >
                {active.quote}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-8">
                {active.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-wider"
                    style={{ background: 'rgba(107,122,83,0.1)', color: '#5c6b45' }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <a
                href="/booking"
                className="self-start inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-xs uppercase tracking-widest font-medium transition-all duration-250"
                style={{ background: '#6b7a53', color: 'white' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#5c6b45')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#6b7a53')}
              >
                Book with {active.name.split(' ')[0]}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
