import type { ReactNode } from 'react'
import { C, fs, Tap } from '../../ui'

/** The shared chrome for the tools embedded in lessons. */
export default function ToolPanel({
  title,
  hint,
  onReset,
  footer,
  children,
}: {
  title: string
  hint?: string
  onReset?: () => void
  footer?: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        marginTop: 16,
        background: 'var(--k0d1117)',
        border: '1px solid var(--k1f2a3a)',
        borderRadius: 14,
        padding: '14px 16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: fs(13), fontWeight: 700 }}>{title}</div>
        {onReset && (
          <Tap onClick={onReset} style={{ fontSize: fs(11), color: C.faint }}>
            reset
          </Tap>
        )}
      </div>
      {hint ? <div style={{ fontSize: fs(11), color: C.link, marginTop: 4 }}>{hint}</div> : null}
      {children}
      {footer ? <div style={{ fontSize: fs(11), color: C.faint, marginTop: 8 }}>{footer}</div> : null}
    </div>
  )
}
