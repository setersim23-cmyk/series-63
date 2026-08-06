import { useApp } from '../context'
import { fs, Tap } from '../ui'

/**
 * Shown only when this copy cannot persist progress — an embedded page on an
 * opaque origin, or a browser with storage switched off. Sits in the flow at the
 * top of every screen rather than floating, so it can't collide with the sticky
 * cell header, and every navigation scrolls back to it.
 */
export default function StorageWarning() {
  const { openSync } = useApp()

  return (
    <Tap
      onClick={openSync}
      style={{
        margin: '10px 12px 0',
        borderRadius: 12,
        padding: '11px 13px',
        background: 'var(--k1c0d12)',
        border: '1px solid var(--k6e2a3d)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div style={{ fontSize: fs(16), flex: 'none' }}>⚠</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: fs(12), fontWeight: 700, color: 'var(--kff8aa8)' }}>
          This copy can’t save your progress
        </div>
        <div style={{ fontSize: fs(11), color: 'var(--kb0798c)', lineHeight: 1.5, marginTop: 2 }}>
          Everything works, but it resets when you close the app. Tap here to copy your progress code
          before you leave — or open the installed version, which does save.
        </div>
      </div>
      <div style={{ color: 'var(--k6e2a3d)', fontSize: fs(16), flex: 'none' }}>›</div>
    </Tap>
  )
}
