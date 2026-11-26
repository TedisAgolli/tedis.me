import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tweetHandler from './api/tweet'

function localApiPlugin(): Plugin {
  return {
    name: 'local-vercel-api',
    configureServer(server) {
      server.middlewares.use('/api/tweet', async (req, res) => {
        let statusCode = 200
        const nodeRes = {
          status(code: number) {
            statusCode = code
            return nodeRes
          },
          setHeader(name: string, value: string) {
            res.setHeader(name, value)
          },
          json(body: unknown) {
            res.statusCode = statusCode
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
          },
        }
        await tweetHandler(req, nodeRes)
      })
    },
  }
}

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    localApiPlugin(),
  ],
})
