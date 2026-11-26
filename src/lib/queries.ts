import { queryOptions, useQuery } from '@tanstack/react-query'
import { PROJECTS, type Project } from '../data/projects'

export interface GitHubRepoSummary {
  full_name: string
  stargazers_count: number
  language: string | null
  pushed_at: string
  html_url: string
}

export interface IasipQuote {
  quote: string
  who: string
  ep: string
  source: 'live' | 'local'
}

const FALLBACK_QUOTES: Omit<IasipQuote, 'source'>[] = [
  { quote: "I'm a five-star man!", who: 'Dennis', ep: 'S10E03' },
  {
    quote: 'Can I offer you a nice egg in this trying time?',
    who: 'Frank',
    ep: 'S07E01',
  },
  { quote: 'Wildcard, bitches! Yeee-haw!', who: 'Charlie', ep: 'S04E02' },
  { quote: 'Science is a liar sometimes.', who: 'Mac', ep: 'S08E10' },
  {
    quote: "I don't know how many years on this Earth I got left. I'm gonna get real weird with it.",
    who: 'Frank',
    ep: 'S05E04',
  },
  {
    quote: "What is your spaghetti policy here?",
    who: 'Charlie',
    ep: 'S06E10',
  },
]

let fallbackCursor = 0

export const githubReposQueryOptions = queryOptions({
  queryKey: ['github', 'repos', 'TedisAgolli'],
  queryFn: async (): Promise<Record<string, GitHubRepoSummary>> => {
    const res = await fetch(
      'https://api.github.com/users/TedisAgolli/repos?per_page=100&sort=updated',
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      },
    )
    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}`)
    }
    const repos = (await res.json()) as GitHubRepoSummary[]
    const map: Record<string, GitHubRepoSummary> = {}
    for (const r of repos) {
      map[r.full_name.toLowerCase()] = r
    }
    return map
  },
  staleTime: 1000 * 60 * 10,
  retry: 1,
})

export function useGithubRepos() {
  return useQuery(githubReposQueryOptions)
}

export function useProjects(filter: 'all' | 'extension' | 'web' = 'all') {
  const reposQuery = useGithubRepos()
  const filtered: Project[] =
    filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)

  return {
    projects: filtered,
    reposByName: reposQuery.data ?? {},
    isSyncing: reposQuery.isFetching,
  }
}

export function useIasipQuote() {
  return useQuery({
    queryKey: ['iasip', 'random-quote'],
    queryFn: async (): Promise<IasipQuote> => {
      try {
        const controller = new AbortController()
        const timer = window.setTimeout(() => controller.abort(), 2500)
        const res = await fetch('https://sunnyquotes.net/q.php?random', {
          signal: controller.signal,
        })
        window.clearTimeout(timer)
        if (res.ok) {
          const data = (await res.json()) as {
            sqQuote?: string
            sqWho?: string
            sqEp?: string
          }
          if (data.sqQuote) {
            return {
              quote: data.sqQuote,
              who: data.sqWho || 'The Gang',
              ep: data.sqEp || 'IASIP',
              source: 'live',
            }
          }
        }
      } catch {
        // Fall back gracefully when CORS or upstream is unavailable
      }
      const pick = FALLBACK_QUOTES[fallbackCursor % FALLBACK_QUOTES.length]
      fallbackCursor += 1
      return { ...pick, source: 'local' }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}
