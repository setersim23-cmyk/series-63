import { Tap } from '../ui'

const TABS = [
  ['home', '⌂', 'Home'],
  ['learn', '▤', 'Learn'],
  ['map', '⚖', 'Map'],
  ['drill', '◎', 'Drill'],
] as const

export type Tab = (typeof TABS)[number][0]

export default function BottomNav({ active, onTap }: { active: string; onTap: (tab: Tab) => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 10,
        background: 'rgba(10,10,14,.94)',
        backdropFilter: 'blur(14px)',
        borderTop: '1px solid #1c1c26',
        display: 'flex',
        padding: '6px 0 calc(8px + var(--safe-bottom))',
      }}
    >
      {TABS.map(([key, icon, label]) => {
        const color = active === key ? '#e9e9ef' : '#55556a'
        return (
          <Tap key={key} onClick={() => onTap(key)} style={{ flex: 1, textAlign: 'center', padding: '6px 0' }}>
            <div style={{ fontSize: 17, lineHeight: 1, color }}>{icon}</div>
            <div style={{ fontSize: 10, fontWeight: 600, marginTop: 3, color }}>{label}</div>
          </Tap>
        )
      })}
    </div>
  )
}
