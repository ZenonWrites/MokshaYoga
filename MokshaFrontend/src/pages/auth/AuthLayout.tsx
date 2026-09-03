import { useLocation, useNavigate, Link, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const BG_IMG =
  'https://images.unsplash.com/photo-1564505892311-612d1e35b375?w=1400&h=900&fit=crop&auto=format'

export default function AuthLayout() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={BG_IMG}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'blur(14px) saturate(0.7)', transform: 'scale(1.08)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(247,242,234,0.82) 0%, rgba(107,122,83,0.35) 100%)' }}
        />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{ borderRadius: 28 }}
      >
        <motion.div
          className="w-full"
          style={{
            background: 'rgba(252,249,244,0.97)',
            borderRadius: 28,
            boxShadow: '0 20px 60px rgba(38,33,28,0.14), 0 2px 8px rgba(38,33,28,0.06)',
            border: '1px solid rgba(38,33,28,0.07)',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo mark */}
          <div className="flex flex-col items-center pt-9 pb-0">
            <Link to="/" aria-label="Back to Sātva home">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-full mb-3 transition-opacity duration-200 hover:opacity-70"
                style={{ border: '1.5px solid rgba(107,122,83,0.4)', background: 'rgba(107,122,83,0.07)' }}
              >
                <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none">
                  <circle cx="10" cy="10" r="6" stroke="#6b7a53" strokeWidth="1.2" />
                  <path d="M10 4 C 6 7, 14 13, 10 16" stroke="#6b7a53" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </div>
              <p
                className="text-sm text-center"
                style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#26211c', letterSpacing: '0.04em' }}
              >
                Sātva
              </p>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex mx-7 mt-7 rounded-full overflow-hidden" style={{ background: 'rgba(38,33,28,0.06)' }}>
            {[
              { label: 'Log In', to: '/login' },
              { label: 'Sign Up', to: '/signup' },
            ].map(({ label, to }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  replace
                  className="flex-1 text-center py-2.5 text-xs uppercase tracking-widest transition-all duration-250 rounded-full relative"
                  style={{
                    color: active ? '#f7f2ea' : '#7a6b5d',
                    background: active ? '#26211c' : 'transparent',
                    zIndex: active ? 1 : 0,
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Form area — fixed min-height prevents card size jump during crossfade */}
          <div className="px-7 pt-6 pb-8" style={{ minHeight: 380 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.32, 0, 0.28, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-7 pb-7 text-center" style={{ borderTop: '1px solid rgba(38,33,28,0.07)' }}>
            <Link
              to="/booking"
              className="inline-block mt-5 text-xs uppercase tracking-wider transition-opacity duration-200 hover:opacity-60"
              style={{ color: '#9a8a76' }}
            >
              Continue as Guest →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
