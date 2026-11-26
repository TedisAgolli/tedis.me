import { useEffect, useRef, useState } from 'react'

interface RingNode {
  baseAngle: number
  dx: number
  dy: number
  vdx: number
  vdy: number
  clusterWeight: number
  jagged: number
  phase: number
}

interface InkFlare {
  nodeIndex: number
  angleOffset: number
  baseLen: number
  baseWidth: number
  bend: number
  hasDroplet: boolean
  phase: number
  speed: number
  inward: boolean
}

const CANVAS_SIZE = 520
const CX = CANVAS_SIZE / 2
const CY = CANVAS_SIZE / 2
const BASE_R = 76
const NODE_COUNT = 56

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildLogogramGeometry() {
  const rand = mulberry32(4217)

  const clusters = [
    { angle: -Math.PI * 0.62, spread: 0.36, strength: 1.35 },
    { angle: -Math.PI * 0.1, spread: 0.3, strength: 0.95 },
    { angle: Math.PI * 0.24, spread: 0.32, strength: 1.2 },
    { angle: Math.PI * 0.82, spread: 0.34, strength: 1.05 },
  ]
  const gapCenter = Math.PI * 0.52
  const gapHalf = 0.22

  const nodes: RingNode[] = Array.from({ length: NODE_COUNT }, (_, i) => {
    const a = (i / NODE_COUNT) * Math.PI * 2 - Math.PI

    let distGap = Math.abs(a - gapCenter)
    if (distGap > Math.PI) distGap = Math.PI * 2 - distGap
    const gapMask =
      distGap < gapHalf ? 0 : Math.min(1, (distGap - gapHalf) / 0.26)

    let clusterWeight = 0.22
    for (const c of clusters) {
      let d = a - c.angle
      while (d > Math.PI) d -= Math.PI * 2
      while (d < -Math.PI) d += Math.PI * 2
      clusterWeight +=
        c.strength * Math.exp(-(d * d) / (2 * c.spread * c.spread))
    }

    return {
      baseAngle: a,
      dx: 0,
      dy: 0,
      vdx: 0,
      vdy: 0,
      clusterWeight: clusterWeight * gapMask,
      jagged: (rand() - 0.5) * 1.4,
      phase: rand() * Math.PI * 2,
    }
  })

  // Restrained, organic brush flares & ink wisps (far fewer & softer — not thorny)
  const flares: InkFlare[] = []
  for (let i = 0; i < NODE_COUNT; i += 2) {
    const n = nodes[i]
    if (n.clusterWeight < 0.78) continue

    const inward = rand() < 0.25
    flares.push({
      nodeIndex: i,
      angleOffset: (rand() - 0.5) * 0.65,
      baseLen: inward ? 5 + rand() * 8 : 8 + rand() * 14,
      baseWidth: 3.5 + rand() * 4.5,
      bend: (rand() - 0.5) * 0.5,
      hasDroplet: !inward && rand() < 0.35,
      phase: rand() * Math.PI * 2,
      speed: 0.65 + rand() * 0.85,
      inward,
    })
  }

  return { nodes, flares }
}

export function HeptapodLogogram() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cursorMode, setCursorMode] = useState<'grab' | 'grabbing'>('grab')

  const geomRef = useRef<{ nodes: RingNode[]; flares: InkFlare[] } | null>(null)

  const stateRef = useRef({
    holding: false,
    dragging: false,
    pointerX: CX,
    pointerY: CY,
    grabAngle: 0,
    grabStartX: CX,
    grabStartY: CY,
    flowSpeed: 1,
    scale: 1,
    energy: 0,
    time: 0,
    rotation: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = CANVAS_SIZE * dpr
    canvas.height = CANVAS_SIZE * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (!geomRef.current) {
      geomRef.current = buildLogogramGeometry()
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let rafId = 0

    function drawSoftFlare(
      x: number,
      y: number,
      ang: number,
      len: number,
      width: number,
      bend: number,
    ) {
      if (!ctx || len < 1) return null
      const nx = -Math.sin(ang)
      const ny = Math.cos(ang)
      const halfW = width * 0.5
      const midX = x + Math.cos(ang + bend * 0.4) * (len * 0.55)
      const midY = y + Math.sin(ang + bend * 0.4) * (len * 0.55)
      const tipX = x + Math.cos(ang + bend * 0.75) * len
      const tipY = y + Math.sin(ang + bend * 0.75) * len

      ctx.beginPath()
      ctx.moveTo(x + nx * halfW, y + ny * halfW)
      ctx.quadraticCurveTo(
        midX + nx * halfW * 0.45,
        midY + ny * halfW * 0.45,
        tipX,
        tipY,
      )
      ctx.quadraticCurveTo(
        midX - nx * halfW * 0.45,
        midY - ny * halfW * 0.45,
        x - nx * halfW,
        y - ny * halfW,
      )
      ctx.closePath()
      ctx.fill()
      return { tipX, tipY }
    }

    function tick() {
      if (!ctx || !geomRef.current) return
      const s = stateRef.current
      const { nodes, flares } = geomRef.current

      const targetFlow = s.holding ? 9.5 : 1.0
      const targetScale = s.holding ? 1.12 : 1.0

      s.flowSpeed += (targetFlow - s.flowSpeed) * (s.holding ? 0.08 : 0.024)
      s.scale += (targetScale - s.scale) * (s.holding ? 0.045 : 0.02)
      s.energy += ((s.holding ? 1 : 0) - s.energy) * (s.holding ? 0.06 : 0.022)

      const dt = reducedMotion ? 0 : 0.016 * s.flowSpeed
      s.time += dt
      s.rotation += dt * 0.14

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        let targetDx = 0
        let targetDy = 0

        if (s.dragging) {
          let diff = node.baseAngle + s.rotation - s.grabAngle
          while (diff > Math.PI) diff -= Math.PI * 2
          while (diff < -Math.PI) diff += Math.PI * 2
          const influence = Math.exp(-(diff * diff) / 0.75)

          const pullX = Math.max(-110, Math.min(110, s.pointerX - s.grabStartX))
          const pullY = Math.max(-110, Math.min(110, s.pointerY - s.grabStartY))
          targetDx = pullX * influence
          targetDy = pullY * influence
        }

        const k = s.dragging ? 0.075 : 0.02
        const damp = s.dragging ? 0.7 : 0.8
        node.vdx = (node.vdx + (targetDx - node.dx) * k) * damp
        node.vdy = (node.vdy + (targetDy - node.dy) * k) * damp
        node.dx += node.vdx
        node.dy += node.vdy
      }

      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

      const ringPts = nodes.map((node) => {
        const a = node.baseAngle + s.rotation
        const chaos =
          Math.sin(node.baseAngle * 4 + s.time * 1.1 + node.phase) *
            (1.8 + s.energy * 3.0) +
          Math.cos(node.baseAngle * 7 - s.time * 1.6) *
            (0.9 + s.energy * 1.8) +
          node.jagged * node.clusterWeight * 1.4
        const r = (BASE_R + chaos) * s.scale
        const x = CX + Math.cos(a) * r + node.dx
        const y = CY + Math.sin(a) * r + node.dy

        const pulse =
          1 + 0.22 * Math.sin(node.baseAngle * 3 - s.time * 1.4 + node.phase)
        const w =
          node.clusterWeight === 0
            ? 0
            : Math.max(
                1.4,
                Math.pow(node.clusterWeight, 1.55) *
                  7.4 *
                  pulse *
                  (1 + s.energy * 0.25),
              )
        return { x, y, a, w }
      })

      // Zero ctx.filter blur — ultra-fast layered alpha passes (60-120fps, 0 lag)
      const renderRingPass = (widthMult: number, fill: string) => {
        if (!ctx) return
        ctx.fillStyle = fill

        let segStart = -1
        for (let i = 0; i <= ringPts.length; i++) {
          const pt = i < ringPts.length ? ringPts[i] : null
          const active = Boolean(pt && pt.w > 0.1)
          if (active && segStart === -1) {
            segStart = i
          } else if (!active && segStart !== -1) {
            const seg = ringPts.slice(segStart, i)
            if (seg.length >= 2) {
              const outer: { x: number; y: number }[] = []
              const inner: { x: number; y: number }[] = []
              for (let j = 0; j < seg.length; j++) {
                const prev = seg[Math.max(0, j - 1)]
                const cur = seg[j]
                const next = seg[Math.min(seg.length - 1, j + 1)]
                const tx = next.x - prev.x
                const ty = next.y - prev.y
                const len = Math.hypot(tx, ty) || 1
                const nx = ty / len
                const ny = -tx / len
                const endFade = Math.min(1, j / 3, (seg.length - 1 - j) / 3)
                const hw = cur.w * widthMult * 0.5 * Math.pow(endFade, 0.7)
                outer.push({ x: cur.x + nx * hw, y: cur.y + ny * hw })
                inner.push({ x: cur.x - nx * hw, y: cur.y - ny * hw })
              }

              ctx.beginPath()
              ctx.moveTo(outer[0].x, outer[0].y)
              for (let j = 1; j < outer.length; j++) {
                const mx = (outer[j - 1].x + outer[j].x) * 0.5
                const my = (outer[j - 1].y + outer[j].y) * 0.5
                ctx.quadraticCurveTo(outer[j - 1].x, outer[j - 1].y, mx, my)
              }
              ctx.lineTo(outer[outer.length - 1].x, outer[outer.length - 1].y)
              for (let j = inner.length - 1; j >= 0; j--) {
                const next = inner[Math.max(0, j - 1)]
                const mx = (inner[j].x + next.x) * 0.5
                const my = (inner[j].y + next.y) * 0.5
                ctx.quadraticCurveTo(inner[j].x, inner[j].y, mx, my)
              }
              ctx.closePath()
              ctx.fill()
            }
            segStart = -1
          }
        }

        for (const f of flares) {
          const host = ringPts[f.nodeIndex]
          if (host.w <= 0.2) continue

          const sway =
            Math.sin(s.time * f.speed + f.phase) * (0.12 + s.energy * 0.2)
          const stretch =
            1 +
            Math.sin(s.time * f.speed * 1.2 + f.phase) *
              (0.16 + s.energy * 0.28) +
            s.energy * 0.22
          const baseDir = f.inward ? host.a + Math.PI : host.a
          const ang = baseDir + f.angleOffset + sway
          const len = f.baseLen * stretch * s.scale
          const width = f.baseWidth * widthMult

          const res = drawSoftFlare(
            host.x,
            host.y,
            ang,
            len,
            width,
            f.bend + sway * 0.6,
          )

          if (res && f.hasDroplet && widthMult <= 1.05) {
            const drift = 4 + Math.sin(s.time * 1.4 + f.phase) * 2 + s.energy * 3
            const dx = res.tipX + Math.cos(ang + f.bend * 0.75) * drift
            const dy = res.tipY + Math.sin(ang + f.bend * 0.75) * drift
            ctx.beginPath()
            ctx.arc(dx, dy, 1.4, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Soft atmospheric mist layers (pure vector alpha — instant GPU rasterization)
      renderRingPass(2.1, `rgba(195, 212, 226, ${0.06 + s.energy * 0.05})`)
      renderRingPass(1.45, `rgba(215, 226, 236, ${0.14 + s.energy * 0.08})`)
      // Crisp calligraphic core
      renderRingPass(1.0, `rgba(236, 240, 244, ${0.86 + s.energy * 0.12})`)

      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafId)
  }, [])

  function getCanvasCoords(e: React.PointerEvent<HTMLDivElement>) {
    const canvas = canvasRef.current
    if (!canvas) return { x: CX, y: CY }
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE,
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    const { x, y } = getCanvasCoords(e)
    const s = stateRef.current
    s.holding = true
    s.dragging = true
    s.grabStartX = x
    s.grabStartY = y
    s.pointerX = x
    s.pointerY = y
    s.grabAngle = Math.atan2(y - CY, x - CX)
    setCursorMode('grabbing')
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const s = stateRef.current
    if (!s.dragging) return
    const { x, y } = getCanvasCoords(e)
    s.pointerX = x
    s.pointerY = y
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    const s = stateRef.current
    s.holding = false
    s.dragging = false
    setCursorMode('grab')
  }

  return (
    <div className="relative flex h-52 w-52 items-center justify-center sm:h-56 sm:w-56">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2"
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="Interactive Heptapod logogram — click and hold to accelerate the ink, or drag any side"
        title="Click & hold to accelerate, or drag any side"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            stateRef.current.holding = true
          }
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            stateRef.current.holding = false
          }
        }}
        className={`relative z-10 h-48 w-48 touch-none select-none rounded-full ${
          cursorMode === 'grabbing' ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      />
    </div>
  )
}
