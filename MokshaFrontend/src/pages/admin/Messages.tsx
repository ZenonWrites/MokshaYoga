import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types & data ─────────────────────────────────────────────────────────────

interface Message {
  id: string
  name: string
  contact: string
  subject: string
  preview: string
  body: string
  date: string
  read: boolean
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    name: 'Priya Desai',
    contact: 'priya.desai@gmail.com',
    subject: 'Membership inquiry',
    preview: "Hi, I'd like to know more about the unlimited monthly plan and whether it includes steam yoga sessions.",
    body: "Hi,\n\nI'd like to know more about the unlimited monthly plan and whether it includes steam yoga sessions. I've been practising for about two years and I'm looking to commit to a regular schedule.\n\nAlso, do you offer any trial sessions before I sign up?\n\nThanks,\nPriya",
    date: '2026-08-31',
    read: false,
  },
  {
    id: '2',
    name: 'Ramesh Shetty',
    contact: '93210 44521',
    subject: 'Back pain — beginner classes',
    preview: "My physiotherapist recommended yoga for lower back pain. I'm a complete beginner. Do you have gentle beginner batches?",
    body: "Hello,\n\nMy physiotherapist recommended yoga for my chronic lower back pain. I'm a complete beginner and a bit nervous about joining. Do you have gentle beginner batches where the instructor can give individual attention?\n\nAlso, what should I bring for my first class?\n\nBest,\nRamesh",
    date: '2026-08-31',
    read: false,
  },
  {
    id: '3',
    name: 'Sunita Pawar',
    contact: 'sunita.p@yahoo.in',
    subject: 'Pregnancy yoga — second trimester',
    preview: "I'm currently 18 weeks pregnant. Is pregnancy yoga safe to start now, and what's the class frequency?",
    body: "Hi Ujwala,\n\nI'm currently 18 weeks pregnant and my gynaecologist has cleared me for gentle exercise. Is pregnancy yoga safe to start now, and what's the recommended class frequency?\n\nI'd also like to know if the instructor has prenatal yoga certification.\n\nWarm regards,\nSunita",
    date: '2026-08-30',
    read: false,
  },
  {
    id: '4',
    name: 'Kavita Nair',
    contact: 'kavita.nair@hotmail.com',
    subject: 'Corporate group booking',
    preview: "We're a team of 12 from a local office. Can you accommodate a group session on Saturday mornings?",
    body: "Dear Team,\n\nWe're a team of 12 from a company in Dahisar East. We're interested in a Saturday morning group session — ideally something energising like Zumba or Power Yoga.\n\nCould you let us know the pricing for a monthly group package and whether weekend slots are available?\n\nThanks and regards,\nKavita Nair\nHR Manager",
    date: '2026-08-29',
    read: true,
  },
  {
    id: '5',
    name: 'Deepak Malhotra',
    contact: '99876 53210',
    subject: 'Rescheduling request',
    preview: "I booked the Thursday 6 PM Power Yoga class but need to move it to Friday. Is that possible?",
    body: "Hi,\n\nI booked the Thursday 6 PM Power Yoga class for next week but something has come up and I need to move it to Friday evening if possible.\n\nPlease let me know if this can be accommodated.\n\nThank you,\nDeepak",
    date: '2026-08-28',
    read: true,
  },
  {
    id: '6',
    name: 'Meera Krishnan',
    contact: 'meera.k@gmail.com',
    subject: 'Feedback — candle yoga session',
    preview: "Just wanted to say the candle yoga session last Wednesday was absolutely wonderful. The ambience was so calming.",
    body: "Hi Ujwala,\n\nJust wanted to drop a note to say the candle yoga session last Wednesday was absolutely wonderful. The ambience was so calming and Meera's guidance was clear and encouraging.\n\nI've been telling all my friends about Sātva. Keep up the beautiful work!\n\nWith gratitude,\nMeera Krishnan",
    date: '2026-08-27',
    read: true,
  },
]

function fmtDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// ─── Side panel ───────────────────────────────────────────────────────────────

function MessagePanel({ msg, onClose, onMarkRead }: { msg: Message; onClose: () => void; onMarkRead: (id: string) => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(38,33,28,0.22)' }}
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="fixed right-0 top-0 h-full z-50 flex flex-col"
        style={{
          width: 440,
          maxWidth: '100vw',
          background: '#f7f2ea',
          borderLeft: '1px solid rgba(38,33,28,0.09)',
          boxShadow: '-8px 0 32px rgba(38,33,28,0.09)',
        }}
      >
        {/* Header */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(38,33,28,0.08)' }}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: '#9a8a76' }}>
                Message
              </p>
              <h3 className="text-base font-medium leading-snug" style={{ color: '#26211c' }}>
                {msg.subject}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/6 flex-shrink-0 mt-4"
              style={{ color: '#7a6b5d' }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Sender */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
              style={{ background: 'rgba(107,122,83,0.15)', color: '#4a6634' }}
            >
              {msg.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#26211c' }}>{msg.name}</p>
              <p className="text-xs" style={{ color: '#9a8a76' }}>{msg.contact}</p>
            </div>
            <span className="ml-auto text-xs" style={{ color: '#b0a090' }}>{fmtDate(msg.date)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p
            className="text-sm leading-[1.8] whitespace-pre-line"
            style={{ color: '#3a332c' }}
          >
            {msg.body}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-5 flex gap-3" style={{ borderTop: '1px solid rgba(38,33,28,0.08)' }}>
          {!msg.read && (
            <button
              onClick={() => { onMarkRead(msg.id); onClose() }}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm uppercase tracking-widest font-medium transition-opacity hover:opacity-80"
              style={{ background: '#6b7a53', color: 'white' }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Mark as Read
            </button>
          )}
          <a
            href={msg.contact.includes('@') ? `mailto:${msg.contact}` : `tel:${msg.contact.replace(/\s/g, '')}`}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm uppercase tracking-widest transition-colors hover:bg-black/6"
            style={{ border: '1px solid rgba(38,33,28,0.14)', color: '#5a5048' }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path d="M2 4h12v9H2z" stroke="currentColor" strokeWidth="1.4" rx="1" />
              <path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Reply
          </a>
          <button
            onClick={onClose}
            className="ml-auto p-2.5 rounded-full transition-colors hover:bg-black/6"
            style={{ color: '#9a8a76' }}
            aria-label="Close"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </motion.aside>
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [selected, setSelected] = useState<Message | null>(null)

  const unread = messages.filter((m) => !m.read).length

  const markRead = (id: string) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))

  const markAllRead = () => setMessages((prev) => prev.map((m) => ({ ...m, read: true })))

  const handleOpen = (msg: Message) => {
    setSelected(msg)
    if (!msg.read) markRead(msg.id)
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] mb-0.5" style={{ color: '#9a8a76' }}>
            {messages.length} messages
          </p>
          <p className="text-sm" style={{ color: '#5a5048' }}>
            {unread > 0 ? `${unread} unread` : 'All read'}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs uppercase tracking-wider transition-opacity hover:opacity-60"
            style={{ color: '#6b7a53' }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Inbox list */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'white', border: '1px solid rgba(38,33,28,0.07)', boxShadow: '0 1px 4px rgba(38,33,28,0.04)' }}
      >
        <ul>
          {messages.map((msg, i) => (
            <motion.li
              key={msg.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              style={{ borderBottom: i < messages.length - 1 ? '1px solid rgba(38,33,28,0.06)' : 'none' }}
            >
              <button
                onClick={() => handleOpen(msg)}
                className="w-full text-left px-5 py-4 transition-colors duration-150 hover:bg-black/[0.025] flex items-start gap-4"
              >
                {/* Avatar + unread dot */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      background: msg.read ? 'rgba(38,33,28,0.07)' : 'rgba(107,122,83,0.15)',
                      color: msg.read ? '#7a6b5d' : '#4a6634',
                    }}
                  >
                    {msg.name[0]}
                  </div>
                  {!msg.read && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ background: '#6b7a53' }}
                      aria-label="Unread"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-0.5">
                    <p
                      className="text-sm truncate"
                      style={{ color: '#26211c', fontWeight: msg.read ? 400 : 600 }}
                    >
                      {msg.name}
                    </p>
                    <span className="text-[11px] flex-shrink-0" style={{ color: '#b0a090' }}>
                      {fmtDate(msg.date)}
                    </span>
                  </div>
                  <p
                    className="text-xs mb-1 truncate"
                    style={{ color: msg.read ? '#9a8a76' : '#3a332c', fontWeight: msg.read ? 400 : 500 }}
                  >
                    {msg.subject}
                  </p>
                  <p className="text-xs truncate" style={{ color: '#b0a090' }}>
                    {msg.contact} · {msg.preview}
                  </p>
                </div>

                {/* Chevron */}
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0 mt-3" style={{ color: '#c0b0a0' }}>
                  <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {selected && (
          <MessagePanel
            msg={selected}
            onClose={() => setSelected(null)}
            onMarkRead={markRead}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
