import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, useAnimationControls } from 'framer-motion'
import { useMagneticButton } from '../../hooks/useMagneticCursor'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface LocationState { from?: { pathname: string } }

interface Errors { email?: string; password?: string }

function validate(email: string, password: string): Errors {
  const errs: Errors = {}
  if (!email) errs.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email'
  if (!password) errs.password = 'Password is required'
  else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
  return errs
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const formControls = useAnimationControls()
  const btnRef = useMagneticButton()
  const navigate = useNavigate()
  const location = useLocation()
  const reduced = useReducedMotion()

  const state = location.state as LocationState | null
  const from = state?.from?.pathname

  const shake = async () => {
    if (reduced) return
    await formControls.start({
      x: [0, -9, 9, -6, 6, -3, 3, 0],
      transition: { duration: 0.42, ease: 'easeInOut' },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(email, password)
    setErrors(errs)
    if (Object.keys(errs).length) { await shake(); return }

    setLoading(true)
    // Simulate auth — replace with real API call
    await new Promise((r) => setTimeout(r, 1100))
    setLoading(false)

    // Role-based redirect
    const isAdmin = email.toLowerCase().includes('admin')
    sessionStorage.setItem('sativa_role', isAdmin ? 'admin' : 'client')
    navigate(from ?? (isAdmin ? '/admin' : '/booking'), { replace: true })
  }

  return (
    <motion.form
      animate={formControls}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Log in to Sātva"
    >
      <h2
        className="mb-6 text-center leading-snug"
        style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.4rem', color: '#26211c' }}
      >
        Welcome back
      </h2>

      {/* Email */}
      <Field
        id="login-email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        autoComplete="email"
        placeholder="you@example.com"
      />

      {/* Password */}
      <Field
        id="login-password"
        label="Password"
        type={showPw ? 'text' : 'password'}
        value={password}
        onChange={setPassword}
        error={errors.password}
        autoComplete="current-password"
        placeholder="••••••••"
        suffix={
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="text-[10px] uppercase tracking-wider transition-opacity hover:opacity-60"
            style={{ color: '#9a8a76' }}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? 'Hide' : 'Show'}
          </button>
        }
      />

      {/* Forgot */}
      <div className="flex justify-end mb-6 -mt-2">
        <Link
          to="/forgot-password"
          className="text-xs transition-opacity hover:opacity-60"
          style={{ color: '#9a8a76' }}
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <motion.button
        ref={btnRef}
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 rounded-full py-3.5 text-sm uppercase tracking-widest font-medium transition-colors duration-200 disabled:opacity-70"
        style={{ background: '#26211c', color: '#f7f2ea', willChange: 'transform', transition: 'transform 0.22s cubic-bezier(0.22,1,0.36,1), background 0.2s' }}
        whileHover={reduced || loading ? {} : { scale: 1.02 }}
        whileTap={reduced || loading ? {} : { scale: 0.97 }}
        aria-busy={loading}
      >
        {loading ? <Spinner /> : 'Log In'}
      </motion.button>

      <p className="text-center mt-5 text-xs" style={{ color: '#9a8a76' }}>
        {"Don't have an account? "}
        <Link to="/signup" replace className="underline underline-offset-2 transition-opacity hover:opacity-60" style={{ color: '#6b7a53' }}>
          Sign up
        </Link>
      </p>
    </motion.form>
  )
}

// ─── Shared field ──────────────────────────────────────────────────────────────

interface FieldProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  error?: string
  autoComplete?: string
  placeholder?: string
  suffix?: React.ReactNode
}

function Field({ id, label, type, value, onChange, error, autoComplete, placeholder, suffix }: FieldProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-xs uppercase tracking-[0.16em]" style={{ color: '#7a6b5d' }}>
          {label}
        </label>
        {suffix}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
        style={{
          background: 'rgba(38,33,28,0.04)',
          border: `1px solid ${error ? '#c0392b' : 'rgba(38,33,28,0.12)'}`,
          color: '#26211c',
          fontFamily: 'var(--font-sans)',
        }}
        onFocus={(e) => { if (!error) (e.currentTarget as HTMLElement).style.borderColor = '#6b7a53' }}
        onBlur={(e) => { if (!error) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(38,33,28,0.12)' }}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs" style={{ color: '#c0392b' }} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export { Field, Spinner }
