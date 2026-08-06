import type { CSSProperties, ReactNode } from 'react'

/** The palette the design is built from. */
export const C = {
  bg: 'var(--k08080b)',
  panel: 'var(--k101016)',
  panelSoft: 'var(--k0d0d13)',
  raised: 'var(--k14141c)',
  raisedAlt: 'var(--k171720)',
  border: 'var(--k22222c)',
  borderSoft: 'var(--k1c1c26)',
  borderRaised: 'var(--k2a2a36)',
  text: 'var(--ke9e9ef)',
  textSerif: 'var(--ke2e2ea)',
  dim: 'var(--k9a9aa6)',
  faint: 'var(--k77778a)',
  ghost: 'var(--k55556a)',
  link: 'var(--k8ab4ff)',
  green: 'var(--k7ee0a8)',
  amber: 'var(--ke8c37a)',
  pink: 'var(--kff9ab0)',
  violet: 'var(--kb8a3f0)',
  blue: 'var(--k7eb8f0)',
} as const

/**
 * A design pixel size, in the app's type scale.
 *
 * Sizes are written the way they were drawn — fs(14) is the 14px the design
 * asked for — but resolve through --fs-unit, so the screen's width and the
 * reader's preference both apply without every call site knowing about either.
 */
export const fs = (px: number) => `calc(${px} * var(--fs-unit))`

export const SERIF = "'Source Serif 4',serif"
export const MONO_DISPLAY = "'Space Grotesk'"

export function Screen({ padding, children }: { padding: string; children: ReactNode }) {
  return <div style={{ padding }}>{children}</div>
}

/** A tappable region. Keyboard-reachable, unlike the prototype's bare divs. */
export function Tap({
  onClick,
  style,
  id,
  label,
  children,
}: {
  onClick: () => void
  style?: CSSProperties
  id?: string
  /** Spoken name, for the buttons whose visible text does not say what they do. */
  label?: string
  children: ReactNode
}) {
  return (
    <div
      id={id}
      role="button"
      aria-label={label}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      style={{ cursor: 'pointer', ...style }}
    >
      {children}
    </div>
  )
}

export function BackLink({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <Tap onClick={onClick} style={{ fontSize: fs(13), color: 'var(--k8a8a9a)', padding: '4px 0' }}>
      {children}
    </Tap>
  )
}

/** The high-contrast call-to-action used to advance every flow. */
export function PrimaryButton({
  onClick,
  children,
  style,
}: {
  onClick: () => void
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <Tap
      onClick={onClick}
      style={{
        textAlign: 'center',
        background: C.text,
        color: C.bg,
        borderRadius: 12,
        padding: 13,
        fontSize: fs(14),
        fontWeight: 700,
        ...style,
      }}
    >
      {children}
    </Tap>
  )
}

export function SectionLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ fontSize: fs(12), color: C.dim, letterSpacing: '.1em', fontWeight: 600, ...style }}>
      {children}
    </div>
  )
}

export function Title({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: MONO_DISPLAY, fontSize: fs(20), fontWeight: 700 }}>{children}</div>
}

/** Result/answer colour sets, reused by the quiz, checkpoint and sim. */
export interface AnswerLook {
  bg: string
  bd: string
  fg: string
}

export const CORRECT: AnswerLook = { bg: 'var(--k0e1f16)', bd: 'var(--k2a5c40)', fg: 'var(--kb9edcd)' }
export const WRONG: AnswerLook = { bg: 'var(--k210f14)', bd: 'var(--k5c2a38)', fg: 'var(--kffc4d0)' }
export const NEUTRAL: AnswerLook = { bg: C.panel, bd: C.border, fg: C.textSerif }
