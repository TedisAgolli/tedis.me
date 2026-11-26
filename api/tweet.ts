import { getTweet } from 'react-tweet/api'

interface NodeRequest {
  url?: string
  query?: Record<string, string | string[] | undefined>
}

interface NodeResponse {
  status: (code: number) => NodeResponse
  setHeader: (name: string, value: string) => void
  json: (body: unknown) => void
}

function getTweetIdFromRequest(req: NodeRequest): string | null {
  const qId = req.query?.id
  if (typeof qId === 'string' && /^\d+$/.test(qId)) return qId
  if (req.url) {
    try {
      const parsed = new URL(req.url, 'http://localhost')
      const id = parsed.searchParams.get('id')
      if (id && /^\d+$/.test(id)) return id
    } catch {
      return null
    }
  }
  return null
}

export default async function handler(req: NodeRequest, res: NodeResponse) {
  const id = getTweetIdFromRequest(req)
  if (!id) {
    res.status(400).json({ error: 'Invalid or missing tweet id' })
    return
  }

  try {
    const tweet = await getTweet(id)
    if (!tweet) {
      res.status(404).json({ data: null })
      return
    }
    res.setHeader(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate=86400',
    )
    res.status(200).json({ data: tweet })
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to fetch tweet',
    })
  }
}
