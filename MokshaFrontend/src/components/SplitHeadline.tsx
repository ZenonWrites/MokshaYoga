import { motion } from 'framer-motion'

interface WordGroupProps {
  text: string
  variant: 'sans' | 'serif'
  delay: number
  reduced: boolean
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const letterVariants = {
  hidden: { opacity: 0, y: 24, skewY: 2 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { duration: 0.65, ease: EASE, delay: i * 0.032 },
  }),
}

const letterInstant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
}

function WordGroup({ text, variant, delay, reduced }: WordGroupProps) {
  const chars = text.split('')
  const cls = variant === 'sans' ? 'headline-sans' : 'headline-serif'

  return (
    <span className={`inline-flex ${cls}`} aria-label={text}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          custom={delay / 0.032 + i}
          variants={reduced ? letterInstant : letterVariants}
          className="inline-block"
          style={{ display: ch === ' ' ? 'inline' : undefined }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}

interface SlashProps { delay: number; reduced: boolean }

function Slash({ delay, reduced }: SlashProps) {
  return (
    <motion.span
      className="headline-slash inline-block"
      variants={reduced ? letterInstant : {
        hidden: { opacity: 0 },
        visible: { opacity: 0.4, transition: { duration: 0.4, delay } },
      }}
    >
      //
    </motion.span>
  )
}

interface SplitHeadlineProps { reduced: boolean }

export default function SplitHeadline({ reduced }: SplitHeadlineProps) {
  return (
    <motion.h1
      className="text-white flex flex-wrap items-baseline gap-x-3 gap-y-1 leading-none"
      initial="hidden"
      animate="visible"
      aria-label="Balance // Calm // Reconnect"
      style={{ fontSize: 'clamp(2.6rem, 7vw, 6.5rem)' }}
    >
      <WordGroup text="BALANCE" variant="sans" delay={0} reduced={reduced} />
      <Slash delay={0.32} reduced={reduced} />
      <WordGroup text="Calm" variant="serif" delay={0.42} reduced={reduced} />
      <Slash delay={0.82} reduced={reduced} />
      <WordGroup text="RECONNECT" variant="sans" delay={0.92} reduced={reduced} />
    </motion.h1>
  )
}
