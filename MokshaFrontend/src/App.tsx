import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Booking from './pages/Booking'
import AuthLayout from './pages/auth/AuthLayout'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ClassSlots from './pages/admin/ClassSlots'
import Bookings from './pages/admin/Bookings'
import Messages from './pages/admin/Messages'

gsap.registerPlugin(ScrollTrigger)

const AUTH_PATHS = ['/login', '/signup', '/forgot-password']
const ADMIN_PATHS = ['/admin']

function AppShell() {
  const location = useLocation()
  const isAuthPage = AUTH_PATHS.some((p) => location.pathname.startsWith(p))
  const isAdminPage = ADMIN_PATHS.some((p) => location.pathname.startsWith(p))

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, duration: 1.2 })
    lenis.on('scroll', () => ScrollTrigger.update())
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    return () => { lenis.destroy() }
  }, [])

  return (
    <>
      {!isAuthPage && !isAdminPage && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          {/* Admin — nested under ProtectedRoute + AdminLayout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="slots" element={<ClassSlots />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="messages" element={<Messages />} />
          </Route>

          {/* Auth — nested so AuthLayout stays mounted during login↔signup toggle */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#f7f2ea' }}>
      <div className="text-center px-8">
        <p className="text-xs uppercase tracking-[0.22em] mb-4" style={{ color: '#9a8a76' }}>Page</p>
        <h1 className="font-serif italic text-5xl" style={{ color: '#26211c' }}>{title}</h1>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
