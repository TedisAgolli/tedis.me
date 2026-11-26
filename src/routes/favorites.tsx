import { useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { KeycapButton, ModulePanel } from '../components/Hardware'
import { BookmarkCard, TweetEmbedCard } from '../components/FavoriteCards'
import { FAVORITES, type FavoriteTag } from '../data/favorites'

type TagFilter = 'all' | FavoriteTag

export const Route = createFileRoute('/favorites')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { tag?: FavoriteTag; q?: string } => {
    const tag =
      search.tag === 'leadership' ||
      search.tag === 'programming' ||
      search.tag === 'general'
        ? search.tag
        : undefined
    const q =
      typeof search.q === 'string' && search.q.trim() ? search.q : undefined
    return { tag, q }
  },
  component: FavoritesPage,
})

function FavoritesPage() {
  const { tag, q = '' } = Route.useSearch()
  const activeTag: TagFilter = tag ?? 'all'
  const navigate = useNavigate({ from: Route.fullPath })

  const counts = useMemo(() => {
    const c = { all: FAVORITES.length, leadership: 0, programming: 0, general: 0 }
    for (const item of FAVORITES) {
      c[item.tag] += 1
    }
    return c
  }, [])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return FAVORITES.filter((item) => {
      if (activeTag !== 'all' && item.tag !== activeTag) return false
      if (!query) return true
      return (
        item.title.toLowerCase().includes(query) ||
        (item.author?.toLowerCase().includes(query) ?? false) ||
        (item.summary?.toLowerCase().includes(query) ?? false) ||
        (item.siteName?.toLowerCase().includes(query) ?? false)
      )
    })
  }, [activeTag, q])

  function setTag(next: TagFilter) {
    void navigate({
      search: (prev) => ({
        ...prev,
        tag: next === 'all' ? undefined : next,
      }),
    })
  }

  function setQuery(next: string) {
    void navigate({
      replace: true,
      search: (prev) => ({
        ...prev,
        q: next.trim() ? next : undefined,
      }),
    })
  }

  const filterButtons: { value: TagFilter; label: string; count: number }[] = [
    { value: 'all', label: 'ALL', count: counts.all },
    { value: 'leadership', label: 'LEADERSHIP', count: counts.leadership },
    { value: 'programming', label: 'PROGRAMMING', count: counts.programming },
    { value: 'general', label: 'GENERAL', count: counts.general },
  ]

  return (
    <div className="space-y-4">
      <ModulePanel>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Favorites
        </h1>
        <p className="mt-1 text-sm text-[var(--hw-muted)]">
          Articles, tweets, and talks I keep coming back to.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {filterButtons.map((btn) => (
            <KeycapButton
              key={btn.value}
              active={activeTag === btn.value}
              onClick={() => setTag(btn.value)}
            >
              <span>{btn.label}</span>
              <span className="opacity-70">{btn.count}</span>
            </KeycapButton>
          ))}
        </div>

        <div className="hw-input mt-3 flex items-center gap-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-[var(--hw-muted)]" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title, author, or site…"
            className="w-full bg-transparent text-xs text-[var(--hw-text)] placeholder:text-[var(--hw-muted)] focus:outline-none"
          />
        </div>
      </ModulePanel>

      {filtered.length === 0 ? (
        <ModulePanel>
          <p className="font-mono-hw text-xs text-[var(--hw-muted)]">
            No matching favorites found.
          </p>
        </ModulePanel>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) =>
            item.category === 'tweet' ? (
              <TweetEmbedCard key={item.id} item={item} />
            ) : (
              <BookmarkCard key={item.id} item={item} />
            ),
          )}
        </div>
      )}
    </div>
  )
}
