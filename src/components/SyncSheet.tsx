import { useEffect, useState } from 'react'
import Sheet from './Sheet'
import QrCode from './QrCode'
import { useApp } from '../context'
import { decodeProgress, encodeProgress } from '../lib/store'
import { transferUrl } from '../lib/transfer'
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
 * Moving progress between devices. The QR is the fast path — point the other
 * device's camera at it and the app opens with the transfer offered. The code
 * below it is the fallback, and doubles as a backup you can paste into Notes.
 */
export default function SyncSheet({ onClose }: { onClose: () => void }) {
  const { store, progress } = useApp()
  const [url, setUrl] = useState<string | null>(null)
  const [showCode, setShowCode] = useState(false)
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let live = true
    transferUrl(store).then(
      (u) => live && setUrl(u),
      () => live && setMessage('Could not build the QR — use the code below.')
    )
    return () => {
      live = false
    }
  }, [store])

  const copy = () => {
    const code = encodeProgress(store)
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(
        () => setMessage('Copied — paste it into your other copy.'),
        () => setMessage('Copy failed — long-press the code and copy manually.')
      )
    } else {
      setMessage('Long-press the code and copy it manually.')
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
    <Sheet onClose={onClose} maxHeight="88vh">
      <div style={{ fontFamily: MONO_DISPLAY, fontSize: 16, fontWeight: 700 }}>⇅ Move my progress</div>
      <div style={{ fontSize: 12, color: C.dim, marginTop: 4, lineHeight: 1.55 }}>
        Point your other device’s camera at this code. It opens the app there and offers to bring your
        progress across — nothing is overwritten, the two are merged and the most recent work wins.
      </div>

      <div style={{ marginTop: 14 }}>
        {url ? (
          <QrCode text={url} size={230} />
        ) : (
          <div style={{ textAlign: 'center', fontSize: 12, color: C.faint, padding: 40 }}>building…</div>
        )}
      </div>

      <Tap
        onClick={() => setShowCode((s) => !s)}
        style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: C.link, padding: 4 }}
      >
        {showCode ? 'Hide the text code' : 'No camera? Use a text code instead'}
      </Tap>

      {showCode && (
        <>
          <PrimaryButton onClick={copy} style={{ marginTop: 8, padding: 12, fontSize: 13 }}>
            Copy my progress code
          </PrimaryButton>
          <textarea readOnly value={encodeProgress(store)} style={{ ...boxStyle, marginTop: 8, color: C.faint }} />

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
        </>
      )}

      <div style={{ fontSize: 12, color: C.green, marginTop: 8, minHeight: 16 }}>{message}</div>
    </Sheet>
  )
}
