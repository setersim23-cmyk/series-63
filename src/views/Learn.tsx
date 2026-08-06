import { useApp } from '../context'
import { META } from '../data/meta'
import { chapterColor } from '../lib/color'
import { trapCount } from '../lib/content'
import { chapterScore } from '../lib/scoring'
import { ORDER } from '../types'
import { C, fs, MONO_DISPLAY, Tap, Title } from '../ui'

export default function Learn() {
  const { store, go } = useApp()

  return (
    <div style={{ padding: '20px 18px calc(120px + var(--safe-bottom))' }}>
      <Title>Learn</Title>
      <div style={{ fontSize: fs(12), color: C.dim, marginTop: 4, lineHeight: 1.5 }}>
        Eight chapters in teaching order. Each opens into eight cells you can read or listen to.
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ORDER.map((code) => {
          const color = chapterColor(code)
          return (
            <Tap
              key={code}
              onClick={() => go.chapter(code)}
              style={{
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${color}`,
                borderRadius: 14,
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: fs(15), fontWeight: 600 }}>{META[code].name}</div>
                <div style={{ fontFamily: MONO_DISPLAY, fontSize: fs(13), fontWeight: 700, color }}>
                  {chapterScore(store, code)}
                </div>
              </div>
              <div style={{ fontSize: fs(11), color: C.faint, marginTop: 3 }}>
                {META[code].w}% of the exam · about <span style={{ color }}>{META[code].actor.toLowerCase()}</span>
              </div>
            </Tap>
          )
        })}
      </div>

      <Tap
        onClick={go.traps}
        style={{
          marginTop: 14,
          background: 'var(--k17111a)',
          border: '1px solid var(--k3a2233)',
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: fs(14), fontWeight: 600, color: C.pink }}>▲ All {trapCount()} exam traps</div>
          <div style={{ fontSize: fs(11), color: 'var(--k9a7a88)', marginTop: 2 }}>The highest-yield hour before you walk in</div>
        </div>
        <div style={{ color: 'var(--k664455)', fontSize: fs(18) }}>›</div>
      </Tap>
    </div>
  )
}
