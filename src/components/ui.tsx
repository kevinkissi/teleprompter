import type { ReactNode } from 'react'

/**
 * A switch that answers to a thumb.
 *
 * It used to be a native checkbox hidden under the track. iOS Safari never
 * resizes a native checkbox — `width: 100%` is ignored without
 * `appearance: none` — so the only thing that could take a tap was an invisible
 * ~20px box in one corner, and the track it sat under had `pointer-events:
 * none`. A mouse never noticed: a click anywhere on a <label> activates its
 * input. A finger did. A <button> is a tap target everywhere, on its whole
 * area, with no heuristics about what counts as clickable.
 */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="switch"
      onClick={() => onChange(!checked)}
    >
      <span className="switch__track" />
      <span className="switch__thumb" />
    </button>
  )
}

export function LabeledRange({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
  hint,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  hint?: string
}) {
  return (
    <div className="field">
      <div className="field__label">
        <span>{label}</span>
        <span className="field__value">{display}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <div className="field__hint">{hint}</div>}
    </div>
  )
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label?: string
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          className={'seg__opt' + (o.value === value ? ' seg__opt--active' : '')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Row({
  label,
  desc,
  children,
}: {
  label: string
  desc?: string
  children: ReactNode
}) {
  return (
    <div className="row">
      <div>
        <div className="row__label">{label}</div>
        {desc && <div className="row__desc">{desc}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}
