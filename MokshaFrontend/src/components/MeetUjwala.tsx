import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const PHOTO =
  'https://images.unsplash.com/photo-1581423880338-b9e4f9718df6?w=800&h=1000&fit=crop&auto=format'

const CREDENTIALS = ['RYT-500', 'Mysore Certified', '12+ Years', 'Prenatal Trained']

const FOCUS_AREAS = [
  { title: 'Power Yoga', desc: 'Dynamic strength-building sequences for intermediate and advanced practitioners.' },
  { title: 'Steam Yoga', desc: "Sātva's signature warm-room practice — opens the body twice as deep in half the time." },
  { title: 'Pregnancy Yoga', desc: 'Gentle, medically-informed sequences supporting each trimester and postpartum.' },
  { title: 'Posture Correction', desc: 'Structural alignment work targeting the specific patterns modern life creates.' },
  { title: 'Diet Guidance', desc: 'Ayurvedic and nutritional guidance as an integrated part of your wellness plan.' },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function MeetUjwala() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(photoRef.current, {
        x: -52, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
      gsap.from(textRef.current, {
        x: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24"
      style={{ background: '#ede7da' }}
      aria-labelledby="ujwala-heading"
    >
      <div className="absolute top-0 left-0 right-0" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-5 mb-14">
          <p className="text-xs uppercase tracking-[0.28em] shrink-0" style={{ color: '#9a8a76' }}>Our Founder</p>
          <div className="flex-1" style={{ height: 1, background: 'rgba(38,33,28,0.1)' }} aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-14 lg:gap-20 items-start">

          {/* Photo */}
          <div ref={photoRef}>
            <motion.div
              className="relative overflow-hidden group"
              style={{ borderRadius: 22, aspectRatio: '3/4', background: '#ddd5c8' }}
              whileHover={reduced ? {} : { scale: 1.012 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <motion.img
                src={PHOTO}
                alt="Ujwala Sharma, founder of Sātva Yoga, in a studio practice"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
                whileHover={reduced ? {} : { scale: 1.06 }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{ transformOrigin: 'center top' }}
              />
              {/* Overlay fades out on hover */}
              <motion.div
                className="absolute inset-0"
                style={{ background: 'rgba(107,122,83,0.12)' }}
                initial={{ opacity: 1 }}
                whileHover={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                aria-hidden="true"
              />
            </motion.div>

            {/* Name below photo on mobile */}
            <div className="mt-6 lg:hidden">
              <h2
                id="ujwala-heading"
                style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.9rem', color: '#26211c' }}
              >
                Ujwala Sharma
              </h2>
              <p className="text-xs uppercase tracking-[0.18em] mt-1" style={{ color: '#9a8a76' }}>Founder & Lead Instructor</p>
            </div>
          </div>

          {/* Text */}
          <div ref={textRef}>
            <div className="hidden lg:block mb-6">
              <h2
                id="ujwala-heading"
                style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#26211c', lineHeight: 1.12 }}
              >
                Ujwala Sharma
              </h2>
              <p className="text-xs uppercase tracking-[0.18em] mt-2" style={{ color: '#9a8a76' }}>Founder & Lead Instructor</p>
            </div>

            {/* Credential pills */}
            <div className="flex flex-wrap gap-2 mb-8" aria-label="Credentials">
              {CREDENTIALS.map((c) => (
                <span
                  key={c}
                  className="rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-wider"
                  style={{ background: 'rgba(107,122,83,0.12)', color: '#5c6b45', border: '1px solid rgba(107,122,83,0.2)' }}
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="text-sm md:text-base leading-relaxed mb-5" style={{ color: '#6b5e52', fontWeight: 300 }}>
              Ujwala founded Sātva in 2019 after a decade of teaching across Mumbai in borrowed community halls and borrowed time. Her training at the Mysore Institute gave her the rigour; twelve years of teaching gave her the patience; and the mothers, the office workers, and the teenagers of Dahisar gave her the purpose.
            </p>
            <p className="text-sm md:text-base leading-relaxed mb-10" style={{ color: '#6b5e52', fontWeight: 300 }}>
              She does not believe in one-size-fits-all yoga. She believes in listening — to the body in front of her, to the breath in the room, and to the quieter signals that students themselves have not yet noticed. Her sessions are equal parts practice and conversation.
            </p>

            {/* Focus areas list */}
            <p className="text-[10px] uppercase tracking-[0.24em] mb-0" style={{ color: '#9a8a76' }}>Focus Areas</p>

            <div className="mt-0">
              {FOCUS_AREAS.map((area, i) => (
                <motion.div
                  key={area.title}
                  className="flex gap-5 py-4"
                  style={{ borderTop: '1px solid rgba(38,33,28,0.1)' }}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                >
                  <span
                    className="text-xs tracking-[0.18em] mt-0.5 shrink-0 tabular-nums"
                    style={{ color: '#b5a898', fontFamily: 'var(--font-sans)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-medium mb-0.5" style={{ color: '#26211c' }}>{area.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#9a8a76', fontWeight: 300 }}>{area.desc}</p>
                  </div>
                </motion.div>
              ))}
              <div style={{ borderTop: '1px solid rgba(38,33,28,0.1)' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
