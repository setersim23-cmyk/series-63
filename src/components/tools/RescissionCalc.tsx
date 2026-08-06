import type { CalcState, ToolState } from '../../App'
import { C, fs, MONO_DISPLAY, Tap } from '../../ui'
import ToolPanel from './ToolPanel'

const money = (n: number) => '$' + Math.round(n).toLocaleString()

const inputStyle = {
  width: '100%',
  background: C.panel,
  border: `1px solid ${C.borderRaised}`,
  borderRadius: 8,
  color: C.text,
  fontSize: fs(14),
  padding: '8px 10px',
  fontFamily: MONO_DISPLAY,
}

/** The §410 formula, live: price + interest − income, against tender. */
export default function RescissionCalc({
  tool,
  setTool,
}: {
  tool: ToolState
  setTool: (patch: Partial<ToolState>) => void
}) {
  const calc = tool.calc
  const interest = calc.price * (calc.rate / 100) * (calc.months / 12)
  const total = calc.price + interest - calc.income - (calc.sold ? calc.proceeds : 0)

  const setField = (key: keyof CalcState, value: number) => setTool({ calc: { ...calc, [key]: value } })

  const field = (key: 'price' | 'rate' | 'months' | 'income' | 'proceeds', label: string) => (
    <div key={key}>
      <div style={{ fontSize: fs(10), color: C.faint, marginBottom: 3 }}>{label}</div>
      <input
        type="number"
        value={calc[key]}
        onChange={(e) => setField(key, parseFloat(e.target.value) || 0)}
        style={inputStyle}
      />
    </div>
  )

  const lines: [string, string][] = [
    ['Price paid', money(calc.price)],
    [`+ Interest (${calc.rate}% × ${calc.months} mo)`, money(interest)],
    ['− Income received', '−' + money(calc.income).slice(1)],
  ]
  if (calc.sold) lines.push(['− Sale proceeds', '−' + money(calc.proceeds).slice(1)])

  return (
    <ToolPanel title="🧮 Rescission calculator — the §410 formula, live">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
        {field('price', 'Price paid $')}
        {field('rate', 'Interest rate %')}
        {field('months', 'Months held')}
        {field('income', 'Income received $')}
      </div>

      <Tap
        onClick={() => setTool({ calc: { ...calc, sold: !calc.sold } })}
        style={{
          marginTop: 8,
          padding: '9px 12px',
          borderRadius: 9,
          background: C.raised,
          border: `1px solid ${C.borderRaised}`,
          fontSize: fs(12),
          fontWeight: 600,
          color: 'var(--kc9c9d4)',
        }}
      >
        ⇄ {calc.sold ? 'Client already SOLD (damages — no tender)' : 'Client still HOLDS (rescission — must tender)'}
      </Tap>

      {calc.sold && <div style={{ marginTop: 8 }}>{field('proceeds', 'Sale proceeds $')}</div>}

      <div
        style={{
          marginTop: 12,
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: 12,
        }}
      >
        {lines.map(([label, value]) => (
          <div
            key={label}
            style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(13), color: 'var(--kc9c9d4)', padding: '2px 0' }}
          >
            <span>{label}</span>
            <span style={{ fontFamily: MONO_DISPLAY }}>{value}</span>
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: fs(15),
            fontWeight: 700,
            borderTop: `1px solid ${C.borderRaised}`,
            marginTop: 6,
            paddingTop: 8,
          }}
        >
          <span>Buyer recovers</span>
          <span style={{ fontFamily: MONO_DISPLAY, color: C.green }}>{money(total)}</span>
        </div>
        <div style={{ fontSize: fs(11), color: C.faint, marginTop: 6, lineHeight: 1.5 }}>
          {calc.sold
            ? 'No tender — the security is gone; this is the damages formula.'
            : '…against tender of the security back to the seller. Plus court costs and reasonable attorney fees.'}
        </div>
      </div>

      <div style={{ fontSize: fs(11), color: 'var(--k8a9a8f)', marginTop: 8, lineHeight: 1.5 }}>
        Worked example (Case 4): $40,000 bought 14 months ago at 6% state rate, $1,600 in distributions received →
        $40,000 + $2,800 − $1,600 = $41,200, against tender.
      </div>
    </ToolPanel>
  )
}
