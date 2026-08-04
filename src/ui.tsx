import type { CSSProperties, ReactNode } from 'react'

/** The palette the design is built from. */
export const C = {
  bg: '#08080b',
  panel: '#101016',
  panelSoft: '#0d0d13',
  raised: '#14141c',
  raisedAlt: '#171720',
  border: '#22222c',
  borderSoft: '#1c1c26',
  borderRaised: '#2a2a36',
  text: '#e9e9ef',
  textSerif: '#e2e2ea',
  dim: '#9a9aa6',
  faint: '#77778a',
  ghost: '#55556a',
  link: '#8ab4ff',
  green: '#7ee0a8',
  amber: '#e8c37a',
  pink: '#ff9ab0',
  violet: '#b8a3f0',
  blue: '#7eb8f0',
} as const

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
  children,
}: {
  onClick: () => void
  style?: CSSProperties
  id?: string
  children: ReactNode
}) {
  return (
    <div
      id={id}
      role="button"
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
    <Tap onClick={onClick} style={{ fontSize: 13, color: '#8a8a9a', padding: '4px 0' }}>
      {children}
    </Tap>
  )
}

/** The white call-to-action used to advance every flow. */
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
        fontSize: 14,
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
    <div style={{ fontSize: 12, color: C.dim, letterSpacing: '.1em', fontWeight: 600, ...style }}>
      {children}
    </div>
  )
}

export function Title({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: MONO_DISPLAY, fontSize: 20, fontWeight: 700 }}>{children}</div>
}

/** Result/answer colour sets, reused by the quiz, checkpoint and sim. */
export interface AnswerLook {
  bg: string
  bd: string
  fg: string
}

export const CORRECT: AnswerLook = { bg: '#0e1f16', bd: '#2a5c40', fg: '#b9edcd' }
export const WRONG: AnswerLook = { bg: '#210f14', bd: '#5c2a38', fg: '#ffc4d0' }
export const NEUTRAL: AnswerLook = { bg: C.panel, bd: C.border, fg: C.textSerif }
