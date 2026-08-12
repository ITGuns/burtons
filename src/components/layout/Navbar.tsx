import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from '../ui/Button'
import { BUSINESS, NAV_LINKS } from '../../lib/constants'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

/**
 * Reference-style nav: links left · logo center · phone + pill CTA right.
 * Transparent over the hero, frosted white pill once scrolled.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const openBooking = useStore((s) => s.openBooking)
  const location = useLocation()
  const onHome = location.pathname === '/'
  const overHero = onHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const linkCls = (isActive: boolean) =>
    cn(
      'nav-link font-display text-[13px] font-medium transition-colors',
      overHero
        ? isActive ? 'text-white active' : 'text-white/75 hover:text-white'
        : isActive ? 'text-royal-600 active' : 'text-navy-900/65 hover:text-navy-900',
    )

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6"
      >
        <div
          className={cn(
            'mx-auto max-w-6xl grid grid-cols-[1fr_auto_1fr] items-center gap-4 transition-all duration-500 px-5',
            scrolled
              ? 'glass-light rounded-full mt-3 py-2.5 shadow-[0_16px_40px_-20px_rgba(14,12,61,0.35)]'
              : 'py-5 mt-2',
          )}
        >
          {/* Left: links (desktop) / hamburger (mobile) */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.slice(0, 4).map((l) => (
              <NavLink key={l.href} to={l.href} className={({ isActive }) => linkCls(isActive)}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <button
            className={cn('lg:hidden p-2 cursor-pointer justify-self-start', overHero ? 'text-white' : 'text-navy-900')}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center: logo */}
          {/* Accessible name comes from the logo img's alt */}
          <Link to="/" className="justify-self-center">
            <Logo light={overHero} />
          </Link>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-5 justify-self-end">
            {NAV_LINKS.slice(4).map((l) => (
              <NavLink key={l.href} to={l.href} className={({ isActive }) => linkCls(isActive)}>
                {l.label}
              </NavLink>
            ))}
            <a
              href={BUSINESS.phoneHref}
              className={cn(
                'flex items-center gap-2 font-display text-[13px] font-medium transition-colors',
                overHero ? 'text-white/85 hover:text-white' : 'text-navy-900/70 hover:text-royal-600',
              )}
            >
              <Phone className="w-3.5 h-3.5" />
              {BUSINESS.phone}
            </a>
            <Button size="sm" variant={overHero ? 'white' : 'primary'} onClick={() => openBooking()}>
              Request Service
            </Button>
          </div>
          <span className="lg:hidden" />
        </div>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] bg-white/92 backdrop-blur-2xl lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-6">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="text-navy-900 p-2 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={l.href}
                    className={({ isActive }) =>
                      cn(
                        'font-display text-4xl font-light tracking-tight py-2.5 block transition-colors',
                        isActive ? 'text-royal-600' : 'text-navy-900 hover:text-royal-600',
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-8 pb-10 space-y-4"
            >
              <Button size="lg" className="w-full" onClick={() => { setOpen(false); openBooking() }}>
                Request Service
              </Button>
              <a
                href={BUSINESS.phoneHref}
                className="flex items-center justify-center gap-2 text-navy-900/70 font-display text-sm"
              >
                <Phone className="w-4 h-4" /> {BUSINESS.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
