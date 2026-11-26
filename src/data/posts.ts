export interface PostBlock {
  type: 'paragraph' | 'code' | 'heading' | 'links'
  text?: string
  label?: string
  language?: string
  items?: { label: string; href: string }[]
}

export interface Post {
  slug: string
  code: string
  title: string
  date: string
  readTime: string
  excerpt: string
  coverImage?: string
  unlisted?: boolean
  theme?: 'arrival'
  ps?: string
  markdown?: string
  blocks?: PostBlock[]
}

function parseFrontmatter(raw: string): {
  data: Record<string, string>
  content: string
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw.trim() }

  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const val = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    if (key) data[key] = val
  }

  return { data, content: match[2].trim() }
}

const markdownFiles = import.meta.glob<string>('/content/writing/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const MARKDOWN_POSTS: Post[] = Object.entries(markdownFiles).map(
  ([filePath, raw], idx) => {
    const slug = filePath.split('/').pop()!.replace(/\.md$/, '')
    const { data, content } = parseFrontmatter(raw)
    const firstParagraph =
      content
        .split(/\r?\n\r?\n/)
        .map((p) => p.trim())
        .find((p) => p && !p.startsWith('#')) ?? ''

    return {
      slug,
      code: data.code || `LOG-${String(idx + 3).padStart(2, '0')}`,
      title: data.title || slug,
      date: data.date || 'Draft',
      readTime: data.readTime || '2 min',
      excerpt: data.excerpt || firstParagraph,
      coverImage: data.coverImage || undefined,
      unlisted: data.unlisted === 'true',
      theme: data.theme === 'arrival' ? 'arrival' : undefined,
      ps: data.ps || undefined,
      markdown: content,
    }
  },
)

const LEGACY_POSTS: Post[] = [
  {
    slug: 'iasip-quote',
    code: 'LOG-02',
    title: 'Random IASIP quote',
    date: '2021-06-01',
    readTime: '1 min',
    excerpt:
      "Show a random quote from It's Always Sunny in Philadelphia right in your terminal.",
    coverImage: '/img/iasip_quote.png',
    blocks: [
      {
        type: 'paragraph',
        text: "Show a random quote from It's Always Sunny in Philadelphia in your terminal. All credit to the person who made sunnyquotes.net.",
      },
      {
        type: 'heading',
        text: 'Bash',
      },
      {
        type: 'paragraph',
        text: 'Add this snippet to your ~/.bashrc:',
      },
      {
        type: 'code',
        language: 'bash',
        text: `echo $(curl -s http://sunnyquotes.net/q.php?random \\
  | jq -r '.sqQuote + " - " + .sqWho + " (" + .sqEp + ")"')`,
      },
      {
        type: 'heading',
        text: 'PowerShell',
      },
      {
        type: 'paragraph',
        text: 'Add this snippet to your Microsoft.PowerShell_profile.ps1:',
      },
      {
        type: 'code',
        language: 'powershell',
        text: `function Get-IASIP-Quote() {
  $content = Invoke-WebRequest http://sunnyquotes.net/q.php?random \`
  | Select-Object -Expand Content | ConvertFrom-Json
  $quote = $content.sqQuote
  $ep = $content.sqEp
  $author = $content.sqWho
  Write-Host "$quote - $author ($ep)" -ForegroundColor yellow
}
Get-IASIP-Quote`,
      },
    ],
  },
  {
    slug: 'runneth',
    code: 'LOG-01',
    title: 'Runneth release',
    date: '2020-06-07',
    readTime: '2 min',
    excerpt:
      'A bookmark manager with a strict 5-item cap so you stop hoarding links you will never read.',
    coverImage: '/img/runneth_banner.png',
    blocks: [
      {
        type: 'paragraph',
        text: 'Runneth is a bookmark manager with the added goal of forcing you to prioritize. The difference from a normal bookmark manager is that you can only have up to 5 saved bookmarks at any time. This helps you stop hoarding links that you will never read.',
      },
      {
        type: 'links',
        label: 'Download Extension',
        items: [
          {
            label: 'Install on Chrome',
            href: 'https://chrome.google.com/webstore/detail/dmihmacgmljciebmenpanbfkllboajkl',
          },
          {
            label: 'Install on Firefox',
            href: 'https://addons.mozilla.org/en-US/firefox/addon/runneth/?src=search',
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'I was prompted to build this when I noticed that a few of my bookmarks folders had so many items that they were basically useless. One example was my Movies folder. I ended up saving so many movies to watch that opening the folder was the equivalent of going to IMDB and looking around the top lists.',
      },
      {
        type: 'paragraph',
        text: 'Runneth understands that collecting cool and interesting resources is no longer the problem — prioritizing them is. Live means that the items in this folder are meant to be in constant motion: they are added, read or watched, and then removed.',
      },
    ],
  },
]

export const POSTS: Post[] = [...MARKDOWN_POSTS, ...LEGACY_POSTS]

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug)
}
