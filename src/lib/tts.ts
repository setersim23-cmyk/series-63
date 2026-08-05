import { cellItems, findCell, speakables } from './content'
import { keepScreenAwake, releaseScreen } from './wakelock'
import type { CellId } from '../types'

export interface TtsState {
  playing: boolean
  /** Index of the card being read, or -1. */
  item: number
  /** Index of the highlighted word within that card, or -1. */
  word: number
  /** Keep going into the next cell when this one ends (chapter listen). */
  contPlay: boolean
}

export const IDLE: TtsState = { playing: false, item: -1, word: -1, contPlay: false }

interface Hooks {
  onState(state: TtsState): void
  /** A cell was read to the end — mark it read. */
  onCellRead(id: CellId): void
  /** Continuous play moved on. Return false to stop instead. */
  onCellChange(id: CellId): void
  getRate(): number
  getVoiceName(): string | null
}

const supported = typeof speechSynthesis !== 'undefined'

/**
 * Wraps speechSynthesis with the workarounds the platforms need:
 *
 *  · Chrome falls back to the default voice when an utterance starts in the same
 *    tick as a cancel(), so a new read waits a beat.
 *  · Chrome silently stalls long utterances at any rate other than 1×, so a
 *    pause/resume nudge keeps it alive.
 *  · iOS never fires word-boundary events, so word highlighting falls back to a
 *    rate-scaled estimator.
 *  · iOS only populates the voice list after speech has been triggered by a user
 *    gesture, so `prime()` runs on the first interaction.
 */
export class Tts {
  private state: TtsState = IDLE
  private cellId: CellId | null = null
  private estimator: ReturnType<typeof setInterval> | null = null
  private keepAlive: ReturnType<typeof setInterval> | null = null
  private restart: ReturnType<typeof setTimeout> | null = null
  private primed = false

  constructor(private hooks: Hooks) {}

  getState(): TtsState {
    return this.state
  }

  private set(patch: Partial<TtsState>) {
    this.state = { ...this.state, ...patch }
    this.hooks.onState(this.state)
  }

  private clearTimers() {
    if (this.estimator) clearInterval(this.estimator)
    if (this.keepAlive) clearInterval(this.keepAlive)
    if (this.restart) clearTimeout(this.restart)
    this.estimator = this.keepAlive = null
    this.restart = null
  }

  /** iOS hands over its voice list only once speech has run inside a gesture. */
  prime() {
    if (this.primed || !supported) return
    this.primed = true
    if (speechSynthesis.getVoices().length) return
    try {
      const silent = new SpeechSynthesisUtterance('')
      silent.volume = 0
      speechSynthesis.speak(silent)
    } catch {
      /* nothing to do — the picker falls back to the system default */
    }
  }

  voices(): SpeechSynthesisVoice[] {
    if (!supported) return []
    return (speechSynthesis.getVoices() || []).filter((v) => v.lang && v.lang.startsWith('en'))
  }

  start(cellId: CellId, fromItem: number, continuous = false) {
    if (!supported) return
    this.prime()
    this.cellId = cellId
    try {
      speechSynthesis.cancel()
    } catch {
      /* Safari throws if nothing is queued */
    }
    this.clearTimers()
    keepScreenAwake()
    // The beat after cancel() is what stops Chrome reverting to the default voice.
    this.restart = setTimeout(() => {
      this.set({ playing: true, item: fromItem, word: -1, contPlay: continuous })
      this.speakItem(fromItem)
    }, 150)
  }

  stop() {
    try {
      speechSynthesis.cancel()
    } catch {
      /* ignore */
    }
    this.clearTimers()
    releaseScreen()
    this.set({ ...IDLE })
  }

  /** Rate and voice changes restart the current card so they take effect at once. */
  refresh() {
    if (this.state.playing && this.cellId) this.start(this.cellId, this.state.item, this.state.contPlay)
  }

  private speakItem(i: number) {
    const cell = findCell(this.cellId)
    if (!cell) return this.stop()

    const items = cellItems(cell)
    if (i >= items.length) {
      this.hooks.onCellRead(cell.id)
      if (this.state.contPlay) {
        const next = nextCellId(cell.id)
        if (next) {
          this.cellId = next
          this.hooks.onCellChange(next)
          this.set({ item: 0, word: -1 })
          window.scrollTo({ top: 0 })
          this.speakItem(0)
          return
        }
      }
      return this.stop()
    }

    const spoken = speakables(cell)[i]
    const rawWords = items[i].x.split(/\s+/)
    // Build the spoken string word by word so a boundary's charIndex maps back to
    // a raw word index exactly, even where "§101" is read as "section 101".
    const spokenWords = rawWords.map((w) => w.replace(/·/g, ';').replace(/§/g, 'section '))
    const offsets: number[] = []
    let at = 0
    for (const w of spokenWords) {
      offsets.push(at)
      at += w.length + 1
    }

    const el = document.getElementById(`rit-${i}`)
    if (el) {
      const rect = el.getBoundingClientRect()
      window.scrollTo({ top: window.scrollY + rect.top - 140, behavior: 'smooth' })
    }

    this.set({ playing: true, item: i, word: -1 })

    const label = spoken.label ? `${spoken.label} ` : ''
    const utterance = new SpeechSynthesisUtterance(label + spokenWords.join(' '))
    utterance.rate = this.hooks.getRate() || 1
    const wanted = this.hooks.getVoiceName()
    const voice = wanted ? this.voices().find((v) => v.name === wanted) : undefined
    if (voice) utterance.voice = voice

    let sawBoundary = false
    utterance.onboundary = (e) => {
      if (e.name && e.name !== 'word') return
      sawBoundary = true
      if (this.estimator) clearInterval(this.estimator)
      const ci = Math.max(0, e.charIndex - label.length)
      let wi = 0
      for (let k = 0; k < offsets.length; k++) {
        if (offsets[k] <= ci) wi = k
        else break
      }
      if (this.state.item === i) this.set({ word: wi })
    }

    // iOS fires no boundaries: step the highlight at the reading rate instead.
    const msPerWord = 60000 / (175 * utterance.rate)
    let wi = 0
    this.estimator = setInterval(() => {
      if (sawBoundary) {
        if (this.estimator) clearInterval(this.estimator)
        return
      }
      wi++
      if (wi < rawWords.length && this.state.item === i && this.state.playing) this.set({ word: wi })
    }, msPerWord)

    utterance.onend = () => {
      if (this.estimator) clearInterval(this.estimator)
      if (this.keepAlive) clearInterval(this.keepAlive)
      if (this.state.playing && this.state.item === i) this.speakItem(i + 1)
    }
    utterance.onerror = () => {
      if (this.estimator) clearInterval(this.estimator)
      if (this.keepAlive) clearInterval(this.keepAlive)
    }

    speechSynthesis.speak(utterance)

    // Chrome stalls long utterances at rates ≠ 1× unless it is nudged.
    if (this.keepAlive) clearInterval(this.keepAlive)
    this.keepAlive = setInterval(() => {
      if (!speechSynthesis.speaking) {
        if (this.keepAlive) clearInterval(this.keepAlive)
        return
      }
      speechSynthesis.pause()
      speechSynthesis.resume()
    }, 8000)
  }

  dispose() {
    this.clearTimers()
    try {
      speechSynthesis.cancel()
    } catch {
      /* ignore */
    }
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
