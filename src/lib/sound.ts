let audioCtx: AudioContext | null = null
let sfxEnabled = true

export function isSfxEnabled() {
  return sfxEnabled
}

export function setSfxEnabled(next: boolean) {
  sfxEnabled = next
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (Ctx) {
      audioCtx = new Ctx()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    void audioCtx.resume()
  }
  return audioCtx
}

export function playClick(kind: 'press' | 'tick' | 'toggle' = 'press') {
  if (!sfxEnabled) return
  const ctx = getContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  if (kind === 'press') {
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.028)
    gain.gain.setValueAtTime(0.06, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
  } else if (kind === 'toggle') {
    osc.type = 'sine'
    osc.frequency.setValueAtTime(680, now)
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.035)
    gain.gain.setValueAtTime(0.05, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038)
  } else {
    osc.type = 'square'
    osc.frequency.setValueAtTime(900, now)
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.015)
    gain.gain.setValueAtTime(0.025, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018)
  }

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.045)
}
