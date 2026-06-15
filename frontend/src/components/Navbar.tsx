import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/', label: 'Головна', exact: true },
  { to: '/services', label: 'Послуги' },
  { to: '/reviews', label: 'Відгуки' },
]

export function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      style={{ backgroundColor: scrolled ? 'rgba(9,9,11,0.40)' : 'rgba(9,9,11,0.20)' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md ${scrolled ? 'border-b border-zinc-800/60 shadow-xl' : 'border-b border-white/5'}`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo-short.png" alt="TimCar Studio" className="h-8 w-auto" />
          <span className="font-bold text-sm text-white tracking-tight">TimCar Studio</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.exact}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          <button
            onClick={() => navigate('/booking')}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
          >
            Записатись
          </button>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 px-4 pb-4 flex flex-col gap-1"
          >
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.exact}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button
              onClick={() => { navigate('/booking'); setMenuOpen(false) }}
              className="mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold text-center"
            >
              Записатись
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
