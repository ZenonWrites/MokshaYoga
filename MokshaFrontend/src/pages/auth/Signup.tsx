import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useAnimationControls } from 'framer-motion'
import { useMagneticButton } from '../../hooks/useMagneticCursor'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Field, Spinner } from './Login'

interface Errors {
  name?: string
  email?: string
  phone?: string
  password?: string
  confirm?: string
}

function validate(name: string, email: string, phone: string, password: string, confirm: string): Errors {
  const errs: Errors = {}
  if (!name.trim()) errs.name = 'Full name is required'
  if (!email) errs.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email'
  if (phone && !/^[+\d\s\-()]{7,15}$/.test(phone)) errs.phone = 'Enter a valid phone number'
  if (!password) errs.password = 'Password is required'
  else if (password.length < 8) errs.password = 'Minimum 8 characters'
  if (!confirm) errs.confirm = 'Please confirm your password'
  else if (confirm !== password) errs.confirm = 'Passwords do not match'
  return errs
}

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const formControls = useAnimationControls()
  const btnRef = useMagneticButton()
  const navigate = useNavigate()
  const reduced = useReducedMotion()

  const shake = async () => {
    if (reduced) return
    await formControls.start({
      x: [0, -9, 9, -6, 6, -3, 3, 0],
      transition: { duration: 0.42, ease: 'easeInOut' },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(name, email, phone, password, confirm)
    setErrors(errs)
    if (Object.keys(errs).length) { await shake(); return }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    navigate('/booking', { replace: true })
  }

  const pwSuffix = (
    <button
      type="button"
      onClick={() => setShowPw((v) => !v)}
      className="text-[10px] uppercase tracking-wider transition-opacity hover:opacity-60"
      style={{ color: '#9a8a76' }}
      aria-label={showPw ? 'Hide password' : 'Show password'}
    >
      {showPw ? 'Hide' : 'Show'}
    </button>
  )

  return (
    <motion.form
      animate={formControls}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Create your Sātva account"
    >
      <h2
        className="mb-6 text-center leading-snug"
        style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.4rem', color: '#26211c' }}
      >
        Start your practice
      </h2>

      <Field
        id="signup-name"
        label="Full Name"
        type="text"
        value={name}
        onChange={setName}
        error={errors.name}
        autoComplete="name"
        placeholder="Ujwala Sharma"
      />
      <Field
        id="signup-email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        autoComplete="email"
        placeholder="you@example.com"
      />
      <Field
        id="signup-phone"
        label="Phone (optional)"
        type="tel"
        value={phone}
        onChange={setPhone}
        error={errors.phone}
        autoComplete="tel"
        placeholder="+91 98XXX XXXXX"
      />
      <Field
        id="signup-password"
        label="Password"
        type={showPw ? 'text' : 'password'}
        value={password}
        onChange={setPassword}
        error={errors.password}
        autoComplete="new-password"
        placeholder="Min. 8 characters"
        suffix={pwSuffix}
      />
      <Field
        id="signup-confirm"
        label="Confirm Password"
        type={showPw ? 'text' : 'password'}
        value={confirm}
        onChange={setConfirm}
        error={errors.confirm}
        autoComplete="new-password"
        placeholder="Repeat your password"
      />

      {/* Password strength indicator */}
      <PasswordStrength password={password} />

      <motion.button
        ref={btnRef}
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 rounded-full py-3.5 text-sm uppercase tracking-widest font-medium transition-colors duration-200 disabled:opacity-70 mt-2"
        style={{ background: '#6b7a53', color: 'white', willChange: 'transform', transition: 'transform 0.22s cubic-bezier(0.22,1,0.36,1), background 0.2s' }}
        whileHover={reduced || loading ? {} : { scale: 1.02 }}
        whileTap={reduced || loading ? {} : { scale: 0.97 }}
        aria-busy={loading}
      >
        {loading ? <Spinner /> : 'Create Account'}
      </motion.button>

      <p className="text-center mt-5 text-xs" style={{ color: '#9a8a76' }}>
        Already a member?{' '}
        <Link to="/login" replace className="underline underline-offset-2 transition-opacity hover:opacity-60" style={{ color: '#26211c' }}>
          Log in
        </Link>
      </p>

      <p className="text-center mt-3 text-[10px] leading-relaxed" style={{ color: 'rgba(38,33,28,0.35)' }}>
        By creating an account you agree to our{' '}
        <Link to="/terms" className="underline underline-offset-1">Terms</Link>
        {' '}and{' '}
        <Link to="/privacy" className="underline underline-offset-1">Privacy Policy</Link>.
      </p>
    </motion.form>
  )
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null

  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = ['#c0392b', '#e67e22', '#f0c040', '#6b7a53']

  return (
    <div className="mb-4 -mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-full"
            style={{ height: 3, background: i < strength ? colors[strength - 1] : 'rgba(38,33,28,0.1)' }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: i < strength ? 1 : 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          />
        ))}
      </div>
      {strength > 0 && (
        <p className="text-[10px] uppercase tracking-wider" style={{ color: colors[strength - 1] }}>
          {labels[strength - 1]}
        </p>
      )}
    </div>
  )
}
