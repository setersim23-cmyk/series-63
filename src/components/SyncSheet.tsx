import { useMemo, useState } from 'react'
import Sheet from './Sheet'
import { useApp } from '../context'
import { decodeProgress, encodeProgress } from '../lib/store'
import { C, MONO_DISPLAY, PrimaryButton, Tap } from '../ui'

const boxStyle = {
  width: '100%',
  height: 64,
  background: C.panelSoft,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  fontSize: 10,
  padding: 8,
  fontFamily: 'monospace',
  boxSizing: 'border-box' as const,
}

/**
 * Progress lives on the device, so moving between the installed app and a backup
 * copy means moving a code by hand. It doubles as a "paste this into Notes" backup.
 */
export default function SyncSheet({ onClose }: { onClose: () => void }) {
  const { store, progress } = useApp()
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')

  const code = useMemo(() => encodeProgress(store), [store])

  const copy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(
        () => setMessage('Copied — paste it into your other copy.'),
        () => setMessage('Copy failed — long-press the code below and copy manually.')
      )
    } else {
      setMessage('Long-press the code below and copy it manually.')
    }
  }

  const apply = () => {
    try {
      progress.replace(decodeProgress(input))
      setInput('')
      setMessage('Progress restored ✓')
    } catch {
      setMessage('That code didn’t parse — paste the whole thing.')
    }
  }

  return (
    <Sheet onClose={onClose} maxHeight="75vh">
      <div style={{ fontFamily: MONO_DISPLAY, fontSize: 16, fontWeight: 700 }}>⇅ Progress transfer</div>
      <div style={{ fontSize: 12, color: C.dim, marginTop: 4, lineHeight: 1.55 }}>
        Your progress lives on this device only. To move it between the home-screen app and a backup copy: copy the
        code here, open the other copy, paste it there.
      </div>

      <PrimaryButton onClick={copy} style={{ marginTop: 12, padding: 12, fontSize: 13 }}>
        Copy my progress code
      </PrimaryButton>
      <textarea readOnly value={code} style={{ ...boxStyle, marginTop: 8, color: C.faint }} />

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: C.faint, marginTop: 14 }}>
        RESTORE FROM A CODE
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a progress code here"
        style={{ ...boxStyle, marginTop: 6, color: '#c9c9d4' }}
      />
      <Tap
        onClick={apply}
        style={{
          marginTop: 8,
          textAlign: 'center',
          background: C.raisedAlt,
          border: `1px solid ${C.borderRaised}`,
          borderRadius: 12,
          padding: 11,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Apply — replace this copy’s progress
      </Tap>
      <div style={{ fontSize: 12, color: C.green, marginTop: 8, minHeight: 16 }}>{message}</div>
    </Sheet>
  )
}
