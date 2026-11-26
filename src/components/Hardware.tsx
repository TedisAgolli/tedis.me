import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { playClick } from '../lib/sound'

interface ModulePanelProps {
  unit?: string
  rightLabel?: ReactNode
  children: ReactNode
  className?: string
}

export function ModulePanel({
  unit,
  rightLabel,
  children,
  className = '',
}: ModulePanelProps) {
  return (
    <section className={`hw-module p-4 sm:p-5 ${className}`}>
      {unit || rightLabel ? (
        <header className="mb-3 flex items-center justify-between gap-2 font-mono-hw text-[10px] font-medium uppercase tracking-[0.09em] text-[var(--hw-muted)]">
          <span>{unit}</span>
          {rightLabel ? (
            <div className="flex items-center gap-2">{rightLabel}</div>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}

interface KeycapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  variant?: 'default' | 'accent'
  sound?: 'press' | 'tick' | 'toggle'
}

export function KeycapButton({
  active = false,
  variant = 'default',
  sound = 'press',
  onClick,
  className = '',
  children,
  ...rest
}: KeycapButtonProps) {
  return (
    <button
      type="button"
      data-active={active ? 'true' : undefined}
      data-variant={variant === 'accent' ? 'accent' : undefined}
      className={`hw-key ${className}`}
      onClick={(e) => {
        playClick(sound)
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

export function LcdScreen({
  tone = 'green',
  className = '',
  children,
}: {
  tone?: 'green' | 'amber'
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`hw-lcd ${className}`}
      data-tone={tone === 'amber' ? 'amber' : undefined}
    >
      {children}
    </div>
  )
}
