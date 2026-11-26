import { useEffect, useState } from 'react'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import { SITE } from '../data/site'
import { isSfxEnabled, playClick, setSfxEnabled } from '../lib/sound'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundView,
})

// Flip to true to restore the multi-tab navigation bar (routes remain active in src/routes/)
const SHOW_NAV_TABS = false

const NAV_ITEMS = [
  { to: '/', label: '01 BENCH', key: '1' },
  { to: '/projects', label: '02 PROJECTS', key: '2' },
  { to: '/writing', label: '03 WRITING', key: '3' },
  { to: '/commute-tile-generator', label: '04 COMMUTE', key: '4' },
] as const

function RootLayout() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const saved = window.localStorage.getItem('tedis-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [sfx, setSfx] = useState<boolean>(() => isSfxEnabled())

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    window.localStorage.setItem('tedis-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    if (!SHOW_NAV_TABS) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      const match = NAV_ITEMS.find((item) => item.key === e.key)
      if (match) {
        playClick('press')
        void navigate({ to: match.to })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  function toggleTheme() {
    playClick('toggle')
    setDark((d) => !d)
  }

  function toggleSfx() {
    const next = !sfx
    setSfxEnabled(next)
    setSfx(next)
    if (next) playClick('toggle')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-5 flex items-center justify-between gap-4 border-b border-[var(--hw-border)] pb-4">
        <Link
          to="/"
          onClick={() => playClick('press')}
          className="inline-flex items-center gap-2.5 font-mono-hw text-sm font-bold tracking-[0.06em] text-[var(--hw-text)] no-underline"
        >
          <span className="hw-led" aria-hidden="true" />
          <span>{SITE.handle}</span>
        </Link>

        <div className="flex items-center gap-2">
          {SHOW_NAV_TABS ? (
            <nav aria-label="Primary" className="mr-1 flex flex-wrap items-center gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.to === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => playClick('press')}
                    data-active={isActive ? 'true' : undefined}
                    className="hw-key no-underline"
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          ) : null}

          <button
            type="button"
            onClick={toggleSfx}
            className="hw-key px-2"
            title={sfx ? 'Mute keycap click sounds' : 'Enable keycap click sounds'}
            aria-label={sfx ? 'Mute keycap click sounds' : 'Enable keycap click sounds'}
          >
            {sfx ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 opacity-60" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="hw-key px-2"
            title={dark ? 'Switch to light chassis' : 'Switch to dark chassis'}
            aria-label={dark ? 'Switch to light chassis' : 'Switch to dark chassis'}
          >
            {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-10 flex items-center justify-between border-t border-[var(--hw-border)] pt-4 font-mono-hw text-[11px] text-[var(--hw-muted)]">
        <span>{SITE.name.toUpperCase()}</span>
        <span>{SITE.handle}</span>
      </footer>
    </div>
  )
}

function NotFoundView() {
  return (
    <div className="hw-module p-8 text-center">
      <div className="font-mono-hw text-xs uppercase tracking-[0.12em] text-[var(--hw-muted)]">
        ERR 404 · SIGNAL LOST
      </div>
      <h1 className="mt-2 text-xl font-bold">Route not found</h1>
      <p className="mt-2 text-sm text-[var(--hw-muted)]">
        That page doesn&apos;t exist here.
      </p>
      <div className="mt-5">
        <Link to="/" className="hw-key no-underline" data-variant="accent">
          RETURN HOME
        </Link>
      </div>
    </div>
  )
}
