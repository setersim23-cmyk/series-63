import Sheet from './Sheet'
import { useApp } from '../context'
import { C, MONO_DISPLAY, Tap } from '../ui'

export default function VoiceSheet({ onClose }: { onClose: () => void }) {
  const { voices, store, setVoice } = useApp()

  return (
    <Sheet onClose={onClose} maxHeight="60vh">
      <div style={{ fontFamily: MONO_DISPLAY, fontSize: 16, fontWeight: 700 }}>Narration voice</div>
      <div style={{ fontSize: 12, color: C.dim, marginTop: 4, lineHeight: 1.55 }}>
        Chapters are narrated by a recorded voice — that is what keeps playing with the screen locked. These
        choices apply to anything not yet recorded, which your phone reads aloud instead.
      </div>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {voices.length === 0 && (
          <Tap
            onClick={onClose}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 10,
              padding: '11px 13px',
              background: C.panel,
              border: `1px solid ${C.border}`,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>System default</span>
            <span style={{ fontSize: 11, color: C.faint }}>voices load after first tap on iPhone</span>
          </Tap>
        )}
        {voices.map((v) => {
          const current = store.settings.voice === v.name
          return (
            <Tap
              key={v.name}
              onClick={() => setVoice(v.name)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 10,
                padding: '11px 13px',
                background: current ? '#1e2436' : C.panel,
                border: `1px solid ${current ? '#3a4a76' : C.border}`,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500 }}>
                {v.name.replace(/Microsoft |Google |Apple /, '')}
              </span>
              <span style={{ fontSize: 11, color: C.faint }}>
                {v.lang}
                {v.localService ? '' : ' · online'}
              </span>
            </Tap>
          )
        })}
      </div>
    </Sheet>
  )
}
