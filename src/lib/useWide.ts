import { useEffect, useState } from 'react'

/**
 * True on a laptop-sized screen. The breakpoint is where the phone column stops
 * being a sensible use of the width — below it nothing about the phone layout
 * changes, which matters five days out from an exam.
 */
export const WIDE = '(min-width: 900px)'

export function useWide(): boolean {
  const [wide, setWide] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia(WIDE).matches
  )
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return
    const mq = matchMedia(WIDE)
    const onChange = () => setWide(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return wide
}
