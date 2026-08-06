import { useState } from 'react'
import { useApp } from '../context'
import { AUTH } from '../content/authorities'
import { L, chapterColor, codeOf } from '../lib/color'
import type { Authority } from '../types'
import Sheet from '../components/Sheet'
import { C, fs, MONO_DISPLAY, SERIF, Tap, Title } from '../ui'

/**
 * Six layers of authority as a stack, with the NSMIA line drawn as the literal
 * cut it is. Tap a law for what it does on this exam and which cells it lives in.
 */
export default function MapView() {
  const { go } = useApp()
  const [openLayer, setOpenLayer] = useState<string | null>(null)
  const [item, setItem] = useState<Authority | null>(null)

  return (
    <div style={{ padding: '20px 18px calc(130px + var(--safe-bottom))' }}>
      <Title>⚖ The Map of Authorities</Title>
      <div style={{ fontSize: fs(12), color: C.dim, marginTop: 6, lineHeight: 1.6 }}>{AUTH.intro}</div>

      <div
        style={{
          marginTop: 12,
          borderRadius: 12,
          padding: '12px 14px',
          background: C.panel,
          border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontSize: fs(10), fontWeight: 700, letterSpacing: '.1em', color: C.green }}>
          THE LAYER QUESTION THAT ANSWERS QUESTIONS
        </div>
        <div style={{ fontFamily: SERIF, fontSize: fs(13), lineHeight: 1.65, color: 'var(--kc9c9d4)', marginTop: 5 }}>
          {AUTH.layerRule}
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {AUTH.layers.map((layer, li) => {
          if (layer.line) {
            return (
              <div
                key={li}
                style={{
                  margin: '6px 0',
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'var(--k1c0d12)',
                  border: '1px dashed var(--k6e2a3d)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '50%',
                    height: 1,
                    background: 'linear-gradient(90deg,transparent,var(--kc14a68),transparent)',
                    opacity: 0.35,
                  }}
                />
                <div
                  style={{
                    fontSize: fs(11),
                    fontWeight: 700,
                    letterSpacing: '.14em',
                    color: 'var(--kff8aa8)',
                    textAlign: 'center',
                  }}
                >
                  — {layer.name} —
                </div>
                <div style={{ fontSize: fs(11), color: 'var(--kb0798c)', lineHeight: 1.6, marginTop: 6 }}>{layer.desc}</div>
              </div>
            )
          }

          const open = openLayer === layer.id
          const groups = layer.parts ?? [{ p: '', items: layer.items ?? [] }]
          const count = groups.reduce((s, g) => s + g.items.length, 0)

          return (
            <div
              key={li}
              style={{
                borderRadius: 14,
                background: `oklch(${L(30)} 0.04 ${layer.hue} / 0.25)`,
                border: `1px solid oklch(${L(45)} 0.07 ${layer.hue} / 0.5)`,
                overflow: 'hidden',
              }}
            >
              <Tap
                onClick={() => setOpenLayer(open ? null : (layer.id ?? null))}
                style={{
                  padding: '13px 15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: fs(14), fontWeight: 700, color: `oklch(${L(75)} 0.13 ${layer.hue})` }}>
                    {open ? '▾' : '▸'} {layer.name}
                  </div>
                  <div style={{ fontSize: fs(11), color: C.dim, marginTop: 2 }}>
                    {layer.sub} · {count} authorities
                  </div>
                </div>
              </Tap>

              {open && (
                <div style={{ padding: '0 15px 13px' }}>
                  <div style={{ fontSize: fs(12), color: 'var(--ka9a9b6)', lineHeight: 1.6, marginBottom: 10 }}>
                    {layer.desc}
                  </div>
                  {groups.map((group, gi) => (
                    <div key={gi}>
                      {group.p && (
                        <div
                          style={{
                            fontSize: fs(10),
                            fontWeight: 700,
                            letterSpacing: '.1em',
                            color: C.faint,
                            margin: '12px 0 6px',
                          }}
                        >
                          {group.p}
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 4 }}>
                        {group.items.map((authority) => (
                          <Tap
                            key={authority.n}
                            onClick={() => setItem(authority)}
                            style={{
                              background: C.panelSoft,
                              border: '1px solid var(--k1e1e28)',
                              borderRadius: 10,
                              padding: '10px 12px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: fs(13), fontWeight: 600, color: C.textSerif }}>{authority.n}</div>
                              <div style={{ fontSize: fs(11), color: C.faint, marginTop: 1 }}>{authority.s}</div>
                            </div>
                            <div style={{ color: 'var(--k44445a)', fontSize: fs(15), flex: 'none' }}>›</div>
                          </Tap>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ fontSize: fs(11), color: C.ghost, marginTop: 14, lineHeight: 1.6 }}>
        NASAA writes almost no questions that turn on a section number. Learn the map so the architecture makes sense
        — not to recite citations.
      </div>

      {item && (
        <Sheet onClose={() => setItem(null)} maxHeight="70vh">
          <div style={{ fontFamily: MONO_DISPLAY, fontSize: fs(17), fontWeight: 700, color: C.link }}>{item.n}</div>
          <div style={{ fontSize: fs(12), color: C.dim, marginTop: 3 }}>{item.s}</div>
          <div style={{ fontFamily: SERIF, fontSize: fs(14), lineHeight: 1.7, color: C.textSerif, marginTop: 12 }}>
            {item.w}
          </div>
          {!!item.cells?.length && (
            <>
              <div
                style={{
                  fontSize: fs(10),
                  fontWeight: 700,
                  letterSpacing: '.1em',
                  color: C.faint,
                  marginTop: 14,
                }}
              >
                WHERE THIS LIVES IN YOUR CHART
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {item.cells.map((id) => (
                  <Tap
                    key={id}
                    onClick={() => {
                      setItem(null)
                      go.cell(id)
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      background: 'var(--k1a1a24)',
                      border: `1px solid ${C.borderRaised}`,
                      fontFamily: MONO_DISPLAY,
                      fontSize: fs(12),
                      fontWeight: 700,
                      color: chapterColor(codeOf(id)),
                    }}
                  >
                    {id} →
                  </Tap>
                ))}
              </div>
            </>
          )}
        </Sheet>
      )}
    </div>
  )
}
