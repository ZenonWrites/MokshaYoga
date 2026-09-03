import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types & data ─────────────────────────────────────────────────────────────

const CLASS_TYPES = [
  'Power Yoga', 'Steam Yoga', 'Candle Yoga', 'Pregnancy Yoga',
  'Posture Correction', 'Aerobics', 'Zumba', 'Ice Therapy',
]
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_SHORT: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
}

interface Slot {
  id: string
  day: string
  startTime: string
  endTime: string
  classType: string
  capacity: number
  active: boolean
}

const INITIAL_SLOTS: Slot[] = [
  { id: '1', day: 'Monday',    startTime: '06:00', endTime: '07:00', classType: 'Power Yoga',        capacity: 15, active: true  },
  { id: '2', day: 'Monday',    startTime: '07:30', endTime: '08:15', classType: 'Posture Correction', capacity: 10, active: true  },
  { id: '3', day: 'Tuesday',   startTime: '09:00', endTime: '10:00', classType: 'Pregnancy Yoga',    capacity: 8,  active: true  },
  { id: '4', day: 'Wednesday', startTime: '10:30', endTime: '11:45', classType: 'Candle Yoga',       capacity: 12, active: true  },
  { id: '5', day: 'Thursday',  startTime: '17:00', endTime: '17:50', classType: 'Zumba',             capacity: 20, active: true  },
  { id: '6', day: 'Friday',    startTime: '18:30', endTime: '19:30', classType: 'Steam Yoga',        capacity: 10, active: false },
  { id: '7', day: 'Saturday',  startTime: '07:00', endTime: '08:00', classType: 'Power Yoga',        capacity: 15, active: true  },
  { id: '8', day: 'Sunday',    startTime: '09:00', endTime: '10:00', classType: 'Aerobics',          capacity: 18, active: true  },
]

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="relative flex-shrink-0 rounded-full transition-colors duration-200"
      style={{
        width: 36, height: 20,
        background: on ? '#6b7a53' : 'rgba(38,33,28,0.14)',
      }}
    >
      <motion.span
        animate={{ x: on ? 18 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
        style={{ boxShadow: '0 1px 3px rgba(38,33,28,0.18)' }}
      />
    </button>
  )
}

// ─── Panel form ───────────────────────────────────────────────────────────────

interface PanelProps {
  editing: Slot | null
  onClose: () => void
  onSave: (slot: Omit<Slot, 'id'> & { id?: string }) => void
}

function SlotPanel({ editing, onClose, onSave }: PanelProps) {
  const uid = useId()
  const [classType, setClassType] = useState(editing?.classType ?? CLASS_TYPES[0])
  const [day, setDay] = useState(editing?.day ?? DAYS[0])
  const [startTime, setStartTime] = useState(editing?.startTime ?? '08:00')
  const [endTime, setEndTime] = useState(editing?.endTime ?? '09:00')
  const [capacity, setCapacity] = useState(String(editing?.capacity ?? 12))
  const [active, setActive] = useState(editing?.active ?? true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ id: editing?.id, classType, day, startTime, endTime, capacity: parseInt(capacity) || 1, active })
    onClose()
  }

  const fieldCls = "w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-150"
  const fieldStyle = {
    background: 'rgba(38,33,28,0.04)',
    border: '1px solid rgba(38,33,28,0.12)',
    color: '#26211c',
    fontFamily: 'var(--font-sans)',
  }
  const onFocusStyle = (e: React.FocusEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = '#6b7a53'
  }
  const onBlurStyle = (e: React.FocusEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(38,33,28,0.12)'
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(38,33,28,0.28)' }}
        onClick={onClose}
      />
      {/* Panel */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="fixed right-0 top-0 h-full z-50 flex flex-col"
        style={{
          width: 400,
          maxWidth: '100vw',
          background: '#f7f2ea',
          borderLeft: '1px solid rgba(38,33,28,0.09)',
          boxShadow: '-8px 0 32px rgba(38,33,28,0.09)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(38,33,28,0.08)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#9a8a76' }}>
              {editing ? 'Edit' : 'New'} Slot
            </p>
            <h3 className="text-base font-medium mt-0.5" style={{ color: '#26211c' }}>
              {editing ? editing.classType : 'Add Class Slot'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/6"
            style={{ color: '#7a6b5d' }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Class type */}
          <div>
            <label htmlFor={`${uid}-class`} className="block text-[10px] uppercase tracking-[0.18em] mb-1.5" style={{ color: '#7a6b5d' }}>
              Class Type
            </label>
            <select
              id={`${uid}-class`}
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              className={fieldCls}
              style={fieldStyle}
              onFocus={onFocusStyle}
              onBlur={onBlurStyle}
            >
              {CLASS_TYPES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Day */}
          <div>
            <label htmlFor={`${uid}-day`} className="block text-[10px] uppercase tracking-[0.18em] mb-1.5" style={{ color: '#7a6b5d' }}>
              Day
            </label>
            <select
              id={`${uid}-day`}
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className={fieldCls}
              style={fieldStyle}
              onFocus={onFocusStyle}
              onBlur={onBlurStyle}
            >
              {DAYS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Time row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${uid}-start`} className="block text-[10px] uppercase tracking-[0.18em] mb-1.5" style={{ color: '#7a6b5d' }}>
                Start Time
              </label>
              <input
                id={`${uid}-start`}
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={fieldCls}
                style={fieldStyle}
                onFocus={onFocusStyle}
                onBlur={onBlurStyle}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-end`} className="block text-[10px] uppercase tracking-[0.18em] mb-1.5" style={{ color: '#7a6b5d' }}>
                End Time
              </label>
              <input
                id={`${uid}-end`}
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={fieldCls}
                style={fieldStyle}
                onFocus={onFocusStyle}
                onBlur={onBlurStyle}
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor={`${uid}-cap`} className="block text-[10px] uppercase tracking-[0.18em] mb-1.5" style={{ color: '#7a6b5d' }}>
              Capacity
            </label>
            <input
              id={`${uid}-cap`}
              type="number"
              min={1}
              max={100}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className={fieldCls}
              style={fieldStyle}
              onFocus={onFocusStyle}
              onBlur={onBlurStyle}
            />
          </div>

          {/* Active */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: 'rgba(38,33,28,0.04)', border: '1px solid rgba(38,33,28,0.08)' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: '#26211c' }}>Active</p>
              <p className="text-xs mt-0.5" style={{ color: '#9a8a76' }}>Slot visible and bookable</p>
            </div>
            <Toggle on={active} onChange={setActive} />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-5 flex gap-3" style={{ borderTop: '1px solid rgba(38,33,28,0.08)' }}>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full py-3 text-sm uppercase tracking-widest transition-colors hover:bg-black/6"
            style={{ border: '1px solid rgba(38,33,28,0.14)', color: '#5a5048' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form=""
            onClick={(e) => { e.currentTarget.closest('aside')?.querySelector('form')?.requestSubmit() }}
            className="flex-1 rounded-full py-3 text-sm uppercase tracking-widest font-medium transition-opacity hover:opacity-80"
            style={{ background: '#26211c', color: '#f7f2ea' }}
          >
            {editing ? 'Save Changes' : 'Add Slot'}
          </button>
        </div>
      </motion.aside>
    </>
  )
}

// ─── Delete modal ─────────────────────────────────────────────────────────────

function DeleteModal({ slot, onConfirm, onCancel }: { slot: Slot; onConfirm: () => void; onCancel: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(38,33,28,0.35)' }}
        onClick={onCancel}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          className="pointer-events-auto rounded-2xl p-6 w-full max-w-sm"
          style={{
            background: '#f7f2ea',
            boxShadow: '0 20px 60px rgba(38,33,28,0.18)',
            border: '1px solid rgba(38,33,28,0.08)',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(176,92,62,0.1)' }}
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" style={{ color: '#b05c3e' }}>
              <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3.5 16.5l6.5-13 6.5 13H3.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-base font-medium mb-1.5" style={{ color: '#26211c' }}>
            Delete this slot?
          </h3>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: '#7a6b5d' }}>
            <strong style={{ color: '#26211c' }}>{slot.classType}</strong> on {slot.day} at {slot.startTime} will be permanently removed.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-full py-2.5 text-sm uppercase tracking-widest transition-colors hover:bg-black/5"
              style={{ border: '1px solid rgba(38,33,28,0.14)', color: '#5a5048' }}
            >
              Keep
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-full py-2.5 text-sm uppercase tracking-widest font-medium transition-opacity hover:opacity-80"
              style={{ background: '#b05c3e', color: 'white' }}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ClassSlots() {
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS)
  const [panelOpen, setPanelOpen] = useState(false)
  const [editing, setEditing] = useState<Slot | null>(null)
  const [deleting, setDeleting] = useState<Slot | null>(null)

  const openAdd = () => { setEditing(null); setPanelOpen(true) }
  const openEdit = (s: Slot) => { setEditing(s); setPanelOpen(true) }
  const closePanel = () => { setPanelOpen(false); setEditing(null) }

  const handleSave = (data: Omit<Slot, 'id'> & { id?: string }) => {
    if (data.id) {
      setSlots((prev) => prev.map((s) => (s.id === data.id ? { ...s, ...data, id: s.id } : s)))
    } else {
      setSlots((prev) => [...prev, { ...data, id: String(Date.now()) }])
    }
  }

  const handleDelete = () => {
    if (deleting) setSlots((prev) => prev.filter((s) => s.id !== deleting.id))
    setDeleting(null)
  }

  const toggleActive = (id: string) =>
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)))

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] mb-0.5" style={{ color: '#9a8a76' }}>
            {slots.length} slots configured
          </p>
          <p className="text-sm" style={{ color: '#5a5048' }}>
            {slots.filter((s) => s.active).length} active · {slots.filter((s) => !s.active).length} inactive
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm uppercase tracking-widest font-medium transition-opacity hover:opacity-80"
          style={{ background: '#26211c', color: '#f7f2ea' }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add Slot
        </button>
      </div>

      {/* Table card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'white', border: '1px solid rgba(38,33,28,0.07)', boxShadow: '0 1px 4px rgba(38,33,28,0.04)' }}
      >
        {/* Desktop column headers */}
        <div
          className="hidden md:grid px-6 py-3 text-[10px] uppercase tracking-[0.18em]"
          style={{
            gridTemplateColumns: '110px 90px 140px 1fr 80px 80px 100px',
            color: '#9a8a76',
            borderBottom: '1px solid rgba(38,33,28,0.07)',
            background: 'rgba(38,33,28,0.015)',
          }}
        >
          <span>Day</span>
          <span>Time</span>
          <span>Class</span>
          <span></span>
          <span>Capacity</span>
          <span>Active</span>
          <span></span>
        </div>

        <ul>
          <AnimatePresence initial={false}>
            {slots.map((slot, i) => (
              <motion.li
                key={slot.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderBottom: i < slots.length - 1 ? '1px solid rgba(38,33,28,0.06)' : 'none' }}
              >
                {/* Mobile */}
                <div className="md:hidden px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#26211c' }}>{slot.classType}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9a8a76' }}>
                        {DAY_SHORT[slot.day]} · {slot.startTime}–{slot.endTime} · {slot.capacity} spots
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <Toggle on={slot.active} onChange={() => toggleActive(slot.id)} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => openEdit(slot)} className="text-xs uppercase tracking-wider transition-opacity hover:opacity-60" style={{ color: '#6b7a53' }}>Edit</button>
                    <button onClick={() => setDeleting(slot)} className="text-xs uppercase tracking-wider transition-opacity hover:opacity-60" style={{ color: '#b05c3e' }}>Delete</button>
                  </div>
                </div>

                {/* Desktop */}
                <div
                  className="hidden md:grid items-center px-6 py-4 gap-4"
                  style={{ gridTemplateColumns: '110px 90px 140px 1fr 80px 80px 100px' }}
                >
                  <span className="text-sm" style={{ color: '#26211c' }}>{slot.day}</span>
                  <span className="text-sm tabular-nums" style={{ color: '#5a5048' }}>{slot.startTime}</span>
                  <span className="text-sm font-medium" style={{ color: '#26211c' }}>{slot.classType}</span>
                  <span className="text-xs" style={{ color: '#9a8a76' }}>{slot.startTime}–{slot.endTime}</span>
                  <span className="text-sm tabular-nums" style={{ color: '#5a5048' }}>{slot.capacity}</span>
                  <Toggle on={slot.active} onChange={() => toggleActive(slot.id)} />
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => openEdit(slot)}
                      className="text-xs uppercase tracking-wider transition-opacity hover:opacity-60"
                      style={{ color: '#6b7a53' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(slot)}
                      className="text-xs uppercase tracking-wider transition-opacity hover:opacity-60"
                      style={{ color: '#b05c3e' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>

          {slots.length === 0 && (
            <li className="px-6 py-12 text-center">
              <p className="text-sm" style={{ color: '#9a8a76' }}>No slots yet. Add your first slot above.</p>
            </li>
          )}
        </ul>
      </div>

      {/* Slide-in panel */}
      <AnimatePresence>
        {panelOpen && (
          <SlotPanel editing={editing} onClose={closePanel} onSave={handleSave} />
        )}
      </AnimatePresence>

      {/* Delete modal */}
      <AnimatePresence>
        {deleting && (
          <DeleteModal slot={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
