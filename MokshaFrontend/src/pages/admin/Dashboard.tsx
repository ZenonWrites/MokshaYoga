import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Today's Bookings",
    value: 14,
    unit: '',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: '#6b7a53',
    bg: 'rgba(107,122,83,0.08)',
    note: '+3 vs yesterday',
    noteUp: true,
  },
  {
    label: "Week's Bookings",
    value: 87,
    unit: '',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <rect x="2.5" y="3.5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6.5 2v3M13.5 2v3M2.5 8h15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    accent: '#8a7060',
    bg: 'rgba(138,112,96,0.08)',
    note: '+12 vs last week',
    noteUp: true,
  },
  {
    label: 'Unread Messages',
    value: 3,
    unit: '',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path
          d="M17 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3l3 3 3-3h5a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
    accent: '#b05c3e',
    bg: 'rgba(176,92,62,0.08)',
    note: 'Needs attention',
    noteUp: false,
  },
  {
    label: 'Active Slots',
    value: 12,
    unit: '',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M4 14l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
    accent: '#5a7a8a',
    bg: 'rgba(90,122,138,0.08)',
    note: 'Across 3 studios',
    noteUp: true,
  },
]

const SCHEDULE = [
  { time: '06:00', duration: '60 min', class: 'Power Yoga', instructor: 'Ujwala S.', booked: 12, capacity: 15, level: 'All Levels' },
  { time: '07:30', duration: '45 min', class: 'Posture Correction', instructor: 'Priya M.', booked: 8, capacity: 10, level: 'Beginner' },
  { time: '09:00', duration: '60 min', class: 'Pregnancy Yoga', instructor: 'Ujwala S.', booked: 5, capacity: 8, level: 'Special' },
  { time: '10:30', duration: '75 min', class: 'Candle Yoga', instructor: 'Meera K.', booked: 11, capacity: 12, level: 'Intermediate' },
  { time: '17:00', duration: '50 min', class: 'Zumba', instructor: 'Ananya R.', booked: 14, capacity: 20, level: 'All Levels' },
  { time: '18:30', duration: '60 min', class: 'Steam Yoga', instructor: 'Ujwala S.', booked: 9, capacity: 10, level: 'All Levels' },
]

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  'All Levels': { bg: 'rgba(107,122,83,0.12)', text: '#5a6b44' },
  Beginner: { bg: 'rgba(90,122,138,0.12)', text: '#3d6b7a' },
  Intermediate: { bg: 'rgba(138,112,96,0.12)', text: '#7a5c44' },
  Special: { bg: 'rgba(176,92,62,0.12)', text: '#8a4a2e' },
}

// ─── Count-up ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  accent,
  bg,
  note,
  noteUp,
  delay,
}: (typeof STATS)[0] & { delay: number }) {
  const numRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (reduced) { setDisplayed(value); return }
    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: value,
      duration: 1.4,
      delay,
      ease: 'power3.out',
      onUpdate: () => setDisplayed(Math.round(obj.val)),
    })
    return () => { tween.kill() }
  }, [value, delay, reduced])

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-5"
      style={{
        background: 'white',
        border: '1px solid rgba(38,33,28,0.07)',
        boxShadow: '0 1px 4px rgba(38,33,28,0.04)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: '#9a8a76' }}>
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: bg, color: accent }}
        >
          {icon}
        </div>
      </div>
      <p
        className="text-4xl font-medium leading-none mb-2 tabular-nums"
        style={{ color: '#26211c', fontFamily: 'var(--font-sans)' }}
      >
        <span ref={numRef}>{displayed}</span>
      </p>
      <p className="text-xs flex items-center gap-1.5" style={{ color: noteUp ? '#6b7a53' : '#b05c3e' }}>
        {noteUp ? (
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <path d="M6 9V3M3 6l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
            <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        )}
        {note}
      </p>
    </motion.div>
  )
}

// ─── Capacity bar ─────────────────────────────────────────────────────────────

function CapacityBar({ booked, capacity }: { booked: number; capacity: number }) {
  const pct = Math.min(booked / capacity, 1)
  const full = pct >= 0.9
  return (
    <div className="flex items-center gap-2.5 min-w-[80px]">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 4, background: 'rgba(38,33,28,0.08)' }}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="h-full rounded-full origin-left"
          style={{ background: full ? '#b05c3e' : '#6b7a53' }}
        />
      </div>
      <span className="text-xs tabular-nums" style={{ color: '#9a8a76', minWidth: 36 }}>
        {booked}/{capacity}
      </span>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const now = new Date()
  const currentHour = now.getHours() + now.getMinutes() / 60

  return (
    <div>
      {/* Eyebrow */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.22em] mb-1" style={{ color: '#9a8a76' }}>
          {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h2
          className="text-2xl font-medium leading-tight"
          style={{ color: '#26211c', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
        >
          Good {currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening'}, Ujwala.
        </h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.08} />
        ))}
      </div>

      {/* Today's Schedule */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'white',
          border: '1px solid rgba(38,33,28,0.07)',
          boxShadow: '0 1px 4px rgba(38,33,28,0.04)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(38,33,28,0.07)' }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.18em] mb-0.5" style={{ color: '#9a8a76' }}>
              Today
            </p>
            <h3 className="text-base font-medium" style={{ color: '#26211c' }}>
              Class Schedule
            </h3>
          </div>
          <span
            className="text-xs uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(107,122,83,0.1)', color: '#6b7a53' }}
          >
            {SCHEDULE.length} classes
          </span>
        </div>

        {/* Column headers */}
        <div
          className="hidden md:grid px-6 py-2.5 text-[10px] uppercase tracking-[0.18em]"
          style={{
            gridTemplateColumns: '100px 1fr 120px 100px 120px',
            color: '#9a8a76',
            borderBottom: '1px solid rgba(38,33,28,0.06)',
          }}
        >
          <span>Time</span>
          <span>Class</span>
          <span>Instructor</span>
          <span>Level</span>
          <span>Capacity</span>
        </div>

        {/* Rows */}
        <ul>
          {SCHEDULE.map((slot, i) => {
            const [h, m] = slot.time.split(':').map(Number)
            const slotHour = h + m / 60
            const isPast = slotHour + 1 < currentHour
            const isNow = slotHour <= currentHour && currentHour < slotHour + 1
            const levelStyle = LEVEL_COLORS[slot.level] ?? LEVEL_COLORS['All Levels']

            return (
              <motion.li
                key={slot.time}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.12 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
                style={{
                  borderBottom: i < SCHEDULE.length - 1 ? '1px solid rgba(38,33,28,0.06)' : 'none',
                  opacity: isPast ? 0.42 : 1,
                }}
              >
                {isNow && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
                    style={{ background: '#6b7a53' }}
                    aria-hidden="true"
                  />
                )}
                {/* Mobile layout */}
                <div className="md:hidden px-6 py-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="text-xs font-medium tabular-nums" style={{ color: '#9a8a76' }}>
                        {slot.time}
                      </span>
                      {isNow && (
                        <span
                          className="ml-2 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(107,122,83,0.15)', color: '#6b7a53' }}
                        >
                          Now
                        </span>
                      )}
                      <p className="text-sm font-medium mt-0.5" style={{ color: '#26211c' }}>
                        {slot.class}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#9a8a76' }}>
                        {slot.instructor} · {slot.duration}
                      </p>
                    </div>
                    <span
                      className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0"
                      style={{ background: levelStyle.bg, color: levelStyle.text }}
                    >
                      {slot.level}
                    </span>
                  </div>
                  <CapacityBar booked={slot.booked} capacity={slot.capacity} />
                </div>

                {/* Desktop layout */}
                <div
                  className="hidden md:grid items-center px-6 py-4 gap-4"
                  style={{ gridTemplateColumns: '100px 1fr 120px 100px 120px' }}
                >
                  <div>
                    <span className="text-sm font-medium tabular-nums" style={{ color: '#26211c' }}>
                      {slot.time}
                    </span>
                    {isNow && (
                      <span
                        className="block text-[9px] uppercase tracking-wider mt-0.5"
                        style={{ color: '#6b7a53' }}
                      >
                        Now
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#26211c' }}>
                      {slot.class}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#9a8a76' }}>
                      {slot.duration}
                    </p>
                  </div>
                  <p className="text-sm" style={{ color: '#5a5048' }}>
                    {slot.instructor}
                  </p>
                  <span
                    className="text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-full inline-block w-fit"
                    style={{ background: levelStyle.bg, color: levelStyle.text }}
                  >
                    {slot.level}
                  </span>
                  <CapacityBar booked={slot.booked} capacity={slot.capacity} />
                </div>
              </motion.li>
            )
          })}
        </ul>

        {/* Footer */}
        <div
          className="px-6 py-3 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(38,33,28,0.07)', background: 'rgba(38,33,28,0.015)' }}
        >
          <p className="text-xs" style={{ color: '#9a8a76' }}>
            Total capacity: {SCHEDULE.reduce((a, s) => a + s.capacity, 0)} slots ·{' '}
            {SCHEDULE.reduce((a, s) => a + s.booked, 0)} booked today
          </p>
          <button
            className="text-xs uppercase tracking-wider transition-opacity hover:opacity-60"
            style={{ color: '#6b7a53' }}
          >
            Manage slots →
          </button>
        </div>
      </div>
    </div>
  )
}
