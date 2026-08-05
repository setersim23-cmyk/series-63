import { useApp } from '../context'
import { META } from '../data/meta'
import { chapterColor } from '../lib/color'
import { findChapter } from '../lib/content'
import type { ChapterCode } from '../types'
import { BackLink, C, MONO_DISPLAY, SERIF, Tap } from '../ui'

/** Cover the fact, read the cell code, say the fact out loud. */
export default function Memo({
  code,
  open,
  setOpen,
}: {
  code: ChapterCode
  open: Record<number, boolean>
  setOpen: (next: Record<number, boolean>) => void
}) {
  const { go } = useApp()
  const chapter = findChapter(code)
  const color = chapterColor(code)

  return (
    <div style={{ padding: '16px 18px calc(130px + var(--safe-bottom))' }}>
      <BackLink onClick={() => go.chapter(code)}>‹ {META[code].name}</BackLink>
      <div style={{ fontFamily: MONO_DISPLAY, fontSize: 20, fontWeight: 700, marginTop: 8, color: C.amber }}>
        ● {code} memorize sheet
      </div>
      <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>
        Cover the fact, read the cell code, say the fact out loud.
      </div>

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(chapter?.memorize ?? []).map((fact, i) => {
          const isOpen = open[i] !== false
          return (
            <Tap
              key={i}
              onClick={() => setOpen({ ...open, [i]: !isOpen })}
              style={{
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: MONO_DISPLAY, fontSize: 11, fontWeight: 700, color }}>{fact.cell}</div>
                <div style={{ fontSize: 10, color: C.ghost }}>{isOpen ? 'tap to hide' : 'tap to reveal'}</div>
              </div>
              {isOpen && (
                <div
                  style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.7, color: C.textSerif, marginTop: 6 }}
                >
                  {fact.x}
                </div>
              )}
            </Tap>
          )
        })}
      </div>
    </div>
  )
}
