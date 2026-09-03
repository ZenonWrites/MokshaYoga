import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  {
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="10" r="5" />
        <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        <path d="M24 14c2.2.8 4 3 4 6" opacity=".4" />
        <path d="M8 14c-2.2.8-4 3-4 6" opacity=".4" />
      </svg>
    ),
    title: 'Personal Attention',
    desc: 'Every class is capped at twelve. Every student is seen, adjusted, and remembered from session to session. No lost faces in a crowd.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4 C 10 10, 6 14, 6 20 a10 10 0 0 0 20 0c0-6-4-10-10-16z" />
        <path d="M16 14v8M13 18l3 4 3-4" opacity=".5" />
      </svg>
    ),
    title: 'Holistic Wellness',
    desc: "Body, breath, mind — never one in isolation. Diet guidance, sleep habits, and stress patterns are part of the conversation when they need to be.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="13" r="4" />
        <circle cx="22" cy="13" r="4" />
        <path d="M4 26c0-3.3 2.7-6 6-6h12c3.3 0 6 2.7 6 6" />
        <path d="M16 7V4M16 4l-2 2M16 4l2 2" opacity=".4" />
      </svg>
    ),
    title: 'Community',
    desc: "Students who have practiced together for two years show up for each other outside the studio. That's not a feature we planned — it's what happens when practice is genuine.",
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 24V12l8-6 8 6v12" />
        <rect x="13" y="18" width="6" height="6" rx="1" />
        <path d="M6 24h20" />
        <path d="M16 8v4" opacity=".4" />
      </svg>
    ),
    title: 'Consistency',
    desc: 'Transformation is not dramatic. It is sixteen sessions of small shifts accumulating into a life that feels different. We are here every week, without exception.',
  },
]

export default function OurValues() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.72,
          ease: 'power2.out',
          delay: i * 0.11,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24"
      style={{ background: '#f7f2ea' }}
      aria-labelledby="values-heading"
    >
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-5 mb-14">
          <p className="text-xs uppercase tracking-[0.28em] shrink-0" style={{ color: '#9a8a76' }}>What We Stand For</p>
          <div className="flex-1" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />
          <h2
            id="values-heading"
            className="shrink-0"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: '#26211c' }}
          >
            Our Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              ref={(el) => { if (el) cardsRef.current[i] = el }}
              className="group relative p-7 md:p-8 transition-colors duration-300"
              style={{
                borderTop: '1px solid rgba(38,33,28,0.1)',
                borderLeft: i % 2 === 1 || i >= 2 ? '1px solid rgba(38,33,28,0.1)' : undefined,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(107,122,83,0.05)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-olive-subtle"
                style={{ background: 'rgba(107,122,83,0.1)', color: '#6b7a53' }}
              >
                {v.icon}
              </div>

              <h3
                className="mb-3 text-base font-medium"
                style={{ color: '#26211c', fontFamily: 'var(--font-sans)' }}
              >
                {v.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#7a6b5d', fontWeight: 300 }}>
                {v.desc}
              </p>

              {/* Bottom hairline accent on hover */}
              <div
                className="absolute bottom-0 left-7 right-7 transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{ height: 1, background: 'rgba(107,122,83,0.35)' }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Bottom hairline to close grid */}
        <div style={{ borderTop: '1px solid rgba(38,33,28,0.1)' }} />
      </div>
    </section>
  )
}
