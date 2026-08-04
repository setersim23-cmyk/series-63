import type { ToolState } from '../../App'
import { WALK } from '../../data/tools'
import { C, PrimaryButton, SERIF, Tap } from '../../ui'
import ToolPanel from './ToolPanel'

/** Six scenarios: call agent-or-not, then see which filter decided it. */
export default function FiveFilterWalk({
  tool,
  setTool,
}: {
  tool: ToolState
  setTool: (patch: Partial<ToolState>) => void
}) {
  const i = Math.min(tool.walkIdx, WALK.scenarios.length - 1)
  const scenario = WALK.scenarios[i]
  const answered = tool.walkPick != null
  const right = tool.walkPick === scenario.agent
  const last = i >= WALK.scenarios.length - 1

  return (
    <ToolPanel title={`🧭 ${WALK.title}`}>
      <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>
        Scenario {i + 1} of {WALK.scenarios.length}
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontSize: 14,
          lineHeight: 1.65,
          color: C.textSerif,
          marginTop: 10,
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: 12,
        }}
      >
        {scenario.s}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {([['AGENT — must register', true], ['NOT AN AGENT', false]] as const).map(([label, value]) => (
          <Tap
            key={label}
            onClick={() => {
              if (!answered) setTool({ walkPick: value })
            }}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '11px 6px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              background: answered && value === scenario.agent ? '#0e1f16' : C.raisedAlt,
              color: answered ? (value === scenario.agent ? C.green : C.ghost) : C.textSerif,
              border: `1px solid ${answered && value === scenario.agent ? '#2a5c40' : C.borderRaised}`,
            }}
          >
            {label}
          </Tap>
        ))}
      </div>

      {answered && (
        <>
          <div
            style={{
              marginTop: 10,
              borderRadius: 10,
              padding: '11px 13px',
              background: C.panel,
              border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: right ? C.green : C.pink }}>
              {right ? 'CORRECT' : 'NOT QUITE'}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 13, lineHeight: 1.6, color: '#d9d9e2', marginTop: 4 }}>
              {scenario.why}
            </div>
          </div>
          <PrimaryButton
            onClick={() => setTool({ walkIdx: last ? 0 : i + 1, walkPick: null })}
            style={{ marginTop: 8, padding: 10, fontSize: 13 }}
          >
            {last ? 'Start over' : 'Next scenario'}
          </PrimaryButton>
        </>
      )}
    </ToolPanel>
  )
}
