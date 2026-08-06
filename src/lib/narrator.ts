import { AUDIO } from '../content/audio'
import { META } from '../data/meta'
import { cellItems, findCell } from './content'
import { codeOf } from './color'
import { IDLE, Tts, type TtsState } from './tts'
import { releaseScreen } from './wakelock'
import type { CellId } from '../types'

export type { TtsState }
export { IDLE }

interface Hooks {
  onState(state: TtsState): void
  onCellRead(id: CellId): void
  onCellChange(id: CellId): void
  getRate(): number
  getVoiceName(): string | null
}

const clipUrl = (cellId: CellId, index: number) =>
  `${import.meta.env.BASE_URL}audio/${cellId}-${index}.mp3`

/**
 * Whether this cell's recording still matches what the app would read.
 *
 * A clip is addressed by its position in the cell — `SEC-1-3.mp3` is the fourth
 * card — so a recording made before a card was added or moved would play the
 * right voice over the wrong text, which is worse than not playing at all. One
 * clip per card is the cheap check that catches it, and a mismatch degrades the
 * whole cell to speech synthesis rather than lying.
 */
export const hasAudio = (cellId: CellId) => {
  const clips = AUDIO[cellId]?.length ?? 0
  return clips > 0 && clips === cellItems(findCell(cellId)).length
}

/**
 * Plays the pre-rendered narration.
 *
 * The reason this exists rather than just calling speechSynthesis: iOS suspends
 * speech synthesis the instant the screen locks, but keeps an <audio> element
 * playing in the background. Real audio files are the only way to listen with
 * the phone in a pocket, and they bring lockscreen controls with them.
 *
 * If a clip is missing — a cell added since the last render, or a failed
 * request — it falls back to speech synthesis for that cell, so the app never
 * simply goes quiet.
 */
export class Narrator {
  private audio: HTMLAudioElement | null = null
  private state: TtsState = IDLE
  private cellId: CellId | null = null
  private speaking = false
  private tts: Tts

  constructor(private hooks: Hooks) {
    // The fallback reports through the same channel, so the UI cannot tell which
    // engine is running.
    this.tts = new Tts({
      ...hooks,
      onState: (s) => {
        if (this.speaking) {
          this.state = s
          hooks.onState(s)
        }
      },
    })
  }

  getState() {
    return this.state
  }

  voices() {
    return this.tts.voices()
  }

  prime() {
    this.tts.prime()
  }

  private set(patch: Partial<TtsState>) {
    this.state = { ...this.state, ...patch }
    this.hooks.onState(this.state)
  }

  private element(): HTMLAudioElement {
    if (!this.audio) {
      const el = new Audio()
      el.preload = 'auto'
      // iOS is markedly more reliable about background playback and lockscreen
      // metadata when the element is actually in the document.
      el.setAttribute('playsinline', '')
      el.style.display = 'none'
      document.body.appendChild(el)
      el.addEventListener('ended', () => this.playItem(this.state.item + 1))
      el.addEventListener('timeupdate', () => this.tick())
      el.addEventListener('error', () => {
        // A missing or unplayable clip drops this cell to speech synthesis.
        if (this.state.playing && this.cellId) this.speakFallback(this.state.item)
      })
      this.audio = el
      this.mediaSession()
    }
    return this.audio
  }

  /** Lockscreen and Control Centre buttons. */
  private mediaSession() {
    if (!('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    ms.setActionHandler('play', () => {
      if (this.cellId) this.start(this.cellId, Math.max(0, this.state.item), this.state.contPlay)
    })
    ms.setActionHandler('pause', () => this.stop())
    ms.setActionHandler('previoustrack', () => this.playItem(Math.max(0, this.state.item - 1)))
    ms.setActionHandler('nexttrack', () => this.playItem(this.state.item + 1))
    ms.setActionHandler('seekbackward', () => {
      if (this.audio) this.audio.currentTime = Math.max(0, this.audio.currentTime - 10)
    })
    ms.setActionHandler('seekforward', () => {
      if (this.audio) this.audio.currentTime += 10
    })
  }

  private describe(cellId: CellId, index: number, total: number) {
    if (!('mediaSession' in navigator)) return
    const cell = findCell(cellId)
    const code = codeOf(cellId)
    navigator.mediaSession.metadata = new MediaMetadata({
      title: cell ? `${cellId} · ${cell.title}` : cellId,
      artist: `${META[code].name} — part ${index + 1} of ${total}`,
      album: 'Series 63 Coach',
      artwork: [
        { src: `${import.meta.env.BASE_URL}icon-192.png`, sizes: '192x192', type: 'image/png' },
        { src: `${import.meta.env.BASE_URL}icon-512.png`, sizes: '512x512', type: 'image/png' },
      ],
    })
  }

  /** Estimate which word is being read from how far through the clip we are. */
  private tick() {
    const el = this.audio
    if (!el || !el.duration || !this.cellId) return
    const items = cellItems(findCell(this.cellId))
    const item = items[this.state.item]
    if (!item) return
    const words = item.x.split(/\s+/).length
    const word = Math.min(words - 1, Math.floor((el.currentTime / el.duration) * words))
    if (word !== this.state.word) this.set({ word })
    if ('mediaSession' in navigator && navigator.mediaSession.setPositionState) {
      try {
        navigator.mediaSession.setPositionState({
          duration: el.duration,
          position: el.currentTime,
          playbackRate: el.playbackRate,
        })
      } catch {
        /* Safari throws if duration is not finite yet */
      }
    }
  }

  start(cellId: CellId, fromItem: number, continuous = false) {
    this.stopAll()
    this.cellId = cellId
    this.set({ playing: true, item: fromItem, word: -1, contPlay: continuous })

    if (!hasAudio(cellId)) return this.speakFallback(fromItem)
    void this.playItem(fromItem)
  }

  private speakFallback(fromItem: number) {
    this.speaking = true
    this.tts.start(this.cellId!, fromItem, this.state.contPlay)
  }

  private playItem(index: number): void {
    if (!this.cellId || !this.state.playing) return
    const cell = findCell(this.cellId)
    const items = cellItems(cell)

    if (index >= items.length) {
      this.hooks.onCellRead(this.cellId)
      if (this.state.contPlay) {
        const next = nextCellId(this.cellId)
        if (next) {
          this.cellId = next
          this.hooks.onCellChange(next)
          this.set({ item: 0, word: -1 })
          window.scrollTo({ top: 0 })
          if (!hasAudio(next)) return this.speakFallback(0)
          return this.playItem(0)
        }
      }
      return this.stop()
    }

    this.set({ item: index, word: -1 })
    this.describe(this.cellId, index, items.length)

    const card = document.getElementById(`rit-${index}`)
    if (card) {
      const rect = card.getBoundingClientRect()
      window.scrollTo({ top: window.scrollY + rect.top - 140, behavior: 'smooth' })
    }

    const el = this.element()
    el.src = clipUrl(this.cellId, index)
    el.playbackRate = this.hooks.getRate() || 1
    el.play().catch(() => {
      // Autoplay refused (no gesture yet) or the file is missing.
      this.speakFallback(index)
    })
  }

  /** Rate changes apply live; no need to restart the clip. */
  refresh() {
    if (this.speaking) return this.tts.refresh()
    if (this.audio) this.audio.playbackRate = this.hooks.getRate() || 1
  }

  private stopAll() {
    if (this.speaking) {
      this.tts.stop()
      this.speaking = false
    }
    if (this.audio) {
      this.audio.pause()
      this.audio.removeAttribute('src')
    }
    releaseScreen()
  }

  stop() {
    this.stopAll()
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused'
    this.set({ ...IDLE })
  }

  dispose() {
    this.stopAll()
    this.tts.dispose()
    this.audio?.remove()
    this.audio = null
  }
}

// Local copy to avoid a cycle with scoring.ts.
function nextCellId(id: CellId): CellId | null {
  const [code, n] = id.split('-')
  const i = parseInt(n, 10)
  if (i < 8) return `${code}-${i + 1}`
  const order = ['SEC', 'BDR', 'AGT', 'IAD', 'IAR', 'COM', 'ETH', 'REM']
  const at = order.indexOf(code)
  return at < order.length - 1 ? `${order[at + 1]}-1` : null
}
