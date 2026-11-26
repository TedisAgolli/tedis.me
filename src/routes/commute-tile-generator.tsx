import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Copy, RotateCcw } from 'lucide-react'
import { KeycapButton, LcdScreen, ModulePanel } from '../components/Hardware'

export const Route = createFileRoute('/commute-tile-generator')({
  component: CommuteTileGeneratorPage,
})

function CommuteTileGeneratorPage() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [label, setLabel] = useState('commute')
  const [logo, setLogo] = useState('')
  const [color, setColor] = useState('')
  const [style, setStyle] = useState('')
  const [copied, setCopied] = useState(false)

  const badgeUrl = useMemo(() => {
    const googleParams = new URLSearchParams({
      origins: origin.trim(),
      destinations: destination.trim(),
      key: apiKey.trim() || 'API_KEY_HERE',
      departure_time: 'now',
      mode: 'driving',
      units: 'imperial',
    }).toString()

    const googleMapsUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?${googleParams}`

    const shieldsParams = new URLSearchParams({ label })
    if (logo.trim()) shieldsParams.set('logo', logo.trim())
    if (color.trim()) shieldsParams.set('color', color.trim())
    if (style.trim()) shieldsParams.set('style', style.trim())
    shieldsParams.set('url', googleMapsUrl)
    shieldsParams.set(
      'query',
      '$.rows[0].elements[0].duration_in_traffic.text',
    )

    return `https://img.shields.io/badge/dynamic/json?${shieldsParams.toString()}`
  }, [origin, destination, apiKey, label, logo, color, style])

  function fillExample() {
    setOrigin('41.8781,-87.6298')
    setDestination('41.9742,-87.9073')
    setLabel('to work')
    setColor('brightgreen')
    setStyle('for-the-badge')
  }

  function resetForm() {
    setOrigin('')
    setDestination('')
    setApiKey('')
    setLabel('commute')
    setLogo('')
    setColor('')
    setStyle('')
  }

  function copyUrl() {
    void navigator.clipboard?.writeText(badgeUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="space-y-4">
      <ModulePanel
        unit="TOOL · COMMUTE TILE GENERATOR"
        rightLabel={
          <div className="flex items-center gap-1.5">
            <KeycapButton className="px-2.5 py-1 text-[10px]" onClick={fillExample}>
              LOAD EXAMPLE
            </KeycapButton>
            <KeycapButton className="px-2.5 py-1 text-[10px]" onClick={resetForm}>
              <RotateCcw className="h-3 w-3" />
              RESET
            </KeycapButton>
          </div>
        }
      >
        <h1 className="text-xl font-bold tracking-tight">
          Commute Time Badge Generator
        </h1>
        <p className="mt-1 text-sm text-[var(--hw-muted)]">
          Generate a dynamic Shields.io badge powered by the Google Maps Distance
          Matrix API — great for SharpTools dashboards or README status tiles.
        </p>

        <div className="hw-well mt-4 flex flex-wrap items-center justify-between gap-4 p-3">
          <div className="font-mono-hw text-[11px] text-[var(--hw-muted)]">
            EXAMPLE OUTPUT:
          </div>
          <img
            src="/img/commute/exampleTile.png"
            alt="Example commute tile"
            className="max-h-14 rounded"
          />
        </div>
      </ModulePanel>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <ModulePanel unit="INPUT 01 · GOOGLE MAPS" className="md:col-span-6">
          <ol className="mb-4 space-y-1 font-mono-hw text-[11px] text-[var(--hw-muted)]">
            <li>1. Grab lat,long from Maps URL (@lat,long)</li>
            <li>2. Replace API_KEY_HERE with your key</li>
          </ol>

          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block font-mono-hw text-[10px] uppercase text-[var(--hw-muted)]">
                Origin (Lat, Long)
              </span>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="41.8781,-87.6298"
                className="hw-input"
              />
            </label>

            <label className="block">
              <span className="mb-1 block font-mono-hw text-[10px] uppercase text-[var(--hw-muted)]">
                Destination (Lat, Long)
              </span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="41.9742,-87.9073"
                className="hw-input"
              />
            </label>

            <label className="block">
              <span className="mb-1 block font-mono-hw text-[10px] uppercase text-[var(--hw-muted)]">
                Google Maps API Key (optional)
              </span>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API_KEY_HERE"
                className="hw-input"
              />
            </label>
          </div>
        </ModulePanel>

        <ModulePanel unit="INPUT 02 · SHIELDS.IO" className="md:col-span-6">
          <p className="mb-4 font-mono-hw text-[11px] text-[var(--hw-muted)]">
            Optional styling parameters passed to{' '}
            <a
              href="https://shields.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              shields.io
            </a>
            .
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block font-mono-hw text-[10px] uppercase text-[var(--hw-muted)]">
                Label
              </span>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="commute"
                className="hw-input"
              />
            </label>

            <label className="block">
              <span className="mb-1 block font-mono-hw text-[10px] uppercase text-[var(--hw-muted)]">
                Logo
              </span>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="googlemaps"
                className="hw-input"
              />
            </label>

            <label className="block">
              <span className="mb-1 block font-mono-hw text-[10px] uppercase text-[var(--hw-muted)]">
                Color
              </span>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="brightgreen"
                className="hw-input"
              />
            </label>

            <label className="block">
              <span className="mb-1 block font-mono-hw text-[10px] uppercase text-[var(--hw-muted)]">
                Style
              </span>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="for-the-badge"
                className="hw-input"
              />
            </label>
          </div>
        </ModulePanel>
      </div>

      <ModulePanel
        unit="OUTPUT · LIVE BADGE & URL"
        rightLabel={
          <KeycapButton
            variant="accent"
            className="px-3 py-1 text-[10px]"
            onClick={copyUrl}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                COPIED URL
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                COPY URL
              </>
            )}
          </KeycapButton>
        }
      >
        <div className="hw-well mb-3 flex min-h-14 items-center justify-center p-4">
          <img src={badgeUrl} alt="Generated commute badge preview" />
        </div>
        <LcdScreen className="break-all text-[11px]">{badgeUrl}</LcdScreen>
      </ModulePanel>
    </div>
  )
}
