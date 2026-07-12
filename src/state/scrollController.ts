/**
 * Imperative handle to the running scroll engine.
 *
 * The scroll engine lives inside <PromptDisplay/> and owns the animation loop and
 * the authoritative pixel position (kept in a ref, not React state, so scrolling
 * never triggers re-renders). Controls and keyboard shortcuts call these methods
 * so they can drive the DOM directly regardless of where they are mounted.
 */
export interface ScrollController {
  play: () => void
  pause: () => void
  jumpTop: () => void
  jumpBottom: () => void
  /** Move by seconds of reading time at the current speed (negative = rewind). */
  nudgeSeconds: (seconds: number) => void
  /** Recompute layout metrics (call after size / typography / rotation changes). */
  recompute: () => void
  /** Re-push progress + remaining time without re-measuring layout (e.g. speed change while paused). */
  refreshProgress: () => void
  /** Current progress 0..1 (for immediate reads). */
  getProgress: () => number
}

const noop = () => {}

export const scrollController: { current: ScrollController } = {
  current: {
    play: noop,
    pause: noop,
    jumpTop: noop,
    jumpBottom: noop,
    nudgeSeconds: noop,
    recompute: noop,
    refreshProgress: noop,
    getProgress: () => 0,
  },
}
