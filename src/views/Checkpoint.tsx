import type { CheckState } from '../App'
import { useApp } from '../context'
import { QBANK } from '../content/questions'
import { chapterColor, codeOf } from '../lib/color'
import { recordAnswer } from '../lib/quiz'
import type { CellId, Mark } from '../types'
import { C, CORRECT, MONO_DISPLAY, NEUTRAL, PrimaryButton, SERIF, Tap, WRONG } from '../ui'

const markName = (m: Mark) => (m === 2 ? 'solid' : m === 1 ? 'shaky' : 'blank')
const markColor = (m: Mark) => (m === 2 ? C.green : m === 1 ? C.amber : C.pink)

/**
 * Prove it: concept MCQs, then say-the-whole-fact recall. The result grades ◆ and
 * ● for you and writes them to the chart, instead of self-marking.
 */
export default function Checkpoint({
  state,
  setState,
  onFinish,
  nextCellId,
}: {
  state: CheckState
  setState: (next: CheckState) => void
  onFinish: (state: CheckState) => void
  nextCellId: (id: CellId) => CellId | null
}) {
  const { store, go, progress } = useApp()
  const color = chapterColor(codeOf(state.cellId))

  const header = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Tap onClick={() => go.cell(state.cellId)} style={{ fontSize: 13, color: '#8a8a9a' }}>
        ‹ Back to {state.cellId}
      </Tap>
      <div style={{ fontSize: 11, fontWeight: 700, fontFamily: MONO_DISPLAY, color }}>CHECKPOINT</div>
    </div>
  )

  if (state.phase === 'q') {
    const q = QBANK[state.qs[state.qi]]
    const answered = state.chosen != null
    const right = state.chosen === q.a
    const lastQuestion = state.qi >= state.qs.length - 1

    return (
      <div style={{ padding: '16px 18px 130px' }}>
        {header}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: C.blue, marginTop: 14 }}>
          ◆ Concept check · {state.qi + 1} of {state.qs.length}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.6, marginTop: 10, color: '#eeeef4' }}>{q.q}</div>

        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.o.map((option, oi) => {
            let look = NEUTRAL
            let fg: string = NEUTRAL.fg
            if (answered) {
              if (oi === q.a) {
                look = CORRECT
                fg = CORRECT.fg
              } else if (oi === state.chosen) {
                look = WRONG
                fg = WRONG.fg
              } else {
                fg = C.faint
              }
            }
            return (
              <Tap
                key={oi}
                onClick={() => {
                  if (answered) return
                  const ok = oi === q.a
                  recordAnswer(progress, state.qs[state.qi], ok)
                  setState({ ...state, chosen: oi, qRight: state.qRight + (ok ? 1 : 0) })
                }}
                style={{
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  lineHeight: 1.5,
                  background: look.bg,
                  border: `1px solid ${look.bd}`,
                  color: fg,
                }}
              >
                {option}
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
              <div style={{ fontSize: 11, fontWeight: 700, color: right ? C.green : C.pink }}>
                {right ? 'CORRECT' : 'NOT QUITE'}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 13, lineHeight: 1.6, color: '#d9d9e2', marginTop: 4 }}>
                {q.w}
              </div>
            </div>
            <PrimaryButton
              onClick={() => {
                if (!lastQuestion) setState({ ...state, qi: state.qi + 1, chosen: null })
                else if (state.facts.length) setState({ ...state, phase: 'f' })
                else onFinish(state)
              }}
              style={{ marginTop: 10, padding: 12, fontSize: 13 }}
            >
              {!lastQuestion ? 'Next' : state.facts.length ? 'Now the facts →' : 'See your marks'}
            </PrimaryButton>
          </>
        )}
      </div>
    )
  }

  if (state.phase === 'f') {
    const fact = state.facts[state.fi]
    const lastFact = state.fi >= state.facts.length - 1

    return (
      <div style={{ padding: '16px 18px 130px' }}>
        {header}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: C.amber, marginTop: 14 }}>
          ● Fact recall · {state.fi + 1} of {state.facts.length}
        </div>

        <div
          style={{
            marginTop: 10,
            borderRadius: 12,
            padding: '14px 16px',
            background: '#131007',
            border: '1px solid #2e2612',
          }}
        >
          <div style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.6, color: '#eeeef4' }}>
            {fact.x.split(' ').slice(0, 5).join(' ')} …
          </div>
          <div style={{ fontSize: 12, color: '#9a8a5f', marginTop: 8 }}>
            Say the rest OUT LOUD — the whole fact — then reveal.
          </div>
        </div>

        {state.revealed ? (
          <>
            <div
              style={{
                marginTop: 12,
                borderRadius: 12,
                padding: '14px 16px',
                background: C.panel,
                border: `1px solid ${C.borderRaised}`,
              }}
            >
              <div style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.7, color: C.textSerif }}>{fact.x}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {([['Had it', true], ['Missed it', false]] as const).map(([label, ok]) => (
                <Tap
                  key={label}
                  onClick={() => {
                    const graded = { ...state, fRight: state.fRight + (ok ? 1 : 0) }
                    if (!lastFact) setState({ ...graded, fi: state.fi + 1, revealed: false })
                    else onFinish(graded)
                  }}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: 12,
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    background: ok ? CORRECT.bg : WRONG.bg,
                    border: `1px solid ${ok ? CORRECT.bd : WRONG.bd}`,
                    color: ok ? CORRECT.fg : WRONG.fg,
                  }}
                >
                  {label}
                </Tap>
              ))}
            </div>
          </>
        ) : (
          <PrimaryButton onClick={() => setState({ ...state, revealed: true })} style={{ marginTop: 12 }}>
            Reveal the fact
          </PrimaryButton>
        )}
      </div>
    )
  }

  // graded
  const saved = store.cells[state.cellId] ?? {}
  const cMark = (saved.c ?? 0) as Mark
  const fMark = (saved.f ?? 0) as Mark
  const prescription =
    cMark < 2 && fMark < 2
      ? 'Both columns shaky: start the cell over — read it, close the book, explain it out loud, then drill it.'
      : cMark < 2
        ? 'Concept weakness: re-reading won’t fix it. Re-derive the logic out loud without the book.'
        : fMark < 2
          ? 'Fact weakness: nothing is conceptually wrong — hit this chapter’s memorize sheet twice.'
          : 'Solid on both. The chart is lit — keep it lit with the missed queue.'

  return (
    <div style={{ padding: '16px 18px 130px' }}>
      {header}
      <div style={{ textAlign: 'center', marginTop: 26 }}>
        <div style={{ fontSize: 12, color: C.dim, letterSpacing: '.1em' }}>{state.cellId} — GRADED FOR YOU</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {(
            [
              ['◆ CONCEPTS', C.blue, cMark],
              ['● FACTS', C.amber, fMark],
            ] as const
          ).map(([label, labelColor, mark]) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 11, color: labelColor, fontWeight: 700 }}>{label}</div>
              <div
                style={{
                  fontFamily: MONO_DISPLAY,
                  fontSize: 24,
                  fontWeight: 700,
                  marginTop: 6,
                  color: markColor(mark),
                }}
              >
                {markName(mark)}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: SERIF,
            fontSize: 14,
            lineHeight: 1.65,
            color: '#c9c9d4',
            marginTop: 16,
            textAlign: 'left',
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
          {prescription}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <Tap
            onClick={() => go.cell(state.cellId)}
            style={{
              flex: 1,
              textAlign: 'center',
              background: C.raisedAlt,
              border: `1px solid ${C.borderRaised}`,
              borderRadius: 12,
              padding: 12,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Re-read the cell
          </Tap>
          <PrimaryButton
            onClick={() => {
              const next = nextCellId(state.cellId)
              if (next) go.cell(next)
              else go.home()
            }}
            style={{ flex: 1, padding: 12, fontSize: 13 }}
          >
            Next cell →
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
