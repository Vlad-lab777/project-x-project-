import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const links = [
  { to: '/', label: 'Головна', exact: true },
  { to: '/services', label: 'Послуги' },
  { to: '/reviews', label: 'Відгуки' },
]

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60 shadow-xl' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
              <rect x="9" y="11" width="14" height="10" rx="2"/>
              <circle cx="12" cy="20" r="1"/><circle cx="20" cy="20" r="1"/>
            </svg>
          </div>
          <span className="font-bold text-sm text-white tracking-tight">DetailPRO</span>
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
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
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
