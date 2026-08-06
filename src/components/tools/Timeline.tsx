import type { ToolState } from '../../App'
import { TIMELINE } from '../../data/tools'
import { C, fs, MONO_DISPLAY, Tap } from '../../ui'
import ToolPanel from './ToolPanel'

/** Tap the events into the order the Act requires them. Graded once all are placed. */
export default function Timeline({
  tool,
  setTool,
}: {
  tool: ToolState
  setTool: (patch: Partial<ToolState>) => void
}) {
  const done = tool.seq.length === TIMELINE.events.length
  const correct = tool.seq.filter((e, k) => e === k).length

  return (
    <ToolPanel
      title={`🕐 ${TIMELINE.title}`}
      hint={done ? '' : TIMELINE.hint}
      onReset={() => setTool({ seq: [] })}
      footer={done ? `${correct}/${TIMELINE.events.length} in the right slot` : ''}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
        {TIMELINE.events.map((event, ei) => {
          const pos = tool.seq.indexOf(ei)
          const placed = pos >= 0
          const right = pos === ei
          return (
            <Tap
              key={event}
              onClick={() => {
                if (placed || done) return
                setTool({ seq: [...tool.seq, ei] })
              }}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                padding: '9px 12px',
                borderRadius: 10,
                background: !placed ? C.panel : done ? (right ? 'var(--k0e1f16)' : 'var(--k210f14)') : 'var(--k1a1a24)',
                border: `1px solid ${!placed ? C.border : done ? (right ? 'var(--k2a5c40)' : 'var(--k5c2a38)') : 'var(--k3a3a52)'}`,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'var(--k1a1a24)',
                  flex: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: MONO_DISPLAY,
                  fontSize: fs(11),
                  fontWeight: 700,
                  color: !placed ? C.ghost : done ? (right ? C.green : C.pink) : C.text,
                }}
              >
                {placed ? pos + 1 : '·'}
              </div>
              <div style={{ fontSize: fs(12), lineHeight: 1.5, color: 'var(--kd9d9e2)' }}>{event}</div>
            </Tap>
          )
        })}
      </div>
    </ToolPanel>
  )
}
