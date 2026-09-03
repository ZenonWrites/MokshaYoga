import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const BADGES = [
  {
    label: 'Women-Owned',
    icon: (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="8" cy="6" r="3.5" />
        <path d="M8 9.5V14M6 12h4" />
      </svg>
    ),
  },
  {
    label: 'Wheelchair Accessible',
    icon: (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="3" r="1.5" />
        <path d="M8 5v4l2 2" />
        <path d="M5 8H3l1.5 4.5A1.5 1.5 0 006 14h4" />
        <circle cx="11" cy="12.5" r="1.5" />
      </svg>
    ),
  },
  {
    label: 'Kid Friendly',
    icon: (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M8 2C5.8 2 4 3.8 4 6c0 2.6 4 8 4 8s4-5.4 4-8c0-2.2-1.8-4-4-4z" />
        <circle cx="8" cy="6" r="1.5" />
      </svg>
    ),
  },
  {
    label: '4.8★ Rating',
    icon: (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
        <path d="M8 1.5l1.8 3.6 4 .58-2.9 2.83.68 3.99L8 10.35l-3.58 1.15.68-3.99L2.2 5.68l4-.58L8 1.5z" />
      </svg>
    ),
    accent: true,
  },
  {
    label: '94 Verified Reviews',
    icon: (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H3a1 1 0 00-1 1v8a1 1 0 001 1h3l2 2 2-2h3a1 1 0 001-1V3a1 1 0 00-1-1z" />
        <path d="M5 6h6M5 9h4" />
      </svg>
    ),
  },
  {
    label: 'Steam Yoga Studio',
    icon: (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M5 13c0-2 2-3 2-5" />
        <path d="M8 13c0-2 2-3 2-5" />
        <path d="M11 13c0-2 2-3 2-5" />
        <path d="M3 10h10" />
      </svg>
    ),
  },
]

export default function TrustBadges() {
  const reduced = useReducedMotion()

  return (
    <div
      className="px-8 md:px-16 lg:px-24 py-10"
      style={{ background: '#ede7da', borderTop: '1px solid rgba(38,33,28,0.1)', borderBottom: '1px solid rgba(38,33,28,0.1)' }}
      aria-label="Studio credentials and accessibility"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
        {BADGES.map((b, i) => (
          <motion.div
            key={b.label}
            className="flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: b.accent ? 'rgba(107,122,83,0.14)' : 'rgba(247,242,234,0.7)',
              border: `1px solid ${b.accent ? 'rgba(107,122,83,0.3)' : 'rgba(38,33,28,0.1)'}`,
              color: b.accent ? '#5c6b45' : '#5e4e3a',
            }}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ color: b.accent ? '#6b7a53' : '#8a7a6a' }} aria-hidden="true">
              {b.icon}
            </span>
            <span className="text-[10px] uppercase tracking-wider whitespace-nowrap">{b.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
