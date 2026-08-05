import { Tap } from '../ui'
import type { Tab } from './BottomNav'

const TABS: [Tab, string, string][] = [
  ['home', '⌂', 'Home'],
  ['learn', '▤', 'Learn'],
  ['map', '⚖', 'Map'],
  ['drill', '◎', 'Drill'],
]

/**
 * The desktop counterpart to the bottom bar. A thumb-reach bar pinned to the
 * bottom of a laptop screen is a long way from the pointer and wastes the
 * width, so on a wide screen the same four destinations sit in a rail.
 */
export default function SideNav({ active, onTap }: { active: string; onTap: (tab: Tab) => void }) {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        height: '100vh',
        width: 188,
        flex: 'none',
        padding: '28px 14px',
        borderRight: '1px solid #1c1c26',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Grotesk'",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          padding: '0 12px 18px',
        }}
      >
        Series 63
      </div>
      {TABS.map(([key, icon, label]) => {
        const on = active === key
        return (
          <Tap
            key={key}
            onClick={() => onTap(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 10,
              background: on ? '#14141c' : 'transparent',
              color: on ? '#e9e9ef' : '#77778a',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }} aria-hidden="true">
              {icon}
            </span>
            <span>{label}</span>
          </Tap>
        )
      })}
    </nav>
  )
}
