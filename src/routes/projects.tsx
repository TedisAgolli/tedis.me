import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowUpRight, MapPin, Star } from 'lucide-react'
import { KeycapButton, ModulePanel } from '../components/Hardware'
import { useProjects } from '../lib/queries'
import { playClick } from '../lib/sound'

type ProjectFilter = 'all' | 'extension' | 'web'

export const Route = createFileRoute('/projects')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { filter?: ProjectFilter } => {
    const raw = search.filter
    if (raw === 'extension' || raw === 'web' || raw === 'all') {
      return { filter: raw }
    }
    return {}
  },
  component: ProjectsPage,
})

const FILTERS: { value: ProjectFilter; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'extension', label: 'EXTENSIONS' },
  { value: 'web', label: 'WEB' },
]

function ProjectsPage() {
  const { filter = 'all' } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { projects, reposByName, isSyncing } = useProjects(filter)

  function setFilter(next: ProjectFilter) {
    void navigate({ search: next === 'all' ? {} : { filter: next } })
  }

  return (
    <div className="space-y-4">
      <ModulePanel
        unit="PROJECT RACK · FILTERABLE VIA URL SEARCH PARAMS"
        rightLabel={
          <span className="font-mono-hw text-[10px]">
            {isSyncing ? 'SYNCING GITHUB...' : `${projects.length} MODULES`}
          </span>
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Projects</h1>
            <p className="mt-0.5 text-sm text-[var(--hw-muted)]">
              Browser extensions, VS Code utilities, and small web builds.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <KeycapButton
                key={f.value}
                active={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </KeycapButton>
            ))}
          </div>
        </div>
      </ModulePanel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((project) => {
          const repo = project.githubRepo
            ? reposByName[project.githubRepo.toLowerCase()]
            : undefined

          return (
            <ModulePanel
              key={project.id}
              unit={project.unitCode}
              rightLabel={
                <div className="flex items-center gap-2">
                  {repo ? (
                    <span className="inline-flex items-center gap-1 font-mono-hw text-[10px] text-[var(--hw-text)]">
                      <Star className="h-3 w-3 text-[var(--hw-accent)]" />
                      {repo.stargazers_count}
                    </span>
                  ) : null}
                  <span>{project.platforms.join(' · ')}</span>
                </div>
              }
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="hw-well flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden p-1.5">
                    {project.icon ? (
                      <img
                        src={project.icon}
                        alt=""
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <MapPin className="h-5 w-5 text-[var(--hw-accent)]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold tracking-tight">
                      {project.name}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--hw-muted)]">
                      {project.summary}
                    </p>
                  </div>
                </div>

                {project.badgeUrl ? (
                  <div className="mt-3">
                    <img
                      src={project.badgeUrl}
                      alt={`${project.name} installs`}
                      className="h-5"
                      loading="lazy"
                    />
                  </div>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--hw-border)] pt-3">
                {project.links.map((link) =>
                  link.internal ? (
                    <Link
                      key={link.href}
                      to="/commute-tile-generator"
                      onClick={() => playClick('press')}
                      className="hw-key no-underline"
                      data-variant="accent"
                    >
                      {link.label.toUpperCase()}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playClick('press')}
                      className="hw-key no-underline"
                    >
                      {link.label.toUpperCase()}
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  ),
                )}
              </div>
            </ModulePanel>
          )
        })}
      </div>
    </div>
  )
}
