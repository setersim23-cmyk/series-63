import type { ToolState } from '../../App'
import { TIMELINE } from '../../data/tools'
import { C, MONO_DISPLAY, Tap } from '../../ui'
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
                background: !placed ? C.panel : done ? (right ? '#0e1f16' : '#210f14') : '#1a1a24',
                border: `1px solid ${!placed ? C.border : done ? (right ? '#2a5c40' : '#5c2a38') : '#3a3a52'}`,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: '#1a1a24',
                  flex: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: MONO_DISPLAY,
                  fontSize: 11,
                  fontWeight: 700,
                  color: !placed ? C.ghost : done ? (right ? C.green : C.pink) : C.text,
                }}
              >
                {placed ? pos + 1 : '·'}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.5, color: '#d9d9e2' }}>{event}</div>
            </Tap>
          )
        })}
      </div>
    </ToolPanel>
  )
}
