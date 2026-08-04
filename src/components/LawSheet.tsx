import Sheet from './Sheet'
import { C, MONO_DISPLAY, SERIF } from '../ui'
import type { SheetContent } from '../context'

/** Tap-to-explain: what a citation is, in plain English. */
export default function LawSheet({ sheet, onClose }: { sheet: SheetContent; onClose: () => void }) {
  return (
    <Sheet onClose={onClose}>
      <div style={{ fontFamily: MONO_DISPLAY, fontSize: 16, fontWeight: 700, color: C.link }}>{sheet.term}</div>
      <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>{sheet.kind ?? ''}</div>
      <div style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.7, color: C.textSerif, marginTop: 10 }}>
        {sheet.body}
      </div>
    </Sheet>
  )
}
