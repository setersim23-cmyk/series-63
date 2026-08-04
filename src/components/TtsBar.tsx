import { useApp } from '../context'
import { cellItems, findCell } from '../lib/content'
import type { CellId } from '../types'
import { C, Tap } from '../ui'

const RATES = [0.75, 1, 1.25, 1.5, 2]

/** The floating player: play/pause, speed, voice. */
export default function TtsBar({ cellId, color }: { cellId: CellId; color: string }) {
  const { store, ttsState, toggleCellSpeech, setRate, openVoices } = useApp()
  const total = cellItems(findCell(cellId)).length

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 66,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 6,
        padding: '0 10px',
      }}
    >
      <div
        style={{
          background: C.raised,
          border: `1px solid ${C.borderRaised}`,
          borderRadius: 16,
          padding: '10px 14px',
          boxShadow: '0 8px 30px rgba(0,0,0,.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Tap
            onClick={() => toggleCellSpeech(cellId)}
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: color,
              color: C.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flex: 'none',
            }}
          >
            {ttsState.playing ? '❚❚' : '▶'}
          </Tap>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {ttsState.playing
                ? `Reading ${cellId} — ${ttsState.item + 1} of ${total}${
                    ttsState.contPlay ? ' · auto-advancing' : ''
                  }`
                : 'Listen to this cell'}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
              {RATES.map((r) => {
                const on = (store.settings.rate || 1) === r
                return (
                  <Tap
                    key={r}
                    onClick={() => setRate(r)}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: on ? C.text : C.borderSoft,
                      color: on ? C.bg : C.dim,
                    }}
                  >
                    {r}×
                  </Tap>
                )
              })}
            </div>
          </div>

          <Tap
            onClick={openVoices}
            style={{ fontSize: 11, color: C.dim, textAlign: 'right', flex: 'none', maxWidth: 80 }}
          >
            <div
              style={{
                fontWeight: 600,
                color: '#c9c9d4',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {(store.settings.voice || 'Default').split(' ').slice(0, 2).join(' ')}
            </div>
            <div>voice ›</div>
          </Tap>
        </div>
      </div>
    </div>
  )
}
