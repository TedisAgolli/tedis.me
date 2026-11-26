import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight, Check, Copy } from 'lucide-react'
import { KeycapButton, LcdScreen, ModulePanel } from '../components/Hardware'
import { getPostBySlug } from '../data/posts'
import { playClick } from '../lib/sound'

export const Route = createFileRoute('/writing/$slug')({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug)
    if (!post) throw notFound()
    return post
  },
  component: PostDetailPage,
})

function PostDetailPage() {
  const post = Route.useLoaderData()
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  function copyCode(text: string, idx: number) {
    void navigator.clipboard?.writeText(text)
    setCopiedIdx(idx)
    window.setTimeout(() => setCopiedIdx(null), 1600)
  }

  return (
    <div className="space-y-4">
      <div>
        <Link
          to="/writing"
          onClick={() => playClick('press')}
          className="hw-key no-underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          ALL WRITING
        </Link>
      </div>

      <ModulePanel
        unit={`${post.code} · ${post.date}`}
        rightLabel={post.readTime.toUpperCase()}
      >
        <h1 className="text-2xl font-bold tracking-tight">{post.title}</h1>

        {post.coverImage ? (
          <div className="hw-well mt-5 overflow-hidden p-2">
            <img
              src={post.coverImage}
              alt={post.title}
              className="mx-auto max-h-72 rounded object-contain"
            />
          </div>
        ) : null}

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--hw-text)]">
          {post.blocks.map((block, idx) => {
            if (block.type === 'heading') {
              return (
                <h2
                  key={idx}
                  className="pt-2 font-mono-hw text-xs font-bold uppercase tracking-[0.09em] text-[var(--hw-muted)]"
                >
                  {block.text}
                </h2>
              )
            }

            if (block.type === 'code' && block.text) {
              return (
                <div key={idx} className="relative">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-mono-hw text-[10px] uppercase text-[var(--hw-muted)]">
                      {block.language ?? 'code'}
                    </span>
                    <KeycapButton
                      className="px-2 py-1 text-[10px]"
                      onClick={() => copyCode(block.text!, idx)}
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          COPIED
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          COPY
                        </>
                      )}
                    </KeycapButton>
                  </div>
                  <LcdScreen className="overflow-x-auto whitespace-pre text-xs">
                    {block.text}
                  </LcdScreen>
                </div>
              )
            }

            if (block.type === 'links' && block.items) {
              return (
                <div key={idx} className="hw-well p-4">
                  {block.label ? (
                    <div className="mb-2.5 font-mono-hw text-[10px] uppercase tracking-[0.08em] text-[var(--hw-muted)]">
                      {block.label}
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {block.items.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playClick('press')}
                        className="hw-key no-underline"
                        data-variant="accent"
                      >
                        {item.label.toUpperCase()}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <p key={idx} className="text-[15px] leading-7">
                {block.text}
              </p>
            )
          })}
        </div>
      </ModulePanel>
    </div>
  )
}
