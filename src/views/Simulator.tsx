import type { SimState } from '../App'
import { useApp } from '../context'
import { SIM } from '../data/sim'
import { C, BackLink, fs, MONO_DISPLAY, PrimaryButton, SERIF, Tap, Title } from '../ui'

/** You are the Administrator: choose the action, the statute, and the remedy. */
export default function Simulator({
  state,
  setState,
}: {
  state: SimState
  setState: (next: SimState) => void
}) {
  const { go } = useApp()

  if (state.ci == null) {
    return (
      <div style={{ padding: '16px 18px calc(130px + var(--safe-bottom))' }}>
        <BackLink onClick={go.drill}>‹ Back</BackLink>
        <div style={{ marginTop: 8 }}>
          <Title>⚖ {SIM.title}</Title>
        </div>
        <div style={{ fontSize: fs(12), color: C.dim, marginTop: 4, lineHeight: 1.5 }}>
          You are the state securities Administrator. Choose the action, the statute, and the remedy — and see what
          getting it wrong costs.
        </div>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SIM.cases.map((c, ci) => (
            <Tap
              key={c.name}
              onClick={() => setState({ ci, step: 0, pick: null, wrong: 0 })}
              style={{
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: '15px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: fs(14), fontWeight: 600 }}>{c.name}</div>
              <div style={{ color: C.ghost, fontSize: fs(18) }}>›</div>
            </Tap>
          ))}
        </div>
      </div>
    )
  }

  const theCase = SIM.cases[state.ci]
  const finished = state.step >= theCase.steps.length
  const step = theCase.steps[Math.min(state.step, theCase.steps.length - 1)]
  const answered = state.pick != null
  const backToCases = () => setState({ ci: null, step: 0, pick: null, wrong: 0 })

  return (
    <div style={{ padding: '16px 18px calc(130px + var(--safe-bottom))' }}>
      <BackLink onClick={backToCases}>‹ Back</BackLink>
      <div style={{ fontFamily: MONO_DISPLAY, fontSize: fs(17), fontWeight: 700, marginTop: 8 }}>{theCase.name}</div>
      <div style={{ fontSize: fs(11), color: C.faint, marginTop: 2 }}>
        {finished ? 'Case closed' : `Decision ${state.step + 1} of ${theCase.steps.length}`}
      </div>

      <div
        style={{
          fontFamily: SERIF,
          fontSize: fs(14),
          lineHeight: 1.7,
          color: 'var(--kd9d9e2)',
          marginTop: 10,
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 14,
        }}
      >
        {theCase.facts}
      </div>

      {finished ? (
        <>
          <div
            style={{
              marginTop: 14,
              borderRadius: 12,
              padding: '14px 16px',
              background: 'var(--k0a1510)',
              border: '1px solid var(--k1e3a2c)',
            }}
          >
            <div style={{ fontSize: fs(13), fontWeight: 700, color: C.green }}>
              {state.wrong === 0
                ? 'Flawless — the Administrator’s Administrator.'
                : state.wrong === 1
                  ? 'One misstep — the appeal survives.'
                  : 'Reversed on appeal. Re-run this case.'}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: fs(13), lineHeight: 1.65, color: 'var(--kc9d8ce)', marginTop: 6 }}>
              {theCase.close}
            </div>
          </div>
          <PrimaryButton onClick={backToCases} style={{ marginTop: 12, padding: 12, fontSize: fs(13) }}>
            Back to the case files
          </PrimaryButton>
        </>
      ) : (
        <>
          <div style={{ fontSize: fs(14), fontWeight: 600, marginTop: 14 }}>{step.p}</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {step.o.map((option, oi) => {
              const picked = state.pick === oi
              return (
                <Tap
                  key={option.t}
                  onClick={() => {
                    if (answered) return
                    setState({ ...state, pick: oi, wrong: state.wrong + (option.ok ? 0 : 1) })
                  }}
                  style={{
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: fs(13),
                    lineHeight: 1.5,
                    background: answered ? (option.ok ? 'var(--k0e1f16)' : picked ? 'var(--k210f14)' : C.panel) : C.panel,
                    border: `1px solid ${
                      answered ? (option.ok ? 'var(--k2a5c40)' : picked ? 'var(--k5c2a38)' : C.border) : C.border
                    }`,
                    color: answered ? (option.ok ? 'var(--kb9edcd)' : picked ? 'var(--kffc4d0)' : C.ghost) : C.textSerif,
                  }}
                >
                  {option.t}
                </Tap>
              )
            })}
          </div>

          {answered && (
            <>
              <div
                style={{
                  marginTop: 12,
                  borderRadius: 12,
                  padding: '12px 14px',
                  background: C.panel,
                  border: `1px solid ${C.borderRaised}`,
                }}
              >
                <div
                  style={{ fontSize: fs(11), fontWeight: 700, color: step.o[state.pick!].ok ? C.green : C.pink }}
                >
                  {step.o[state.pick!].ok ? 'GOOD CALL' : 'CONSEQUENCE'}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: fs(13), lineHeight: 1.6, color: 'var(--kd9d9e2)', marginTop: 4 }}>
                  {step.o[state.pick!].fb}
                </div>
              </div>
              <PrimaryButton
                onClick={() => setState({ ...state, step: state.step + 1, pick: null })}
                style={{ marginTop: 10, padding: 12, fontSize: fs(13) }}
              >
                {state.step >= theCase.steps.length - 1 ? 'Close the case' : 'Next decision'}
              </PrimaryButton>
            </>
          )}
        </>
      )}
    </div>
  )
}
