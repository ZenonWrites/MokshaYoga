import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    n: '01',
    title: 'Mindful Movement',
    body: 'Each pose is a meditation in motion. We slow down, listen inward, and let the body lead with intelligence rather than effort.',
  },
  {
    n: '02',
    title: 'Breath Awareness',
    body: 'Pranayama principles are woven through every class — breathing as anchor, as reset, as the quiet teacher always present.',
  },
  {
    n: '03',
    title: 'Community Support',
    body: 'Practice deepens in the company of others. Our Dahisar community holds space for every stage of the journey.',
  },
]

const IMG =
  'https://images.unsplash.com/photo-1683056255281-e52a141924f0?w=800&h=1000&fit=crop&auto=format'

export default function HolisticApproach() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -48,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })

      gsap.from(rightRef.current, {
        x: 48,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })

      pillarsRef.current.forEach((el, i) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.15 * i,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="about-section"
      className="relative py-28 md:py-36 px-8 md:px-16 lg:px-24"
      style={{ background: '#f7f2ea' }}
      aria-labelledby="holistic-heading"
    >
      {/* Section hairline top */}
      <div className="absolute top-0 left-8 right-8 md:left-16 md:right-16 lg:left-24 lg:right-24" style={{ height: 1, background: 'rgba(38,33,28,0.12)' }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

        {/* Left column */}
        <div ref={leftRef}>
          <p className="text-xs uppercase tracking-[0.22em] mb-5" style={{ color: '#9a8a76', fontFamily: 'var(--font-sans)' }}>
            Our Philosophy
          </p>

          <h2
            id="holistic-heading"
            className="mb-6 leading-[1.12]"
            style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#26211c' }}
          >
            A Holistic<br />
            <span style={{ fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 300, fontSize: '0.78em', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Approach
            </span>
          </h2>

          <p className="text-base leading-relaxed mb-10" style={{ color: '#6b5e52', maxWidth: 420, fontWeight: 300 }}>
            At Sātva, we believe yoga is more than posture — it is a living relationship between body, breath, and awareness, cultivated slowly over a lifetime.
          </p>

          {/* Numbered list */}
          <div className="flex flex-col">
            {PILLARS.map((item, i) => (
              <div
                key={item.n}
                ref={(el) => { if (el) pillarsRef.current[i] = el }}
                className="py-6"
                style={{ borderTop: '1px solid rgba(38,33,28,0.1)' }}
              >
                <div className="flex gap-5 items-start">
                  <span className="text-xs tracking-[0.2em] mt-1 shrink-0" style={{ color: '#9a8a76', fontFamily: 'var(--font-sans)' }}>
                    {item.n}
                  </span>
                  <div>
                    <h3 className="mb-2 font-medium text-sm tracking-wide" style={{ color: '#26211c' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#7a6b5d', fontWeight: 300 }}>
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(38,33,28,0.1)' }} />
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Link
              to="/about"
              className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-xs uppercase tracking-widest font-medium transition-all duration-300"
              style={{ background: '#26211c', color: '#f7f2ea' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#6b7a53')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#26211c')}
            >
              <span>Explore Our Method</span>
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8h12M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right column — image card */}
        <div ref={rightRef} className="relative">
          <div
            className="relative overflow-hidden"
            style={{ borderRadius: 24, aspectRatio: '4/5', background: '#e8dfd2' }}
          >
            <img
              src={IMG}
              alt="Students practicing yoga together in the Sātva studio with warm natural light"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {/* Subtle tint overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(107,122,83,0.08)' }}
              aria-hidden="true"
            />
          </div>

          {/* Floating stat badge */}
          <motion.div
            className="absolute -bottom-5 -left-5 md:-left-8 rounded-2xl px-5 py-4"
            style={{ background: '#f7f2ea', border: '1px solid rgba(38,33,28,0.1)', boxShadow: '0 8px 32px rgba(38,33,28,0.08)' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-2xl font-serif italic" style={{ color: '#26211c' }}>7+</p>
            <p className="text-xs uppercase tracking-[0.18em] mt-0.5" style={{ color: '#9a8a76' }}>Years of Practice</p>
          </motion.div>

          {/* Floating tag */}
          <motion.div
            className="absolute -top-4 -right-2 md:-right-5 rounded-full px-4 py-2"
            style={{ background: '#6b7a53', color: 'white' }}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-[10px] uppercase tracking-widest">Dahisar Studio</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
