import type { ToolState } from '../App'
import { useApp } from '../context'
import { LAWS } from '../data/laws'
import { META } from '../data/meta'
import { TOOLMAP } from '../data/tools'
import { chapterColor, codeOf, hue } from '../lib/color'
import { cellItems, findCell, locusOf, segments, type DisplayItem } from '../lib/content'
import { nextCellId } from '../lib/scoring'
import type { CellId, Mark } from '../types'
import { C, MONO_DISPLAY, SERIF, Tap } from '../ui'
import TtsBar from '../components/TtsBar'
import FiveFilterWalk from '../components/tools/FiveFilterWalk'
import RescissionCalc from '../components/tools/RescissionCalc'
import Sorter from '../components/tools/Sorter'
import Timeline from '../components/tools/Timeline'

const TAG_STYLES: Record<string, { l: string; c: string; bg: string; bd: string }> = {
  concept: { l: '◆ CONCEPT — RE-DERIVE IF MISSED', c: '#7eb8f0', bg: '#0d1119', bd: '#1c2536' },
  memorize: { l: '● MEMORIZE — DRILL IF MISSED', c: '#e8c37a', bg: '#131007', bd: '#2e2612' },
  trap: { l: '▲ EXAM TRAP', c: '#ff9ab0', bg: '#170d12', bd: '#33202a' },
  link: { l: '→ CONNECTS TO', c: '#9a9aa6', bg: '#0d0d13', bd: '#22222c' },
  warn: { l: '⚠ SOURCE NOTE', c: '#e89a5a', bg: '#140f0a', bd: '#2e2214' },
  frame: { l: '● THE ANSWER FRAMEWORK', c: '#7ee0a8', bg: '#0a1510', bd: '#1e3a2c' },
}

const MARKS: [string, Mark][] = [
  ['blank', 0],
  ['shaky', 1],
  ['solid', 2],
]

export default function CellView({
  cellId,
  tool,
  setTool,
  onNextCell,
}: {
  cellId: CellId
  tool: ToolState
  setTool: React.Dispatch<React.SetStateAction<ToolState>>
  onNextCell: (id: CellId) => void
}) {
  const { store, go, progress, ttsState, startQuiz, startCheck, openSheet, markCell } = useApp()

  const code = codeOf(cellId)
  const cell = findCell(cellId)
  const color = chapterColor(code)
  const saved = store.cells[cellId] ?? {}
  const locus = locusOf(cellId)
  const items = cellItems(cell)
  const next = nextCellId(cellId)
  const toolKey = TOOLMAP[cellId]
  const patchTool = (patch: Partial<ToolState>) => setTool((t) => ({ ...t, ...patch }))

  const markRow = (field: 'c' | 'f') =>
    MARKS.map(([label, value]) => {
      // "blank" only reads as chosen once the cell has actually been touched.
      const on = (saved[field] ?? 0) === value && (store.cells[cellId] != null || value !== 0)
      return (
        <Tap
          key={label}
          onClick={() => markCell(cellId, field, value)}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '7px 0',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            background: on ? color : C.raisedAlt,
            color: on ? C.bg : C.dim,
            border: `1px solid ${on ? 'transparent' : C.borderRaised}`,
          }}
        >
          {label}
        </Tap>
      )
    })

  return (
    <div style={{ padding: '0 0 190px' }}>
      {/* sticky header keeps the actor visible while you read */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
          background: 'rgba(8,8,11,.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${C.borderSoft}`,
          padding: '12px 18px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tap onClick={() => go.chapter(code)} style={{ fontSize: 13, color: '#8a8a9a' }}>
            ‹ {META[code].name}
          </Tap>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '.05em',
              color: C.bg,
              background: color,
              borderRadius: 5,
              padding: '2px 7px',
            }}
          >
            ABOUT {META[code].actor}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
          <div style={{ fontFamily: MONO_DISPLAY, fontSize: 15, fontWeight: 700, color }}>{cellId}</div>
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{cell?.title ?? 'Loading…'}</div>
        </div>
      </div>

      <div style={{ padding: '14px 18px' }}>
        {locus && (
          <div
            style={{
              marginBottom: 12,
              borderRadius: 12,
              padding: '12px 14px',
              background: '#12101a',
              border: '1px solid #2b2440',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: C.violet }}>
              🏛 YOUR LOCUS — {locus.room} · {locus.spot}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 14,
                lineHeight: 1.65,
                color: '#d5cbee',
                marginTop: 5,
              }}
            >
              {locus.img}
            </div>
            <div style={{ fontSize: 10, color: '#77708f', marginTop: 5 }}>
              Fix this image at this spot while you read. The palace walk will bring you back here.
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <ItemCard
              key={i}
              item={item}
              index={i}
              speaking={ttsState.playing && ttsState.item === i}
              word={ttsState.word}
              color={color}
              tintBg={hue(code, 28, 0.05, 0.3)}
              onTerm={(term) =>
                openSheet({ term: LAWS[term][0], body: LAWS[term][1], kind: 'tap outside to close' })
              }
            />
          ))}
        </div>

        {!!cell?.refs.length && (
          <div
            style={{
              marginTop: 14,
              background: C.panelSoft,
              border: `1px solid ${C.borderSoft}`,
              borderRadius: 12,
              padding: '12px 14px',
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: C.faint }}>
              SECOND ANGLES — SAME MATERIAL IN YOUR OTHER BOOKS
            </div>
            {cell.refs.map((r) => (
              <div key={r} style={{ fontSize: 12, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>
                {r}
              </div>
            ))}
          </div>
        )}

        {(toolKey === 'sorter-sec' || toolKey === 'sorter-eth') && (
          <Sorter toolKey={toolKey} tool={tool} setTool={patchTool} />
        )}
        {toolKey === 'timeline' && <Timeline tool={tool} setTool={patchTool} />}
        {toolKey === 'walk' && <FiveFilterWalk tool={tool} setTool={patchTool} />}
        {toolKey === 'calc' && <RescissionCalc tool={tool} setTool={patchTool} />}

        <Tap
          onClick={() => startCheck(cellId)}
          style={{
            marginTop: 16,
            borderRadius: 14,
            padding: '15px 16px',
            background: color,
            color: C.bg,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Prove it — checkpoint</div>
            <div style={{ fontSize: 11, marginTop: 2, opacity: 0.75 }}>
              Concept questions + fact recall grade this cell for you
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>→</div>
        </Tap>

        <div
          style={{
            marginTop: 10,
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: C.dim }}>
            OR MARK IT MANUALLY
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <div style={{ fontSize: 12, color: C.blue, width: 80, flex: 'none' }}>◆ Concepts</div>
            {markRow('c')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <div style={{ fontSize: 12, color: C.amber, width: 80, flex: 'none' }}>● Facts</div>
            {markRow('f')}
          </div>
          <div style={{ fontSize: 11, color: '#66667a', marginTop: 10, lineHeight: 1.5 }}>
            Shaky on ◆ concepts → re-derive out loud. Shaky on ● facts → drill the memorize sheet. Different diseases,
            different treatments.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Tap
            onClick={() => startQuiz('cell', cellId)}
            style={{
              flex: 1,
              textAlign: 'center',
              background: C.raisedAlt,
              border: `1px solid ${C.borderRaised}`,
              borderRadius: 12,
              padding: 11,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Drill this cell
          </Tap>
          <Tap
            onClick={() => {
              progress.touch(cellId, (c) => (c.read = true))
              if (!next) return go.home()
              // Crossing into a new chapter lands on the chapter, not straight into its first cell.
              if (codeOf(next) !== code) go.chapter(codeOf(next))
              else onNextCell(next)
            }}
            style={{
              flex: 1,
              textAlign: 'center',
              background: color,
              color: C.bg,
              borderRadius: 12,
              padding: 11,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {next ? (next.endsWith('-1') ? 'Next chapter →' : 'Next cell →') : 'Done'}
          </Tap>
        </div>
      </div>

      <TtsBar cellId={cellId} color={color} />
    </div>
  )
}

function ItemCard({
  item,
  index,
  speaking,
  word,
  color,
  tintBg,
  onTerm,
}: {
  item: DisplayItem
  index: number
  speaking: boolean
  word: number
  color: string
  tintBg: string
  onTerm: (term: string) => void
}) {
  const tag = TAG_STYLES[item.t] ?? TAG_STYLES.link
  const isFrame = item.t === 'frame' && !speaking

  return (
    <div
      id={`rit-${index}`}
      style={{
        borderRadius: 12,
        padding: '12px 14px',
        background: speaking ? tintBg : tag.bg,
        border: `1px solid ${speaking ? color : tag.bd}`,
        transition: 'background .3s,border-color .3s',
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: tag.c, marginBottom: 6 }}>
        {isFrame && item.t === 'frame' ? item.fr.head.toUpperCase() : tag.l}
      </div>

      {speaking ? (
        <div style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.75, color: C.textSerif }}>
          {item.x.split(/\s+/).map((w, wi) => (
            <span
              key={wi}
              style={{
                borderRadius: 3,
                padding: '0 1px',
                background: wi === word ? color : '',
                color: wi === word ? C.bg : wi < word ? '#fafafd' : '#8f8f9e',
              }}
            >
              {w}{' '}
            </span>
          ))}
        </div>
      ) : isFrame && item.t === 'frame' ? (
        <>
          <div style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.7, color: '#c9d8ce' }}>{item.fr.intro}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 10 }}>
            {item.fr.bullets.map(([b, r]) => (
              <div key={b} style={{ display: 'flex', gap: 9 }}>
                <span style={{ color: C.green, flex: 'none', lineHeight: 1.7 }}>▸</span>
                <div style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.7, color: '#dce8e0' }}>
                  <strong style={{ color: '#f0faf4' }}>{b}</strong> {r}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 14,
              lineHeight: 1.7,
              color: '#c9d8ce',
              marginTop: 10,
              borderTop: '1px solid #1e3a2c',
              paddingTop: 10,
            }}
          >
            {item.fr.tail}
          </div>
        </>
      ) : (
        <div style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.75, color: C.textSerif }}>
          {segments(item.x).map((seg, si) =>
            seg.term ? (
              <span
                key={si}
                onClick={() => onTerm(seg.term!)}
                style={{ color: C.link, borderBottom: '1px dotted #4a6a9e', cursor: 'pointer' }}
              >
                {seg.t}
              </span>
            ) : (
              <span key={si}>{seg.t}</span>
            )
          )}
        </div>
      )}
    </div>
  )
}
