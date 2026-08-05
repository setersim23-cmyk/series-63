import { useApp } from '../context'
import { useWide } from '../lib/useWide'
import { META } from '../data/meta'
import { FALLBACK_PLAN, PLAN, type PlanDay } from '../data/plan'
import { EXAM_DATE, PASS_TARGET } from '../lib/config'
import { AMBER, GREEN, RED, chapterColor, hue } from '../lib/color'
import {
  chapterScore,
  cellScore,
  drillAccuracy,
  dueCount,
  overallScore,
  solidCount,
  weakestChapter,
} from '../lib/scoring'
import { ORDER, type ChapterCode } from '../types'
import { C, MONO_DISPLAY, SectionLabel, Tap } from '../ui'

const RING_R = 45
const CIRC = 2 * Math.PI * RING_R

function countdown(): string {
  const ms = new Date(EXAM_DATE).getTime() - Date.now()
  if (ms <= 0) return 'Exam day — go get it'
  const d = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return d > 0 ? `Exam in ${d}d ${h}h` : `Exam in ${h}h ${m}m`
}

function todaysPlan(): PlanDay {
  const now = new Date()
  return PLAN[`${now.getMonth() + 1}-${now.getDate()}`] ?? FALLBACK_PLAN
}

export default function Home() {
  const { store, go, openSync } = useApp()
  const wide = useWide()

  const score = overallScore(store)
  const ringColor = score >= PASS_TARGET ? GREEN : score >= 45 ? AMBER : RED
  const readyLabel =
    score >= PASS_TARGET ? 'In the passing zone' : score >= 45 ? 'Building — keep drilling' : 'Early days'
  const weak = weakestChapter(store)
  const readyHint =
    score >= PASS_TARGET
      ? `Hold it here. Weakest area: ${META[weak].name}.`
      : `White tick = pass line (${PASS_TARGET}). Biggest lift right now: ${META[weak].name} (${META[weak].w}% of the exam).`

  const plan = todaysPlan()
  const openPlan = () => {
    if (plan.target.kind === 'chapter') go.chapter(plan.target.code)
    else if (plan.target.kind === 'mock') go.drill()
    else if (plan.target.view === 'traps') go.traps()
    else if (plan.target.view === 'learn') go.learn()
    else go.drill()
  }

  // 3×3 of 3×3: eight chapter blocks around a centre block of chapter scores.
  const around: (ChapterCode | null)[] = ['SEC', 'BDR', 'AGT', 'IAD', null, 'IAR', 'COM', 'ETH', 'REM']
  const byWeight = [...ORDER].sort((a, b) => META[b].w - META[a].w)

  return (
    <div style={{ padding: '20px 18px calc(120px + var(--safe-bottom))' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: MONO_DISPLAY, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Series 63
        </div>
        <div style={{ fontSize: 12, color: C.dim }}>{countdown()}</div>
      </div>

      {/* readiness */}
      <div
        style={{
          marginTop: 18,
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ position: 'relative', width: 104, height: 104, flex: 'none' }}>
            <svg width="104" height="104" viewBox="0 0 104 104">
              <circle cx="52" cy="52" r={RING_R} fill="none" stroke="#1d1d26" strokeWidth="9" />
              <circle
                cx="52"
                cy="52"
                r={RING_R}
                fill="none"
                stroke={ringColor}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={`${(CIRC * score) / 100} ${CIRC}`}
                transform="rotate(-90 52 52)"
                style={{ transition: 'stroke-dasharray .6s' }}
              />
              {/* the pass line */}
              <circle
                cx="52"
                cy="52"
                r={RING_R}
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeDasharray="2 280.7"
                strokeDashoffset={-((CIRC * PASS_TARGET) / 100)}
                transform="rotate(-90 52 52)"
                opacity="0.9"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontFamily: MONO_DISPLAY, fontSize: 30, fontWeight: 700, lineHeight: 1 }}>{score}</div>
              <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>READY</div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{readyLabel}</div>
            <div style={{ fontSize: 12, color: C.dim, marginTop: 4, lineHeight: 1.5 }}>{readyHint}</div>
            <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
              {[
                [`${solidCount(store, PASS_TARGET)}/64`, 'CELLS SOLID'],
                [drillAccuracy(store), 'DRILL ACC'],
                [`${dueCount(store)}`, 'DUE NOW'],
              ].map(([value, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: MONO_DISPLAY, fontSize: 16, fontWeight: 700 }}>{value}</div>
                  <div style={{ fontSize: 10, color: C.faint }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* today */}
      <Tap
        onClick={openPlan}
        style={{
          marginTop: 14,
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#1a1a24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: MONO_DISPLAY,
            fontWeight: 700,
            fontSize: 13,
            color: C.text,
          }}
        >
          {new Date().getDate()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: C.faint, letterSpacing: '.08em' }}>TODAY’S PLAN</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, lineHeight: 1.4 }}>
            {plan.title} — {plan.detail}
          </div>
        </div>
        <div style={{ color: C.ghost, fontSize: 18 }}>›</div>
      </Tap>

      <Tap
        onClick={openSync}
        style={{ marginTop: 10, textAlign: 'center', fontSize: 11, color: '#66667a', padding: 4 }}
      >
        ⇅ Backup / transfer my progress
      </Tap>

      {/* harada chart + chapters: two columns on a laptop, stacked on a phone */}
      <div
        style={
          wide
            ? {
                marginTop: 18,
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 400px) minmax(0, 1fr)',
                gap: 28,
                alignItems: 'start',
              }
            : undefined
        }
      >
      <div>
      <div style={{ marginTop: wide ? 0 : 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <SectionLabel>HARADA · 64 CELLS</SectionLabel>
        <div style={{ fontSize: 11, color: C.ghost }}>tap any cell to open it</div>
      </div>
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {around.map((code, bi) => (
          <div
            key={bi}
            style={{
              borderRadius: 12,
              padding: 5,
              background: code === null ? '#12121a' : '#0c0c11',
              border: `1px solid ${code === null ? C.borderRaised : C.borderSoft}`,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3 }}>
              {code === null
                ? around.map((inner, ii) =>
                    inner === null ? (
                      <ChartCell key={ii} label="63" fontSize={13} bg="#1a1a24" color={C.text} border="#2a2a36" />
                    ) : (
                      <ChartCell
                        key={ii}
                        label={`${chapterScore(store, inner)}`}
                        fontSize={10}
                        bg={hue(inner, 35, 0.06, 0.25 + (0.5 * chapterScore(store, inner)) / 100)}
                        color={hue(inner, 88, 0.1)}
                        border="transparent"
                        onTap={() => go.chapter(inner)}
                      />
                    )
                  )
                : [1, 2, 3, 4, 0, 5, 6, 7, 8].map((n, ii) => {
                    if (n === 0)
                      return (
                        <ChartCell
                          key={ii}
                          label={code}
                          fontSize={9}
                          bg="transparent"
                          color={hue(code, 80, 0.12)}
                          border="transparent"
                          onTap={() => go.chapter(code)}
                        />
                      )
                    const id = `${code}-${n}`
                    const s = cellScore(store, id)
                    const touched = !!store.cells[id]
                    return (
                      <ChartCell
                        key={ii}
                        label={`${n}`}
                        fontSize={10}
                        weight={600}
                        bg={touched ? hue(code, 40, 0.09, 0.15 + (0.7 * s) / 100) : '#0e0e14'}
                        color={touched ? '#f0f0f5' : '#4a4a5c'}
                        border={touched ? 'transparent' : C.borderSoft}
                        onTap={() => go.cell(id)}
                      />
                    )
                  })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 10, color: C.faint }}>
        <span>fill = readiness</span>
        <span>· dim = untouched</span>
        <span>· center block = chapter scores</span>
      </div>
      </div>

      {/* chapters */}
      <div>
      <SectionLabel style={{ marginTop: wide ? 0 : 22 }}>CHAPTERS · BY EXAM WEIGHT</SectionLabel>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {byWeight.map((code) => {
          const s = chapterScore(store, code)
          const color = chapterColor(code)
          return (
            <Tap
              key={code}
              onClick={() => go.chapter(code)}
              style={{
                background: C.panel,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '12px 14px',
              }}
            >
              {/* the desktop column is too narrow for one line, so the weight
                  drops underneath rather than truncating the chapter name */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: wide ? 'flex-start' : 'center',
                  flexDirection: wide ? 'column' : 'row',
                  gap: wide ? 3 : 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: color, flex: 'none' }} />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      whiteSpace: wide ? 'normal' : 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {META[code].name}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: C.faint, flex: 'none', paddingLeft: wide ? 16 : 0 }}>
                  {META[code].w}% · {META[code].q} questions · {s}/100
                </div>
              </div>
              <div style={{ marginTop: 8, height: 5, borderRadius: 3, background: '#1c1c26', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 3,
                    background: color,
                    width: `${s}%`,
                    transition: 'width .5s',
                  }}
                />
              </div>
            </Tap>
          )
        })}
      </div>
      </div>
      </div>
    </div>
  )
}

function ChartCell({
  label,
  fontSize,
  weight = 700,
  bg,
  color,
  border,
  onTap,
}: {
  label: string
  fontSize: number
  weight?: number
  bg: string
  color: string
  border: string
  onTap?: () => void
}) {
  const style = {
    aspectRatio: '1',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize,
    fontWeight: weight,
    fontFamily: MONO_DISPLAY,
    background: bg,
    color,
    border: `1px solid ${border}`,
  }
  return onTap ? (
    <Tap onClick={onTap} style={style}>
      {label}
    </Tap>
  ) : (
    <div style={style}>{label}</div>
  )
}
