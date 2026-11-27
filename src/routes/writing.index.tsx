import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { POSTS } from '../data/posts'
import { playClick } from '../lib/sound'

export const Route = createFileRoute('/writing/')({
  component: WritingIndexPage,
})

function WritingIndexPage() {
  const visiblePosts = POSTS.filter((p) => !p.unlisted)

  return (
    <div className="space-y-3">
      {visiblePosts.map((post) => (
        <Link
          key={post.slug}
          to="/writing/$slug"
          params={{ slug: post.slug }}
          onClick={() => playClick('press')}
          className="hw-module block p-5 no-underline transition-colors hover:border-[var(--hw-accent)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono-hw text-[10px] uppercase tracking-[0.09em] text-[var(--hw-muted)]">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--hw-text)]">
                {post.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--hw-muted)]">
                {post.excerpt}
              </p>
            </div>
            <span className="hw-key shrink-0">
              READ <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
