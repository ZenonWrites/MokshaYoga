import { useState, useCallback } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const ADMIN_NAV = [
  {
    label: 'Dashboard',
    to: '/admin',
    exact: true,
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    label: 'Class Slots',
    to: '/admin/slots',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
        <rect x="2.5" y="3.5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6.5 2v3M13.5 2v3M2.5 8h15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="7" cy="13" r="1" fill="currentColor" />
        <circle cx="10" cy="13" r="1" fill="currentColor" />
        <circle cx="13" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    to: '/admin/bookings',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
        <path d="M4 5h12M4 9h8M4 13h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    label: 'Messages',
    to: '/admin/messages',
    badge: 3,
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
        <path
          d="M17 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3l3 3 3-3h5a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

interface SidebarContentProps {
  collapsed: boolean
  onLinkClick?: () => void
}

function SidebarContent({ collapsed, onLinkClick }: SidebarContentProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('sativa_role')
    navigate('/login', { replace: true })
  }, [navigate])

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 py-6"
        style={{ borderBottom: '1px solid rgba(38,33,28,0.08)' }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
          style={{ border: '1.5px solid rgba(107,122,83,0.5)', background: 'rgba(107,122,83,0.1)' }}
        >
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
            <circle cx="10" cy="10" r="6" stroke="#6b7a53" strokeWidth="1.2" />
            <path d="M10 4 C 6 7, 14 13, 10 16" stroke="#6b7a53" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p
                className="leading-none"
                style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.05rem', color: '#26211c' }}
              >
                Sātva
              </p>
              <p className="text-[9px] uppercase tracking-[0.22em] mt-0.5" style={{ color: '#9a8a76' }}>
                Admin
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
        {ADMIN_NAV.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onLinkClick}
              className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150"
              style={{
                color: isActive ? '#6b7a53' : '#5a5048',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-nav-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(107,122,83,0.12)' }}
                  transition={{ type: 'spring', stiffness: 360, damping: 36 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap flex-1 flex items-center justify-between"
                  >
                    {item.label}
                    {item.badge ? (
                      <span
                        className="ml-auto text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center"
                        style={{ background: '#6b7a53', color: 'white' }}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </motion.span>
                )}
              </AnimatePresence>
              {collapsed && item.badge ? (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: '#6b7a53' }}
                  aria-label={`${item.badge} unread`}
                />
              ) : null}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5" style={{ borderTop: '1px solid rgba(38,33,28,0.08)', paddingTop: '1rem' }}>
        <button
          onClick={handleLogout}
          className="relative flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm transition-colors duration-150 hover:bg-black/5"
          style={{ color: '#9a8a76' }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
            <path d="M13 3h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M8 13l3-3-3-3M11 10H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Page title from route
  const pageTitle =
    location.pathname === '/admin'
      ? 'Dashboard'
      : location.pathname.includes('slots')
      ? 'Class Slots'
      : location.pathname.includes('bookings')
      ? 'Bookings'
      : location.pathname.includes('messages')
      ? 'Messages'
      : 'Admin'

  const SIDEBAR_W = collapsed ? 72 : 232

  return (
    <div className="flex min-h-screen" style={{ background: '#f7f2ea' }}>
      {/* ── Desktop sidebar ── */}
      <motion.aside
        animate={{ width: SIDEBAR_W }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-hidden"
        style={{
          background: '#ede7da',
          borderRight: '1px solid rgba(38,33,28,0.08)',
          zIndex: 40,
        }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute top-5 -right-3 w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-70 z-50"
          style={{
            background: '#ede7da',
            border: '1px solid rgba(38,33,28,0.14)',
            color: '#7a6b5d',
          }}
        >
          <motion.svg
            viewBox="0 0 12 12"
            fill="none"
            className="w-3 h-3"
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.22 }}
          >
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>
        <SidebarContent collapsed={collapsed} />
      </motion.aside>

      {/* ── Mobile drawer overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(38,33,28,0.35)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed left-0 top-0 h-full z-50 md:hidden"
              style={{
                width: 240,
                background: '#ede7da',
                borderRight: '1px solid rgba(38,33,28,0.08)',
              }}
            >
              <SidebarContent collapsed={false} onLinkClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-8"
          style={{
            height: 60,
            background: 'rgba(247,242,234,0.95)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(38,33,28,0.08)',
          }}
        >
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              className="md:hidden -ml-1 p-1.5 rounded-lg transition-colors hover:bg-black/6"
              style={{ color: '#5a5048' }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <h1
              className="text-base font-medium tracking-tight"
              style={{ color: '#26211c', fontFamily: 'var(--font-sans)' }}
            >
              {pageTitle}
            </h1>
          </div>

          {/* Admin avatar */}
          <div
            className="flex items-center gap-2.5 rounded-full pl-1 pr-3 py-1"
            style={{ background: 'rgba(38,33,28,0.06)', border: '1px solid rgba(38,33,28,0.08)' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: '#6b7a53', color: 'white' }}
            >
              U
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium leading-none" style={{ color: '#26211c' }}>
                Ujwala S.
              </p>
              <p className="text-[10px] mt-0.5 uppercase tracking-wider" style={{ color: '#9a8a76' }}>
                Admin
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-6 md:px-8 py-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
