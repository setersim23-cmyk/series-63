import type { ToolState } from '../../App'
import { SORTERS } from '../../data/tools'
import { useApp } from '../../context'
import { C, fs, Tap } from '../../ui'
import ToolPanel from './ToolPanel'

/** Tap an item, then tap the bucket it belongs in. Feedback opens as a sheet. */
export default function Sorter({
  toolKey,
  tool,
  setTool,
}: {
  toolKey: string
  tool: ToolState
  setTool: (patch: Partial<ToolState>) => void
}) {
  const { openSheet } = useApp()
  const sorter = SORTERS[toolKey]

  const placedKeys = Object.keys(tool.placed).map(Number)
  const rightCount = placedKeys.filter((k) => tool.placed[k] === sorter.items[k].b).length

  return (
    <ToolPanel
      title={`🎯 ${sorter.title}`}
      hint={tool.sel != null ? 'Now tap the bucket it belongs in ↓' : sorter.hint}
      onReset={() => setTool({ placed: {}, sel: null })}
      footer={placedKeys.length ? `${rightCount}/${placedKeys.length} placed correctly` : ''}
    >
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {sorter.buckets.map((bucket, bi) => (
          <Tap
            key={bucket}
            onClick={() => {
              if (tool.sel == null) return
              const item = sorter.items[tool.sel]
              const ok = item.b === bi
              openSheet({
                term: ok ? '✓ Correct' : `✗ Not quite — it’s ${sorter.buckets[item.b]}`,
                body: item.why,
                kind: item.t,
              })
              setTool({ placed: { ...tool.placed, [tool.sel]: bi }, sel: null })
            }}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px 4px',
              borderRadius: 10,
              border: `1px dashed ${tool.sel != null ? 'var(--k3a4a76)' : 'var(--k26262e)'}`,
              background: tool.sel != null ? 'var(--k1e2436)' : C.raised,
              fontSize: fs(11),
              fontWeight: 700,
              letterSpacing: '.05em',
            }}
          >
            {bucket}
          </Tap>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {sorter.items.map((item, ii) => {
          const placed = tool.placed[ii]
          const selected = tool.sel === ii
          const correct = placed === item.b
          return (
            <Tap
              key={item.t}
              onClick={() => {
                if (placed != null) openSheet({ term: sorter.buckets[item.b], body: item.why, kind: item.t })
                else setTool({ sel: selected ? null : ii })
              }}
              style={{
                padding: '7px 11px',
                borderRadius: 9,
                fontSize: fs(12),
                fontWeight: 500,
                background: placed == null ? (selected ? C.text : C.raisedAlt) : correct ? 'var(--k0e1f16)' : 'var(--k210f14)',
                color: placed == null ? (selected ? C.bg : C.textSerif) : correct ? C.green : C.pink,
                border: `1px solid ${
                  placed == null ? (selected ? C.text : C.borderRaised) : correct ? 'var(--k2a5c40)' : 'var(--k5c2a38)'
                }`,
              }}
            >
              {item.t}
              {placed == null ? '' : correct ? ' ✓' : ` ✗ → ${sorter.buckets[item.b]}`}
            </Tap>
          )
        })}
      </div>
    </ToolPanel>
  )
}
