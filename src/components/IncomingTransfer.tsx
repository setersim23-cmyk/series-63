import Sheet from './Sheet'
import { useApp } from '../context'
import { describeSnapshot, type Snapshot } from '../lib/transfer'
import { C, fs, MONO_DISPLAY, PrimaryButton, Tap } from '../ui'

/**
 * Shown when the app is opened from a transfer link. Nothing is applied until
 * it is accepted, and the summary says what will actually change — arriving to
 * find your chart silently rewritten would be worse than no sync at all.
 */
export default function IncomingTransfer({
  snapshot,
  onDone,
}: {
  snapshot: Snapshot
  onDone: () => void
}) {
  const { store, progress } = useApp()
  const { newCells, newMocks, age, merged } = describeSnapshot(store, snapshot)
  const nothingNew = newCells === 0 && newMocks === 0

  return (
    <Sheet onClose={onDone} maxHeight="70vh">
      <div style={{ fontFamily: MONO_DISPLAY, fontSize: fs(16), fontWeight: 700 }}>⇅ Progress from your other device</div>
      <div style={{ fontSize: fs(12), color: C.dim, marginTop: 4, lineHeight: 1.55 }}>
        Taken {age}.{' '}
        {nothingNew
          ? 'Everything in it is already here or older than what this device has, so there is nothing to bring across.'
          : 'Merging keeps whichever version of each cell was worked on most recently — nothing already on this device is lost.'}
      </div>

      {!nothingNew && (
        <div
          style={{
            marginTop: 12,
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            gap: 18,
          }}
        >
          <div>
            <div style={{ fontFamily: MONO_DISPLAY, fontSize: fs(20), fontWeight: 700 }}>{newCells}</div>
            <div style={{ fontSize: fs(10), color: C.faint }}>CELLS UPDATED</div>
          </div>
          <div>
            <div style={{ fontFamily: MONO_DISPLAY, fontSize: fs(20), fontWeight: 700 }}>{newMocks}</div>
            <div style={{ fontSize: fs(10), color: C.faint }}>MOCKS ADDED</div>
          </div>
        </div>
      )}

      {nothingNew ? (
        <PrimaryButton onClick={onDone} style={{ marginTop: 14 }}>
          Close
        </PrimaryButton>
      ) : (
        <>
          <PrimaryButton
            onClick={() => {
              progress.replace(merged)
              onDone()
            }}
            style={{ marginTop: 14 }}
          >
            Bring it across
          </PrimaryButton>
          <Tap
            onClick={onDone}
            style={{ marginTop: 8, textAlign: 'center', fontSize: fs(12), color: C.faint, padding: 6 }}
          >
            Not now
          </Tap>
        </>
      )}
    </Sheet>
  )
}
