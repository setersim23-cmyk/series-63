import type { WalkState } from '../App'
import { useApp } from '../context'
import { chapterColor, codeOf } from '../lib/color'
import { findCell, locusOf } from '../lib/content'
import type { Mark } from '../types'
import { C, MONO_DISPLAY, PrimaryButton, SERIF, Tap } from '../ui'

const GRADES: [string, Mark, string, string, string][] = [
  ['Had it', 2, '#0e1f16', '#2a5c40', '#b9edcd'],
  ['Shaky', 1, '#191507', '#4a3d16', '#e8c37a'],
  ['Gone', 0, '#210f14', '#5c2a38', '#ffc4d0'],
]

/** Stand at each locus, recall the rule out loud, grade yourself. Grades hit the chart. */
export default function PalaceWalk({
  state,
  setState,
  onGrade,
}: {
  state: WalkState
  setState: (next: WalkState) => void
  onGrade: (g: Mark) => void
}) {
  const { go } = useApp()
  const exit = () => (state.scope === 'all' ? go.drill() : go.chapter(state.scope))

  if (state.i >= state.seq.length) {
    const had = state.grades.filter((g) => g === 2).length
    const shaky = state.grades.filter((g) => g === 1).length
    return (
      <div style={{ padding: '16px 18px calc(130px + var(--safe-bottom))' }}>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div style={{ fontSize: 40 }}>🏛</div>
          <div style={{ fontFamily: MONO_DISPLAY, fontSize: 20, fontWeight: 700, marginTop: 10 }}>
            {state.scope === 'all' ? 'The full palace walk' : 'Room walk complete'}
          </div>
          <div style={{ fontSize: 13, color: C.violet, marginTop: 8 }}>
            {had === state.grades.length
              ? 'You own this floor.'
              : had >= state.grades.length * 0.7
                ? 'Nearly furnished — revisit the dark spots.'
                : 'Walk it again tomorrow. The rooms remember.'}
          </div>
          <div style={{ fontSize: 13, color: C.dim, marginTop: 6, lineHeight: 1.6 }}>
            {had} solid · {shaky} shaky · {state.grades.length - had - shaky} gone. Every grade is on your chart.
          </div>
          <PrimaryButton onClick={exit} style={{ marginTop: 18 }}>
            Back
          </PrimaryButton>
        </div>
      </div>
    )
  }

  const id = state.seq[state.i]
  const locus = locusOf(id)!
  const cell = findCell(id)
  const core = cell ? (cell.items.find((x) => x.t === 'concept') ?? cell.items[0]) : null

  return (
    <div style={{ padding: '16px 18px calc(130px + var(--safe-bottom))' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tap onClick={exit} style={{ fontSize: 13, color: '#8a8a9a' }}>
          ✕ Leave the palace
        </Tap>
        <div style={{ fontSize: 12, color: C.dim }}>
          {state.i + 1} / {state.seq.length}
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          borderRadius: 16,
          padding: 18,
          background: '#12101a',
          border: '1px solid #2b2440',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', color: '#77708f' }}>{locus.room}</div>
        <div
          style={{
            fontFamily: MONO_DISPLAY,
            fontSize: 19,
            fontWeight: 700,
            color: C.violet,
            marginTop: 3,
            textTransform: 'capitalize',
          }}
        >
          {locus.spot}
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.7,
            color: '#d5cbee',
            marginTop: 12,
          }}
        >
          {locus.img}
        </div>
      </div>

      <div style={{ fontSize: 13, color: C.dim, marginTop: 12, lineHeight: 1.6 }}>
        Stand here. What rule lives at this spot? Say it out loud before you reveal.
      </div>

      {state.revealed ? (
        <>
          <div
            style={{
              marginTop: 14,
              borderRadius: 12,
              padding: '14px 16px',
              background: C.panel,
              border: `1px solid ${C.borderRaised}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                style={{
                  fontFamily: MONO_DISPLAY,
                  fontSize: 12,
                  fontWeight: 700,
                  color: chapterColor(codeOf(id)),
                }}
              >
                {id}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{cell?.title}</span>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.7, color: C.textSerif, marginTop: 8 }}>
              {core?.x}
            </div>
            <Tap onClick={() => go.cell(id)} style={{ fontSize: 12, color: C.link, marginTop: 8 }}>
              Open the full cell →
            </Tap>
          </div>

          <div style={{ fontSize: 11, color: C.faint, marginTop: 12 }}>How was your recall?</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {GRADES.map(([label, grade, bg, bd, fg]) => (
              <Tap
                key={label}
                onClick={() => onGrade(grade)}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: 12,
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  background: bg,
                  border: `1px solid ${bd}`,
                  color: fg,
                }}
              >
                {label}
              </Tap>
            ))}
          </div>
        </>
      ) : (
        <PrimaryButton onClick={() => setState({ ...state, revealed: true })} style={{ marginTop: 14 }}>
          Reveal what lives here
        </PrimaryButton>
      )}
    </div>
  )
}
