import { createContext, useContext } from 'react'
import type { Tts, TtsState } from './lib/tts'
import type { Progress } from './lib/store'
import type { QuizMode } from './lib/quiz'
import type { Mark } from './types'
import type { CellId, ChapterCode, Store } from './types'

export interface SheetContent {
  term: string
  body: string
  kind?: string
}

export interface AppApi {
  progress: Progress
  store: Store
  /** Ticks once a second — countdowns and the mock timer read it. */
  tick: number

  tts: Tts
  ttsState: TtsState
  voices: SpeechSynthesisVoice[]

  go: {
    home(): void
    learn(): void
    drill(): void
    map(): void
    traps(): void
    chapter(code: ChapterCode): void
    cell(id: CellId): void
    memo(code: ChapterCode): void
  }

  startQuiz(mode: QuizMode, filter?: ChapterCode | CellId): void
  startCheck(id: CellId): void
  startWalk(scope: ChapterCode | 'all'): void
  startSim(): void
  /** Play a whole chapter, cell after cell. */
  listenToChapter(code: ChapterCode): void
  toggleCellSpeech(id: CellId): void
  setRate(rate: number): void
  setVoice(name: string): void

  openSheet(sheet: SheetContent): void
  openSync(): void
  openVoices(): void

  markCell(id: CellId, field: 'c' | 'f', value: Mark): void
}

export const AppContext = createContext<AppApi | null>(null)

export function useApp(): AppApi {
  const api = useContext(AppContext)
  if (!api) throw new Error('useApp must be used inside the app')
  return api
}
