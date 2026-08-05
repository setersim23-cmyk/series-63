/**
 * Holds the screen awake while narration plays.
 *
 * iOS suspends speech synthesis the moment the screen locks, and nothing a web
 * page can do prevents that — so the next best thing is to stop the screen
 * locking on its own while you are listening. Supported in Safari from 16.4.
 *
 * The lock is dropped by the browser whenever the page is hidden, so it has to
 * be taken again when the page comes back.
 */
let sentinel: WakeLockSentinel | null = null
let wanted = false

const supported = () => typeof navigator !== 'undefined' && 'wakeLock' in navigator

async function acquire() {
  if (!wanted || !supported() || sentinel) return
  try {
    sentinel = await navigator.wakeLock.request('screen')
    sentinel.addEventListener('release', () => {
      sentinel = null
    })
  } catch {
    /* denied, or the tab isn't visible — listening still works, the screen just dims */
  }
}

export function keepScreenAwake() {
  wanted = true
  void acquire()
}

export function releaseScreen() {
  wanted = false
  try {
    void sentinel?.release()
  } catch {
    /* already gone */
  }
  sentinel = null
}

/** Call once at startup: re-takes the lock after the page has been backgrounded. */
export function watchVisibility() {
  if (!supported()) return
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void acquire()
  })
}
