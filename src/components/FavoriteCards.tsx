import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Play } from 'lucide-react'
import { EmbeddedTweet, TweetSkeleton } from 'react-tweet'
import type { FavoriteItem } from '../data/favorites'
import { useTweet } from '../lib/queries'
import { playClick } from '../lib/sound'

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export function BookmarkCard({ item }: { item: FavoriteItem }) {
  const [imgFailed, setImgFailed] = useState(false)
  const [faviconFailed, setFaviconFailed] = useState(false)
  const hostname = getHostname(item.sourceUrl)
  const displaySite = item.siteName || hostname
  const showImage = Boolean(item.imageUrl && !imgFailed)
  const isVideo = item.category === 'video'

  return (
    <a
      href={item.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => playClick('tick')}
      className="hw-module group flex flex-col-reverse overflow-hidden no-underline transition-colors hover:border-[var(--hw-accent)] sm:flex-row"
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5 p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--hw-text)] group-hover:text-[var(--hw-accent)]">
              {item.title}
            </h2>
            <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--hw-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--hw-accent)]" />
          </div>
          {item.summary ? (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--hw-muted)]">
              {item.summary}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono-hw text-[11px] text-[var(--hw-muted)]">
          {hostname && !faviconFailed ? (
            <img
              src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=32`}
              alt=""
              width={14}
              height={14}
              className="h-3.5 w-3.5 shrink-0 rounded-sm"
              loading="lazy"
              onError={() => setFaviconFailed(true)}
            />
          ) : null}
          {displaySite ? (
            <span className="truncate font-medium text-[var(--hw-text)]">
              {displaySite}
            </span>
          ) : null}
          {item.author && item.author !== displaySite ? (
            <>
              <span>·</span>
              <span className="truncate">{item.author}</span>
            </>
          ) : null}
          {isVideo ? (
            <span className="inline-flex items-center gap-1 rounded bg-[var(--hw-well)] px-1.5 py-0.5 text-[10px] uppercase text-[var(--hw-text)]">
              <Play className="h-2.5 w-2.5 fill-current text-[var(--hw-accent)]" />
              VIDEO
            </span>
          ) : null}
          <span className="ml-auto rounded border border-[var(--hw-border)] bg-[var(--hw-well)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.06em] text-[var(--hw-muted)]">
            {item.tag}
          </span>
        </div>
      </div>

      {showImage ? (
        <div className="relative h-36 w-full shrink-0 overflow-hidden border-b border-[var(--hw-border)] bg-[var(--hw-well)] sm:h-[132px] sm:w-44 sm:border-b-0 sm:border-l">
          <img
            src={item.imageUrl!}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setImgFailed(true)}
          />
          {isVideo ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white shadow">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </a>
  )
}

function useChassisTheme(): 'dark' | 'light' {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    typeof document !== 'undefined' &&
    document.documentElement.dataset.theme === 'dark'
      ? 'dark'
      : 'light',
  )

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(
        document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
      )
    })
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => obs.disconnect()
  }, [])

  return theme
}

export function TweetEmbedCard({ item }: { item: FavoriteItem }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const theme = useChassisTheme()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = hostRef.current
    if (!el || !item.tweetId) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [item.tweetId])

  const tweetQuery = useTweet(item.tweetId, visible)

  return (
    <div ref={hostRef} data-theme={theme} className="hw-module p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-end">
        <span className="rounded border border-[var(--hw-border)] bg-[var(--hw-well)] px-1.5 py-0.5 font-mono-hw text-[10px] uppercase tracking-[0.06em] text-[var(--hw-muted)]">
          {item.tag}
        </span>
      </div>

      {tweetQuery.data ? (
        <EmbeddedTweet tweet={tweetQuery.data} />
      ) : item.tweetId && (!visible || tweetQuery.isLoading) ? (
        <TweetSkeleton />
      ) : (
        <div className="flex flex-col gap-2.5 p-1">
          <div className="font-mono-hw text-[11px] font-semibold text-[var(--hw-text)]">
            {item.author || 'X / Twitter'}
          </div>
          <p className="text-sm leading-relaxed text-[var(--hw-text)]">
            {item.summary || item.title}
          </p>
          <div>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick('press')}
              className="hw-key py-1 text-[10px] no-underline"
            >
              OPEN ON X
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
