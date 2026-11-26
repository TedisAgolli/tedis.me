import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import type { Post } from '../data/posts'
import { HeptapodLogogram } from './HeptapodLogogram'

export function ArrivalArticle({ post }: { post: Post }) {
  const [psRevealed, setPsRevealed] = useState(false)
  const blocks = post.blocks ?? []
  const [leadBlock, ...restBlocks] = blocks

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06090c] text-[#e6e4df]">
      {/* Shell monolith backdrop shifted downward so it looms below and never competes with the top logogram */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 top-[24vh] z-0 bg-cover bg-top bg-no-repeat"
        style={{
          backgroundImage: 'url("/img/arrival/shell-bg.jpg")',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 22%, black 48%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.65) 22%, black 48%)',
        }}
      />

      {/* Atmospheric mist & readability vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 72% 45% at 50% 12%, rgba(160, 178, 192, 0.08) 0%, transparent 65%), linear-gradient(180deg, rgba(6, 9, 12, 0.92) 0%, rgba(7, 10, 14, 0.45) 45%, rgba(5, 7, 10, 0.78) 100%)',
        }}
      />

      <div className="relative z-20 mx-auto max-w-2xl px-6 py-8 sm:px-8 sm:py-12">
        <header className="mb-6 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#e2e4e8]/55">
          <Link
            to="/"
            className="text-[#e2e4e8]/65 no-underline transition-colors hover:text-[#f4f2ec]"
          >
            ← TEDIS.ME
          </Link>
          <span>{post.unlisted ? 'UNLISTED DRAFT' : post.date}</span>
        </header>

        {/* Centered procedural interactive Heptapod ink logogram + title */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-3 flex items-center justify-center">
            <HeptapodLogogram />
          </div>

          <h1
            className="text-3xl font-normal tracking-wide text-[#f4f2ec] drop-shadow-[0_2px_18px_rgba(0,0,0,0.8)] sm:text-4xl"
            style={{ fontFamily: 'Georgia, "Iowan Old Style", serif' }}
          >
            {post.title}
          </h1>
        </div>

        {/* Translucent glass-partition reading column */}
        <article
          className="arrival-prose mx-auto max-w-xl space-y-6 rounded-2xl border border-white/[0.08] bg-[#080b0f]/68 px-6 py-8 text-[16px] leading-[1.85] text-[#eceae4]/88 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-md sm:px-9 sm:py-10"
          style={{ fontFamily: 'Georgia, "Iowan Old Style", serif' }}
        >
          {post.markdown ? (
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="pt-4 font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#d7dee4]/65">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="pt-2 font-sans text-xs font-medium uppercase tracking-[0.16em] text-[#d7dee4]/55">
                    {children}
                  </h3>
                ),
                p: ({ children }) => <p>{children}</p>,
                blockquote: ({ children }) => (
                  <blockquote className="mb-8 space-y-3 border-l border-white/25 pl-5 text-[15.5px] leading-[1.8] italic text-[#f2f0ea]/90">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f4f2ec] underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white/80"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc space-y-2 pl-5">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal space-y-2 pl-5">{children}</ol>
                ),
                hr: () => <hr className="my-6 border-white/10" />,
                code: ({ children }) => (
                  <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-[#f4f2ec]">
                    {children}
                  </code>
                ),
              }}
            >
              {post.markdown}
            </ReactMarkdown>
          ) : (
            <>
              {leadBlock?.text ? (
                <p className="border-l border-white/30 pl-4 text-[17.5px] leading-[1.75] text-[#f6f4ee]">
                  {leadBlock.text}
                </p>
              ) : null}

              {restBlocks.map((block, idx) => {
                if (block.type === 'heading') {
                  return (
                    <h2
                      key={idx}
                      className="pt-4 font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#d7dee4]/65"
                    >
                      {block.text}
                    </h2>
                  )
                }
                return <p key={idx}>{block.text}</p>
              })}
            </>
          )}

          {post.ps ? (
            <div
              tabIndex={0}
              onMouseEnter={() => setPsRevealed(true)}
              onMouseLeave={() => setPsRevealed(false)}
              onFocus={() => setPsRevealed(true)}
              onBlur={() => setPsRevealed(false)}
              onClick={() => setPsRevealed((v) => !v)}
              className="mt-8 border-t border-white/10 pt-5 text-center focus:outline-none"
            >
              <p
                className="inline-block cursor-pointer font-sans text-sm font-medium tracking-[0.04em] transition-all duration-300 ease-out"
                style={{
                  color: '#ffffff',
                  opacity: psRevealed ? 1 : 0.14,
                  filter: psRevealed ? 'none' : 'blur(2.5px)',
                }}
              >
                P.S. {post.ps}
              </p>
            </div>
          ) : null}
        </article>
      </div>
    </div>
  )
}
