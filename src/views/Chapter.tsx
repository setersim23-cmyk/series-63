import { useApp } from '../context'
import { LOCI } from '../data/loci'
import { META } from '../data/meta'
import { PASS_TARGET } from '../lib/config'
import { chapterColor, hue } from '../lib/color'
import { findChapter } from '../lib/content'
import { cellScore } from '../lib/scoring'
import type { ChapterCode, Mark } from '../types'
import { BackLink, C, MONO_DISPLAY, SERIF, Tap } from '../ui'

const markLabel = (m: Mark | undefined) => (m === 2 ? 'solid' : m === 1 ? 'shaky' : '—')

export default function ChapterView({ code }: { code: ChapterCode }) {
  const { store, go, startQuiz, startWalk, listenToChapter } = useApp()
  const chapter = findChapter(code)
  const meta = META[code]
  const color = chapterColor(code)

  return (
    <div style={{ padding: '16px 18px 120px' }}>
      <BackLink onClick={go.learn}>‹ Chapters</BackLink>

      <div
        style={{
          marginTop: 10,
          padding: 16,
          borderRadius: 16,
          background: hue(code, 30, 0.05, 0.22),
          border: `1px solid ${hue(code, 45, 0.08, 0.4)}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: MONO_DISPLAY, fontSize: 22, fontWeight: 700, color }}>{code}</div>
          <div style={{ fontSize: 11, color: C.dim }}>{chapter?.weight}</div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{meta.name}</div>
        <div
          style={{
            marginTop: 8,
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '.06em',
            color: C.bg,
            background: color,
            borderRadius: 6,
            padding: '3px 8px',
          }}
        >
          EVERYTHING HERE IS ABOUT {meta.actor}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.65, color: '#c9c9d4', marginTop: 12 }}>
          {chapter?.spine ?? 'Loading…'}
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <Tap
          onClick={() => listenToChapter(code)}
          style={{
            flex: 1,
            textAlign: 'center',
            background: C.raisedAlt,
            border: `1px solid ${C.borderRaised}`,
            borderRadius: 12,
            padding: 10,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ▶ Listen to chapter
        </Tap>
        <Tap
          onClick={() => startQuiz('chapter', code)}
          style={{
            flex: 1,
            textAlign: 'center',
            background: C.raisedAlt,
            border: `1px solid ${C.borderRaised}`,
            borderRadius: 12,
            padding: 10,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Drill {code}
        </Tap>
      </div>

      <Tap
        onClick={() => startWalk(code)}
        style={{
          marginTop: 8,
          borderRadius: 12,
          padding: '12px 16px',
          background: '#12101a',
          border: '1px solid #2b2440',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.violet }}>
            🏛 Walk this room — {LOCI[code].room}
          </div>
          <div style={{ fontSize: 11, color: '#77708f', marginTop: 2 }}>
            8 loci · recall each spot out loud, grade yourself, chart updates
          </div>
        </div>
        <div style={{ color: '#55506a', fontSize: 18 }}>›</div>
      </Tap>

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(chapter?.cells ?? []).map((cell) => {
          const s = cellScore(store, cell.id)
          const saved = store.cells[cell.id] ?? {}
          return (
            <Tap
              key={cell.id}
              onClick={() => go.cell(cell.id)}
              style={{
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{ fontFamily: MONO_DISPLAY, fontSize: 12, fontWeight: 700, color, flex: 'none', width: 44 }}
              >
                {cell.id}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{cell.title}</div>
                <div style={{ fontSize: 10, color: C.faint, marginTop: 2 }}>
                  ◆ {markLabel(saved.c)} · ● {markLabel(saved.f)}
                  {saved.read ? ' · read' : ''}
                </div>
              </div>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  flex: 'none',
                  background: s > 0 ? hue(code, 40, 0.09, 0.15 + (0.7 * s) / 100) : C.raised,
                  border: `1px solid ${s > 0 ? 'transparent' : '#26262e'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontFamily: MONO_DISPLAY,
                  fontWeight: 700,
                  color: s >= PASS_TARGET ? '#fff' : '#c9c9d4',
                }}
              >
                {s > 0 ? s : '·'}
              </div>
            </Tap>
          )
        })}
      </div>

      <Tap
        onClick={() => go.memo(code)}
        style={{
          marginTop: 12,
          background: '#141019',
          border: '1px solid #2e2438',
          borderRadius: 12,
          padding: '13px 16px',
          fontSize: 13,
          fontWeight: 600,
          color: C.amber,
        }}
      >
        ● Memorize sheet — {chapter?.memorize.length ?? '…'} raw facts
      </Tap>
    </div>
  )
}
