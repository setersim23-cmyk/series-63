import type { LastSession } from '../App'
import { QBANK } from '../content/questions'
import { MOCK_PASS, PASS_TARGET } from '../lib/config'
import { GREEN, chapterColor, codeOf } from '../lib/color'
import type { ChapterCode } from '../types'
import { C, MONO_DISPLAY, PrimaryButton } from '../ui'

export default function Results({ last, onDone }: { last: LastSession; onDone: () => void }) {
  const pct = Math.round((100 * last.right) / last.total)
  const mock = last.mode === 'mock'
  const pass = mock ? last.right >= MOCK_PASS : pct >= PASS_TARGET

  const byChapter: Record<string, { r: number; t: number }> = {}
  last.qs.forEach((qi, k) => {
    const code = codeOf(QBANK[qi].c)
    byChapter[code] = byChapter[code] ?? { r: 0, t: 0 }
    byChapter[code].t++
    if (last.answers[k]) byChapter[code].r++
  })

  return (
    <div style={{ padding: '24px 18px calc(130px + var(--safe-bottom))', textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: C.dim, letterSpacing: '.1em' }}>
        {mock ? `TIMED MOCK — ${MOCK_PASS} TO PASS` : 'DRILL COMPLETE'}
      </div>
      <div
        style={{
          fontFamily: MONO_DISPLAY,
          fontSize: 52,
          fontWeight: 700,
          marginTop: 10,
          color: pass ? GREEN : C.pink,
        }}
      >
        {mock ? `${last.right}/60` : `${pct}%`}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
        {pass
          ? mock
            ? 'That’s a pass. Do it again tomorrow.'
            : 'Strong.'
          : mock
            ? 'Below the line — the chart shows where.'
            : 'The chart just got more honest.'}
      </div>
      <div style={{ fontSize: 12, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>
        {last.right} of {last.total} correct. Every answer has been written to your Harada chart and readiness score.
      </div>

      <div style={{ marginTop: 20, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Object.keys(byChapter).map((code) => {
          const { r, t } = byChapter[code]
          const color = chapterColor(code as ChapterCode)
          return (
            <div
              key={code}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '9px 13px',
              }}
            >
              <span style={{ fontFamily: MONO_DISPLAY, fontSize: 11, fontWeight: 700, color, width: 36 }}>
                {code}
              </span>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: C.borderSoft }}>
                <div
                  style={{ height: '100%', borderRadius: 2, background: color, width: `${Math.round((100 * r) / t)}%` }}
                />
              </div>
              <span style={{ fontSize: 12, color: C.dim }}>
                {r}/{t}
              </span>
            </div>
          )
        })}
      </div>

      <PrimaryButton onClick={onDone} style={{ marginTop: 18 }}>
        Back to Drill
      </PrimaryButton>
    </div>
  )
}
