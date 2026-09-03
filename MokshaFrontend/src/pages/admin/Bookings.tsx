import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types & data ─────────────────────────────────────────────────────────────

type BookingStatus = 'confirmed' | 'attended' | 'cancelled'

interface Booking {
  id: string
  clientName: string
  phone: string
  classType: string
  date: string
  time: string
  status: BookingStatus
}

const INITIAL_BOOKINGS: Booking[] = [
  { id: '1',  clientName: 'Priya Desai',     phone: '98201 44312', classType: 'Power Yoga',        date: '2026-08-31', time: '06:00', status: 'confirmed'  },
  { id: '2',  clientName: 'Sneha Kulkarni',  phone: '99676 12034', classType: 'Steam Yoga',        date: '2026-08-31', time: '18:30', status: 'confirmed'  },
  { id: '3',  clientName: 'Meera Joshi',     phone: '98334 77821', classType: 'Pregnancy Yoga',    date: '2026-08-31', time: '09:00', status: 'attended'   },
  { id: '4',  clientName: 'Anita Shah',      phone: '97692 30091', classType: 'Candle Yoga',       date: '2026-08-30', time: '10:30', status: 'attended'   },
  { id: '5',  clientName: 'Kavita Rao',      phone: '93215 88740', classType: 'Zumba',             date: '2026-08-30', time: '17:00', status: 'cancelled'  },
  { id: '6',  clientName: 'Ritu Nair',       phone: '77009 22341', classType: 'Posture Correction',date: '2026-08-30', time: '07:30', status: 'attended'   },
  { id: '7',  clientName: 'Divya Menon',     phone: '94510 66782', classType: 'Power Yoga',        date: '2026-08-29', time: '06:00', status: 'confirmed'  },
  { id: '8',  clientName: 'Sunita Pawar',    phone: '98763 55120', classType: 'Aerobics',          date: '2026-08-29', time: '09:00', status: 'attended'   },
  { id: '9',  clientName: 'Rekha Iyer',      phone: '91234 09867', classType: 'Steam Yoga',        date: '2026-08-29', time: '18:30', status: 'cancelled'  },
  { id: '10', clientName: 'Pooja Hegde',     phone: '87654 32100', classType: 'Candle Yoga',       date: '2026-08-28', time: '10:30', status: 'confirmed'  },
  { id: '11', clientName: 'Lalita Sharma',   phone: '99001 45678', classType: 'Pregnancy Yoga',    date: '2026-08-28', time: '09:00', status: 'attended'   },
  { id: '12', clientName: 'Geeta Pillai',    phone: '93456 78901', classType: 'Zumba',             date: '2026-08-27', time: '17:00', status: 'confirmed'  },
]

const STATUS_META: Record<BookingStatus, { label: string; bg: string; text: string; dot: string }> = {
  confirmed: { label: 'Confirmed', bg: 'rgba(107,122,83,0.12)', text: '#4a6634',  dot: '#6b7a53' },
  attended:  { label: 'Attended',  bg: 'rgba(90,112,138,0.12)', text: '#2d5a7a',  dot: '#5a708a' },
  cancelled: { label: 'Cancelled', bg: 'rgba(176,92,62,0.12)',  text: '#8a3d22',  dot: '#b05c3e' },
}

const STATUSES: BookingStatus[] = ['confirmed', 'attended', 'cancelled']

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: BookingStatus }) {
  const meta = STATUS_META[status]
  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider"
      style={{ background: meta.bg, color: meta.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: meta.dot }} />
      {meta.label}
    </motion.span>
  )
}

// ─── Status changer dropdown ──────────────────────────────────────────────────

function StatusChanger({
  bookingId,
  current,
  onChange,
}: {
  bookingId: string
  current: BookingStatus
  onChange: (id: string, status: BookingStatus) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="p-1.5 rounded-lg transition-colors hover:bg-black/6"
        aria-label="Change status"
        style={{ color: '#7a6b5d' }}
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
          <circle cx="8" cy="3" r="1.2" fill="currentColor" />
          <circle cx="8" cy="8" r="1.2" fill="currentColor" />
          <circle cx="8" cy="13" r="1.2" fill="currentColor" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -4 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-8 z-20 rounded-xl overflow-hidden py-1"
              style={{
                background: 'white',
                boxShadow: '0 8px 24px rgba(38,33,28,0.12)',
                border: '1px solid rgba(38,33,28,0.08)',
                minWidth: 140,
              }}
            >
              {STATUSES.filter((s) => s !== current).map((s) => {
                const meta = STATUS_META[s]
                return (
                  <button
                    key={s}
                    onClick={(e) => { e.stopPropagation(); onChange(bookingId, s); setOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-left transition-colors hover:bg-black/4"
                    style={{ color: '#26211c' }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.dot }} />
                    Mark as {meta.label}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

const FILTER_OPTIONS: Array<{ label: string; value: BookingStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Attended', value: 'attended' },
  { label: 'Cancelled', value: 'cancelled' },
]

// ─── Main page ────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS)
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = filter === 'all' || b.status === filter
      const q = search.toLowerCase()
      const matchSearch = !q || b.clientName.toLowerCase().includes(q) || b.classType.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [bookings, filter, search])

  const handleStatusChange = (id: string, status: BookingStatus) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg viewBox="0 0 16 16" fill="none" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#9a8a76' }}>
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search name or class…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full pl-9 pr-4 py-2.5 text-sm outline-none transition-all duration-150"
            style={{
              background: 'white',
              border: '1px solid rgba(38,33,28,0.1)',
              color: '#26211c',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#6b7a53')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(38,33,28,0.1)')}
          />
        </div>

        {/* Status filters */}
        <div
          className="flex items-center gap-1 rounded-full p-1"
          style={{ background: 'rgba(38,33,28,0.06)' }}
        >
          {FILTER_OPTIONS.map(({ label, value }) => {
            const active = filter === value
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className="relative rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors duration-150"
                style={{ color: active ? '#f7f2ea' : '#7a6b5d' }}
              >
                {active && (
                  <motion.span
                    layoutId="bookings-filter-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: '#26211c' }}
                    transition={{ type: 'spring', stiffness: 360, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Summary row */}
      <div className="flex gap-4 mb-4">
        {STATUSES.map((s) => {
          const count = bookings.filter((b) => b.status === s).length
          const meta = STATUS_META[s]
          return (
            <div key={s} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: meta.dot }} />
              <span className="text-xs" style={{ color: '#9a8a76' }}>
                {count} {meta.label.toLowerCase()}
              </span>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'white', border: '1px solid rgba(38,33,28,0.07)', boxShadow: '0 1px 4px rgba(38,33,28,0.04)' }}
      >
        {/* Desktop headers */}
        <div
          className="hidden md:grid px-6 py-3 text-[10px] uppercase tracking-[0.18em]"
          style={{
            gridTemplateColumns: '1fr 160px 90px 90px 120px 48px',
            color: '#9a8a76',
            borderBottom: '1px solid rgba(38,33,28,0.07)',
            background: 'rgba(38,33,28,0.015)',
          }}
        >
          <span>Client</span>
          <span>Class</span>
          <span>Date</span>
          <span>Time</span>
          <span>Status</span>
          <span></span>
        </div>

        <ul>
          <AnimatePresence initial={false}>
            {filtered.map((booking, i) => (
              <motion.li
                key={booking.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(38,33,28,0.06)' : 'none' }}
              >
                {/* Mobile */}
                <div className="md:hidden px-5 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#26211c' }}>{booking.clientName}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9a8a76' }}>{booking.phone}</p>
                    </div>
                    <AnimatePresence mode="wait">
                      <StatusPill key={booking.status} status={booking.status} />
                    </AnimatePresence>
                  </div>
                  <p className="text-xs" style={{ color: '#5a5048' }}>
                    {booking.classType} · {fmtDate(booking.date)} · {booking.time}
                  </p>
                  <div className="mt-2">
                    <StatusChanger bookingId={booking.id} current={booking.status} onChange={handleStatusChange} />
                  </div>
                </div>

                {/* Desktop */}
                <div
                  className="hidden md:grid items-center px-6 py-4 gap-4"
                  style={{ gridTemplateColumns: '1fr 160px 90px 90px 120px 48px' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#26211c' }}>{booking.clientName}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9a8a76' }}>{booking.phone}</p>
                  </div>
                  <span className="text-sm" style={{ color: '#5a5048' }}>{booking.classType}</span>
                  <span className="text-sm tabular-nums" style={{ color: '#5a5048' }}>{fmtDate(booking.date)}</span>
                  <span className="text-sm tabular-nums" style={{ color: '#5a5048' }}>{booking.time}</span>
                  <AnimatePresence mode="wait">
                    <StatusPill key={booking.status} status={booking.status} />
                  </AnimatePresence>
                  <StatusChanger bookingId={booking.id} current={booking.status} onChange={handleStatusChange} />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <li className="px-6 py-12 text-center">
              <p className="text-sm" style={{ color: '#9a8a76' }}>
                {search ? `No bookings matching "${search}"` : 'No bookings in this category.'}
              </p>
            </li>
          )}
        </ul>

        <div
          className="px-6 py-3"
          style={{ borderTop: '1px solid rgba(38,33,28,0.07)', background: 'rgba(38,33,28,0.015)' }}
        >
          <p className="text-xs" style={{ color: '#9a8a76' }}>
            Showing {filtered.length} of {bookings.length} bookings
          </p>
        </div>
      </div>
    </div>
  )
}
