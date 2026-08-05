import { useMemo } from 'react'
import qrcode from 'qrcode-generator'

/**
 * Renders a QR as inline SVG — no canvas, no image request, and it stays crisp
 * at whatever size the sheet gives it.
 */
export default function QrCode({ text, size = 240 }: { text: string; size?: number }) {
  const path = useMemo(() => {
    // Type 0 lets the encoder pick the smallest version that fits; L is the
    // lowest error correction, which buys the most capacity. A screen is a
    // clean scanning surface, so heavy correction would be wasted space.
    const qr = qrcode(0, 'L')
    qr.addData(text, 'Byte')
    qr.make()
    const count = qr.getModuleCount()
    let d = ''
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) d += `M${col},${row}h1v1h-1z`
      }
    }
    return { d, count }
  }, [text])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`-2 -2 ${path.count + 4} ${path.count + 4}`}
      style={{ display: 'block', margin: '0 auto', background: '#fff', borderRadius: 10 }}
      role="img"
      aria-label="Scan to transfer your progress"
    >
      <path d={path.d} fill="#08080b" />
    </svg>
  )
}
