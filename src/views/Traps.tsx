import { useApp } from '../context'
import { TEXTBOOK } from '../content/textbook'
import { chapterColor } from '../lib/color'
import { ORDER } from '../types'
import { C, BackLink, fs, MONO_DISPLAY, SERIF, Tap } from '../ui'

/** Every ▲ trap in the book, in teaching order. The night-before read. */
export default function Traps() {
  const { go } = useApp()

  const traps = ORDER.flatMap((code) => {
    const chapter = TEXTBOOK.chapters.find((c) => c.code === code)
    if (!chapter) return []
    return chapter.cells.flatMap((cell) =>
      cell.items.filter((i) => i.t === 'trap').map((item) => ({ cell: cell.id, text: item.x, code }))
    )
  })

  return (
    <div style={{ padding: '16px 18px calc(130px + var(--safe-bottom))' }}>
      <BackLink onClick={go.learn}>‹ Learn</BackLink>
      <div style={{ fontFamily: MONO_DISPLAY, fontSize: fs(20), fontWeight: 700, marginTop: 8, color: C.pink }}>
        ▲ Every trap in the book
      </div>
      <div style={{ fontSize: fs(12), color: C.dim, marginTop: 4, lineHeight: 1.5 }}>
        The wrong answers that feel right. Read these last, the night before.
      </div>

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {traps.map((trap, i) => (
          <Tap
            key={i}
            onClick={() => go.cell(trap.cell)}
            style={{
              background: 'var(--k120e13)',
              border: '1px solid var(--k2e1f2a)',
              borderRadius: 12,
              padding: '12px 14px',
            }}
          >
            <div style={{ fontFamily: MONO_DISPLAY, fontSize: fs(11), fontWeight: 700, color: chapterColor(trap.code) }}>
              {trap.cell}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: fs(14), lineHeight: 1.65, color: C.textSerif, marginTop: 5 }}>
              {trap.text}
            </div>
          </Tap>
        ))}
      </div>
    </div>
  )
}
