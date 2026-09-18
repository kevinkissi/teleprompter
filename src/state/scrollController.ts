import { useAppStore } from './appStore'

/**
 * Imperative handle to whichever playback engine is currently mounted.
 *
 * Continuous Mode installs the scrolling engine (`useScrollEngine`, inside
 * <ScrollStage/>); Slide Mode installs the slide engine (`useSlideEngine`,
 * inside <SlideStage/>). Both speak these same methods, so controls, keyboard
 * shortcuts and the WiFi remote drive playback without caring which one is up —
 * and, crucially, no command is ever a silent no-op just because the mode
 * changed underneath it.
 *
 * The engines own the authoritative position (a pixel offset for scrolling, a
 * slide index for slides) outside React state, so playback never triggers a
 * re-render of the prompt text.
 */
export interface ScrollController {
  play: () => void
  pause: () => void
  jumpTop: () => void
  jumpBottom: () => void
  /** Continuous: move by seconds of reading time. Slides: step a whole slide. */
  nudgeSeconds: (seconds: number) => void
  /** Recompute layout metrics (call after size / typography / rotation changes). */
  recompute: () => void
  /** Re-push progress + remaining time without re-measuring layout (e.g. speed change while paused). */
  refreshProgress: () => void
  /** Current progress 0..1 (for immediate reads). */
  getProgress: () => number
}

const noop = () => {}

/**
 * What the handle holds while no engine is mounted — between a mode switch's
 * unmount and mount, or once the reader has closed.
 *
 * `pause` still clears the store's playback flags. A no-op pause was the one
 * genuinely dangerous case: the store would keep reporting `playing`, the
 * master bar would stay lit after Stop, and a `countingDown` that nothing could
 * resolve would make Studio OS take the "already counting down" branch and stop
 * starting the prompter on every later take. Telling the truth here is cheap
 * and makes that whole class of bug unreachable.
 */
export const idleController: ScrollController = {
  play: noop,
  pause: () => {
    const s = useAppStore.getState()
    s.setPlaying(false)
    if (s.countingDown) s.cancelCountdown()
  },
  jumpTop: noop,
  jumpBottom: noop,
  nudgeSeconds: noop,
  recompute: noop,
  refreshProgress: noop,
  getProgress: () => 0,
}

export const scrollController: { current: ScrollController } = {
  current: idleController,
}
