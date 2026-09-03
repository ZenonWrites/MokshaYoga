import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const CLASSES = [
  { name: 'Morning Flow', time: '6:00 – 7:15 AM', level: 'All Levels', days: 'Mon · Wed · Fri', desc: 'Begin your day rooted. A gentle energising sequence to wake the spine and set intention.' },
  { name: 'Hatha Basics', time: '8:00 – 9:00 AM', level: 'Beginner', days: 'Tue · Thu · Sat', desc: 'The essential foundation. Perfect for those stepping onto the mat for the first time.' },
  { name: 'Vinyasa Flow', time: '10:00 – 11:30 AM', level: 'Intermediate', days: 'Mon · Wed · Fri', desc: 'Breath-linked movement with playful sequencing and intelligent transitions.' },
  { name: 'Yin & Restore', time: '12:30 – 1:45 PM', level: 'All Levels', days: 'Tue · Thu', desc: 'Long-held postures, deep connective tissue release, and profound stillness.' },
  { name: 'Power Yoga', time: '5:30 – 6:45 PM', level: 'Advanced', days: 'Mon · Wed · Sat', desc: 'Strength, endurance, and focus. A demanding practice for those ready to push edges.' },
  { name: 'Evening Meditation', time: '7:00 – 8:00 PM', level: 'All Levels', days: 'Daily', desc: 'Close the day with guided breath, body scan, and seated meditation.' },
]

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  'All Levels': { bg: 'rgba(107,122,83,0.12)', text: '#5c6b45' },
  'Beginner': { bg: 'rgba(184,163,132,0.15)', text: '#7a6340' },
  'Intermediate': { bg: 'rgba(154,138,118,0.15)', text: '#5e4e38' },
  'Advanced': { bg: 'rgba(38,33,28,0.08)', text: '#3a3028' },
}

export default function ClassSchedule() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLAnchorElement[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !sectionRef.current) return

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
          delay: (i % 2) * 0.12,
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-36 px-8 md:px-16 lg:px-24"
      style={{ background: '#ede7da' }}
      aria-labelledby="schedule-heading"
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: '#9a8a76' }}>Weekly Schedule</p>
            <h2
              id="schedule-heading"
              className="leading-tight"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#26211c' }}
            >
              Flow With Us,{' '}
              <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 300, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.8em' }}>
                Anytime
              </span>
            </h2>
          </div>
          <Link
            to="/booking"
            className="self-start md:self-auto inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs uppercase tracking-widest"
            style={{ border: '1px solid rgba(38,33,28,0.2)', color: '#26211c' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#26211c'; (e.currentTarget as HTMLElement).style.color = '#f7f2ea' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#26211c' }}
          >
            View Full Schedule
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {CLASSES.map((cls, i) => {
            const col = LEVEL_COLORS[cls.level] ?? LEVEL_COLORS['All Levels']
            const isLastRow = i >= CLASSES.length - 2
            const isRightCol = i % 2 === 1

            return (
              <Link
                key={cls.name}
                to="/booking"
                ref={(el) => { if (el) cardsRef.current[i] = el }}
                className="group relative block p-7 md:p-8 transition-colors duration-300"
                style={{
                  borderTop: '1px solid rgba(38,33,28,0.1)',
                  borderBottom: isLastRow ? '1px solid rgba(38,33,28,0.1)' : undefined,
                  borderLeft: isRightCol ? '1px solid rgba(38,33,28,0.1)' : undefined,
                }}
                aria-label={`Book ${cls.name} — ${cls.time}`}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(107,122,83,0.06)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-lg font-medium transition-colors duration-200 group-hover:text-olive"
                    style={{ color: '#26211c', fontFamily: 'var(--font-sans)' }}
                  >
                    {cls.name}
                  </h3>
                  <span
                    className="text-[10px] uppercase tracking-wider rounded-full px-3 py-1 shrink-0 ml-3"
                    style={{ background: col.bg, color: col.text }}
                  >
                    {cls.level}
                  </span>
                </div>

                <p className="text-sm mb-1 font-light" style={{ color: '#7a6b5d' }}>
                  {cls.days}
                </p>
                <p
                  className="text-base font-medium mb-3"
                  style={{ color: '#26211c', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
                >
                  {cls.time}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#9a8a76', fontWeight: 300 }}>
                  {cls.desc}
                </p>

                {/* Arrow indicator */}
                <div
                  className="mt-4 flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: '#6b7a53' }}
                  aria-hidden="true"
                >
                  <span>Book</span>
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 8h10M8 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
