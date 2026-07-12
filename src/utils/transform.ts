import type { RotateDeg, TransformState } from '../types'

/**
 * Build the CSS transform string for the reading layer.
 * Order: rotate, then mirror (scale). Applied about the layer centre.
 * We always emit the translate(-50%,-50%) centring first so the fixed-size
 * layer stays centred in the viewport regardless of rotation.
 */
export function transformCss(t: TransformState): string {
  const sx = t.mirrorX ? -1 : 1
  const sy = t.mirrorY ? -1 : 1
  return `translate(-50%, -50%) rotate(${t.rotateDeg}deg) scale(${sx}, ${sy})`
}

/** True when the layer is turned on its side (reading axis is the viewport width). */
export function isRotatedQuarter(rotateDeg: RotateDeg): boolean {
  return rotateDeg === 90 || rotateDeg === -90
}

export interface TransformMode {
  id: string
  label: string
  transform: TransformState
}

/** The 11 named orientations from the spec, in the preferred label order. */
export const TRANSFORM_MODES: TransformMode[] = [
  { id: 'normal', label: 'Normal', transform: { rotateDeg: 0, mirrorX: false, mirrorY: false } },
  { id: 'mirror-x', label: 'Mirror Left/Right', transform: { rotateDeg: 0, mirrorX: true, mirrorY: false } },
  { id: 'mirror-y', label: 'Mirror Top/Bottom', transform: { rotateDeg: 0, mirrorX: false, mirrorY: true } },
  { id: 'flip-both', label: 'Flip Both', transform: { rotateDeg: 0, mirrorX: true, mirrorY: true } },
  { id: 'rot-cw', label: 'Rotate 90° Right', transform: { rotateDeg: 90, mirrorX: false, mirrorY: false } },
  { id: 'rot-ccw', label: 'Rotate 90° Left', transform: { rotateDeg: -90, mirrorX: false, mirrorY: false } },
  { id: 'rot-180', label: 'Rotate 180°', transform: { rotateDeg: 180, mirrorX: false, mirrorY: false } },
  { id: 'rot-cw-mx', label: 'Rotate 90° Right + Mirror L/R', transform: { rotateDeg: 90, mirrorX: true, mirrorY: false } },
  { id: 'rot-cw-my', label: 'Rotate 90° Right + Mirror T/B', transform: { rotateDeg: 90, mirrorX: false, mirrorY: true } },
  { id: 'rot-ccw-mx', label: 'Rotate 90° Left + Mirror L/R', transform: { rotateDeg: -90, mirrorX: true, mirrorY: false } },
  { id: 'rot-ccw-my', label: 'Rotate 90° Left + Mirror T/B', transform: { rotateDeg: -90, mirrorX: false, mirrorY: true } },
]

export function transformsEqual(a: TransformState, b: TransformState): boolean {
  return a.rotateDeg === b.rotateDeg && a.mirrorX === b.mirrorX && a.mirrorY === b.mirrorY
}

/** Find the named mode matching a transform, or undefined for a custom combo. */
export function findTransformMode(t: TransformState): TransformMode | undefined {
  return TRANSFORM_MODES.find((m) => transformsEqual(m.transform, t))
}

const ROTATION_CYCLE: RotateDeg[] = [0, 90, 180, -90]

/** Rotate one quarter-turn clockwise (dir=1) or counter-clockwise (dir=-1). */
export function nextRotation(current: RotateDeg, dir: 1 | -1): RotateDeg {
  const i = ROTATION_CYCLE.indexOf(current)
  const base = i === -1 ? 0 : i
  const len = ROTATION_CYCLE.length
  return ROTATION_CYCLE[(base + dir + len) % len]
}
