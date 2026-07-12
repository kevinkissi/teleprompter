import { useEffect } from 'react'
import { useAppStore } from '../state/appStore'
import { scrollController } from '../state/scrollController'
import { FONT_STEP, NUDGE_SECONDS, WPM_STEP_LARGE, WPM_STEP_SMALL } from '../state/defaults'

function toggleFullscreen(): void {
  const doc = document as Document & { webkitFullscreenElement?: Element }
  const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }
  const exit = document as Document & { webkitExitFullscreen?: () => Promise<void> }
  const isFull = document.fullscreenElement || doc.webkitFullscreenElement
  if (!isFull) {
    ;(el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())?.catch(() => {})
  } else {
    void (document.exitFullscreen?.() ?? exit.webkitExitFullscreen?.())
  }
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

/** Global keyboard / Bluetooth-remote shortcuts, active only in the reader. */
export function useKeyboardShortcuts(): void {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      const state = useAppStore.getState()
      if (!state.settings.keyboardShortcutsEnabled) return
      if (state.view !== 'reader') return
      if (isTypingTarget(e.target)) return
      // Leave browser/OS combos alone.
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const store = useAppStore.getState()
      switch (e.key) {
        case ' ':
        case 'Enter':
          store.togglePlay()
          break
        case 'ArrowUp': // slower
          store.adjustSpeed(-(e.shiftKey ? WPM_STEP_LARGE : WPM_STEP_SMALL))
          break
        case 'ArrowDown': // faster
          store.adjustSpeed(e.shiftKey ? WPM_STEP_LARGE : WPM_STEP_SMALL)
          break
        case 'ArrowLeft': // rewind
          scrollController.current.nudgeSeconds(-NUDGE_SECONDS)
          break
        case 'ArrowRight': // forward
          scrollController.current.nudgeSeconds(NUDGE_SECONDS)
          break
        case '+':
        case '=':
          store.adjustFont(FONT_STEP)
          break
        case '-':
        case '_':
          store.adjustFont(-FONT_STEP)
          break
        case 'm':
          store.toggleMirrorX()
          break
        case 'M':
          store.toggleMirrorY()
          break
        case '[':
          store.rotate(-1)
          break
        case ']':
          store.rotate(1)
          break
        case 'r':
        case 'R':
          scrollController.current.jumpTop()
          break
        case 'Home':
          scrollController.current.jumpTop()
          break
        case 'End':
          scrollController.current.jumpBottom()
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'Escape':
          if (store.playing || store.countingDown) store.togglePlay()
          else store.closeReader()
          break
        default:
          return // don't preventDefault for keys we don't handle
      }
      e.preventDefault()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
