import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useAppStore } from '../state/appStore'
import { LabeledRange, Row, Segmented, Toggle } from './ui'
import {
  FONT_MAX,
  FONT_MIN,
  LENS_MAX_MM,
  LENS_MIN_MM,
  LETTER_SPACING_MAX,
  LETTER_SPACING_MIN,
  LINE_HEIGHT_MAX,
  LINE_HEIGHT_MIN,
  MARGIN_MAX,
  MARGIN_MIN,
  PREROLL_MAX,
  PREROLL_MIN,
  WORD_SPACING_MAX,
  WORD_SPACING_MIN,
  WPM_MAX,
  WPM_MIN,
} from '../state/defaults'
import { IPHONE_17PM_SCREEN_MM, LENS_PRESETS } from '../utils/lens'
import {
  TRANSFORM_MODES,
  findTransformMode,
  isRotatedQuarter,
  transformCss,
} from '../utils/transform'
import type { CountdownSeconds, FontWeight } from '../types'

const SAMPLE =
  'The quick brown fox jumps over the lazy dog.\nRead this line through your teleprompter glass and pick the orientation that looks correct.'

const CHECKLIST = [
  'Brightness set high',
  'Do Not Disturb / notifications off',
  'Airplane mode (optional)',
  'Script loaded',
  'Mirror mode verified through the glass',
  'Speed tested',
  'Camera rolling',
]

function useSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

function PreviewStage() {
  const config = useAppStore((s) => s.config)
  const stageRef = useRef<HTMLDivElement>(null)
  const { width, height } = useSize(stageRef)
  const [showCenter, setShowCenter] = useState(true)
  const [showSafe, setShowSafe] = useState(true)
  const [showGrid, setShowGrid] = useState(false)

  const rotated = isRotatedQuarter(config.transform.rotateDeg)
  const innerW = rotated ? height : width
  const innerH = rotated ? width : height

  const innerStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${innerW}px`,
    height: `${innerH}px`,
    display: 'grid',
    placeItems: 'center',
    padding: `0 ${config.typography.marginXPercent}%`,
    transform: transformCss(config.transform),
    fontSize: `${Math.min(config.typography.fontSizePx, 48)}px`,
    lineHeight: config.typography.lineHeight,
    fontWeight: config.typography.fontWeight,
    textAlign: config.typography.textAlign,
    letterSpacing: `${config.typography.letterSpacingPx}px`,
    wordSpacing: `${config.typography.wordSpacingPx}px`,
    textTransform: config.typography.allCaps ? 'uppercase' : 'none',
    color: config.colors.text,
    whiteSpace: 'pre-wrap',
  }

  return (
    <div>
      <div className="calib__stage" ref={stageRef} style={{ background: config.colors.background }}>
        <div style={innerStyle}>{SAMPLE}</div>
        {showGrid && <div className="guide-grid" />}
        {showSafe && <div className="guide-safe" />}
        {showCenter && <div className="guide-center" />}
      </div>
      <div className="wrap" style={{ marginBottom: 16 }}>
        <button
          className={'btn btn--ghost' + (showCenter ? ' ctrl-btn--active' : '')}
          onClick={() => setShowCenter((v) => !v)}
          type="button"
        >
          Center line
        </button>
        <button className="btn btn--ghost" onClick={() => setShowSafe((v) => !v)} type="button">
          Safe area
        </button>
        <button className="btn btn--ghost" onClick={() => setShowGrid((v) => !v)} type="button">
          Alignment grid
        </button>
      </div>
    </div>
  )
}

function LensSection() {
  const lens = useAppStore((s) => s.config.lens)
  const setLens = useAppStore((s) => s.setLens)

  const SW = IPHONE_17PM_SCREEN_MM.width
  const SH = IPHONE_17PM_SCREEN_MM.height
  const sideMm = Math.min(lens.sizeMm, SW)
  const mockH = 200
  const scale = mockH / SH
  const mockW = SW * scale
  const sq = sideMm * scale

  return (
    <div>
      <div className="section-title">Camera lens window</div>
      <p className="field__hint" style={{ marginTop: 0 }}>
        Confines the script to a centered square about the size of your lens opening, so your eyes
        stay over the lens and you always look straight into the camera. Everything outside the
        window is hidden. iPhone 17 Pro Max is ~73mm wide; a Sony 24–70 lens is ~67–82mm.
      </p>

      <Row label="Lens window" desc="Toggle the centered reading window on or off.">
        <Toggle checked={lens.enabled} onChange={(v) => setLens({ enabled: v })} label="Lens window" />
      </Row>

      {lens.enabled && (
        <>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '12px 0' }}>
            <div
              style={{
                position: 'relative',
                width: mockW,
                height: mockH,
                flex: 'none',
                background: '#000',
                border: '2px solid var(--border)',
                borderRadius: 14,
              }}
              aria-hidden="true"
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: sq,
                  height: sq,
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid var(--accent)',
                  borderRadius: 4,
                  background: 'rgba(56,189,248,0.12)',
                }}
              />
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              Window ≈ {sideMm.toFixed(0)}mm square<br />
              of a {SW.toFixed(0)}×{SH.toFixed(0)}mm screen
            </div>
          </div>

          <div className="field__label" style={{ marginTop: 8 }}>
            <span>Lens size / opening</span>
          </div>
          <div className="wrap" style={{ marginBottom: 12 }}>
            {LENS_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={'btn' + (lens.sizeMm === p.sizeMm ? ' btn--primary' : ' btn--ghost')}
                onClick={() => setLens({ sizeMm: p.sizeMm })}
              >
                {p.label}
              </button>
            ))}
          </div>

          <LabeledRange
            label="Window size"
            value={lens.sizeMm}
            display={`${lens.sizeMm}mm`}
            min={LENS_MIN_MM}
            max={LENS_MAX_MM}
            hint="Fine-tune until the lit area matches your lens opening through the glass."
            onChange={(v) => setLens({ sizeMm: v })}
          />

          <Row label="Show window border">
            <Toggle
              checked={lens.showBorder}
              onChange={(v) => setLens({ showBorder: v })}
              label="Show window border"
            />
          </Row>
          <Row label="Soft edge fade" desc="Fade text in/out at the window edges instead of a hard cut.">
            <Toggle checked={lens.edgeFade} onChange={(v) => setLens({ edgeFade: v })} label="Soft edge fade" />
          </Row>
        </>
      )}
    </div>
  )
}

const COLOR_PRESETS = [
  { bg: '#000000', text: '#ffffff', label: 'White on black' },
  { bg: '#000000', text: '#ffe600', label: 'Yellow on black' },
  { bg: '#ffffff', text: '#000000', label: 'Black on white' },
  { bg: '#001018', text: '#7ee0ff', label: 'Cyan on navy' },
]

export function CalibrationView() {
  const config = useAppStore((s) => s.config)
  const setTypography = useAppStore((s) => s.setTypography)
  const setScroll = useAppStore((s) => s.setScroll)
  const setColors = useAppStore((s) => s.setColors)
  const setTransformState = useAppStore((s) => s.setTransformState)
  const saveAsPreset = useAppStore((s) => s.saveAsPreset)
  const openReader = useAppStore((s) => s.openReader)
  const currentScriptId = useAppStore((s) => s.currentScriptId)

  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST.map(() => false))
  const [battery, setBattery] = useState<number | null>(null)
  const activeMode = findTransformMode(config.transform)

  useEffect(() => {
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{
        level: number
        addEventListener: (e: string, cb: () => void) => void
        removeEventListener: (e: string, cb: () => void) => void
      }>
    }
    let cleanup: (() => void) | undefined
    void nav.getBattery?.().then((b) => {
      const read = () => setBattery(Math.round(b.level * 100))
      read()
      b.addEventListener('levelchange', read)
      cleanup = () => b.removeEventListener('levelchange', read)
    })
    return () => cleanup?.()
  }, [])

  const t = config.typography

  return (
    <div>
      <PreviewStage />

      <div className="section-title">Orientation / mirror</div>
      <div className="wrap" style={{ marginBottom: 8 }}>
        {TRANSFORM_MODES.map((m) => (
          <button
            key={m.id}
            className={'btn' + (activeMode?.id === m.id ? ' btn--primary' : ' btn--ghost')}
            onClick={() => setTransformState(m.transform)}
            type="button"
          >
            {m.label}
          </button>
        ))}
      </div>

      <LensSection />

      <div className="section-title">Typography</div>
      <LabeledRange
        label="Font size"
        value={t.fontSizePx}
        display={`${t.fontSizePx}px`}
        min={FONT_MIN}
        max={FONT_MAX}
        onChange={(v) => setTypography({ fontSizePx: v })}
      />
      <LabeledRange
        label="Line height"
        value={t.lineHeight}
        display={t.lineHeight.toFixed(2)}
        min={LINE_HEIGHT_MIN}
        max={LINE_HEIGHT_MAX}
        step={0.05}
        onChange={(v) => setTypography({ lineHeight: v })}
      />
      <LabeledRange
        label="Side margins"
        value={t.marginXPercent}
        display={`${t.marginXPercent}%`}
        min={MARGIN_MIN}
        max={MARGIN_MAX}
        onChange={(v) => setTypography({ marginXPercent: v })}
      />
      <LabeledRange
        label="Letter spacing"
        value={t.letterSpacingPx}
        display={`${t.letterSpacingPx}px`}
        min={LETTER_SPACING_MIN}
        max={LETTER_SPACING_MAX}
        step={0.5}
        onChange={(v) => setTypography({ letterSpacingPx: v })}
      />
      <LabeledRange
        label="Word spacing"
        value={t.wordSpacingPx}
        display={`${t.wordSpacingPx}px`}
        min={WORD_SPACING_MIN}
        max={WORD_SPACING_MAX}
        onChange={(v) => setTypography({ wordSpacingPx: v })}
      />

      <Row label="Weight">
        <Segmented<FontWeight>
          value={t.fontWeight}
          onChange={(v) => setTypography({ fontWeight: v })}
          options={[
            { value: 400, label: 'Regular' },
            { value: 500, label: 'Medium' },
            { value: 700, label: 'Bold' },
          ]}
        />
      </Row>
      <Row label="Alignment">
        <Segmented
          value={t.textAlign}
          onChange={(v) => setTypography({ textAlign: v })}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
          ]}
        />
      </Row>
      <Row label="All caps">
        <Toggle checked={t.allCaps} onChange={(v) => setTypography({ allCaps: v })} label="All caps" />
      </Row>
      <Row label="Dyslexia-friendly font" desc="Uses a rounded system font where available.">
        <Toggle
          checked={t.dyslexiaFont}
          onChange={(v) => setTypography({ dyslexiaFont: v })}
          label="Dyslexia-friendly font"
        />
      </Row>

      <div className="section-title">Colours</div>
      <div className="wrap" style={{ marginBottom: 12 }}>
        {COLOR_PRESETS.map((c) => (
          <button
            key={c.label}
            className="btn btn--ghost"
            style={{ background: c.bg, color: c.text, borderColor: '#333' }}
            onClick={() => setColors({ background: c.bg, text: c.text })}
            type="button"
          >
            {c.label}
          </button>
        ))}
      </div>
      <Row label="Background">
        <input
          type="color"
          value={config.colors.background}
          onChange={(e) => setColors({ background: e.target.value })}
          aria-label="Background colour"
        />
      </Row>
      <Row label="Text">
        <input
          type="color"
          value={config.colors.text}
          onChange={(e) => setColors({ text: e.target.value })}
          aria-label="Text colour"
        />
      </Row>

      <div className="section-title">Scrolling</div>
      <LabeledRange
        label="Speed"
        value={config.scroll.speedWpm}
        display={`${config.scroll.speedWpm} WPM`}
        min={WPM_MIN}
        max={WPM_MAX}
        onChange={(v) => setScroll({ speedWpm: v })}
      />
      <LabeledRange
        label="Pre-roll padding"
        value={config.scroll.preRollVh}
        display={`${config.scroll.preRollVh}%`}
        min={PREROLL_MIN}
        max={PREROLL_MAX}
        hint="Blank space before the first line so it starts lower on screen."
        onChange={(v) => setScroll({ preRollVh: v })}
      />
      <Row label="Countdown">
        <Segmented<CountdownSeconds>
          value={config.scroll.countdownSeconds}
          onChange={(v) => setScroll({ countdownSeconds: v })}
          options={[
            { value: 0, label: 'Off' },
            { value: 3, label: '3s' },
            { value: 5, label: '5s' },
            { value: 10, label: '10s' },
          ]}
        />
      </Row>
      <Row label="Loop at end" desc="Restart from the top when the script finishes.">
        <Toggle
          checked={config.scroll.loop}
          onChange={(v) => setScroll({ loop: v })}
          label="Loop at end"
        />
      </Row>

      <div className="wrap" style={{ margin: '16px 0' }}>
        <button
          className="btn btn--primary"
          disabled={!currentScriptId}
          onClick={() => currentScriptId && openReader(currentScriptId)}
          type="button"
        >
          Test in prompter
        </button>
        <button
          className="btn"
          onClick={() => {
            const name = prompt('Save these settings as a preset named:')
            if (name) saveAsPreset(name)
          }}
          type="button"
        >
          Save as preset
        </button>
      </div>

      <div className="section-title">Recording checklist</div>
      {battery !== null && (
        <div className={'field__hint'} style={{ color: battery < 20 ? 'var(--danger)' : undefined }}>
          Battery: {battery}%{battery < 20 ? ' — consider charging before a long take.' : ''}
        </div>
      )}
      <div className="stack" style={{ marginTop: 8 }}>
        {CHECKLIST.map((item, i) => (
          <label key={item} className="row" style={{ cursor: 'pointer' }}>
            <span className="row__label">{item}</span>
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={(e) =>
                setChecked((prev) => prev.map((c, idx) => (idx === i ? e.target.checked : c)))
              }
            />
          </label>
        ))}
      </div>
    </div>
  )
}
