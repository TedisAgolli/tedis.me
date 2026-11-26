import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react'
import { LcdScreen, ModulePanel } from '../components/Hardware'
import { SITE } from '../data/site'
import { useGithubRepos } from '../lib/queries'
import { playClick } from '../lib/sound'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const SOCIALS = [
  {
    name: 'GitHub',
    handle: '@TedisAgolli',
    href: SITE.links.github,
    icon: Github,
  },
  {
    name: 'LinkedIn',
    handle: 'in/tedisagolli',
    href: SITE.links.linkedin,
    icon: Linkedin,
  },
  {
    name: 'Twitter',
    handle: '@TedisAgolli',
    href: SITE.links.twitter,
    icon: Twitter,
  },
] as const

function HomePage() {
  const reposQuery = useGithubRepos()
  const repoCount = reposQuery.data ? Object.keys(reposQuery.data).length : null

  return (
    <div className="space-y-4">
      <ModulePanel>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {SITE.name}
        </h1>
        <p className="mt-1 text-sm text-[var(--hw-muted)]">{SITE.role}</p>

        {repoCount !== null ? (
          <LcdScreen className="mt-4">
            GITHUB · {repoCount} PUBLIC REPOS
          </LcdScreen>
        ) : null}
      </ModulePanel>

      <ModulePanel unit="SOCIALS">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SOCIALS.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick('press')}
                className="hw-key flex-col items-start justify-between gap-2.5 p-4 text-left no-underline"
              >
                <div className="flex w-full items-center justify-between">
                  <Icon className="h-4 w-4 text-[var(--hw-accent)]" />
                  <ArrowUpRight className="h-3.5 w-3.5 text-[var(--hw-muted)]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--hw-text)]">
                    {social.name}
                  </div>
                  <div className="mt-0.5 text-[11px] font-normal text-[var(--hw-muted)]">
                    {social.handle}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </ModulePanel>
    </div>
  )
}
