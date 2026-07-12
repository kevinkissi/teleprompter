import { useState } from 'react'
import { useAppStore } from '../state/appStore'
import { scrollController } from '../state/scrollController'
import { Icon, type IconName } from './Icon'
import { formatDuration } from '../utils/estimateReadTime'
import {
  FONT_MAX,
  FONT_MIN,
  FONT_STEP,
  LENS_MAX_MM,
  LENS_MIN_MM,
  LINE_HEIGHT_MAX,
  LINE_HEIGHT_MIN,
  MARGIN_MAX,
  MARGIN_MIN,
  NUDGE_SECONDS,
  WPM_MAX,
  WPM_MIN,
  WPM_STEP_SMALL,
} from '../state/defaults'
import { TRANSFORM_MODES, findTransformMode } from '../utils/transform'
import { LENS_PRESETS } from '../utils/lens'

interface CtrlProps {
  icon: IconName
  label: string
  value?: string
  onClick: () => void
  primary?: boolean
  active?: boolean
  ariaLabel?: string
}

function Ctrl({ icon, label, value, onClick, primary, active, ariaLabel }: CtrlProps) {
  return (
    <button
      className={
        'ctrl-btn' + (primary ? ' ctrl-btn--primary' : '') + (active ? ' ctrl-btn--active' : '')
      }
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      type="button"
    >
      <Icon name={icon} size={22} />
      <span>{label}</span>
      {value !== undefined && <span className="ctrl-btn__val">{value}</span>}
    </button>
  )
}

function QuickSettings({ onClose }: { onClose: () => void }) {
  const config = useAppStore((s) => s.config)
  const setScroll = useAppStore((s) => s.setScroll)
  const setTypography = useAppStore((s) => s.setTypography)
  const setTransformState = useAppStore((s) => s.setTransformState)
  const setLens = useAppStore((s) => s.setLens)
  const activeMode = findTransformMode(config.transform)

  const quickModes = TRANSFORM_MODES.slice(0, 4) // Normal, Mirror L/R, Mirror T/B, Flip Both

  return (
    <div className="quick" role="group" aria-label="Quick settings">
      <div className="field">
        <div className="field__label">
          <span>Speed</span>
          <span className="field__value">{config.scroll.speedWpm} WPM</span>
        </div>
        <input
          type="range"
          aria-label="Speed in words per minute"
          min={WPM_MIN}
          max={WPM_MAX}
          step={1}
          value={config.scroll.speedWpm}
          onChange={(e) => setScroll({ speedWpm: Number(e.target.value) })}
        />
      </div>

      <div className="field">
        <div className="field__label">
          <span>Font size</span>
          <span className="field__value">{config.typography.fontSizePx}px</span>
        </div>
        <input
          type="range"
          aria-label="Font size in pixels"
          min={FONT_MIN}
          max={FONT_MAX}
          step={1}
          value={config.typography.fontSizePx}
          onChange={(e) => setTypography({ fontSizePx: Number(e.target.value) })}
        />
      </div>

      <div className="field">
        <div className="field__label">
          <span>Line height</span>
          <span className="field__value">{config.typography.lineHeight.toFixed(2)}</span>
        </div>
        <input
          type="range"
          aria-label="Line height"
          min={LINE_HEIGHT_MIN}
          max={LINE_HEIGHT_MAX}
          step={0.05}
          value={config.typography.lineHeight}
          onChange={(e) => setTypography({ lineHeight: Number(e.target.value) })}
        />
      </div>

      <div className="field">
        <div className="field__label">
          <span>Side margins</span>
          <span className="field__value">{config.typography.marginXPercent}%</span>
        </div>
        <input
          type="range"
          aria-label="Side margins percent"
          min={MARGIN_MIN}
          max={MARGIN_MAX}
          step={1}
          value={config.typography.marginXPercent}
          onChange={(e) => setTypography({ marginXPercent: Number(e.target.value) })}
        />
      </div>

      {config.lens.enabled && (
        <div className="field">
          <div className="field__label">
            <span>Lens window</span>
            <span className="field__value">{config.lens.sizeMm}mm</span>
          </div>
          <input
            type="range"
            aria-label="Lens window size in millimetres"
            min={LENS_MIN_MM}
            max={LENS_MAX_MM}
            step={1}
            value={config.lens.sizeMm}
            onChange={(e) => setLens({ sizeMm: Number(e.target.value) })}
          />
          <div className="wrap" style={{ marginTop: 6 }}>
            {LENS_PRESETS.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
                className={'seg__opt' + (config.lens.sizeMm === p.sizeMm ? ' seg__opt--active' : '')}
                style={{ border: '1px solid var(--border)', borderRadius: 8 }}
                onClick={() => setLens({ sizeMm: p.sizeMm })}
              >
                {p.sizeMm}mm
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="field">
        <div className="field__label">
          <span>Mirror</span>
        </div>
        <div className="seg">
          {quickModes.map((m) => (
            <button
              key={m.id}
              className={'seg__opt' + (activeMode?.id === m.id ? ' seg__opt--active' : '')}
              onClick={() => setTransformState(m.transform)}
              type="button"
            >
              {m.label.replace('Mirror ', '').replace('Left/Right', 'L/R').replace('Top/Bottom', 'T/B')}
            </button>
          ))}
        </div>
      </div>

      <div className="wrap">
        <button className="btn btn--ghost" type="button" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}

export function ControlOverlay() {
  const [quickOpen, setQuickOpen] = useState(false)
  const controlsVisible = useAppStore((s) => s.controlsVisible)
  const playing = useAppStore((s) => s.playing)
  const countingDown = useAppStore((s) => s.countingDown)
  const progress = useAppStore((s) => s.progress)
  const remainingSeconds = useAppStore((s) => s.remainingSeconds)
  const speedWpm = useAppStore((s) => s.config.scroll.speedWpm)
  const fontSizePx = useAppStore((s) => s.config.typography.fontSizePx)
  const mirrorX = useAppStore((s) => s.config.transform.mirrorX)
  const rotateDeg = useAppStore((s) => s.config.transform.rotateDeg)
  const lensEnabled = useAppStore((s) => s.config.lens.enabled)
  const lensSizeMm = useAppStore((s) => s.config.lens.sizeMm)
  const title = useAppStore((s) => {
    const id = s.currentScriptId
    return s.scripts.find((x) => x.id === id)?.title ?? 'Teleprompter'
  })

  const togglePlay = useAppStore((s) => s.togglePlay)
  const adjustSpeed = useAppStore((s) => s.adjustSpeed)
  const adjustFont = useAppStore((s) => s.adjustFont)
  const toggleMirrorX = useAppStore((s) => s.toggleMirrorX)
  const rotate = useAppStore((s) => s.rotate)
  const toggleLens = useAppStore((s) => s.toggleLens)
  const closeReader = useAppStore((s) => s.closeReader)

  return (
    <div className={'overlay' + (controlsVisible ? '' : ' overlay--hidden')}>
      <div className="overlay__top">
        <button className="btn btn--icon btn--ghost" onClick={closeReader} aria-label="Back to library" type="button">
          <Icon name="back" />
        </button>
        <div className="overlay__title">{title}</div>
        <div className="overlay__time">-{formatDuration(remainingSeconds)}</div>
      </div>

      <div className="overlay__bottom">
        {quickOpen && <QuickSettings onClose={() => setQuickOpen(false)} />}

        <div className="progress" aria-hidden="true">
          <div className="progress__bar" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>

        <div className="ctrl-row">
          <Ctrl icon="top" label="Top" onClick={() => scrollController.current.jumpTop()} />
          <Ctrl
            icon="rewind"
            label={`-${NUDGE_SECONDS}s`}
            onClick={() => scrollController.current.nudgeSeconds(-NUDGE_SECONDS)}
          />
          <Ctrl
            icon={playing ? 'pause' : 'play'}
            label={countingDown ? 'Cancel' : playing ? 'Pause' : 'Play'}
            onClick={togglePlay}
            primary
          />
          <Ctrl
            icon="forward"
            label={`+${NUDGE_SECONDS}s`}
            onClick={() => scrollController.current.nudgeSeconds(NUDGE_SECONDS)}
          />
          <Ctrl icon="bottom" label="End" onClick={() => scrollController.current.jumpBottom()} />
        </div>

        <div className="ctrl-row">
          <Ctrl
            icon="minus"
            label="Slower"
            value={`${speedWpm}`}
            onClick={() => adjustSpeed(-WPM_STEP_SMALL)}
          />
          <Ctrl icon="plus" label="Faster" onClick={() => adjustSpeed(WPM_STEP_SMALL)} />
          <Ctrl
            icon="minus"
            label="Font"
            value={`${fontSizePx}`}
            onClick={() => adjustFont(-FONT_STEP)}
          />
          <Ctrl icon="font" label="Font +" onClick={() => adjustFont(FONT_STEP)} />
          <Ctrl icon="mirror" label="Mirror" onClick={toggleMirrorX} active={mirrorX} />
          <Ctrl
            icon="rotate"
            label="Rotate"
            value={`${rotateDeg}°`}
            onClick={() => rotate(1)}
            active={rotateDeg !== 0}
          />
          <Ctrl
            icon="target"
            label="Lens"
            value={lensEnabled ? `${lensSizeMm}mm` : 'off'}
            onClick={toggleLens}
            active={lensEnabled}
          />
          <Ctrl icon="sliders" label="More" onClick={() => setQuickOpen((v) => !v)} active={quickOpen} />
        </div>
      </div>
    </div>
  )
}
