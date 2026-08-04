import { useApp } from '../context'
import { MOCK_PASS } from '../lib/config'
import { GREEN, chapterColor } from '../lib/color'
import { dueCount } from '../lib/scoring'
import { ORDER } from '../types'
import { C, MONO_DISPLAY, SectionLabel, Tap, Title } from '../ui'

const tile = {
  background: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: 16,
}

export default function Drill() {
  const { store, startQuiz, startWalk, startSim } = useApp()

  const due = dueCount(store)
  const best = store.mocks.length ? Math.max(...store.mocks.map((m) => m.score)) : null

  return (
    <div style={{ padding: '20px 18px 120px' }}>
      <Title>Drill</Title>
      <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>
        Every answer updates your readiness score and Harada chart instantly.
      </div>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Tap onClick={() => startQuiz('quick')} style={tile}>
          <div style={{ fontSize: 22 }}>⚡</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>Quick 10</div>
          <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>Adaptive — targets your weakest cells</div>
        </Tap>

        <Tap onClick={() => startQuiz('missed')} style={{ ...tile, border: `1px solid ${due ? '#7a3b2e' : C.border}` }}>
          <div style={{ fontSize: 22 }}>↻</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>Missed queue</div>
          <div style={{ fontSize: 11, color: due ? '#ff9a7a' : C.faint, marginTop: 2 }}>
            {due ? `${due} due for review now` : 'Nothing due — miss some questions first'}
          </div>
        </Tap>

        <Tap onClick={() => startQuiz('hard')} style={tile}>
          <div style={{ fontSize: 22 }}>◆</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>The Hard 5</div>
          <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>Multi-concept killers — exam-day difficulty</div>
        </Tap>

        <Tap onClick={startSim} style={tile}>
          <div style={{ fontSize: 22 }}>⚖</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>Administrator sim</div>
          <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>4 enforcement cases — you make the calls</div>
        </Tap>

        <Tap
          onClick={() => startWalk('all')}
          style={{
            gridColumn: '1/-1',
            background: '#12101a',
            border: '1px solid #2b2440',
            borderRadius: 16,
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.violet }}>🏛 Walk the whole palace</div>
            <div style={{ fontSize: 11, color: '#77708f', marginTop: 2 }}>
              All 8 rooms, 64 loci — the final overview. Recall every spot from memory.
            </div>
          </div>
          <div style={{ color: '#55506a', fontSize: 18 }}>›</div>
        </Tap>

        <Tap
          onClick={() => startQuiz('mock')}
          style={{
            ...tile,
            gridColumn: '1/-1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Timed mock exam</div>
            <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>
              60 scored questions · 75 minutes · pass at {MOCK_PASS}
            </div>
          </div>
          <div
            style={{
              fontFamily: MONO_DISPLAY,
              fontSize: 13,
              fontWeight: 700,
              color: best != null ? (best >= MOCK_PASS ? GREEN : C.amber) : C.ghost,
            }}
          >
            {best != null ? `best ${best}/60` : 'not taken'}
          </div>
        </Tap>
      </div>

      <SectionLabel style={{ marginTop: 18 }}>DRILL ONE CHAPTER</SectionLabel>
      <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {ORDER.map((code) => (
          <Tap
            key={code}
            onClick={() => startQuiz('chapter', code)}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              background: C.raised,
              border: '1px solid #26262e',
              fontSize: 13,
              fontWeight: 600,
              color: chapterColor(code),
            }}
          >
            {code}
          </Tap>
        ))}
      </div>

      {store.mocks.length > 0 && (
        <>
          <SectionLabel style={{ marginTop: 18 }}>MOCK HISTORY</SectionLabel>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {store.mocks
              .slice(-5)
              .reverse()
              .map((mock) => (
                <div
                  key={mock.ts}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    background: C.panel,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: C.dim }}>
                    {new Date(mock.ts).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                  <span style={{ fontWeight: 700, color: mock.score >= MOCK_PASS ? GREEN : C.pink }}>
                    {mock.score}/60{mock.score >= MOCK_PASS ? ' · pass' : ` · below ${MOCK_PASS}`}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}
