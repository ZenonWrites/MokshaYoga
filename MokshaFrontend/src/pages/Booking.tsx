import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "react-router-dom"
import { useReducedMotion } from "../hooks/useReducedMotion"
import { useMagneticButton } from "../hooks/useMagneticCursor"

// ─── Grid constants ────────────────────────────────────────────────────────────

const HOUR_START = 7
const HOUR_END = 20
const TOTAL_HOURS = HOUR_END - HOUR_START
const PX_PER_HOUR = 84
const GRID_HEIGHT = TOTAL_HOURS * PX_PER_HOUR
const HOURS = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => HOUR_START + i)
const DAY_ABBR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// ─── Types ─────────────────────────────────────────────────────────────────────

type Category = "yoga" | "aerobics" | "zumba"
type FilterKey = "all" | Category
type SubmitState = "idle" | "loading" | "success"

interface Slot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  classType: string
  category: Category
  instructor: string
  capacity: number
  booked: number
}

interface UserBooking {
  id: string
  slotId: string
  classType: string
  category: Category
  date: Date
  startTime: string
  endTime: string
  instructor: string
  participants: number
  status: "confirmed" | "cancelled"
}

interface ToastData {
  id: number
  message: string
}

// ─── Category colours ─────────────────────────────────────────────────────────

const CAT: Record<Category, {
  bg: string
  border: string
  text: string
  sub: string
  dot: string
}> = {
  yoga: {
    bg: "rgba(107,122,83,0.13)",
    border: "rgba(107,122,83,0.4)",
    text: "#3a5726",
    sub: "#5a7a46",
    dot: "#6b7a53",
  },
  aerobics: {
    bg: "rgba(138,100,68,0.12)",
    border: "rgba(138,100,68,0.38)",
    text: "#5a3d20",
    sub: "#7a5a3a",
    dot: "#8a6448",
  },
  zumba: {
    bg: "rgba(172,134,54,0.12)",
    border: "rgba(172,134,54,0.36)",
    text: "#7a5814",
    sub: "#9a7830",
    dot: "#ac8636",
  },
}

const FILTER_TABS: { label: string; value: FilterKey }[] = [
  { label: "All", value: "all" },
  { label: "Yoga", value: "yoga" },
  { label: "Aerobics", value: "aerobics" },
  { label: "Zumba", value: "zumba" },
]

// ─── Instructor & class data ──────────────────────────────────────────────────

const INSTRUCTOR_DATA: Record<string, {
  fullName: string
  bio: string
  creds: string[]
}> = {
  "Ujwala S.": {
    fullName: "Ujwala Sharma",
    bio: "Founder & lead instructor. 12+ years of practice, trained in Mysore, certified prenatal yoga.",
    creds: ["RYT-500", "Mysore Certified", "Prenatal"],
  },
  "Priya M.": {
    fullName: "Priya Menon",
    bio: "Therapeutic yoga & posture correction specialist, focused on spinal health.",
    creds: ["RYT-200", "Therapeutic"],
  },
  "Meera K.": {
    fullName: "Meera Kulkarni",
    bio: "Candle and restorative yoga expert, creating deeply calming practice environments.",
    creds: ["RYT-300", "Restorative"],
  },
  "Ananya R.": {
    fullName: "Ananya Rao",
    bio: "High-energy aerobics & Zumba instructor with a background in dance fitness.",
    creds: ["ACE Certified", "Zumba Licensed"],
  },
}

const CLASS_DESC: Record<string, string> = {
  "Power Yoga":
    "Vigorous, fitness-based vinyasa that builds strength, flexibility, and mental endurance.",
  "Steam Yoga":
    "Traditional asanas in our heated steam room — deepens stretch and detoxifies.",
  "Candle Yoga":
    "Slow, candlelit session focused on breath, release, and gentle restoration.",
  "Pregnancy Yoga":
    "Specially designed sequences supporting expecting mothers through each trimester.",
  "Posture Correction":
    "Targeted practice addressing postural imbalances — ideal for desk workers.",
  Aerobics:
    "High-energy cardio set to upbeat music, improving cardiovascular health.",
  Zumba: "Dance-fitness fusion combining Latin rhythms with interval training.",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toMins(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

function getMonday(d: Date): Date {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  const day = c.getDay()
  c.setDate(c.getDate() - (day === 0 ? 6 : day - 1))
  return c
}

function addDays(d: Date, n: number): Date {
  const c = new Date(d)
  c.setDate(c.getDate() + n)
  return c
}

function fmtMonthRange(mon: Date): string {
  const sun = addDays(mon, 6)
  const a = mon.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  const b = sun.toLocaleDateString("en-IN", {
    day: "numeric",
    month: mon.getMonth() !== sun.getMonth() ? "short" : undefined,
  })
  return `${a} – ${b}, ${sun.getFullYear()}`
}

function fmtBookingDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

// ─── URL param → FilterKey ────────────────────────────────────────────────────

function typeParamToFilter(type: string | null): FilterKey {
  if (!type) return "all"
  const t = type.toLowerCase()
  if (
    [
      "yoga",
      "power-yoga",
      "steam-yoga",
      "candle-yoga",
      "pregnancy-yoga",
      "posture-correction",
    ].includes(t)
  )
    return "yoga"
  if (t === "aerobics") return "aerobics"
  if (t === "zumba") return "zumba"
  return "all"
}

// ─── Initial mock bookings (for logged-in users) ──────────────────────────────

function getInitialBookings(): UserBooking[] {
  if (!sessionStorage.getItem("sativa_role")) return []
  const mon = getMonday(new Date())
  return [
    {
      id: "ub-init-1",
      slotId: "slot-0",
      classType: "Power Yoga",
      category: "yoga",
      date: addDays(mon, 0),
      startTime: "07:00",
      endTime: "08:00",
      instructor: "Ujwala S.",
      participants: 1,
      status: "confirmed",
    },
    {
      id: "ub-init-2",
      slotId: "slot-20",
      classType: "Steam Yoga",
      category: "yoga",
      date: addDays(mon, 4),
      startTime: "19:00",
      endTime: "20:00",
      instructor: "Ujwala S.",
      participants: 2,
      status: "confirmed",
    },
    {
      id: "ub-init-3",
      slotId: "slot-6",
      classType: "Zumba",
      category: "zumba",
      date: addDays(mon, 1),
      startTime: "17:00",
      endTime: "17:50",
      instructor: "Ananya R.",
      participants: 1,
      status: "confirmed",
    },
  ]
}

// ─── Stub APIs ────────────────────────────────────────────────────────────────

const BASE: Omit<Slot, "id">[] = [
  {
    dayOfWeek: 0,
    startTime: "07:00",
    endTime: "08:00",
    classType: "Power Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 15,
    booked: 12,
  },
  {
    dayOfWeek: 0,
    startTime: "08:30",
    endTime: "09:20",
    classType: "Aerobics",
    category: "aerobics",
    instructor: "Ananya R.",
    capacity: 20,
    booked: 8,
  },
  {
    dayOfWeek: 0,
    startTime: "10:30",
    endTime: "11:30",
    classType: "Candle Yoga",
    category: "yoga",
    instructor: "Meera K.",
    capacity: 12,
    booked: 12,
  },
  {
    dayOfWeek: 0,
    startTime: "18:30",
    endTime: "19:30",
    classType: "Steam Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 10,
    booked: 7,
  },
  {
    dayOfWeek: 1,
    startTime: "07:30",
    endTime: "08:15",
    classType: "Posture Correction",
    category: "yoga",
    instructor: "Priya M.",
    capacity: 10,
    booked: 6,
  },
  {
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "10:00",
    classType: "Pregnancy Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 8,
    booked: 5,
  },
  {
    dayOfWeek: 1,
    startTime: "17:00",
    endTime: "17:50",
    classType: "Zumba",
    category: "zumba",
    instructor: "Ananya R.",
    capacity: 20,
    booked: 14,
  },
  {
    dayOfWeek: 1,
    startTime: "19:00",
    endTime: "20:00",
    classType: "Power Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 15,
    booked: 9,
  },
  {
    dayOfWeek: 2,
    startTime: "07:00",
    endTime: "07:50",
    classType: "Aerobics",
    category: "aerobics",
    instructor: "Ananya R.",
    capacity: 20,
    booked: 20,
  },
  {
    dayOfWeek: 2,
    startTime: "08:00",
    endTime: "09:00",
    classType: "Power Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 15,
    booked: 11,
  },
  {
    dayOfWeek: 2,
    startTime: "10:30",
    endTime: "11:30",
    classType: "Candle Yoga",
    category: "yoga",
    instructor: "Meera K.",
    capacity: 12,
    booked: 8,
  },
  {
    dayOfWeek: 2,
    startTime: "18:00",
    endTime: "18:50",
    classType: "Zumba",
    category: "zumba",
    instructor: "Ananya R.",
    capacity: 20,
    booked: 17,
  },
  {
    dayOfWeek: 3,
    startTime: "07:30",
    endTime: "08:15",
    classType: "Posture Correction",
    category: "yoga",
    instructor: "Priya M.",
    capacity: 10,
    booked: 10,
  },
  {
    dayOfWeek: 3,
    startTime: "09:00",
    endTime: "10:00",
    classType: "Pregnancy Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 8,
    booked: 4,
  },
  {
    dayOfWeek: 3,
    startTime: "17:30",
    endTime: "18:20",
    classType: "Zumba",
    category: "zumba",
    instructor: "Ananya R.",
    capacity: 20,
    booked: 13,
  },
  {
    dayOfWeek: 3,
    startTime: "18:30",
    endTime: "19:30",
    classType: "Steam Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 10,
    booked: 9,
  },
  {
    dayOfWeek: 4,
    startTime: "07:00",
    endTime: "08:00",
    classType: "Power Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 15,
    booked: 15,
  },
  {
    dayOfWeek: 4,
    startTime: "08:30",
    endTime: "09:20",
    classType: "Aerobics",
    category: "aerobics",
    instructor: "Ananya R.",
    capacity: 20,
    booked: 12,
  },
  {
    dayOfWeek: 4,
    startTime: "11:00",
    endTime: "12:00",
    classType: "Candle Yoga",
    category: "yoga",
    instructor: "Meera K.",
    capacity: 12,
    booked: 7,
  },
  {
    dayOfWeek: 4,
    startTime: "17:30",
    endTime: "18:20",
    classType: "Zumba",
    category: "zumba",
    instructor: "Ananya R.",
    capacity: 20,
    booked: 11,
  },
  {
    dayOfWeek: 4,
    startTime: "19:00",
    endTime: "20:00",
    classType: "Steam Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 10,
    booked: 6,
  },
  {
    dayOfWeek: 5,
    startTime: "07:00",
    endTime: "08:00",
    classType: "Power Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 15,
    booked: 14,
  },
  {
    dayOfWeek: 5,
    startTime: "08:00",
    endTime: "08:50",
    classType: "Aerobics",
    category: "aerobics",
    instructor: "Ananya R.",
    capacity: 20,
    booked: 16,
  },
  {
    dayOfWeek: 5,
    startTime: "10:00",
    endTime: "11:00",
    classType: "Pregnancy Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 8,
    booked: 6,
  },
  {
    dayOfWeek: 5,
    startTime: "17:00",
    endTime: "17:50",
    classType: "Zumba",
    category: "zumba",
    instructor: "Ananya R.",
    capacity: 20,
    booked: 20,
  },
  {
    dayOfWeek: 5,
    startTime: "18:30",
    endTime: "19:30",
    classType: "Steam Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 10,
    booked: 8,
  },
  {
    dayOfWeek: 6,
    startTime: "08:00",
    endTime: "09:00",
    classType: "Power Yoga",
    category: "yoga",
    instructor: "Ujwala S.",
    capacity: 15,
    booked: 10,
  },
  {
    dayOfWeek: 6,
    startTime: "10:00",
    endTime: "11:00",
    classType: "Candle Yoga",
    category: "yoga",
    instructor: "Meera K.",
    capacity: 12,
    booked: 5,
  },
  {
    dayOfWeek: 6,
    startTime: "16:00",
    endTime: "16:50",
    classType: "Aerobics",
    category: "aerobics",
    instructor: "Ananya R.",
    capacity: 20,
    booked: 9,
  },
]

async function fetchSlots(_weekStart: Date): Promise<Slot[]> {
  await new Promise((r) => setTimeout(r, 480))
  return BASE.map((s, i) => ({ ...s, id: `slot-${i}` }))
}

async function submitBooking(_payload: unknown): Promise<void> {
  await new Promise((r) => setTimeout(r, 1300))
}

async function cancelBooking(_bookingId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 700))
}

// ─── useIsMobile ──────────────────────────────────────────────────────────────

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  )
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return mobile
}

// ─── Slot card ────────────────────────────────────────────────────────────────

function SlotCard({
  slot,
  visible,
  index,
  booked,
  onBook,
}: {
  slot: Slot
  visible: boolean
  index: number
  booked: boolean
  onBook: (s: Slot) => void
}) {
  const reduced = useReducedMotion()
  const startMins = toMins(slot.startTime)
  const endMins = toMins(slot.endTime)
  const topPx = ((startMins - HOUR_START * 60) / 60) * PX_PER_HOUR
  const heightPx = ((endMins - startMins) / 60) * PX_PER_HOUR
  const effectiveBooked = booked ? slot.booked + 1 : slot.booked
  const isFull = effectiveBooked >= slot.capacity
  const spotsLeft = slot.capacity - effectiveBooked
  const c = CAT[slot.category]

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 5,
        scale: visible ? 1 : 0.97,
      }}
      transition={{
        opacity: {
          duration: 0.22,
          delay: visible ? index * 0.035 : 0,
          ease: [0.22, 1, 0.36, 1],
        },
        y: {
          duration: 0.28,
          delay: visible ? index * 0.035 : 0,
          ease: [0.22, 1, 0.36, 1],
        },
        scale: { duration: 0.18 },
      }}
      whileHover={
        !reduced && !isFull && visible
          ? { y: -3, boxShadow: "0 6px 20px rgba(38,33,28,0.12)" }
          : {}
      }
      style={{
        position: "absolute",
        top: topPx + 2,
        left: 4,
        right: 4,
        height: heightPx - 4,
        background: booked
          ? "rgba(107,122,83,0.22)"
          : isFull
            ? "rgba(38,33,28,0.04)"
            : c.bg,
        border: `1px solid ${
          booked ? "#6b7a53" : isFull ? "rgba(38,33,28,0.10)" : c.border
        }`,
        borderRadius: 10,
        overflow: "hidden",
        cursor: isFull ? "default" : "pointer",
        pointerEvents: visible ? "auto" : "none",
        zIndex: 2,
        transition: "background 0.3s, border-color 0.3s",
      }}
      onClick={() => !isFull && onBook(slot)}
    >
      <div className="px-2 py-1.5 h-full flex flex-col justify-between">
        <div className="min-w-0">
          <p
            className="text-[11px] font-semibold leading-tight truncate"
            style={{ color: booked ? "#3a5726" : isFull ? "#9a8a76" : c.text }}
          >
            {slot.classType}
          </p>
          {heightPx > 52 && (
            <p
              className="text-[9px] leading-tight mt-0.5 truncate"
              style={{ color: isFull ? "#b0a090" : c.sub, opacity: 0.8 }}
            >
              {slot.instructor}
            </p>
          )}
        </div>
        {heightPx > 44 && (
          <p
            className="text-[9px] leading-tight font-medium"
            style={{ color: booked ? "#6b7a53" : isFull ? "#b0a090" : c.dot }}
          >
            {booked ? "✓ Booked" : isFull ? "Class full" : `${spotsLeft} left`}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Guest field ──────────────────────────────────────────────────────────────

function GuestField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  required?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[10px] uppercase tracking-[0.16em] mb-1.5"
        style={{ color: "#7a6b5d" }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-150"
        style={{
          background: "rgba(38,33,28,0.04)",
          border: "1px solid rgba(38,33,28,0.12)",
          color: "#26211c",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#6b7a53"
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(38,33,28,0.12)"
        }}
      />
    </div>
  )
}

// ─── Booking modal ────────────────────────────────────────────────────────────

function BookingModal({
  slot,
  slotDate,
  alreadyBooked,
  onBooked,
  onClose,
}: {
  slot: Slot
  slotDate: Date
  alreadyBooked: boolean
  onBooked: (b: Omit<UserBooking, "id">) => void
  onClose: () => void
}) {
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()
  const btnRef = useMagneticButton()
  const c = CAT[slot.category]
  const instructor = INSTRUCTOR_DATA[slot.instructor] ?? {
    fullName: slot.instructor,
    bio: "",
    creds: [],
  }
  const desc = CLASS_DESC[slot.classType] ?? ""
  const spotsLeft = slot.capacity - slot.booked
  const maxPax = Math.min(4, spotsLeft)

  const role = sessionStorage.getItem("sativa_role")
  const isLoggedIn = role === "admin" || role === "client"
  const accountName = role === "admin" ? "Ujwala Sharma" : "Member"
  const accountPhone = role === "admin" ? "093215 24280" : ""

  const [mode, setMode] = useState<"account" | "guest">(
    isLoggedIn ? "account" : "guest",
  )
  const [participants, setParticipants] = useState(1)
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [submitState, setSubmitState] = useState<SubmitState>("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitState !== "idle") return
    setSubmitState("loading")
    await submitBooking({
      slotId: slot.id,
      classType: slot.classType,
      date: slotDate.toISOString(),
      participants,
      name: mode === "account" ? accountName : guestName,
      phone: mode === "account" ? accountPhone : guestPhone,
    })
    setSubmitState("success")
    setTimeout(() => {
      onBooked({
        slotId: slot.id,
        classType: slot.classType,
        category: slot.category,
        date: slotDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        instructor: slot.instructor,
        participants,
        status: "confirmed",
      })
      onClose()
    }, 1500)
  }

  const dateLabel = slotDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const mobileVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
    exit: { y: "100%" },
  }
  const desktopVariants = {
    hidden: { opacity: 0, scale: 0.91, y: 18 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.94 },
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ background: "rgba(38,33,28,0.42)" }}
        onClick={submitState === "idle" ? onClose : undefined}
      />

      <div
        className={`fixed inset-0 z-50 flex pointer-events-none ${
          isMobile ? "items-end" : "items-center justify-center px-4"
        }`}
      >
        <motion.div
          variants={isMobile ? mobileVariants : desktopVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "spring", stiffness: 340, damping: 36 }}
          className="pointer-events-auto w-full overflow-y-auto"
          style={{
            maxWidth: isMobile ? "100%" : 520,
            maxHeight: "90svh",
            background: "#f7f2ea",
            borderRadius: isMobile ? "20px 20px 0 0" : 20,
            boxShadow: "0 28px 80px rgba(38,33,28,0.22)",
            border: "1px solid rgba(38,33,28,0.07)",
          }}
        >
          {isMobile && (
            <div className="flex justify-center pt-3 pb-1">
              <div
                className="w-9 h-1 rounded-full"
                style={{ background: "rgba(38,33,28,0.16)" }}
              />
            </div>
          )}
          <div style={{ height: 3, background: c.dot }} />

          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div
              className="px-6 pt-5 pb-4"
              style={{ borderBottom: "1px solid rgba(38,33,28,0.07)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] uppercase tracking-wider mb-2.5"
                    style={{ background: c.bg, color: c.text }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: c.dot }}
                    />
                    {slot.category}
                  </span>
                  <h2
                    className="text-[1.65rem] leading-tight mb-1.5"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      color: "#26211c",
                    }}
                  >
                    {slot.classType}
                  </h2>
                  {desc && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#7a6b5d" }}
                    >
                      {desc}
                    </p>
                  )}
                </div>
                {!isMobile && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-colors hover:bg-black/6"
                    style={{ color: "#9a8a76" }}
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                      <path
                        d="M4 4l8 8M12 4l-8 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Instructor */}
            <div
              className="px-6 py-4"
              style={{ borderBottom: "1px solid rgba(38,33,28,0.07)" }}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                  style={{
                    background: "rgba(107,122,83,0.15)",
                    color: "#3a5726",
                  }}
                >
                  {instructor.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#26211c" }}
                  >
                    {instructor.fullName}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5 mb-1.5">
                    {instructor.creds.map((cr) => (
                      <span
                        key={cr}
                        className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wide"
                        style={{
                          background: "rgba(38,33,28,0.07)",
                          color: "#7a6b5d",
                        }}
                      >
                        {cr}
                      </span>
                    ))}
                  </div>
                  {instructor.bio && (
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "#9a8a76" }}
                    >
                      {instructor.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div
              className="px-6 py-4"
              style={{ borderBottom: "1px solid rgba(38,33,28,0.07)" }}
            >
              <div className="grid grid-cols-2 gap-3">
                {([
                  {
                    label: "Date",
                    value: dateLabel,
                    icon: (
                      <>
                        <rect
                          x="1.5"
                          y="2.5"
                          width="13"
                          height="12"
                          rx="1.5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M5 1v3M11 1v3M1.5 6.5h13"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </>
                    ),
                  },
                  {
                    label: "Time",
                    value: `${slot.startTime} – ${slot.endTime}`,
                    icon: (
                      <>
                        <circle
                          cx="8"
                          cy="8"
                          r="6"
                          stroke="currentColor"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M8 5v3.5l2 1.5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    ),
                  },
                  {
                    label: "Studio",
                    value: "Sātva, Dahisar East",
                    icon: (
                      <>
                        <path
                          d="M8 8.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                          stroke="currentColor"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M8 1.5C5.24 1.5 3 3.74 3 6.5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5Z"
                          stroke="currentColor"
                          strokeWidth="1.3"
                        />
                      </>
                    ),
                  },
                  {
                    label: "Spots left",
                    value: `${spotsLeft} of ${slot.capacity}`,
                    valueColor: spotsLeft <= 3 ? "#b05c3e" : "#26211c",
                    icon: (
                      <>
                        <circle
                          cx="5.5"
                          cy="5"
                          r="2"
                          stroke="currentColor"
                          strokeWidth="1.3"
                        />
                        <circle
                          cx="10.5"
                          cy="5"
                          r="2"
                          stroke="currentColor"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M1 13c0-2.21 1.79-4 4.5-4H8M10 13c0-2.21 1.29-4 3.5-4"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                        />
                      </>
                    ),
                  },
                ] as {
                  label: string
                  value: string
                  icon: React.ReactNode
                  valueColor?: string
                }[]).map(({ label, value, icon, valueColor }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(38,33,28,0.06)" }}
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="w-3.5 h-3.5"
                        style={{ color: "#7a6b5d" }}
                      >
                        {icon}
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-[9px] uppercase tracking-wider mb-0.5"
                        style={{ color: "#b0a090" }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-xs font-medium leading-snug"
                        style={{ color: valueColor ?? "#26211c" }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(38,33,28,0.07)" }}
            >
              <div>
                <p className="text-xs font-medium" style={{ color: "#26211c" }}>
                  Participants
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#9a8a76" }}>
                  Max {maxPax} per booking
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setParticipants((p) => Math.max(1, p - 1))}
                  disabled={participants <= 1}
                  aria-label="Decrease"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    border: "1.5px solid rgba(38,33,28,0.18)",
                    color: participants <= 1 ? "#c0b0a0" : "#26211c",
                  }}
                >
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path
                      d="M2.5 6h7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <motion.span
                  key={participants}
                  initial={reduced ? {} : { scale: 1.25, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-medium tabular-nums w-6 text-center select-none"
                  style={{ color: "#26211c" }}
                >
                  {participants}
                </motion.span>
                <button
                  type="button"
                  onClick={() =>
                    setParticipants((p) => Math.min(maxPax, p + 1))
                  }
                  disabled={participants >= maxPax}
                  aria-label="Increase"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    border: "1.5px solid rgba(38,33,28,0.18)",
                    color: participants >= maxPax ? "#c0b0a0" : "#26211c",
                  }}
                >
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path
                      d="M6 2.5v7M2.5 6h7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Guest / Account */}
            <div
              className="px-6 py-4"
              style={{ borderBottom: "1px solid rgba(38,33,28,0.07)" }}
            >
              <div
                className="flex items-center gap-1 rounded-full p-0.5 mb-4 w-fit"
                style={{ background: "rgba(38,33,28,0.07)" }}
              >
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => setMode("account")}
                    className="relative rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider"
                    style={{
                      color: mode === "account" ? "#f7f2ea" : "#7a6b5d",
                    }}
                  >
                    {mode === "account" && (
                      <motion.span
                        layoutId="bk-mode-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "#26211c" }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 36,
                        }}
                      />
                    )}
                    <span className="relative z-10">Account</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMode("guest")}
                  className="relative rounded-full px-3.5 py-1.5 text-xs uppercase tracking-wider"
                  style={{ color: mode === "guest" ? "#f7f2ea" : "#7a6b5d" }}
                >
                  {mode === "guest" && (
                    <motion.span
                      layoutId="bk-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "#26211c" }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 36,
                      }}
                    />
                  )}
                  <span className="relative z-10">Guest</span>
                </button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {mode === "account" ? (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      background: "rgba(107,122,83,0.09)",
                      border: "1px solid rgba(107,122,83,0.22)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                      style={{ background: "#6b7a53", color: "white" }}
                    >
                      {accountName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#26211c" }}
                      >
                        {accountName}
                      </p>
                      {accountPhone && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "#7a6b5d" }}
                        >
                          {accountPhone}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-[9px] uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0"
                      style={{
                        background: "rgba(107,122,83,0.15)",
                        color: "#4a6634",
                      }}
                    >
                      Auto-filled
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="guest"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3"
                  >
                    <GuestField
                      id="bk-name"
                      label="Full Name"
                      type="text"
                      value={guestName}
                      onChange={setGuestName}
                      placeholder="Your name"
                      required
                    />
                    <GuestField
                      id="bk-phone"
                      label="Phone"
                      type="tel"
                      value={guestPhone}
                      onChange={setGuestPhone}
                      placeholder="+91 98XXX XXXXX"
                      required
                    />
                    {!isLoggedIn && (
                      <p className="text-xs pt-1" style={{ color: "#9a8a76" }}>
                        Have an account?{" "}
                        <a
                          href="/login"
                          className="underline underline-offset-2 transition-opacity hover:opacity-70"
                          style={{ color: "#6b7a53" }}
                        >
                          Log in →
                        </a>
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <div className="px-6 py-5">
              {alreadyBooked ? (
                <div
                  className="w-full rounded-full py-3.5 text-sm uppercase tracking-widest font-medium text-center"
                  style={{
                    background: "rgba(107,122,83,0.13)",
                    color: "#3a5726",
                    border: "1px solid rgba(107,122,83,0.25)",
                  }}
                >
                  ✓ Already Booked
                </div>
              ) : (
                <>
                  <motion.button
                    ref={btnRef}
                    type="submit"
                    disabled={submitState !== "idle"}
                    className="w-full flex items-center justify-center gap-2.5 rounded-full py-3.5 text-sm uppercase tracking-widest font-medium overflow-hidden"
                    style={{
                      background:
                        submitState === "success" ? "#6b7a53" : "#26211c",
                      color: "#f7f2ea",
                      transition: "background 0.4s",
                      willChange: "transform",
                    }}
                    whileHover={
                      reduced || submitState !== "idle" ? {} : { scale: 1.02 }
                    }
                    whileTap={
                      reduced || submitState !== "idle" ? {} : { scale: 0.97 }
                    }
                    aria-busy={submitState === "loading"}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {submitState === "idle" && (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-center gap-2"
                        >
                          Book Now
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            className="w-4 h-4"
                          >
                            <path
                              d="M3 8h10M9 4l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.span>
                      )}
                      {submitState === "loading" && (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeOpacity="0.25"
                            />
                            <path
                              d="M12 2a10 10 0 0 1 10 10"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                          Booking…
                        </motion.span>
                      )}
                      {submitState === "success" && (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-center gap-2"
                        >
                          <motion.svg
                            viewBox="0 0 20 20"
                            fill="none"
                            className="w-5 h-5"
                            aria-hidden="true"
                          >
                            <motion.path
                              d="M4 10l4.5 4.5L16 6"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{
                                duration: 0.45,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            />
                          </motion.svg>
                          Booked!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  {participants > 1 && submitState === "idle" && (
                    <p
                      className="text-center text-xs mt-2.5"
                      style={{ color: "#9a8a76" }}
                    >
                      Booking {participants} spots · confirm above
                    </p>
                  )}
                </>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </>
  )
}

// ─── Cancel confirm dialog ────────────────────────────────────────────────────

function CancelDialog({
  booking,
  onConfirm,
  onClose,
}: {
  booking: UserBooking
  onConfirm: () => void
  onClose: () => void
}) {
  const [cancelling, setCancelling] = useState(false)
  const c = CAT[booking.category]

  const handleConfirm = async () => {
    setCancelling(true)
    await cancelBooking(booking.id)
    onConfirm()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ background: "rgba(38,33,28,0.38)" }}
        onClick={cancelling ? undefined : onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 8 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="pointer-events-auto w-full max-w-sm rounded-2xl overflow-hidden"
          style={{
            background: "#f7f2ea",
            boxShadow: "0 24px 64px rgba(38,33,28,0.2)",
            border: "1px solid rgba(38,33,28,0.07)",
          }}
        >
          {/* Coloured top line */}
          <div style={{ height: 3, background: c.dot }} />

          <div className="px-6 pt-5 pb-6">
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(176,92,62,0.1)" }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="w-5 h-5"
                style={{ color: "#b05c3e" }}
              >
                <path
                  d="M4 6h12l-1 11H5L4 6ZM8 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M2 6h16"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-1.5"
              style={{ color: "#9a8a76" }}
            >
              Cancel booking
            </p>
            <h3
              className="text-xl mb-1"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                color: "#26211c",
              }}
            >
              {booking.classType}
            </h3>
            <p
              className="text-sm mb-5 leading-relaxed"
              style={{ color: "#7a6b5d" }}
            >
              {fmtBookingDate(booking.date)} · {booking.startTime}–
              {booking.endTime} · {booking.instructor}
            </p>

            {/* Cancellation note */}
            <div
              className="flex gap-2.5 p-3.5 rounded-xl mb-5"
              style={{
                background: "rgba(176,92,62,0.07)",
                border: "1px solid rgba(176,92,62,0.14)",
              }}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: "#b05c3e" }}
              >
                <path
                  d="M8 5v4M8 11.5v.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </svg>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#8a4a2e" }}
              >
                Cancellations made less than 12 hours before class may not be
                eligible for a credit.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={cancelling}
                className="flex-1 rounded-full py-2.5 text-sm uppercase tracking-widest transition-colors hover:bg-black/5"
                style={{
                  border: "1px solid rgba(38,33,28,0.14)",
                  color: "#5a5048",
                }}
              >
                Keep It
              </button>
              <motion.button
                onClick={handleConfirm}
                disabled={cancelling}
                className="flex-1 rounded-full py-2.5 text-sm uppercase tracking-widest font-medium flex items-center justify-center gap-2"
                style={{
                  background: "#b05c3e",
                  color: "white",
                  opacity: cancelling ? 0.7 : 1,
                }}
                whileTap={{ scale: 0.97 }}
              >
                {cancelling ? (
                  <>
                    <svg
                      className="w-3.5 h-3.5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeOpacity="0.3"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Cancelling…
                  </>
                ) : (
                  "Cancel Booking"
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

// ─── My Upcoming Bookings section ─────────────────────────────────────────────

function MyUpcomingBookings({
  bookings,
  onRequestCancel,
}: {
  bookings: UserBooking[]
  onRequestCancel: (b: UserBooking) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcoming = bookings
    .filter((b) => b.status === "confirmed" && b.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <section className="px-4 md:px-8 pb-12">
      {/* Section header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.24em] mb-1"
            style={{ color: "#9a8a76" }}
          >
            My Bookings
          </p>
          <h2
            className="text-2xl"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              color: "#26211c",
            }}
          >
            Upcoming Classes
          </h2>
        </div>
        <span
          className="text-xs tabular-nums px-2.5 py-1 rounded-full"
          style={{
            background:
              upcoming.length > 0
                ? "rgba(107,122,83,0.12)"
                : "rgba(38,33,28,0.06)",
            color: upcoming.length > 0 ? "#4a6634" : "#9a8a76",
          }}
        >
          {upcoming.length} confirmed
        </span>
      </div>

      {upcoming.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl px-8 py-10 text-center"
          style={{
            background: "white",
            border: "1px solid rgba(38,33,28,0.07)",
            boxShadow: "0 1px 4px rgba(38,33,28,0.04)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(38,33,28,0.05)" }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="w-5 h-5"
              style={{ color: "#b0a090" }}
            >
              <rect
                x="2.5"
                y="3.5"
                width="15"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M6.5 2v3M13.5 2v3M2.5 8h15"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M7 12h6M7 15h4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "#26211c" }}>
            No upcoming bookings
          </p>
          <p
            className="text-xs leading-relaxed mb-4"
            style={{ color: "#9a8a76" }}
          >
            Browse the schedule above and book a class to see it here.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs uppercase tracking-wider transition-opacity hover:opacity-60"
            style={{ color: "#6b7a53" }}
          >
            Browse schedule ↑
          </button>
        </motion.div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(38,33,28,0.07)",
            boxShadow: "0 1px 4px rgba(38,33,28,0.04)",
          }}
        >
          <ul>
            <AnimatePresence initial={false}>
              {upcoming.map((booking, i) => {
                const c = CAT[booking.category]
                const isToday = booking.date.getTime() === today.getTime()
                const isTomorrow =
                  booking.date.getTime() === addDays(today, 1).getTime()
                const relLabel = isToday
                  ? "Today"
                  : isTomorrow
                    ? "Tomorrow"
                    : null

                return (
                  <motion.li
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      borderBottom:
                        i < upcoming.length - 1
                          ? "1px solid rgba(38,33,28,0.06)"
                          : "none",
                      overflow: "hidden",
                    }}
                  >
                    <div className="flex items-center gap-0 px-0">
                      {/* Category stripe */}
                      <div
                        className="w-1 self-stretch flex-shrink-0 rounded-l-none"
                        style={{ background: c.dot, minHeight: 64 }}
                      />

                      <div className="flex-1 flex items-center gap-4 px-5 py-4 min-w-0">
                        {/* Date badge */}
                        <div className="flex-shrink-0 w-12 text-center hidden sm:block">
                          <p
                            className="text-xs font-semibold tabular-nums leading-tight"
                            style={{ color: "#26211c" }}
                          >
                            {booking.date.getDate()}
                          </p>
                          <p
                            className="text-[9px] uppercase tracking-wider"
                            style={{ color: "#9a8a76" }}
                          >
                            {booking.date.toLocaleDateString("en-IN", {
                              month: "short",
                            })}
                          </p>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: "#26211c" }}
                            >
                              {booking.classType}
                            </p>
                            {relLabel && (
                              <span
                                className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                                style={{
                                  background: isToday
                                    ? "rgba(107,122,83,0.15)"
                                    : "rgba(172,134,54,0.13)",
                                  color: isToday ? "#4a6634" : "#7a5814",
                                }}
                              >
                                {relLabel}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: "#9a8a76" }}
                          >
                            <span className="sm:hidden">
                              {fmtBookingDate(booking.date)} ·{" "}
                            </span>
                            {booking.startTime}–{booking.endTime} ·{" "}
                            {booking.instructor}
                            {booking.participants > 1 &&
                              ` · ${booking.participants} spots`}
                          </p>
                        </div>

                        {/* Status + cancel */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                            style={{
                              background: "rgba(107,122,83,0.12)",
                              color: "#4a6634",
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: "#6b7a53" }}
                            />
                            Confirmed
                          </span>
                          <button
                            onClick={() => onRequestCancel(booking)}
                            className="text-xs uppercase tracking-wider transition-opacity hover:opacity-60 flex-shrink-0"
                            style={{ color: "#b05c3e" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>

          {/* Footer */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{
              borderTop: "1px solid rgba(38,33,28,0.07)",
              background: "rgba(38,33,28,0.015)",
            }}
          >
            <p className="text-xs" style={{ color: "#b0a090" }}>
              {upcoming.length} class{upcoming.length !== 1 ? "es" : ""} this
              period
            </p>
            <p className="text-xs" style={{ color: "#b0a090" }}>
              Cancellations allowed up to 12 hrs prior
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ data, onDismiss }: { data: ToastData; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3400)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 360, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 rounded-full px-5 py-3"
      style={{
        background: "#26211c",
        color: "#f7f2ea",
        boxShadow: "0 10px 36px rgba(38,33,28,0.3)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "#6b7a53" }}
      >
        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
          <path
            d="M2 6l2.5 2.5L10 3.5"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-sm">{data.message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="ml-1 opacity-40 hover:opacity-100 transition-opacity"
      >
        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
          <path
            d="M2 2l8 8M10 2l-8 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </motion.div>
  )
}

// ─── Loading skeleton ──────────────────────────────────────────────────────────

function SkeletonGrid() {
  const MOCK = [
    { day: 0, top: 0 * PX_PER_HOUR, h: PX_PER_HOUR },
    { day: 0, top: 3.5 * PX_PER_HOUR, h: PX_PER_HOUR * 0.75 },
    { day: 1, top: 0.5 * PX_PER_HOUR, h: PX_PER_HOUR * 0.75 },
    { day: 1, top: 2 * PX_PER_HOUR, h: PX_PER_HOUR },
    { day: 2, top: 0 * PX_PER_HOUR, h: PX_PER_HOUR * 0.8 },
    { day: 3, top: 1 * PX_PER_HOUR, h: PX_PER_HOUR },
    { day: 4, top: 0 * PX_PER_HOUR, h: PX_PER_HOUR },
    { day: 4, top: 4 * PX_PER_HOUR, h: PX_PER_HOUR * 0.75 },
    { day: 5, top: 0 * PX_PER_HOUR, h: PX_PER_HOUR },
    { day: 6, top: 1 * PX_PER_HOUR, h: PX_PER_HOUR },
  ]
  return (
    <div className="flex" style={{ minWidth: 0 }}>
      {DAY_ABBR.map((_, dayIdx) => (
        <div
          key={dayIdx}
          className="flex-1 relative"
          style={{ height: GRID_HEIGHT, minWidth: 0 }}
        >
          {MOCK.filter((p) => p.day === dayIdx).map((p, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                top: p.top + 2,
                left: 4,
                right: 4,
                height: p.h - 4,
                borderRadius: 10,
                background: "rgba(38,33,28,0.06)",
              }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Booking() {
  const [searchParams] = useSearchParams()
  const isLoggedIn = !!sessionStorage.getItem("sativa_role")

  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()))
  const [filter, setFilter] = useState<FilterKey>(() =>
    typeParamToFilter(searchParams.get("type")),
  )
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [userBookings, setUserBookings] =
    useState<UserBooking[]>(getInitialBookings)
  const [cancelTarget, setCancelTarget] = useState<UserBooking | null>(null)
  const [toast, setToast] = useState<ToastData | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Derive booked slot IDs from confirmed user bookings
  const bookedIds = useMemo(
    () =>
      new Set(
        userBookings
          .filter((b) => b.status === "confirmed")
          .map((b) => b.slotId),
      ),
    [userBookings],
  )

  const loadSlots = useCallback(async (ws: Date) => {
    setLoading(true)
    try {
      setSlots(await fetchSlots(ws))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSlots(weekStart)
  }, [weekStart, loadSlots])

  const goWeek = (dir: 1 | -1) => setWeekStart((w) => addDays(w, dir * 7))

  const weekDates = useMemo(
    () => DAY_ABBR.map((_, i) => addDays(weekStart, i)),
    [weekStart],
  )

  const todayDow = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return weekDates.findIndex((d) => d.getTime() === today.getTime())
  }, [weekDates])

  const slotsByDay = useMemo(() => {
    const map: Record<number, Slot[]> = {}
    for (let d = 0; d < 7; d++) map[d] = []
    for (const s of slots) map[s.dayOfWeek]?.push(s)
    return map
  }, [slots])

  const isVisible = (s: Slot) => filter === "all" || s.category === filter

  const handleBooked = useCallback((data: Omit<UserBooking, "id">) => {
    setUserBookings((prev) => {
      const idx = prev.findIndex((b) => b.slotId === data.slotId)
      const booking: UserBooking = {
        ...data,
        id: idx >= 0 ? prev[idx].id : `ub-${Date.now()}`,
      }
      return idx >= 0
        ? prev.map((b, i) => (i === idx ? booking : b))
        : [...prev, booking]
    })
    setToast({
      id: Date.now(),
      message: `${data.classType} booked — see you there!`,
    })
  }, [])

  const handleCancelConfirm = useCallback(() => {
    if (!cancelTarget) return
    setUserBookings((prev) =>
      prev.map((b) =>
        b.id === cancelTarget.id ? { ...b, status: "cancelled" as const } : b,
      ),
    )
    setToast({
      id: Date.now(),
      message: `${cancelTarget.classType} booking cancelled.`,
    })
    setCancelTarget(null)
  }, [cancelTarget])

  useEffect(() => {
    if (gridRef.current) gridRef.current.scrollLeft = 0
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Hero ── */}
      <section
        className="pt-32 pb-16 px-6 text-center"
        style={{
          background: "linear-gradient(180deg, #ede7da 0%, #f7f2ea 100%)",
        }}
      >
        <p
          className="text-xs uppercase tracking-[0.28em] mb-4"
          style={{ color: "#9a8a76" }}
        >
          Schedule
        </p>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl leading-[1.12] mb-5 max-w-2xl mx-auto"
          style={{ color: "#26211c" }}
        >
          Find Your{" "}
          <em
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              color: "#6b7a53",
            }}
          >
            Perfect
          </em>{" "}
          Class Time
        </h1>
        <p
          className="max-w-md mx-auto text-base leading-relaxed"
          style={{ color: "#7a6b5d" }}
        >
          Browse the week, choose a class, and secure your spot. New sessions
          added every Sunday.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5 mt-8">
          {(Object.entries(CAT) as [Category, typeof CAT.yoga][]).map(
            ([k, c]) => (
              <span
                key={k}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider"
                style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  color: c.text,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: c.dot }}
                />
                {k}
              </span>
            ),
          )}
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider"
            style={{
              background: "rgba(38,33,28,0.05)",
              border: "1px solid rgba(38,33,28,0.1)",
              color: "#9a8a76",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Full
          </span>
        </div>
      </section>

      {/* ── Controls ── */}
      <div
        className="sticky top-[60px] z-20 px-4 md:px-8 py-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
        style={{
          background: "rgba(247,242,234,0.96)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(38,33,28,0.08)",
        }}
      >
        <div
          className="flex items-center gap-1 rounded-full p-1 self-start"
          style={{ background: "rgba(38,33,28,0.07)" }}
        >
          {FILTER_TABS.map(({ label, value }) => {
            const active = filter === value
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className="relative rounded-full px-4 py-1.5 text-xs uppercase tracking-wider transition-colors duration-150"
                style={{ color: active ? "#f7f2ea" : "#7a6b5d" }}
              >
                {active && (
                  <motion.span
                    layoutId="booking-filter-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "#26211c" }}
                    transition={{ type: "spring", stiffness: 360, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => goWeek(-1)}
            aria-label="Previous week"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/8"
            style={{
              border: "1px solid rgba(38,33,28,0.14)",
              color: "#5a5048",
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span
            className="text-sm font-medium tabular-nums min-w-[180px] text-center"
            style={{ color: "#26211c" }}
          >
            {fmtMonthRange(weekStart)}
          </span>
          <button
            onClick={() => goWeek(1)}
            aria-label="Next week"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/8"
            style={{
              border: "1px solid rgba(38,33,28,0.14)",
              color: "#5a5048",
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Weekly grid ── */}
      <div className="px-4 md:px-8 py-6">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(38,33,28,0.07)",
            boxShadow: "0 2px 12px rgba(38,33,28,0.05)",
          }}
        >
          <div
            className="flex"
            style={{ borderBottom: "1px solid rgba(38,33,28,0.08)" }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: 52,
                borderRight: "1px solid rgba(38,33,28,0.07)",
              }}
            >
              <span
                className="text-[9px] uppercase tracking-wider"
                style={{ color: "#c0b0a0" }}
              >
                Time
              </span>
            </div>
            {DAY_ABBR.map((abbr, i) => {
              const date = weekDates[i]
              const isToday = i === todayDow
              return (
                <div
                  key={abbr}
                  className="flex-1 py-3 text-center min-w-0"
                  style={{
                    borderRight:
                      i < 6 ? "1px solid rgba(38,33,28,0.07)" : "none",
                    background: isToday
                      ? "rgba(107,122,83,0.06)"
                      : "transparent",
                  }}
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.15em] mb-0.5"
                    style={{ color: isToday ? "#6b7a53" : "#9a8a76" }}
                  >
                    {abbr}
                  </p>
                  <p
                    className="text-lg font-medium leading-none tabular-nums"
                    style={{ color: isToday ? "#6b7a53" : "#26211c" }}
                  >
                    {date.getDate()}
                  </p>
                </div>
              )
            })}
          </div>

          <div
            ref={gridRef}
            className="overflow-x-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div style={{ minWidth: 540 }}>
              <div className="flex relative">
                <div
                  className="flex-shrink-0 relative"
                  style={{
                    width: 52,
                    height: GRID_HEIGHT,
                    borderRight: "1px solid rgba(38,33,28,0.07)",
                  }}
                >
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      style={{
                        position: "absolute",
                        top: (h - HOUR_START) * PX_PER_HOUR - 8,
                        right: 8,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className="text-[9px] tabular-nums"
                        style={{ color: "#c0b0a0" }}
                      >
                        {String(h).padStart(2, "0")}:00
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-1 relative">
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      style={{
                        position: "absolute",
                        top: (h - HOUR_START) * PX_PER_HOUR,
                        left: 0,
                        right: 0,
                        height: 1,
                        background:
                          h === HOUR_START
                            ? "transparent"
                            : "rgba(38,33,28,0.06)",
                        zIndex: 1,
                      }}
                    />
                  ))}
                  {loading ? (
                    <div className="flex-1">
                      <SkeletonGrid />
                    </div>
                  ) : (
                    DAY_ABBR.map((_, dayIdx) => {
                      const isToday = dayIdx === todayDow
                      return (
                        <div
                          key={dayIdx}
                          className="flex-1 relative"
                          style={{
                            height: GRID_HEIGHT,
                            borderRight:
                              dayIdx < 6
                                ? "1px solid rgba(38,33,28,0.07)"
                                : "none",
                            background: isToday
                              ? "rgba(107,122,83,0.03)"
                              : "transparent",
                            zIndex: 2,
                          }}
                        >
                          {(slotsByDay[dayIdx] ?? []).map((slot, si) => (
                            <SlotCard
                              key={slot.id}
                              slot={slot}
                              visible={isVisible(slot)}
                              index={si}
                              booked={bookedIds.has(slot.id)}
                              onBook={setSelectedSlot}
                            />
                          ))}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="px-5 py-3 flex items-center justify-between flex-wrap gap-2"
            style={{
              borderTop: "1px solid rgba(38,33,28,0.07)",
              background: "rgba(38,33,28,0.015)",
            }}
          >
            <p className="text-xs" style={{ color: "#b0a090" }}>
              All times IST (Mumbai) · tap a card to book
            </p>
            <p className="text-xs" style={{ color: "#b0a090" }}>
              {slots.filter((s) => s.booked < s.capacity).length} classes
              available this week
            </p>
          </div>
        </div>
      </div>

      {/* ── My Upcoming Bookings (logged-in only) ── */}
      <AnimatePresence>
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Hairline divider */}
            <div
              className="mx-4 md:mx-8 mb-8"
              style={{ height: 1, background: "rgba(38,33,28,0.08)" }}
            />
            <MyUpcomingBookings
              bookings={userBookings}
              onRequestCancel={setCancelTarget}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Booking modal ── */}
      <AnimatePresence>
        {selectedSlot && (
          <BookingModal
            key={selectedSlot.id}
            slot={selectedSlot}
            slotDate={weekDates[selectedSlot.dayOfWeek]}
            alreadyBooked={bookedIds.has(selectedSlot.id)}
            onBooked={handleBooked}
            onClose={() => setSelectedSlot(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Cancel dialog ── */}
      <AnimatePresence>
        {cancelTarget && (
          <CancelDialog
            booking={cancelTarget}
            onConfirm={handleCancelConfirm}
            onClose={() => setCancelTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast.id} data={toast} onDismiss={() => setToast(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
