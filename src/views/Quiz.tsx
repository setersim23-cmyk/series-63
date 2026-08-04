import { useApp } from '../context'
import { QBANK } from '../content/questions'
import { chapterColor, codeOf } from '../lib/color'
import type { Session } from '../lib/quiz'
import { C, CORRECT, MONO_DISPLAY, NEUTRAL, PrimaryButton, SERIF, Tap, WRONG } from '../ui'

export default function Quiz({
  session,
  onAnswer,
  onNext,
  onQuit,
}: {
  session: Session
  onAnswer: (oi: number) => void
  onNext: () => void
  onQuit: () => void
}) {
  const { go } = useApp()
  const q = QBANK[session.qs[session.i]]
  const code = codeOf(q.c)
  const color = chapterColor(code)
  const mock = session.mode === 'mock'

  let timer = ''
  let timerColor: string = C.dim
  if (mock && session.end) {
    const left = Math.max(0, session.end - Date.now())
    timer = `${Math.floor(left / 60000)}:${String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}`
    if (left < 10 * 60000) timerColor = C.pink
  }

  const answered = session.chosen != null
  const right = session.chosen === q.a

  return (
    <div style={{ padding: '16px 18px 130px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tap onClick={onQuit} style={{ fontSize: 13, color: '#8a8a9a' }}>
          ✕ End
        </Tap>
        <div style={{ fontSize: 12, color: C.dim }}>
          {session.i + 1} / {session.qs.length}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: MONO_DISPLAY, color: timerColor }}>{timer}</div>
      </div>

      <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: C.borderSoft }}>
        <div
          style={{
            height: '100%',
            borderRadius: 2,
            background: color,
            width: `${Math.round((100 * (session.i + (answered ? 1 : 0))) / session.qs.length)}%`,
            transition: 'width .3s',
          }}
        />
      </div>

      <div
        style={{
          marginTop: 16,
          display: 'inline-block',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: MONO_DISPLAY,
          color,
          background: C.raised,
          border: '1px solid #26262e',
          borderRadius: 6,
          padding: '3px 8px',
        }}
      >
        {q.c}
      </div>

      <div style={{ fontFamily: SERIF, fontSize: 17, lineHeight: 1.6, marginTop: 12, color: '#eeeef4' }}>{q.q}</div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.o.map((option, oi) => {
          let look = NEUTRAL
          let fg: string = NEUTRAL.fg
          if (answered && !mock) {
            if (oi === q.a) {
              look = CORRECT
              fg = CORRECT.fg
            } else if (oi === session.chosen) {
              look = WRONG
              fg = WRONG.fg
            } else {
              fg = C.faint
            }
          } else if (mock && session.chosen === oi) {
            look = { bg: '#1a1a28', bd: '#3a3a52', fg: NEUTRAL.fg }
            fg = NEUTRAL.fg
          }
          return (
            <Tap
              key={oi}
              onClick={() => onAnswer(oi)}
              style={{
                borderRadius: 12,
                padding: '13px 14px',
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

      {answered && !mock && (
        <>
          <div
            style={{
              marginTop: 14,
              borderRadius: 12,
              padding: '13px 15px',
              background: right ? '#0c1510' : '#160d11',
              border: `1px solid ${right ? '#1e3a2c' : '#33202a'}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.08em',
                color: right ? C.green : C.pink,
              }}
            >
              {right ? 'CORRECT' : 'NOT QUITE'}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.65, marginTop: 5, color: C.textSerif }}>
              {q.w}
            </div>
            <Tap onClick={() => go.cell(q.c)} style={{ fontSize: 12, color: C.link, marginTop: 8 }}>
              Read {q.c} →
            </Tap>
          </div>
          <PrimaryButton onClick={onNext} style={{ marginTop: 12 }}>
            {session.i >= session.qs.length - 1 ? 'See results' : 'Next question'}
          </PrimaryButton>
        </>
      )}
    </div>
  )
}
