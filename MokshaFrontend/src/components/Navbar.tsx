import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'

const links = ['Home', 'About', 'Services', 'Contact', 'Booking']

export default function Navbar(page:string) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
        animate={{
          backgroundColor: scrolled ? 'rgba(247,242,234,0.96)' : 'transparent',
          boxShadow: scrolled ? '0 1px 0 rgba(38,33,28,0.08)' : '0 0 0 transparent',
          paddingTop: scrolled ? '0.75rem' : '1.5rem',
          paddingBottom: scrolled ? '0.75rem' : '1.5rem',
        }}
        transition={{ duration: 0.35, ease: [0.32, 0, 0.28, 1] }}
        role="banner"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 select-none"
          aria-label="Sātva Yoga home"
        >
          <span
            className="w-7 h-7 rounded-full border flex items-center justify-center"
            style={{ borderColor: scrolled ? '#6b7a53' : '#000000' }}
          >
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none">
              <circle cx="10" cy="10" r="6" stroke={scrolled ? '#6b7a53' : 'black'} strokeWidth="1.2" />
              <path d="M10 4 C 6 7, 14 13, 10 16" stroke={scrolled ? '#6b7a53' : 'black'} strokeWidth="1" strokeLinecap="round" />
            </svg>
          </span>
          <motion.span
            className="font-serif italic text-base tracking-wide"
            animate={{ color: scrolled ? '#26211c' : 'black' }}
            transition={{ duration: 0.3 }}
          >
            Sātva
          </motion.span>
        </Link>

        {/* Center links — desktop */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
          {links.map((l) => (
            <Link
              key={l}
              to={l === 'Home' ? '/' : `/${l.toLowerCase()}`}
              className="nav-pill-link"
              style={{ 
                color: isHome 
                    ? '#FFFFFF' 
                    : scrolled 
                      ? '#26211c' 
                      : '#000000'
              }}
            >
              {l}
            </Link>
          ))}
        </nav>

        {/* Right: CTA pill + menu icon */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-300"
            style={{
              background: scrolled ? '#6b7a53' : '#6b7a53',
              color: scrolled ? 'white' : 'white',
              border: scrolled ? '1px solid #6b7a53' : '1px solid rgba(255,255,255,0.35)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = '#6b7a53'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = scrolled ? '#6b7a53' : '#6b7a53'
            }}
          >
            Login
          </Link>

          {/* Hamburger */}
          <button
            className="flex flex-col gap-1.5 p-1.5 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-px w-6"
                style={{ background: scrolled ? '#26211c' : 'white' }}
                animate={
                  menuOpen
                    ? i === 1
                      ? { opacity: 0 }
                      : i === 0
                      ? { rotate: 45, y: 9 }
                      : { rotate: -45, y: -9 }
                    : { rotate: 0, y: 0, opacity: 1 }
                }
                transition={{ duration: 0.25 }}
              />
            ))}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
            style={{ background: '#f7f2ea' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.32, 0, 0.28, 1] }}
          >
            <nav className="flex flex-col items-center gap-8" aria-label="Mobile navigation">
              {links.map((l, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={l === 'Home' ? '/' : `/${l.toLowerCase()}`}
                    className="text-3xl font-serif italic text-charcoal"
                    style={{ color: '#26211c' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {l}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.06, duration: 0.4 }}
              >
                <Link
                  to="/Login"
                  className="mt-4 inline-flex items-center px-8 py-3 rounded-full text-sm uppercase tracking-widest font-medium"
                  style={{ background: '#6b7a53', color: 'black' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
