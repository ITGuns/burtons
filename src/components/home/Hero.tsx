import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ChevronDown, Phone } from 'lucide-react'
import Button from '../ui/Button'
import { BUSINESS } from '../../lib/constants'
import { useStore } from '../../store/useStore'
import { prefersReducedMotion } from '../../lib/utils'
import type { SiteContent } from '../../lib/types'

const HeroScene = lazy(() => import('../three/HeroScene'))

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Minimal boot overlay shown while the WebGL scene initializes. */
function Loader({ progress, done }: { progress: number; done: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[80] bg-page flex flex-col items-center justify-center gap-6 transition-opacity duration-700 ${
        done ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(900px 520px at 8% -6%, rgba(178, 1, 10, 0.18), transparent 55%), radial-gradient(1150px 600px at 92% -8%, rgba(30, 21, 170, 0.28), transparent 62%), radial-gradient(1300px 760px at 50% 112%, rgba(54, 41, 209, 0.24), transparent 66%), linear-gradient(160deg, #dedcf6 0%, #e4e2f6 45%, #d9d7f2 100%)',
      }}
      aria-hidden={done}
    >
      <p className="font-display text-xs tracking-[0.5em] uppercase text-royal-600">
        Initializing Comfort System
      </p>
      <div className="w-56 h-px bg-navy-900/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-royal-600 to-electric-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="font-display text-navy-900/40 text-xs tabular-nums">{Math.round(progress)}%</p>
    </div>
  )
}

export default function Hero({ content }: { content: SiteContent }) {
  const openBooking = useStore((s) => s.openBooking)
  const navigate = useNavigate()
  const root = useRef<HTMLElement>(null)
  const scrollRef = useRef(0)
  const [sceneReady, setSceneReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [bootDone, setBootDone] = useState(false)

  const reduced = useMemo(() => prefersReducedMotion(), [])
  const mobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, [])
  const hasWebGL = useMemo(() => webglAvailable(), [])

  // Absolute failsafe: the boot screen always clears, even in throttled/background tabs.
  useEffect(() => {
    if (!hasWebGL) {
      setProgress(100)
      setBootDone(true)
      return
    }
    const failsafe = setTimeout(() => { setProgress(100); setBootDone(true) }, 3200)
    return () => clearTimeout(failsafe)
  }, [hasWebGL])

  // Simulated progress (interval-based — keeps ticking when rAF is throttled).
  useEffect(() => {
    if (!hasWebGL || bootDone) return
    const t0 = performance.now()
    const iv = setInterval(() => {
      const elapsed = performance.now() - t0
      setProgress((p) => Math.max(p, Math.min(sceneReady ? 100 : 88, (elapsed / 1200) * 100)))
    }, 80)
    return () => clearInterval(iv)
  }, [hasWebGL, sceneReady, bootDone])

  // Scene ready → finish the boot shortly after.
  useEffect(() => {
    if (!sceneReady) return
    const t = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setBootDone(true), 300)
    }, 700)
    return () => clearTimeout(t)
  }, [sceneReady])

  useEffect(() => {
    if (!bootDone || !root.current) return
    // Hidden/background tab: rAF (and therefore GSAP) is suspended — show content directly.
    if (document.hidden || reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero-line', { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.15)
        .fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.hero-cta', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
        .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.2')
    }, root)
    return () => ctx.revert()
  }, [bootDone, reduced])

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight
      scrollRef.current = Math.min(1.5, window.scrollY / h)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={root} className="relative p-2 sm:p-3" aria-label="Hero">
      <Loader progress={progress} done={bootDone} />

      {/* Rounded gradient hero panel (reference style) */}
      <div className="hero-panel relative overflow-hidden rounded-[24px] sm:rounded-[28px] min-h-[94svh] flex flex-col">
        {/* 3D scene / fallback */}
        <div className="absolute inset-0">
          {hasWebGL ? (
            <Suspense fallback={null}>
              <HeroScene
                scrollRef={scrollRef}
                reduced={reduced}
                mobile={mobile}
                onReady={() => setSceneReady(true)}
              />
            </Suspense>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(255,255,255,0.25),transparent_60%)]" />
          )}
        </div>

        {/* Soft glow + bottom scrim for legibility */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-navy-900/50 to-transparent pointer-events-none" />

        {/* Copy anchored bottom-left */}
        <div className="relative z-10 mt-auto p-7 sm:p-12 lg:p-14 flex flex-col lg:flex-row lg:items-end gap-8 pointer-events-none">
          <div className="pointer-events-auto max-w-3xl">
            <h1 className="font-display font-light text-white tracking-tight leading-[1.08] text-4xl sm:text-5xl lg:text-[64px]">
              <span className="hero-line block">Engineered Comfort</span>
              <span className="hero-line block">
                For Baton Rouge{' '}
                <span className="inline-flex items-center align-middle border border-white/50 rounded-full px-5 sm:px-7 py-1 sm:py-1.5 text-[0.55em] font-normal glass-dark">
                  HVAC Experts
                </span>
              </span>
            </h1>
            <p className="hero-sub mt-5 text-white/75 text-base sm:text-lg max-w-xl leading-relaxed">
              {content.hero_description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="hero-cta">
                <Button size="lg" variant="white" onClick={() => openBooking()}>
                  {content.cta_text || 'Request Service'}
                </Button>
              </span>
              <span className="hero-cta">
                <Button size="lg" variant="outline" onClick={() => navigate('/services')}>
                  Explore Services
                </Button>
              </span>
            </div>
          </div>

          {/* Right: phone chip */}
          <a
            href={BUSINESS.phoneHref}
            className="hero-cta pointer-events-auto lg:ml-auto glass-dark rounded-full px-5 py-3 inline-flex items-center gap-3 text-white hover:bg-white/20 transition-colors self-start lg:self-auto"
          >
            <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <Phone className="w-3.5 h-3.5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/60 font-display">24/7 emergencies</span>
              <span className="font-display text-sm font-medium">{BUSINESS.phone}</span>
            </span>
          </a>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1.5 text-white/50">
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
