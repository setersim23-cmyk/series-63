import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppContext, type AppApi, type SheetContent } from './context'
import { QBANK } from './content/questions'
import { findChapter } from './lib/content'
import { IDLE, Tts, type TtsState } from './lib/tts'
import { buildSession, recordAnswer, shuffle, type QuizMode, type Session } from './lib/quiz'
import { useProgress } from './lib/store'
import { nextCellId } from './lib/scoring'
import { ORDER, type CellId, type ChapterCode, type Fact, type Mark } from './types'

import Home from './views/Home'
import Learn from './views/Learn'
import ChapterView from './views/Chapter'
import CellView from './views/Cell'
import Memo from './views/Memo'
import Traps from './views/Traps'
import Drill from './views/Drill'
import MapView from './views/MapView'
import Quiz from './views/Quiz'
import Results from './views/Results'
import Checkpoint from './views/Checkpoint'
import PalaceWalk from './views/PalaceWalk'
import Simulator from './views/Simulator'

import BottomNav from './components/BottomNav'
import LawSheet from './components/LawSheet'
import SyncSheet from './components/SyncSheet'
import VoiceSheet from './components/VoiceSheet'

export type View =
  | 'home'
  | 'learn'
  | 'chapter'
  | 'cell'
  | 'memo'
  | 'traps'
  | 'drill'
  | 'map'
  | 'quiz'
  | 'results'
  | 'check'
  | 'walk'
  | 'sim'

export interface CheckState {
  cellId: CellId
  /** Indices into QBANK. */
  qs: number[]
  qi: number
  chosen: number | null
  qRight: number
  facts: Fact[]
  fi: number
  fRight: number
  revealed: boolean
  phase: 'q' | 'f' | 'done'
}

export interface WalkState {
  seq: CellId[]
  i: number
  revealed: boolean
  grades: Mark[]
  scope: ChapterCode | 'all'
}

export interface SimState {
  ci: number | null
  step: number
  pick: number | null
  wrong: number
}

export interface LastSession {
  mode: QuizMode
  right: number
  total: number
  qs: number[]
  answers: boolean[]
}

export interface CalcState {
  price: number
  rate: number
  months: number
  income: number
  sold: boolean
  proceeds: number
}

/** Scratch state for the tools embedded in lessons. Reset on every navigation. */
export interface ToolState {
  sel: number | null
  placed: Record<number, number>
  seq: number[]
  walkIdx: number
  walkPick: boolean | null
  calc: CalcState
}

export const FRESH_TOOL: ToolState = {
  sel: null,
  placed: {},
  seq: [],
  walkIdx: 0,
  walkPick: null,
  calc: { price: 40000, rate: 6, months: 14, income: 1600, sold: false, proceeds: 35000 },
}

export default function App() {
  const progress = useProgress()
  const { store, touch, update } = progress

  const [view, setView] = useState<View>('home')
  const [ch, setCh] = useState<ChapterCode | null>(null)
  const [cellId, setCellId] = useState<CellId | null>(null)
  const [memoCh, setMemoCh] = useState<ChapterCode | null>(null)

  const [session, setSession] = useState<Session | null>(null)
  const [lastSession, setLastSession] = useState<LastSession | null>(null)
  const [check, setCheck] = useState<CheckState | null>(null)
  const [walk, setWalk] = useState<WalkState | null>(null)
  const [sim, setSim] = useState<SimState | null>(null)
  const [tool, setTool] = useState<ToolState>(FRESH_TOOL)

  const [sheet, setSheet] = useState<SheetContent | null>(null)
  const [syncOpen, setSyncOpen] = useState(false)
  const [voicesOpen, setVoicesOpen] = useState(false)
  const [memoOpen, setMemoOpen] = useState<Record<number, boolean>>({})

  const [ttsState, setTtsState] = useState<TtsState>(IDLE)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [tick, setTick] = useState(0)

  // ---------- speech ----------

  const ttsRef = useRef<Tts | null>(null)
  if (!ttsRef.current) {
    ttsRef.current = new Tts({
      onState: setTtsState,
      onCellRead: (id) => touch(id, (c) => (c.read = true)),
      onCellChange: (id) => setCellId(id),
      getRate: () => store.settings.rate || 1,
      getVoiceName: () => store.settings.voice,
    })
  }
  const tts = ttsRef.current

  useEffect(() => {
    const load = () => setVoices(tts.voices())
    load()
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.addEventListener('voiceschanged', load)
    // iOS hands over its voice list only after speech runs inside a user gesture.
    const prime = () => {
      tts.prime()
      setTimeout(load, 250)
    }
    window.addEventListener('pointerdown', prime, { once: true })

    const iv = setInterval(() => setTick((t) => t + 1), 1000)
    const onUnload = () => tts.dispose()
    window.addEventListener('beforeunload', onUnload)

    return () => {
      clearInterval(iv)
      window.removeEventListener('pointerdown', prime)
      window.removeEventListener('beforeunload', onUnload)
      if (typeof speechSynthesis !== 'undefined')
        speechSynthesis.removeEventListener('voiceschanged', load)
      tts.dispose()
    }
  }, [tts])

  // ---------- navigation ----------

  const nav = useCallback(
    (next: View, patch?: () => void) => {
      tts.stop()
      window.scrollTo({ top: 0 })
      setSheet(null)
      setVoicesOpen(false)
      setTool(FRESH_TOOL)
      setSim(null)
      patch?.()
      setView(next)
    },
    [tts]
  )

  const go = useMemo(
    () => ({
      home: () => nav('home'),
      learn: () => nav('learn'),
      drill: () => nav('drill'),
      map: () => nav('map'),
      traps: () => nav('traps'),
      chapter: (code: ChapterCode) => nav('chapter', () => setCh(code)),
      cell: (id: CellId) =>
        nav('cell', () => {
          setCellId(id)
          setCh(id.split('-')[0] as ChapterCode)
        }),
      memo: (code: ChapterCode) => nav('memo', () => setMemoCh(code)),
    }),
    [nav]
  )

  // ---------- quiz ----------

  const startQuiz = useCallback(
    (mode: QuizMode, filter?: ChapterCode | CellId) => {
      const built = buildSession(store, mode, filter)
      if (!built) return
      nav('quiz', () => setSession(built))
    },
    [nav, store]
  )

  const finishQuiz = useCallback(() => {
    setSession((s) => {
      if (!s) return null
      const right = s.answers.filter(Boolean).length
      if (s.mode === 'mock') {
        s.qs.forEach((qi, k) => {
          if (s.answers[k] != null) recordAnswer(progress, qi, !!s.answers[k])
        })
        update((store) => {
          store.mocks.push({ ts: Date.now(), score: right, total: s.qs.length })
        })
      }
      setLastSession({ mode: s.mode, right, total: s.qs.length, qs: s.qs, answers: s.answers })
      setView('results')
      window.scrollTo({ top: 0 })
      return null
    })
  }, [progress, update])

  const answerQuiz = useCallback(
    (oi: number) => {
      if (!session) return
      const mock = session.mode === 'mock'
      if (session.chosen != null && !mock) return
      const q = QBANK[session.qs[session.i]]
      const ok = oi === q.a
      if (!mock) recordAnswer(progress, session.qs[session.i], ok)
      const answers = [...session.answers]
      answers[session.i] = ok
      setSession({ ...session, chosen: oi, answers })
      if (mock) setTimeout(() => nextQuestion(), 160)
    },
    // nextQuestion is defined below and stable enough for this callback's lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, progress]
  )

  const nextQuestion = useCallback(() => {
    setSession((s) => {
      if (!s) return s
      if (s.i >= s.qs.length - 1) {
        setTimeout(finishQuiz, 0)
        return s
      }
      window.scrollTo({ top: 0 })
      return { ...s, i: s.i + 1, chosen: null }
    })
  }, [finishQuiz])

  // The timed mock ends itself when the clock runs out.
  useEffect(() => {
    if (session?.mode === 'mock' && session.end && Date.now() > session.end) finishQuiz()
  }, [tick, session, finishQuiz])

  // ---------- checkpoint ----------

  const startCheck = useCallback(
    (id: CellId) => {
      const qs = shuffle(
        QBANK.map((q, i) => ({ q, i }))
          .filter((x) => x.q.c === id)
          .map((x) => x.i)
      ).slice(0, 3)
      const chapter = findChapter(id.split('-')[0] as ChapterCode)
      const facts = shuffle((chapter?.memorize ?? []).filter((m) => m.cell === id)).slice(0, 3)
      nav('check', () =>
        setCheck({
          cellId: id,
          qs,
          qi: 0,
          chosen: null,
          qRight: 0,
          facts,
          fi: 0,
          fRight: 0,
          revealed: false,
          phase: qs.length ? 'q' : facts.length ? 'f' : 'done',
        })
      )
    },
    [nav]
  )

  /** Grades the cell from checkpoint performance — all right is solid, some is shaky. */
  const finishCheck = useCallback(
    (c: CheckState) => {
      touch(c.cellId, (cell) => {
        cell.read = true
        if (c.qs.length) cell.c = (c.qRight === c.qs.length ? 2 : c.qRight > 0 ? 1 : 0) as Mark
        if (c.facts.length) cell.f = (c.fRight === c.facts.length ? 2 : c.fRight > 0 ? 1 : 0) as Mark
      })
      setCheck({ ...c, phase: 'done' })
    },
    [touch]
  )

  // ---------- palace walk ----------

  const startWalk = useCallback(
    (scope: ChapterCode | 'all') => {
      const codes = scope === 'all' ? [...ORDER] : [scope]
      const seq: CellId[] = []
      for (const code of codes) for (let i = 1; i <= 8; i++) seq.push(`${code}-${i}`)
      nav('walk', () => setWalk({ seq, i: 0, revealed: false, grades: [], scope }))
    },
    [nav]
  )

  const gradeWalk = useCallback(
    (g: Mark) => {
      setWalk((w) => {
        if (!w) return w
        touch(w.seq[w.i], (cell) => (cell.c = g))
        window.scrollTo({ top: 0 })
        return { ...w, grades: [...w.grades, g], i: w.i + 1, revealed: false }
      })
    },
    [touch]
  )

  // ---------- api ----------

  const api: AppApi = useMemo(
    () => ({
      progress,
      store,
      tick,
      tts,
      ttsState,
      voices,
      go,
      startQuiz,
      startCheck,
      startWalk,
      startSim: () => nav('sim', () => setSim({ ci: null, step: 0, pick: null, wrong: 0 })),
      listenToChapter: (code: ChapterCode) => {
        const first: CellId = `${code}-1`
        nav('cell', () => {
          setCellId(first)
          setCh(code)
        })
        // after nav's stop(), start fresh in continuous mode
        setTimeout(() => tts.start(first, 0, true), 0)
      },
      toggleCellSpeech: (id: CellId) => {
        if (ttsState.playing) tts.stop()
        else tts.start(id, 0)
      },
      setRate: (rate: number) => {
        update((s) => {
          s.settings.rate = rate
        })
        tts.refresh()
      },
      setVoice: (name: string) => {
        update((s) => {
          s.settings.voice = name
        })
        setVoicesOpen(false)
        tts.refresh()
      },
      openSheet: setSheet,
      openSync: () => setSyncOpen(true),
      openVoices: () => setVoicesOpen(true),
      markCell: (id, field, value) => touch(id, (cell) => (cell[field] = value)),
    }),
    [progress, store, tick, tts, ttsState, voices, go, startQuiz, startCheck, startWalk, nav, update, touch]
  )

  const activeTab =
    view === 'chapter' || view === 'cell' || view === 'memo' || view === 'traps' || view === 'check' || view === 'walk'
      ? 'learn'
      : view === 'quiz' || view === 'results' || view === 'sim'
        ? 'drill'
        : view

  return (
    <AppContext.Provider value={api}>
      <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#08080b', position: 'relative' }}>
        {view === 'home' && <Home />}
        {view === 'learn' && <Learn />}
        {view === 'chapter' && ch && <ChapterView code={ch} />}
        {view === 'cell' && cellId && (
          <CellView cellId={cellId} tool={tool} setTool={setTool} onNextCell={(id) => go.cell(id)} />
        )}
        {view === 'memo' && memoCh && <Memo code={memoCh} open={memoOpen} setOpen={setMemoOpen} />}
        {view === 'traps' && <Traps />}
        {view === 'drill' && <Drill />}
        {view === 'map' && <MapView />}
        {view === 'quiz' && session && (
          <Quiz
            session={session}
            onAnswer={answerQuiz}
            onNext={nextQuestion}
            onQuit={() => (session.answers.length ? finishQuiz() : go.drill())}
          />
        )}
        {view === 'results' && lastSession && <Results last={lastSession} onDone={go.drill} />}
        {view === 'check' && check && (
          <Checkpoint state={check} setState={setCheck} onFinish={finishCheck} nextCellId={nextCellId} />
        )}
        {view === 'walk' && walk && <PalaceWalk state={walk} setState={setWalk} onGrade={gradeWalk} />}
        {view === 'sim' && sim && <Simulator state={sim} setState={setSim} />}

        {sheet && <LawSheet sheet={sheet} onClose={() => setSheet(null)} />}
        {syncOpen && <SyncSheet onClose={() => setSyncOpen(false)} />}
        {voicesOpen && <VoiceSheet onClose={() => setVoicesOpen(false)} />}

        <BottomNav
          active={activeTab}
          onTap={(k) => (k === 'home' ? go.home() : k === 'learn' ? go.learn() : k === 'map' ? go.map() : go.drill())}
        />
      </div>
    </AppContext.Provider>
  )
}
