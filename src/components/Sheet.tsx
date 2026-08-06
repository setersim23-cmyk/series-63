import type { ReactNode } from 'react'
import { C } from '../ui'

/** The bottom sheet every overlay in the app is built from. */
export default function Sheet({
  onClose,
  maxHeight,
  children,
}: {
  onClose: () => void
  maxHeight?: string
  children: ReactNode
}) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'var(--scrim)', zIndex: 20 }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          zIndex: 21,
          background: C.raised,
          border: `1px solid ${C.borderRaised}`,
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 34px',
          ...(maxHeight ? { maxHeight, overflow: 'auto' } : null),
        }}
      >
        <div
          style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--k33333f)', margin: '0 auto 14px' }}
        />
        {children}
      </div>
    </>
  )
}
